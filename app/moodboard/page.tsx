'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { QuestionCard } from '@/components/QuestionCard';
import { ProtoBrief } from '@/components/ProtoBrief';
import { mapFilenamesToKeywords } from '@/lib/fileMapping';

interface BrandAnswers {
  mission: string;
  tone: string;
  communities: string;
  inspiration: string;
  budget: string;
  fileNames: string[];
}

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
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<BrandAnswers>({
    mission: '',
    tone: '',
    communities: '',
    inspiration: '',
    budget: '',
    fileNames: [],
  });

  const currentQuestion = questions[currentStep];
  const currentKey = currentQuestion.id as keyof BrandAnswers;

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finished - could navigate or show completion
      console.log('Completed! Answers:', answers);
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

  // Compute file keywords for Proto Brief
  const fileKeywords = mapFilenamesToKeywords(answers.fileNames);

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
