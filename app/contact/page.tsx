'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContactPage() {
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('selected-community');
    if (saved) {
      try {
        setSelectedCommunity(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse selected community:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-8">
          <Link
            href="/communities"
            className="text-sm font-light text-gray-500 transition-colors hover:text-white"
          >
            ← Back to Communities
          </Link>
        </div>

        <h1 className="mb-4 text-4xl font-light tracking-tight text-white md:text-5xl">
          Contact Community
        </h1>

        {selectedCommunity ? (
          <div className="space-y-6">
            <p className="text-lg font-light text-gray-400">
              Ready to reach out to <span className="text-white">{selectedCommunity.communityName}</span>
            </p>

            <div className="rounded border border-gray-800 bg-white/[0.02] p-8">
              <p className="text-sm font-light italic text-gray-500">
                {/* TODO: Textbox to reach out to the community */}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-lg font-light text-gray-400">
            No community selected. Please return to the communities page.
          </p>
        )}
      </motion.div>
    </div>
  );
}
