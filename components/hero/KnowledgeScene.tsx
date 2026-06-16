'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NODES, EDGES, type GraphNode } from './network';
import { hero, smoothstep } from './store';

const INK = new THREE.Color('#3a2630'); // warm sand — nodes/lines glow on the dark ground
const RUST = new THREE.Color('#cf5d72'); // brightened ember-rust to match the dark theme
const SEG = 28; // samples per connection line

const RADIUS: Record<GraphNode['kind'], number> = { core: 0.17, head: 0.11, leaf: 0.065 };

interface NodeObj {
  data: GraphNode;
  group: THREE.Group;
  sphere: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  ring: THREE.Mesh | null;
  ringMat: THREE.MeshBasicMaterial | null;
  pulse: THREE.Mesh | null;
  pulseMat: THREE.MeshBasicMaterial | null;
  base: THREE.Vector3;
}

interface LineObj {
  line: THREE.Line;
  geo: THREE.BufferGeometry;
  positions: Float32Array;
  mat: THREE.LineBasicMaterial;
  a: THREE.Vector3;
  b: THREE.Vector3;
  reveal: number;
  sag: number;
}

function Scene({ labelEls }: { labelEls: React.RefObject<HTMLDivElement[]> }) {
  const { camera, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Reusable scratch objects (no per-frame allocation).
  const scratch = useMemo(
    () => ({
      raycaster: new THREE.Raycaster(),
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      cursorWorld: new THREE.Vector3(),
      cursorLocal: new THREE.Vector3(),
      mid: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      perp: new THREE.Vector3(),
      ctrl: new THREE.Vector3(),
      tmp: new THREE.Vector3(),
      wp: new THREE.Vector3(),
      ndc: new THREE.Vector2(),
    }),
    [],
  );

  const byPos = useMemo(() => {
    const m = new Map<string, THREE.Vector3>();
    NODES.forEach((n) => m.set(n.id, new THREE.Vector3(...n.pos)));
    return m;
  }, []);

  // Build node objects once (imperative for full control in the frame loop).
  const nodes = useMemo<NodeObj[]>(() => {
    return NODES.map((n) => {
      const r = RADIUS[n.kind];
      const group = new THREE.Group();
      group.position.set(...n.pos);
      group.scale.setScalar(0.0001);

      const mat = new THREE.MeshBasicMaterial({
        color: n.kind === 'core' ? RUST : INK,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 3), mat);
      sphere.userData.id = n.id;
      group.add(sphere);

      let ring: THREE.Mesh | null = null;
      let ringMat: THREE.MeshBasicMaterial | null = null;
      if (n.kind !== 'leaf') {
        ringMat = new THREE.MeshBasicMaterial({
          color: RUST,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        ring = new THREE.Mesh(new THREE.RingGeometry(r + 0.05, r + 0.072, 64), ringMat);
        group.add(ring);
      }

      let pulse: THREE.Mesh | null = null;
      let pulseMat: THREE.MeshBasicMaterial | null = null;
      if (n.kind === 'core') {
        pulseMat = new THREE.MeshBasicMaterial({
          color: RUST,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        pulse = new THREE.Mesh(new THREE.RingGeometry(r + 0.04, r + 0.06, 64), pulseMat);
        group.add(pulse);
      }

      return { data: n, group, sphere, mat, ring, ringMat, pulse, pulseMat, base: new THREE.Vector3(...n.pos) };
    });
  }, []);

  const rayTargets = useMemo(() => nodes.map((o) => o.sphere), [nodes]);

  // Build connection-line objects once.
  const lines = useMemo<LineObj[]>(() => {
    return EDGES.map((e) => {
      const positions = new Float32Array((SEG + 1) * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0, depthWrite: false });
      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      line.visible = false;
      return {
        line,
        geo,
        positions,
        mat,
        a: byPos.get(e.from)!,
        b: byPos.get(e.to)!,
        reveal: e.reveal,
        sag: e.sag ?? 0.55,
      };
    });
  }, [byPos]);

  // Dispose GPU resources on unmount.
  useEffect(() => {
    return () => {
      nodes.forEach((o) => {
        o.sphere.geometry.dispose();
        o.mat.dispose();
        o.ring?.geometry.dispose();
        o.ringMat?.dispose();
        o.pulse?.geometry.dispose();
        o.pulseMat?.dispose();
      });
      lines.forEach((l) => {
        l.geo.dispose();
        l.mat.dispose();
      });
    };
  }, [nodes, lines]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 1 / 30); // clamp on tab-refocus spikes
    const ease = 1 - Math.pow(0.0001, d); // frame-rate independent lerp factor
    const slow = 1 - Math.pow(0.002, d);

    // — progress + pointer smoothing —
    hero.progress += (hero.target - hero.progress) * ease;
    hero.pointerX += (hero.rawX - hero.pointerX) * slow;
    hero.pointerY += (hero.rawY - hero.pointerY) * slow;
    const p = hero.progress;
    const settle = smoothstep(0.74, 1, p); // network recedes as identity resolves

    const g = groupRef.current;
    if (!g) return;

    // — responsive fit + parallax rotation —
    const fit = size.width < 640 ? 0.46 : size.width < 1024 ? 0.72 : 1;
    g.scale.x += (fit - g.scale.x) * ease;
    g.scale.y = g.scale.z = g.scale.x;
    g.rotation.y += (hero.pointerX * 0.2 - g.rotation.y) * ease;
    g.rotation.x += (-hero.pointerY * 0.14 - g.rotation.x) * ease;
    g.updateMatrixWorld();

    // — camera: gentle pointer drift + dolly back at the climax —
    const camZ = 11 + settle * 3.2;
    camera.position.z += (camZ - camera.position.z) * ease;
    camera.position.x += (hero.pointerX * 0.5 - camera.position.x) * ease;
    camera.position.y += (hero.pointerY * 0.4 - camera.position.y) * ease;
    camera.lookAt(0, 0, 0);

    // — cursor → world point on z=0 plane, then into group-local space —
    let hasCursor = false;
    if (hero.hasPointer && !hero.reduced) {
      scratch.ndc.set(hero.pointerX, hero.pointerY);
      scratch.raycaster.setFromCamera(scratch.ndc, camera);
      if (scratch.raycaster.ray.intersectPlane(scratch.plane, scratch.cursorWorld)) {
        scratch.cursorLocal.copy(scratch.cursorWorld);
        g.worldToLocal(scratch.cursorLocal);
        hasCursor = true;
      }
    }

    // — hover pick —
    let hovered: string | null = null;
    if (hero.hasPointer && !hero.reduced) {
      scratch.ndc.set(hero.pointerX, hero.pointerY);
      scratch.raycaster.setFromCamera(scratch.ndc, camera);
      const hits = scratch.raycaster.intersectObjects(rayTargets, false);
      // only count nodes that have actually revealed
      for (const h of hits) {
        const id = h.object.userData.id as string;
        const nd = NODES.find((n) => n.id === id)!;
        if (p >= nd.reveal) {
          hovered = id;
          break;
        }
      }
    }
    hero.hovered = hovered;

    // — nodes: reveal, magnetism, breathing, hover —
    for (const o of nodes) {
      const n = o.data;
      const rev = n.kind === 'core' ? 1 : smoothstep(n.reveal, n.reveal + 0.06, p);

      let ox = 0;
      let oy = 0;
      if (hasCursor && n.kind !== 'core' && rev > 0.01) {
        const dx = scratch.cursorLocal.x - o.base.x;
        const dy = scratch.cursorLocal.y - o.base.y;
        const dist = Math.hypot(dx, dy);
        const R = 2.3;
        if (dist < R && dist > 1e-3) {
          const s = 1 - dist / R;
          const pull = s * s * 0.45;
          ox = (dx / dist) * pull;
          oy = (dy / dist) * pull;
        }
      }
      o.group.position.set(o.base.x + ox, o.base.y + oy, o.base.z);

      let sc = rev;
      if (n.kind === 'core' && !hero.reduced) sc *= 1 + Math.sin(t * 1.4) * 0.05;
      if (hovered === n.id) sc *= 1.35;
      o.group.scale.setScalar(Math.max(0.0001, sc));

      const fade = 1 - settle * 0.72;
      o.mat.opacity = rev * (n.kind === 'leaf' ? 0.92 : 1) * fade;
      if (o.ring && o.ringMat) {
        o.ringMat.opacity = rev * 0.85 * fade;
        o.ring.quaternion.copy(camera.quaternion);
      }
      if (o.pulse && o.pulseMat && !hero.reduced) {
        const pp = (t * 0.45) % 1;
        o.pulse.scale.setScalar(1 + pp * 2.4);
        o.pulseMat.opacity = (1 - pp) * 0.4 * fade;
        o.pulse.quaternion.copy(camera.quaternion);
      }
    }

    // — connection lines: bezier with cursor-driven bend + draw-on reveal —
    const fadeLine = 1 - settle * 0.5;
    for (const L of lines) {
      const draw = smoothstep(L.reveal, L.reveal + 0.09, p);
      if (draw <= 0.001) {
        L.line.visible = false;
        continue;
      }
      L.line.visible = true;

      scratch.mid.copy(L.a).add(L.b).multiplyScalar(0.5);
      scratch.dir.copy(L.b).sub(L.a);
      const len = scratch.dir.length() || 1;
      scratch.perp.set(-scratch.dir.y, scratch.dir.x, 0).normalize();
      scratch.ctrl.copy(scratch.mid).addScaledVector(scratch.perp, L.sag * len * 0.12);

      if (hasCursor) {
        const cd = scratch.cursorLocal.distanceTo(scratch.mid);
        const R = 3.2;
        if (cd < R) {
          const s = 1 - cd / R;
          scratch.tmp.copy(scratch.cursorLocal).sub(scratch.mid).multiplyScalar(s * s * 0.5);
          scratch.ctrl.add(scratch.tmp);
        }
      }

      const pos = L.positions;
      for (let i = 0; i <= SEG; i++) {
        const tt = i / SEG;
        const u = 1 - tt;
        const w0 = u * u;
        const w1 = 2 * u * tt;
        const w2 = tt * tt;
        const idx = i * 3;
        pos[idx] = w0 * L.a.x + w1 * scratch.ctrl.x + w2 * L.b.x;
        pos[idx + 1] = w0 * L.a.y + w1 * scratch.ctrl.y + w2 * L.b.y;
        pos[idx + 2] = w0 * L.a.z + w1 * scratch.ctrl.z + w2 * L.b.z;
      }
      L.geo.attributes.position.needsUpdate = true;
      L.geo.setDrawRange(0, Math.max(2, Math.ceil((SEG + 1) * draw)));
      L.mat.opacity = draw * 0.26 * fadeLine;
    }

    // — project nodes → DOM labels —
    const els = labelEls.current;
    if (els) {
      for (let i = 0; i < nodes.length; i++) {
        const el = els[i];
        if (!el) continue;
        const o = nodes[i];
        const n = o.data;
        o.group.getWorldPosition(scratch.wp);
        scratch.wp.project(camera);
        const visible = scratch.wp.z < 1;
        const x = (scratch.wp.x * 0.5 + 0.5) * size.width;
        const y = (-scratch.wp.y * 0.5 + 0.5) * size.height;
        const rev = n.kind === 'core' ? 1 : smoothstep(n.reveal, n.reveal + 0.06, p);
        const show = n.kind !== 'leaf' || hovered === n.id;
        // labels recede hard at the climax so they don't clutter behind the identity
        const kindFade =
          n.kind === 'core'
            ? 1 - smoothstep(0.70, 0.82, p)
            : n.kind === 'head'
              ? 1 - smoothstep(0.72, 0.84, p)
              : 1;
        const op = visible && show ? rev * kindFade : 0;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.opacity = op.toFixed(3);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((l, i) => (
        <primitive key={`l${i}`} object={l.line} />
      ))}
      {nodes.map((o, i) => (
        <primitive key={`n${i}`} object={o.group} />
      ))}
    </group>
  );
}

/** DOM label layer, projected from the scene each frame (keeps site typography). */
function Labels({ labelEls }: { labelEls: React.RefObject<HTMLDivElement[]> }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {NODES.map((n, i) => (
        <div
          key={n.id}
          ref={(el) => {
            if (el) labelEls.current[i] = el;
          }}
          className="absolute left-0 top-0 -translate-x-1/2 will-change-[transform,opacity]"
          style={{ opacity: 0 }}
        >
          <div
            className={
              n.kind === 'leaf'
                ? 'translate-y-3 whitespace-nowrap text-[11px] font-medium tracking-wide text-ink/70'
                : n.kind === 'core'
                  ? 'translate-y-7 whitespace-nowrap text-center'
                  : 'translate-y-5 whitespace-nowrap text-center'
            }
          >
            {n.kind === 'leaf' ? (
              n.label
            ) : (
              <>
                <div
                  className={
                    n.kind === 'core'
                      ? 'text-[13px] font-semibold uppercase tracking-[0.22em] text-rust'
                      : 'text-[15px] font-semibold tracking-tight text-ink'
                  }
                >
                  {n.kind === 'core' ? 'The system' : n.label}
                </div>
                {n.sub && n.kind !== 'core' && (
                  <div className="mt-0.5 text-[11px] tracking-wide text-ink/55">{n.sub}</div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function KnowledgeScene() {
  const labelEls = useRef<HTMLDivElement[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  // Pause the entire render loop (raycast + draw) once the hero scrolls offscreen
  // — otherwise it keeps rendering full-tilt behind every section below it.
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer + reduced-motion wiring (kept outside the frame loop).
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    hero.hasPointer = fine;
    hero.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hero.reduced) hero.target = 1;
    if (!fine) return;

    const onMove = (e: PointerEvent) => {
      hero.rawX = (e.clientX / window.innerWidth) * 2 - 1;
      hero.rawY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 11], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Scene labelEls={labelEls} />
      </Canvas>
      <Labels labelEls={labelEls} />
    </div>
  );
}
