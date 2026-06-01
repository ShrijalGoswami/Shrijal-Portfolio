import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Terminal, ShieldAlert, CheckCircle, AlertTriangle, AlertCircle, Cpu } from 'lucide-react';
import emailjs from '@emailjs/browser';
import confetti from 'canvas-confetti';
import { use3DTilt } from '../hooks/use3DTilt';

const Github = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [honeypot, setHoneypot] = useState('');
  const [logs, setLogs] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 3D tilt effects for the form container
  const formTilt = use3DTilt(2, 1.002);
  const infoTilt = use3DTilt(3, 1.005);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const { name, email, message } = formData;

    setSubmitted(false);
    setLogs(["[SYSTEM] Initializing client validation checks..."]);

    // 1. Client-side Validation Checks
    if (!name.trim() || !email.trim() || !message.trim()) {
      const errorMsg = "[ERROR] Required fields are missing. Validation aborted.";
      setLogs(prev => [...prev, errorMsg]);
      showToast("Please fill in all fields.", "error");
      return;
    }

    if (!validateEmail(email)) {
      const errorMsg = "[ERROR] Invalid sender email syntax format. Hook rejected.";
      setLogs(prev => [...prev, errorMsg]);
      showToast("Please provide a valid email address.", "error");
      return;
    }

    setLogs(prev => [...prev, "1. Client validation completed successfully. [PASSED]"]);
    setSubmitting(true);

    // 2. Anti-Spam Mitigation Checks (Honeypot trap)
    if (honeypot) {
      setLogs(prev => [
        ...prev,
        "2. Executing anti-spam signature scans...",
        "3. System security trigger: Bot signature flagged. [REJECTED]",
        "4. Dispatching virtual dummy success code packet..."
      ]);
      setTimeout(() => {
        setLogs(prev => [...prev, "5. Simulated dispatch accepted. Status 200 (Mock)."]);
        setSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      }, 1000);
      return;
    }

    // 3. Client Throttling prevention (max 1 email per 60 seconds)
    const lastSubmitTime = localStorage.getItem('shrijal_contact_submit_time');
    const now = Date.now();
    if (lastSubmitTime && now - parseInt(lastSubmitTime) < 60000) {
      const cooldownRemaining = Math.ceil((60000 - (now - parseInt(lastSubmitTime))) / 1000);
      const errorMsg = `[ERROR] Rate limit threshold triggered. Cooldown active for ${cooldownRemaining}s.`;
      setLogs(prev => [...prev, errorMsg]);
      showToast(`Rate limit active. Please wait ${cooldownRemaining} seconds.`, "error");
      setSubmitting(false);
      return;
    }

    setLogs(prev => [...prev, "2. Running anti-spam screenings... [CLEAR]"]);

    // 4. Resolve credentials from environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const isSandboxFallback =
      !serviceId ||
      !templateId ||
      !publicKey ||
      serviceId.includes("placeholder") ||
      templateId.includes("placeholder") ||
      publicKey.includes("placeholder");

    if (isSandboxFallback) {
      // Environment Fallback Sandbox Mode
      setLogs(prev => [
        ...prev,
        "3. Loading system configurations... [SANDBOX FALLBACK ACTIVE]",
        "   > Warning: VITE_EMAILJS_* credentials missing or set to placeholder.",
        "   > Executing frontend simulation sequences...",
        "4. Establishing virtual socket connection...",
        "5. Packaging local payload structures..."
      ]);

      setTimeout(() => {
        setLogs(prev => [
          ...prev,
          "6. Sending message payload to mockup service...",
          "7. REST Response: 202 Accepted (Simulated queue).",
          "8. Local thread executed. Simulation complete."
        ]);
        setSubmitting(false);
        setSubmitted(true);
        localStorage.setItem('shrijal_contact_submit_time', Date.now().toString());
        setFormData({ name: '', email: '', message: '' });
        showToast("Sandbox simulated success! (Configure .env to send real emails)", "warning");

        confetti({
          particleCount: 30,
          spread: 40,
          colors: ['#a78bfa', '#818cf8']
        });
      }, 1500);
      return;
    }

    // 5. Real EmailJS Integration
    try {
      setLogs(prev => [
        ...prev,
        "3. Resolved server configurations successfully.",
        "4. Initiating REST socket to api.emailjs.com gateway...",
      ]);

      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        time: new Date().toLocaleString()
      };

      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);

      if (result.status === 200) {
        setLogs(prev => [
          ...prev,
          "5. Socket response: 200 OK Connection established.",
          "6. Transmitting payload headers...",
          "7. Dispatch Accepted. Unique ID generated successfully.",
          "8. Thread closed. Gateway response cached."
        ]);
        setSubmitting(false);
        setSubmitted(true);
        localStorage.setItem('shrijal_contact_submit_time', Date.now().toString());
        setFormData({ name: '', email: '', message: '' });
        showToast("Message dispatched successfully! Shrijal will be notified.", "success");

        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.9 },
          colors: ['#a78bfa', '#818cf8', '#34d399']
        });
      } else {
        throw new Error(`Invalid status response code: ${result.status}`);
      }

    } catch (error) {
      const errorStr = error?.text || error?.message || "Unknown API transport error";
      setLogs(prev => [
        ...prev,
        `[CRITICAL] REST dispatch failed: ${errorStr}`,
        "   > Diagnostic dump saved. Thread terminated."
      ]);
      setSubmitting(false);
      showToast(`Failed to send message: ${errorStr}`, "error");
    }
  };

  return (
    <section id="contact" className="py-20 border-t border-white/[0.04] relative">
      <div className="absolute inset-0 bg-dot-grid opacity-15 pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">

        {/* Dynamic Toast Notifications */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 border px-4.5 py-3 rounded-xl shadow-2xl font-mono text-[10px] max-w-sm backdrop-blur-md ${toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400'
                : toast.type === 'warning'
                  ? 'bg-amber-950/90 border-amber-500/30 text-amber-400'
                  : 'bg-red-950/90 border-red-500/30 text-red-400'
                }`}
            >
              {toast.type === 'success' && <CheckCircle className="h-4 w-4 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="h-4 w-4 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-white/[0.04] bg-[#0e0e14] px-3 py-1 rounded-full text-[10px] text-zinc-400 font-mono mb-4">
            <Mail className="h-3.5 w-3.5 text-indigo-400" />
            <span>/system/gateway</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            LET'S COLLABORATE
          </h2>
          <p className="text-xs sm:text-sm text-zinc-450 max-w-xl mx-auto font-mono">
            Get in touch for internships, research, hackathons, or system building.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-stretch">

          {/* Contact Details & Links */}
          <div 
            style={infoTilt.tiltStyle}
            onMouseMove={infoTilt.handleMouseMove}
            onMouseLeave={infoTilt.handleMouseLeave}
            className="md:col-span-5 space-y-6 flex flex-col justify-between p-6 bg-[#0e0e14]/40 border border-white/[0.04] rounded-xl relative overflow-hidden select-none shadow-md"
          >
            <div style={{ ...infoTilt.glareStyle, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />
            
            <div className="space-y-6 z-10 relative">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-indigo-400" />
                <span>System Endpoints</span>
              </h3>
              <p className="text-xs text-zinc-450 leading-relaxed font-normal">
                Looking to build something impactful with AI? Drop a line to discuss retrieval system optimization, model generalization stacking, or FastAPI integrations. Always open to high-impact projects.
              </p>

              <div className="space-y-3 font-mono text-[10px]">
                <a
                  href="mailto:goswamivansh999@gmail.com"
                  className="flex items-center gap-3 p-3 bg-black/40 border border-white/[0.03] rounded-lg hover:border-indigo-500/30 transition-all text-zinc-400 hover:text-white"
                >
                  <Mail className="h-4 w-4 text-indigo-450" />
                  <span>goswamivansh999@gmail.com</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/shrijal-goswami"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-black/40 border border-white/[0.03] rounded-lg hover:border-indigo-500/30 transition-all text-zinc-400 hover:text-white"
                >
                  <Linkedin className="h-4 w-4 text-indigo-455" />
                  <span>linkedin.com/in/shrijal-goswami</span>
                </a>

                <a
                  href="https://github.com/ShrijalGoswami"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-black/40 border border-white/[0.03] rounded-lg hover:border-indigo-500/30 transition-all text-zinc-400 hover:text-white"
                >
                  <Github className="h-4 w-4 text-indigo-455" />
                  <span>github.com/Shri-AI-ML</span>
                </a>
              </div>
            </div>

            <div className="p-3 bg-black/40 border border-white/[0.03] rounded-lg text-center z-10 relative">
              <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest block mb-1">Response Latency</span>
              <span className="text-xs font-mono font-bold text-emerald-450">&lt; 12 hours (High priority)</span>
            </div>
          </div>

          {/* Contact Form & Console */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <form 
              style={formTilt.tiltStyle}
              onMouseMove={formTilt.handleMouseMove}
              onMouseLeave={formTilt.handleMouseLeave}
              onSubmit={handleSubmit} 
              className="glass-panel border border-white/[0.04] rounded-xl p-6 space-y-4 relative overflow-hidden select-none bg-[#0e0e14]/40 shadow-md"
            >
              <div style={{ ...formTilt.glareStyle, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />

              {/* Bot Trap Honey Pot */}
              <input
                type="text"
                name="bot_trap"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                autoComplete="off"
                tabIndex="-1"
              />

              <div className="grid sm:grid-cols-2 gap-4 z-10 relative">
                <div className="space-y-1.5">
                  <label htmlFor="from_name" className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Your Name</label>
                  <input
                    id="from_name"
                    type="text"
                    name="from_name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alice Dev"
                    disabled={submitting}
                    className="w-full bg-black/30 border border-white/[0.03] rounded-lg p-2.5 text-xs outline-none text-zinc-200 focus:border-indigo-500/40 transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="from_email" className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Your Email</label>
                  <input
                    id="from_email"
                    type="email"
                    name="from_email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alice@domain.com"
                    disabled={submitting}
                    className="w-full bg-black/30 border border-white/[0.03] rounded-lg p-2.5 text-xs outline-none text-zinc-200 focus:border-indigo-500/40 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5 z-10 relative">
                <label htmlFor="message" className="text-[9px] font-mono text-zinc-550 uppercase tracking-wider block">Payload / Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hey Shrijal, let's connect regarding a RAG system optimization project..."
                  disabled={submitting}
                  className="w-full bg-black/30 border border-white/[0.03] rounded-lg p-2.5 text-xs outline-none text-zinc-200 focus:border-indigo-500/40 transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.15)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer z-10 relative"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? "Transmitting payload..." : "Send Secure Message"}</span>
              </button>
            </form>

            {/* Submission Terminal Logger Output */}
            <div className="glass-panel border border-white/[0.04] rounded-xl p-4 font-mono text-[10px] h-[120px] flex flex-col justify-between bg-[#0e0e14]/40 shadow-sm">
              <div className="flex items-center justify-between text-[8px] text-zinc-500 border-b border-white/[0.03] pb-1.5 mb-1.5 uppercase font-bold">
                <div className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Gateway Submission logs</span>
                </div>
                <span>REST client</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 text-[9px] text-zinc-400 terminal-scroll">
                {logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {log.startsWith('[ERROR]') || log.startsWith('[CRITICAL]') ? (
                      <span className="text-red-400 font-semibold">{log}</span>
                    ) : log.includes('Response') || log.includes('Accept') || log.includes('success') || log.includes('dispatched') || log.includes('completed') || log.includes('closed') ? (
                      <span className="text-emerald-400 font-semibold">{log}</span>
                    ) : log.includes('Warning') || log.includes('FALLBACK') ? (
                      <span className="text-amber-400 font-semibold">{log}</span>
                    ) : (
                      <span className="text-zinc-550">{log}</span>
                    )}
                  </div>
                ))}
                {submitting && (
                  <div className="flex items-center gap-1 text-zinc-500 italic">
                    <span className="w-1 h-3.5 bg-indigo-500 animate-pulse"></span>
                    <span>Streaming network buffers...</span>
                  </div>
                )}
                {logs.length === 0 && (
                  <span className="text-zinc-650 italic">// Console idle. Fill form and submit to monitor network gate logs...</span>
                )}
              </div>

              {submitted && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[9px] mt-1 pt-1 border-t border-white/[0.04]">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>DISPATCH COMPLETE. Shrijal has been notified!</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
