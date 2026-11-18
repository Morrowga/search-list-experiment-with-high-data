import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Search millions of papers',
  description: 'Advanced search, live filter counts and infinite scroll over 295 million research papers (OpenAlex).',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Science+Gothic:wght@100..900&family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
