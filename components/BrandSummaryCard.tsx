'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface BrandSummary {
  brandName: string | null;
  brandEssence: string;
  keywords: string[];
  audience: string;
  tone: string[];
  communities: string[];
  fileKeywords: string[];
}

interface BrandSummaryCardProps {
  summary: BrandSummary;
  onEdit: () => void;
}

export function BrandSummaryCard({ summary, onEdit }: BrandSummaryCardProps) {
  const [showJson, setShowJson] = useState(false);

  // JSON output for Step 3
  const jsonOutput = {
    brandName: summary.brandName,
    brandEssence: summary.brandEssence,
    keywords: summary.keywords,
    audience: summary.audience,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto max-w-4xl space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-light tracking-tight text-white md:text-4xl">
          Brand Summary
        </h1>
        <button
          onClick={onEdit}
          className="rounded-full border border-gray-700 bg-transparent px-6 py-2 text-sm font-light tracking-wide text-gray-400 transition-all duration-300 hover:border-white hover:text-white"
        >
          Edit
        </button>
      </div>

      {/* Brand Essence - Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="border border-gray-800 bg-white/[0.02] p-12 shadow-2xl"
      >
        <p className="mb-3 text-xs font-light uppercase tracking-widest text-gray-600">
          Brand Essence
        </p>
        <h2 className="font-serif text-3xl font-normal leading-relaxed text-white md:text-4xl">
          {summary.brandEssence}
        </h2>
      </motion.div>

      {/* Subsection Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Cultural Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border border-gray-800 bg-white/[0.02] p-8"
        >
          <p className="mb-4 text-xs font-light uppercase tracking-widest text-gray-600">
            Cultural Insight
          </p>
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-sm font-light text-gray-500">Tone</p>
              <ul className="space-y-2">
                {summary.tone.map((t, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600" />
                    <span className="text-base font-light capitalize text-gray-300">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {summary.fileKeywords.length > 0 && (
              <div className="pt-3">
                <p className="mb-2 text-sm font-light text-gray-500">
                  Visual Themes
                </p>
                <div className="flex flex-wrap gap-2">
                  {summary.fileKeywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="border border-gray-700 bg-white/5 px-3 py-1 text-xs font-light text-gray-400"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Audience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border border-gray-800 bg-white/[0.02] p-8"
        >
          <p className="mb-4 text-xs font-light uppercase tracking-widest text-gray-600">
            Audience
          </p>
          <ul className="space-y-2">
            {summary.communities.length > 0 ? (
              summary.communities.map((community, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600" />
                  <span className="text-base font-light text-gray-300">
                    {community}
                  </span>
                </li>
              ))
            ) : (
              <li className="flex items-start space-x-3">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-600" />
                <span className="text-base font-light text-gray-300">
                  {summary.audience}
                </span>
              </li>
            )}
          </ul>
        </motion.div>
      </div>

      {/* Image Keywords */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="border border-gray-800 bg-white/[0.02] p-8"
      >
        <p className="mb-4 text-xs font-light uppercase tracking-widest text-gray-600">
          Image Keywords
        </p>
        <p className="mb-4 text-sm font-light text-gray-500">
          These keywords will be used to curate visual inspiration in Step 3
        </p>
        <div className="flex flex-wrap gap-3">
          {summary.keywords.map((keyword, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + idx * 0.05 }}
              className="border border-white bg-transparent px-4 py-2 text-sm font-light text-white"
            >
              {keyword}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* JSON Preview (collapsed by default) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <button
          onClick={() => setShowJson(!showJson)}
          className="flex w-full items-center justify-between border border-gray-800 bg-white/[0.01] px-6 py-4 transition-colors hover:bg-white/[0.02]"
        >
          <span className="text-sm font-light uppercase tracking-widest text-gray-600">
            JSON Preview (for Step 3)
          </span>
          <motion.svg
            animate={{ rotate: showJson ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="h-5 w-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>

        {showJson && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-x border-b border-gray-800 bg-black/50 p-6"
          >
            <pre className="overflow-x-auto text-xs font-light text-gray-400">
              {JSON.stringify(jsonOutput, null, 2)}
            </pre>
          </motion.div>
        )}
      </motion.div>

      {/* Next Step CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-center pt-8"
      >
        <button
          className="rounded-full border border-white bg-transparent px-12 py-4 text-base font-light tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-black"
          onClick={() => {
            console.log('Ready for Step 3: AI Campaign Generation', jsonOutput);
            alert('Step 3 coming soon: AI-powered campaign generation with Unsplash images');
          }}
        >
          Continue to AI Generation
        </button>
      </motion.div>
    </motion.div>
  );
}

