// clarivex-next/app/layout.js
import './globals.css';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Clarivex – Discord Bot',
  description: 'Clarivex website with Discord login via NextAuth'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark">
        {/* 
          Wrap entire app in SessionProvider so that `useSession()` works below.
        */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}