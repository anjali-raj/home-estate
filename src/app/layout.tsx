import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SiteHeader } from '@/components/site-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://estate-finder.example.com'),
  title: {
    default: 'EstateFinder — Property search',
    template: '%s · EstateFinder',
  },
  description:
    'Search apartments, villas and townhouses for sale and rent across the UAE.',
  openGraph: {
    title: 'EstateFinder',
    description: 'Find your next home.',
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-6 text-center text-sm text-muted">
            Built with Next.js · Demo data · © {new Date().getFullYear()} EstateFinder
          </footer>
        </Providers>
      </body>
    </html>
  );
}
