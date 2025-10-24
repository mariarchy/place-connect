'use client';

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0b0b0b] px-6 py-12">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl font-light tracking-wide text-white"
        >
          PLACE Connect
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="flex max-w-5xl flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="mb-6 text-6xl font-light tracking-tight text-white sm:text-7xl md:text-8xl">
            Where Brands
            <br />
            Meet Culture
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-[#BDBDBD] sm:text-xl">
            A cinematic conversational platform for marketing leads to discover their brand essence and connect with authentic communities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            href="/moodboard"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white bg-transparent px-12 py-4 text-base font-light tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            <span className="relative z-10">Start Brand Discovery</span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0 }}
            />
          </Link>
        </motion.div>

        {/* Subtle bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 text-sm font-light tracking-widest text-gray-700"
        >
          STEP 1 — BRAND DISCOVERY
        </motion.p>
      </main>
    </div>
  );
}
