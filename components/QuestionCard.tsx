'use client';

import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  isFileUpload?: boolean;
  fileNames?: string[];
  onFileChange?: (files: FileList) => void;
}

export function QuestionCard({
  question,
  placeholder,
  value,
  onChange,
  onNext,
  onBack,
  isFirst,
  isLast,
  isFileUpload = false,
  fileNames = [],
  onFileChange,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="flex flex-col space-y-8"
    >
      {/* Question */}
      <h2 className="text-3xl font-light leading-relaxed text-white md:text-4xl">
        {question}
      </h2>

      {/* Input Area */}
      {isFileUpload ? (
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center justify-center border border-gray-700 bg-transparent px-8 py-6 transition-all duration-300 hover:border-white hover:bg-white/5">
            <span className="text-base font-light text-gray-400">
              {fileNames.length > 0
                ? `${fileNames.length} file${fileNames.length > 1 ? 's' : ''} selected`
                : 'Choose files (PDF, PPT, images)'}
            </span>
            <input
              type="file"
              multiple
              accept=".pdf,.ppt,.pptx,image/*"
              onChange={(e) => {
                if (e.target.files && onFileChange) {
                  onFileChange(e.target.files);
                }
              }}
              className="hidden"
            />
          </label>

          {/* File List */}
          {fileNames.length > 0 && (
            <div className="space-y-2">
              {fileNames.map((name, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 border border-gray-800 bg-white/5 px-4 py-3"
                >
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="flex-1 truncate text-sm font-light text-gray-300">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full resize-none border border-gray-700 bg-transparent px-6 py-4 text-lg font-light text-white placeholder-gray-600 transition-all duration-300 focus:border-white focus:outline-none"
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between space-x-4">
        <button
          onClick={onBack}
          disabled={isFirst}
          className="rounded-full border border-gray-700 bg-transparent px-8 py-3 text-sm font-light tracking-wide text-gray-500 transition-all duration-300 hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-gray-700 disabled:hover:text-gray-500"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className="rounded-full border border-white bg-transparent px-8 py-3 text-sm font-light tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-black"
        >
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>
    </motion.div>
  );
}

