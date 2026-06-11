import Header from '@/components/Header';
import NameIntro from '@/components/hero/NameIntro';
import LivingHero from '@/components/hero/LivingHero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import TerminalSection from '@/components/TerminalSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <NameIntro />
      <Header />
      <main>
        <LivingHero />
        <About />
        <Experience />
        <Projects />
        <TerminalSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
