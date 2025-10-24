'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MoodboardPage() {
  const [images, setImages] = useState<File[]>([]);
  const [vibe, setVibe] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    
    setImages(prev => [...prev, ...files]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    // Placeholder for AI generation (Phase 3)
    console.log('Generating campaign brief...', { images, vibe });
  };

  return (
    <div className="min-h-screen bg-black px-6 py-8">
      {/* Navigation */}
      <nav className="mb-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-light tracking-wide text-white hover:text-gray-300 transition-colors"
        >
          ← CultureMesh
        </Link>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-3 text-5xl font-light tracking-tight text-white">
            Campaign Moodboard
          </h1>
          <p className="mb-12 text-lg font-light text-gray-400">
            Upload images and describe your brand's vibe to generate an AI-powered campaign brief.
          </p>
        </motion.div>

        {/* Image Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <label className="mb-3 block text-sm font-light uppercase tracking-widest text-gray-500">
            Mood Images
          </label>
          
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative min-h-[400px] border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? 'border-white bg-white/5'
                : 'border-gray-700 bg-transparent'
            }`}
          >
            {images.length === 0 ? (
              <div className="flex h-[400px] flex-col items-center justify-center">
                <svg
                  className="mb-4 h-16 w-16 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mb-2 text-lg font-light text-gray-400">
                  Drag and drop images here
                </p>
                <p className="mb-4 text-sm text-gray-600">or</p>
                <label className="cursor-pointer border border-white px-6 py-2 text-sm font-light tracking-wider text-white transition-all hover:bg-white hover:text-black">
                  Browse Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 p-6 md:grid-cols-3 lg:grid-cols-4">
                {images.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group relative aspect-square overflow-hidden bg-gray-900"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-black/70 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
                
                {/* Add More Button */}
                <label className="flex aspect-square cursor-pointer items-center justify-center border border-dashed border-gray-700 transition-all hover:border-white hover:bg-white/5">
                  <span className="text-4xl font-light text-gray-600">+</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </motion.div>

        {/* Vibe Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <label
            htmlFor="vibe"
            className="mb-3 block text-sm font-light uppercase tracking-widest text-gray-500"
          >
            Brand Vibe (Optional)
          </label>
          <input
            id="vibe"
            type="text"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="e.g. urban, intellectual, experimental"
            className="w-full border border-gray-700 bg-transparent px-6 py-4 font-light text-white placeholder-gray-600 transition-all focus:border-white focus:outline-none"
          />
        </motion.div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={handleGenerate}
            disabled={images.length === 0}
            className="w-full border border-white bg-transparent px-12 py-4 text-base font-light tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-800 disabled:hover:bg-transparent disabled:hover:text-gray-800"
          >
            {images.length === 0 ? 'Add Images to Continue' : 'Generate Campaign Brief'}
          </button>
        </motion.div>
      </main>
    </div>
  );
}

