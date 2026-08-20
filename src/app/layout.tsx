import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SiteHeader } from '@/components/site-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const SITE_NAME = 'Home Estate';
const SITE_DESC =
  'Buy and rent apartments, villas and independent houses across Mumbai, Bengaluru, Delhi, Pune and Gurugram.';

export const metadata: Metadata = {
  metadataBase: new URL('https://home-estate.example.com'),
  title: {
    default: `${SITE_NAME} — Buy & Rent Property in India`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: [
    'property',
    'real estate',
    'buy home India',
    'rent flat',
    'apartments',
    'villas',
    'Mumbai',
    'Bengaluru',
    'Delhi',
    'Pune',
    'Gurugram',
  ],
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    type: 'website',
    locale: 'en_IN',
    siteName: SITE_NAME,
  },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: SITE_DESC },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-IN" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          {/* Barrier-free: keyboard users can jump straight to the content. */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg"
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <footer className="border-t border-border py-6 text-center text-sm text-muted">
            Built with Next.js · Demo data · © {new Date().getFullYear()} Home Estate
          </footer>
        </Providers>
      </body>
    </html>
  );
}
