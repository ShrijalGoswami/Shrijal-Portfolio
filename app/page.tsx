import Header from '@/components/Header';
import ScrollProgress from '@/components/ScrollProgress';
import Hero from '@/components/Hero';
import DriftMotes from '@/components/DriftMotes';
import Identity from '@/components/Identity';
import StatsBand from '@/components/StatsBand';
import About from '@/components/About';
import StackMarquee from '@/components/StackMarquee';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Research from '@/components/Research';
import TerminalSection from '@/components/TerminalSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <DriftMotes />
      <main>
        <Hero />
        <Identity />
        <StatsBand />
        <About />
        <StackMarquee />
        <Experience />
        <Projects />
        <Research />
        <TerminalSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
