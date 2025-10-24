'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { QuestionCard } from '@/components/QuestionCard';
import { ProtoBrief } from '@/components/ProtoBrief';
import { BrandSummaryCard } from '@/components/BrandSummaryCard';
import { mapFilenamesToKeywords } from '@/lib/fileMapping';
import { synthesizeBrandSummary } from '@/lib/summarize';
import { BRAND_ANSWERS_STORAGE_KEY } from '@/app/constants';

interface BrandAnswers {
  mission: string;
  tone: string;
  communities: string;
  inspiration: string;
  budget: string;
  fileNames: string[];
}

type ViewMode = 'questions' | 'review' | 'summary';

const questions = [
  {
    id: 'mission',
    question: "What's your brand's mission or core idea?",
    placeholder: 'e.g., We connect urban creators with sustainable outdoor experiences...',
  },
  {
    id: 'tone',
    question: 'What words describe your tone of voice?',
    placeholder: 'e.g., playful, authentic, bold, minimalist...',
  },
  {
    id: 'communities',
    question: 'Who do you want to connect with — what kind of communities or subcultures?',
    placeholder: 'e.g., skaters, chess enthusiasts, indie music lovers...',
  },
  {
    id: 'inspiration',
    question: "What's an event or campaign that inspired you?",
    placeholder: 'e.g., A pop-up skate park collaboration, a film festival...',
  },
  {
    id: 'budget',
    question: 'What is your budget?',
    placeholder: 'e.g., $10k-$50k, $100k+...',
  },
  {
    id: 'upload',
    question: 'Optional: Upload your brand deck (PDF, PPT, or image).',
    placeholder: '',
    isFileUpload: true,
  },
];

export default function MoodboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params or defaults
  const urlStep = searchParams.get('step');
  const urlView = searchParams.get('view') as ViewMode | null;
  
  const [viewMode, setViewMode] = useState<ViewMode>(urlView || 'questions');
  const [currentStep, setCurrentStep] = useState(
    urlStep ? parseInt(urlStep, 10) : 0
  );
  const [answers, setAnswers] = useState<BrandAnswers>({
    mission: '',
    tone: '',
    communities: '',
    inspiration: '',
    budget: '',
    fileNames: [],
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load answers from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(BRAND_ANSWERS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
      } catch (e) {
        console.error('Failed to parse saved answers:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save answers to sessionStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      sessionStorage.setItem(BRAND_ANSWERS_STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers, isInitialized]);

  // Sync URL with current state
  useEffect(() => {
    if (!isInitialized) return;
    
    const params = new URLSearchParams();
    if (viewMode !== 'questions') {
      params.set('view', viewMode);
    }
    if (currentStep > 0 && viewMode === 'questions') {
      params.set('step', currentStep.toString());
    }
    
    const paramString = params.toString();
    const newUrl = paramString ? `?${paramString}` : '/brand';
    
    // Use push to create history entries for back/forward navigation
    router.push(newUrl, { scroll: false });
  }, [currentStep, viewMode, router, isInitialized]);

  // Read state from URL when user navigates back/forward
  useEffect(() => {
    const urlStep = searchParams.get('step');
    const urlView = searchParams.get('view') as ViewMode | null;
    
    if (urlView && urlView !== viewMode) {
      setViewMode(urlView);
    } else if (!urlView && viewMode !== 'questions') {
      setViewMode('questions');
    }
    
    if (urlStep) {
      const step = parseInt(urlStep, 10);
      if (step !== currentStep) {
        setCurrentStep(step);
      }
    } else if (currentStep !== 0 && viewMode === 'questions' && !urlView) {
      setCurrentStep(0);
    }
  }, [searchParams]);

  const currentQuestion = questions[currentStep];
  const currentKey = currentQuestion.id as keyof BrandAnswers;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finished all questions - show review screen
      setViewMode('review');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentKey]: value,
    }));
  };

  const handleFileChange = (files: FileList) => {
    const fileNamesArray = Array.from(files).map((f) => f.name);
    setAnswers((prev) => ({
      ...prev,
      fileNames: fileNamesArray,
    }));
  };

  const handleSummarize = () => {
    setViewMode('summary');
  };

  const handleEdit = () => {
    setViewMode('questions');
    setCurrentStep(0);
  };

  const handleClearAndRestart = () => {
    sessionStorage.removeItem(BRAND_ANSWERS_STORAGE_KEY);
    setAnswers({
      mission: '',
      tone: '',
      communities: '',
      inspiration: '',
      budget: '',
      fileNames: [],
    });
    setViewMode('questions');
    setCurrentStep(0);
  };

  // Compute file keywords for Proto Brief
  const fileKeywords = mapFilenamesToKeywords(answers.fileNames);

  // Generate brand summary
  const brandSummary = synthesizeBrandSummary(answers, fileKeywords);

  // Render summary view
  if (viewMode === 'summary') {
    return (
      <div className="min-h-screen bg-[#0b0b0b] px-6 py-8">
        <nav className="mb-12">
          <Link
            href="/"
            className="text-lg font-light tracking-wide text-white transition-colors hover:text-gray-300"
          >
            ← PLACE Connect
          </Link>
        </nav>
        <main className="pb-16">
          <BrandSummaryCard summary={brandSummary} onEdit={handleEdit} />
        </main>
      </div>
    );
  }

  // Render review/CTA view
  if (viewMode === 'review') {
    return (
      <div className="min-h-screen bg-[#0b0b0b] px-6 py-8">
        <nav className="mb-12">
          <Link
            href="/"
            className="text-lg font-light tracking-wide text-white transition-colors hover:text-gray-300"
          >
            ← PLACE Connect
          </Link>
        </nav>
        <main className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center"
          >
            <div>
              <h1 className="mb-4 text-5xl font-light tracking-tight text-white md:text-6xl">
                You're all set.
              </h1>
              <p className="text-xl font-light text-[#BDBDBD]">
                Let's synthesize your brand story into a beautiful summary.
              </p>
            </div>

            {/* Preview Cards */}
            <div className="grid grid-cols-1 gap-4 py-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="border border-gray-800 bg-white/[0.02] p-6"
              >
                <p className="mb-2 text-xs font-light uppercase tracking-widest text-gray-600">
                  Brand Essence
                </p>
                <p className="text-sm font-light text-gray-400">
                  Synthesized from your mission and tone
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="border border-gray-800 bg-white/[0.02] p-6"
              >
                <p className="mb-2 text-xs font-light uppercase tracking-widest text-gray-600">
                  Audience Insights
                </p>
                <p className="text-sm font-light text-gray-400">
                  Communities and cultural themes
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="border border-gray-800 bg-white/[0.02] p-6"
              >
                <p className="mb-2 text-xs font-light uppercase tracking-widest text-gray-600">
                  Image Keywords
                </p>
                <p className="text-sm font-light text-gray-400">
                  Ready for visual curation
                </p>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 pt-8 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              <button
                onClick={handleEdit}
                className="rounded-full border border-gray-700 bg-transparent px-8 py-3 text-sm font-light tracking-wide text-gray-400 transition-all duration-300 hover:border-white hover:text-white"
              >
                Go Back & Edit
              </button>
              <button
                onClick={handleSummarize}
                className="rounded-full border border-white bg-transparent px-12 py-4 text-base font-light tracking-wider text-white transition-all duration-300 hover:bg-white hover:text-black"
              >
                Summarize Brand
              </button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Render questions view
  return (
    <div className="min-h-screen bg-[#0b0b0b] px-6 py-8">
      {/* Navigation */}
      <nav className="mb-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-light tracking-wide text-white transition-colors hover:text-gray-300"
        >
          ← PLACE Connect
        </Link>
        <div className="text-sm font-light text-gray-600">
          Step {currentStep + 1} of {questions.length}
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Left Column: Chat Q&A (60%) */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="mb-3 text-4xl font-light tracking-tight text-white md:text-5xl">
                Brand Discovery
              </h1>
              <p className="text-lg font-light text-[#BDBDBD]">
                Answer a few questions to build your proto brief.
              </p>
            </div>

            {/* Question Card with Animation */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <QuestionCard
                  key={currentStep}
                  question={currentQuestion.question}
                  placeholder={currentQuestion.placeholder}
                  value={
                    currentQuestion.isFileUpload
                      ? ''
                      : (answers[currentKey] as string)
                  }
                  onChange={handleAnswerChange}
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirst={currentStep === 0}
                  isLast={currentStep === questions.length - 1}
                  isFileUpload={currentQuestion.isFileUpload}
                  fileNames={currentQuestion.isFileUpload ? answers.fileNames : []}
                  onFileChange={handleFileChange}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Proto Brief (40%) */}
          <div className="lg:col-span-2">
            <ProtoBrief
              mission={answers.mission}
              tone={answers.tone}
              communities={answers.communities}
              inspiration={answers.inspiration}
              budget={answers.budget}
              fileKeywords={fileKeywords}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
