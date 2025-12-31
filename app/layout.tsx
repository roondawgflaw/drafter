import './globals.css';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider>
          <div className="max-w-6xl mx-auto px-4 py-6">
            <header className="mb-6">
              <nav className="flex items-center justify-between">
                <a href="/" className="font-semibold">Fantasy Track & Field</a>
                <div className="space-x-4 text-sm">
                  <a href="/standings/unofficial">Unofficial</a>
                  <a href="/standings/official">Official</a>
                  <a href="/draft/demo-league">Draft</a>
                  <a href="/admin/upload">Admin</a>
                </div>
              </nav>
            </header>
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
