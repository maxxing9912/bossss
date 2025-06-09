// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Clarivex – Discord Bot",
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        {/* CSS di AOS via CDN, se non l’hai già in globals.css */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/aos@2.3.1/dist/aos.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}