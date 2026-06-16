import Header from '@/components/Header';
import ScrollProgress from '@/components/ScrollProgress';
import NameIntro from '@/components/hero/NameIntro';
import LivingHero from '@/components/hero/LivingHero';
import AmbientField from '@/components/AmbientField';
import Identity from '@/components/Identity';
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
      <NameIntro />
      <ScrollProgress />
      <Header />
      <AmbientField />
      <main>
        <LivingHero />
        <Identity />
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
