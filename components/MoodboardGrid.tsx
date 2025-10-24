'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

export interface MoodboardImage {
  id: string;
  url: string;
  urlLarge: string;
  alt: string;
  tags: string[];
  photographer: string;
  photographerUrl?: string;
}

interface MoodboardGridProps {
  images: MoodboardImage[];
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function MoodboardGrid({
  images,
  onRegenerate,
  isRegenerating = false,
}: MoodboardGridProps) {
  const [lightboxImage, setLightboxImage] = useState<MoodboardImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-light tracking-tight text-white">Visual Moodboard</h3>
          <p className="mt-1 text-sm font-light text-gray-500">
            {selectedImages.size} image{selectedImages.size !== 1 ? 's' : ''} selected for deck
          </p>
        </div>
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="rounded-full border border-gray-700 bg-transparent px-6 py-2 text-sm font-light tracking-wide text-gray-400 transition-all duration-300 hover:border-white hover:text-white disabled:opacity-50"
        >
          {isRegenerating ? 'Loading...' : 'Regenerate'}
        </button>
      </div>

      {/* Image Grid */}
      <motion.div
        className="grid grid-cols-2 gap-4 lg:grid-cols-2"
        layout
      >
        <AnimatePresence mode="popLayout">
          {images.slice(0, 8).map((image, idx) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: idx * 0.05,
                layout: { duration: 0.3 },
              }}
              layout
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden border border-gray-800 bg-white/[0.02] shadow-lg"
              onClick={() => setLightboxImage(image)}
            >
              {/* Image */}
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4"
              >
                <div className="flex h-full flex-col justify-end">
                  {/* Tags */}
                  <div className="mb-2 flex flex-wrap gap-1">
                    {image.tags.slice(0, 3).map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="border border-white/30 bg-white/10 px-2 py-1 text-xs font-light text-white backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleImageSelection(image.id);
                    }}
                    className="flex items-center space-x-2 text-white transition-colors hover:text-red-400"
                  >
                    <svg
                      className="h-5 w-5"
                      fill={selectedImages.has(image.id) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-xs font-light">
                      {selectedImages.has(image.id) ? 'Selected' : 'Select'}
                    </span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[90vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-black text-white transition-colors hover:bg-white hover:text-black"
              >
                ×
              </button>

              {/* Large Image */}
              <img
                src={lightboxImage.urlLarge}
                alt={lightboxImage.alt}
                className="max-h-[80vh] w-auto rounded border border-gray-800 shadow-2xl"
              />

              {/* Image Info */}
              <div className="mt-4 space-y-3 border border-gray-800 bg-black/80 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-light text-gray-400">
                      Photo by{' '}
                      {lightboxImage.photographerUrl ? (
                        <a
                          href={lightboxImage.photographerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white underline"
                        >
                          {lightboxImage.photographer}
                        </a>
                      ) : (
                        <span className="text-white">{lightboxImage.photographer}</span>
                      )}
                    </p>
                    <p className="mt-1 text-xs font-light text-gray-500">{lightboxImage.alt}</p>
                  </div>

                  {/* Use in Deck Toggle */}
                  <button
                    onClick={() => toggleImageSelection(lightboxImage.id)}
                    className={`rounded-full border px-6 py-2 text-sm font-light transition-all duration-300 ${
                      selectedImages.has(lightboxImage.id)
                        ? 'border-white bg-white text-black'
                        : 'border-white bg-transparent text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    {selectedImages.has(lightboxImage.id) ? '✓ In Deck' : 'Use in Deck'}
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {lightboxImage.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="border border-gray-700 bg-white/5 px-3 py-1 text-xs font-light text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

