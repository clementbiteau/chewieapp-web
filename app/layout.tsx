import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chewie Smart Tag',
  description: 'Scan this tag to identify this pet.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#f0f4ff',
        minHeight: '100vh',
      }}>
        {children}
      </body>
    </html>
  );
}
