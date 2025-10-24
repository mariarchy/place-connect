'use client';

import { motion } from 'framer-motion';

interface ProtoBriefProps {
  mission: string;
  tone: string;
  communities: string;
  inspiration: string;
  budget: string;
  fileKeywords: string[];
}

export function ProtoBrief({
  mission,
  tone,
  communities,
  inspiration,
  budget,
  fileKeywords,
}: ProtoBriefProps) {
  const hasContent = mission || tone || communities || inspiration || budget || fileKeywords.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-8 h-fit space-y-6"
    >
      {/* Header */}
      <div className="border-b border-gray-800 pb-4">
        <h3 className="text-sm font-light uppercase tracking-widest text-gray-500">
          Proto Brief
        </h3>
      </div>

      {/* Content Card */}
      <div className="border border-gray-800 bg-white/[0.02] p-8 shadow-xl">
        {!hasContent ? (
          <p className="text-base font-light italic text-gray-600">
            Your brand summary will appear here as you answer questions...
          </p>
        ) : (
          <div className="space-y-6">
            {/* Brand Essence */}
            {mission && (
              <div>
                <h4 className="mb-2 font-serif text-3xl font-normal leading-tight text-white">
                  {mission}
                </h4>
              </div>
            )}

            {/* Tone Keywords */}
            {tone && (
              <div>
                <p className="mb-1 text-xs font-light uppercase tracking-wider text-gray-500">
                  Tone
                </p>
                <p className="text-base font-light text-gray-300">{tone}</p>
              </div>
            )}

            {/* Target Communities */}
            {communities && (
              <div>
                <p className="mb-1 text-xs font-light uppercase tracking-wider text-gray-500">
                  Communities
                </p>
                <p className="text-base font-light text-gray-300">{communities}</p>
              </div>
            )}

            {/* Inspiration */}
            {inspiration && (
              <div>
                <p className="mb-1 text-xs font-light uppercase tracking-wider text-gray-500">
                  Inspiration
                </p>
                <p className="text-base font-light text-gray-300">{inspiration}</p>
              </div>
            )}

            {/* Budget */}
            {budget && (
              <div>
                <p className="mb-1 text-xs font-light uppercase tracking-wider text-gray-500">
                  Budget
                </p>
                <p className="text-base font-light text-gray-300">{budget}</p>
              </div>
            )}

            {/* File Keywords */}
            {fileKeywords.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-light uppercase tracking-wider text-gray-500">
                  Visual Themes
                </p>
                <div className="flex flex-wrap gap-2">
                  {fileKeywords.map((keyword, idx) => (
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
        )}
      </div>

      {/* Subtle hint */}
      <p className="text-xs font-light text-gray-700">
        This summary updates in real-time as you type.
      </p>
    </motion.div>
  );
}

