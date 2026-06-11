import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
});

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jbmono',
});

export const metadata: Metadata = {
  title: 'Shrijal Goswami — AI/ML Engineer',
  description:
    'AI/ML engineer turning research into production-grade systems: hybrid retrieval (RAG), stacked ensembles, and explainable AI. B.Tech CS (AI & ML) @ VIT Bhopal. AI Intern @ Pinnacle Labs.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Shrijal Goswami — AI/ML Engineer',
    description:
      'Hybrid retrieval (RAG), stacked ensembles, explainable AI — built to ship, not just to demo.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable} ${jbMono.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
