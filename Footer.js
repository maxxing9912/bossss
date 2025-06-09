// src/components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-indigo-400 py-6 border-t border-gray-700 text-center animate-fade-in">
      <Link href="/tos" className="hover:text-indigo-300">Terms of Service</Link> |
      <Link href="/privacy" className="hover:text-indigo-300"> Privacy Policy</Link> |
      <Link href="/support" className="hover:text-indigo-300"> Support</Link>
      <p className="mt-4">&copy; 2025 Clarivex. All rights reserved.</p>
    </footer>
  );
}