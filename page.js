// app/pricing/page.js

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PricingPage() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPlan(localStorage.getItem('clarivexPlan'));
  }, []);

  useEffect(() => {
    const header = document.getElementById('header');
    const handleScroll = () => header?.classList.toggle('shrink', window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch('/create-checkout-session', { method: 'POST' });
      const { sessionId } = await res.json();
      const stripe = Stripe(process.env.NEXT_PUBLIC_STRIPE_PK);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (err) {
      alert(err.message || 'Failed to reach server');
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />

      <Header />

      <section className="text-center py-20">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
          <span className="typewriter"><span className="wrap"></span></span>
        </h2>
        <p className="text-indigo-300 mb-12">Choose your plan and unlock all Clarivex features.</p>
      </section>

      <main className="container mx-auto px-6 max-w-4xl grid md:grid-cols-2 gap-8 mb-20">
        <div className={`plan-card ${plan === 'premium' ? '' : 'current'}`}>
          <h3 className="text-2xl font-semibold mb-2">Free</h3>
          <p className="text-xl mb-4">Forever Free</p>
          <ul className="mb-6 space-y-2 text-left list-disc list-inside">
            <li>Basic Moderation</li>
            <li>Limited XP & Levels</li>
            <li>Community Support</li>
          </ul>
          <button
            className="btn cta-btn bg-white text-gray-900 font-bold py-2 px-6 rounded-full shadow-lg"
            disabled
          >
            You're on Free
          </button>
        </div>

        <div className={`plan-card ${plan === 'premium' ? 'current' : ''}`}>
          <h3 className="text-2xl font-semibold mb-2">Premium</h3>
          <p className="text-3xl font-bold mb-1">€3.99
          </p>
          <p className="text-base mb-4">One-time payment • Lifetime Access</p>
          <ul className="mb-6 space-y-2 text-left list-disc list-inside">
            <li>Advanced Moderation</li>
            <li>Full XP & Levels</li>
            <li>Premium Unlocks</li>
            <li>Priority Support</li>
          </ul>
          <button
            onClick={handleBuy}
            disabled={plan === 'premium' || loading}
            className="btn cta-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg"
          >
            {plan === 'premium' ? "You're on Premium" : loading ? 'Redirecting…' : 'Buy Premium'}
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}