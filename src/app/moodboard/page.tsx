'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

export default function MoodboardPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [vibes, setVibes] = useState('');
  const [brandName, setBrandName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const generateBrief = async () => {
    if (!brandName.trim()) {
      alert('Please enter a brand name');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Store data in sessionStorage for the results page
    sessionStorage.setItem('brandName', brandName);
    sessionStorage.setItem('vibes', vibes);
    sessionStorage.setItem('files', JSON.stringify(files.map(f => ({
      name: f.file.name,
      type: f.file.type
    }))));
    
    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="p-8 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-wider hover:text-gray-300 transition-colors">
            CultureMesh
          </Link>
          <div className="text-sm text-gray-400">
            Step 1 of 3
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Brand Input */}
          <div className="space-y-4">
            <h2 className="text-3xl font-light">Brand Information</h2>
            <input
              type="text"
              placeholder="Enter brand name (e.g., Salomon, Nike, Patagonia)"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full bg-transparent border-b border-gray-600 py-3 text-xl focus:border-white focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* Moodboard Upload */}
          <div className="space-y-6">
            <h2 className="text-3xl font-light">Campaign Moodboard</h2>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                isDragActive 
                  ? 'border-white bg-gray-900' 
                  : 'border-gray-600 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{ scale: isDragActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-xl mb-2">
                    {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                  </p>
                  <p className="text-gray-400">or click to browse</p>
                </div>
              </motion.div>
            </div>

            {/* Uploaded Images */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group"
                    >
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Vibes Input */}
          <div className="space-y-4">
            <h2 className="text-3xl font-light">Brand Vibes</h2>
            <textarea
              placeholder="Describe your brand's cultural vibe (e.g., urban, intellectual, experimental, sustainable, rebellious)"
              value={vibes}
              onChange={(e) => setVibes(e.target.value)}
              className="w-full bg-transparent border border-gray-600 rounded-lg p-4 h-24 resize-none focus:border-white focus:outline-none placeholder-gray-500"
            />
          </div>

          {/* Generate Button */}
          <div className="flex justify-center pt-8">
            <motion.button
              onClick={generateBrief}
              disabled={isGenerating || !brandName.trim()}
              whileHover={{ scale: isGenerating ? 1 : 1.05 }}
              whileTap={{ scale: isGenerating ? 1 : 0.95 }}
              className={`px-12 py-4 text-lg font-medium tracking-wide transition-all duration-300 flex items-center gap-3 ${
                isGenerating || !brandName.trim()
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Analyzing cultural signals...
                </>
              ) : (
                <>
                  Generate Campaign Brief
                  <Sparkles className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
