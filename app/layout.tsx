import type {Metadata} from 'next';
import { Inter, Space_Grotesk, Cormorant_Garamond } from 'next/font/google';
import './globals.css'; // Global styles
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import AgeVerification from '@/components/AgeVerification';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vapeai.com'),
  title: {
    template: '%s | VapeAI Enterprise',
    default: 'VapeAI - Премиальный маркетплейс вейпов',
  },
  description: 'Лучшие вейпы, жидкости и аксессуары с доставкой. AI-подбор вкусов.',
  openGraph: {
    title: 'VapeAI - Премиальный маркетплейс',
    description: 'Лучшие вейпы, жидкости и аксессуары с доставкой.',
    url: 'https://vapeai.com',
    siteName: 'VapeAI',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VapeAI - Премиальный маркетплейс',
    description: 'Лучшие вейпы, жидкости и аксессуары с доставкой.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${cormorant.variable} dark`}>
      <body className="bg-[#0F0F0F] text-white font-sans antialiased selection:bg-indigo-500/30 relative min-h-screen" suppressHydrationWarning>
        <Providers>
          <AgeVerification />
          <CookieConsent />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Cart />
          </div>
        </Providers>
      </body>
    </html>
  );
}
