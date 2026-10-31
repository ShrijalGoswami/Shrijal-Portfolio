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

const SITE_URL = 'https://shrijal-goswami.vercel.app';
const SHARE_TITLE = 'Shrijal Goswami — AI/ML Engineer';
const SHARE_DESCRIPTION =
  'Hybrid retrieval (RAG), stacked ensembles, explainable AI — built to ship, not just to demo.';
const SHARE_IMAGE = {
  url: '/og-card.jpg',
  width: 1200,
  height: 630,
  alt: 'Shrijal Goswami, AI/ML Engineer: I build AI systems that hold up in production.',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SHARE_TITLE,
  description:
    'AI/ML engineer turning research into production-grade systems: hybrid retrieval (RAG), stacked ensembles, and explainable AI. B.Tech CS (AI & ML) @ VIT Bhopal. Building Hirevo, an AI recruiting platform.',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    url: '/',
    siteName: 'Shrijal Goswami',
    locale: 'en_IN',
    type: 'website',
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [SHARE_IMAGE.url],
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
