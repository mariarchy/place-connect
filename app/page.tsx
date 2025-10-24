'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { BRAND_ANSWERS_STORAGE_KEY } from '@/app/constants';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0b0b0b] px-6 py-12">
      {/* Background GIF */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/landing-page.gif"
          alt=""
          className="h-full w-full object-cover opacity-40"
        />
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl font-light tracking-wide text-white"
          style={{ fontFamily: 'var(--font-druk-wide)' }}
        >
          PLACE Connect
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex max-w-5xl flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="mb-6 text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl" style={{ fontFamily: 'var(--font-druk-wide)' }}>
            Tap into<br />the culture.
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-[#BDBDBD] sm:text-xl">
          PLACE Connect helps brands design authentic, high-impact activations — connecting you with the communities and movements that define the moment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/brand"
            onClick={() => {
              // Clear any existing session data when starting fresh from landing page
              sessionStorage.removeItem(BRAND_ANSWERS_STORAGE_KEY);
            }}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white bg-transparent px-12 py-4 text-base font-light tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            <span className="relative z-10" style={{ fontFamily: 'var(--font-druk-wide)' }}>Connect with Culture</span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0 }}
            />
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
