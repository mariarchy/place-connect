'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';

interface MoodboardImage {
  id: string;
  url: string;
  alt: string;
}

interface Collaboration {
  engagementType: string;
  budget: number;
  nonMonetaryOfferings: string[];
  description: string;
}

interface CommunityCollaboration {
  communityId: string;
  communityName?: string;
  collaborations: Collaboration[];
}

interface CulturalMetric {
  trend: string;
  metric: string;
  summary: string;
}

interface CampaignReportData {
  culturalInsight: {
    description: string;
    metrics: CulturalMetric[];
  };
  campaignIdea: {
    title: string;
    description: string;
  };
  potentialCollaborations: CommunityCollaboration[];
  nextSteps: string[];
}

interface CampaignReportProps {
  report: CampaignReportData;
  keywords: string[];
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

// Diagonal image positions for creative overlapping layout
const IMAGE_POSITIONS = [
  { rotation: -3, zIndex: 4, offsetX: '-5%', offsetY: '10%' },
  { rotation: 2, zIndex: 3, offsetX: '15%', offsetY: '5%' },
  { rotation: -1, zIndex: 5, offsetX: '35%', offsetY: '15%' },
  { rotation: 3, zIndex: 2, offsetX: '55%', offsetY: '8%' },
  { rotation: -2, zIndex: 6, offsetX: '10%', offsetY: '35%' },
  { rotation: 1, zIndex: 1, offsetX: '65%', offsetY: '30%' },
  { rotation: -4, zIndex: 3, offsetX: '40%', offsetY: '45%' },
  { rotation: 2, zIndex: 4, offsetX: '20%', offsetY: '60%' },
];

export function CampaignReport({
  report,
  keywords,
  onRegenerate,
  isRegenerating = false,
}: CampaignReportProps) {
  const router = useRouter();
  const [moodboardImages, setMoodboardImages] = useState<MoodboardImage[]>([]);
  const [isLoadingMoodboard, setIsLoadingMoodboard] = useState(false);
  const [moodboardSeed, setMoodboardSeed] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Save report to sessionStorage for communities page
  useEffect(() => {
    sessionStorage.setItem('place-connect-campaign-report', JSON.stringify(report));
  }, [report]);
  
  // Refs for scroll animations
  const culturalInsightRef = useRef(null);
  const collaborationsRef = useRef(null);
  const culturalSignalsRef = useRef(null);
  
  const culturalInsightInView = useInView(culturalInsightRef, { once: true, margin: "-100px" });
  const collaborationsInView = useInView(collaborationsRef, { once: true, margin: "-100px" });
  const culturalSignalsInView = useInView(culturalSignalsRef, { once: true, margin: "-100px" });

  // Fetch moodboard on mount
  useEffect(() => {
    fetchMoodboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoodboard = async () => {
    setIsLoadingMoodboard(true);
    try {
      const keywordsParam = keywords.join(',');
      const response = await fetch(
        `/api/moodboard?keywords=${encodeURIComponent(keywordsParam)}&seed=${moodboardSeed}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch moodboard');
      }

      const images = await response.json();
      setMoodboardImages(images);
    } catch (error) {
      console.error('Error fetching moodboard:', error);
    } finally {
      setIsLoadingMoodboard(false);
    }
  };

  const handleRegenerateMoodboard = () => {
    setMoodboardSeed((prev) => prev + 1);
    setTimeout(() => fetchMoodboard(), 100);
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);
    try {
      // Capture the report container
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0b0b0b',
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      // Add pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`campaign-report-${report.campaignIdea.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try using browser print (Cmd+P) instead.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={reportRef} className="min-h-screen bg-black">
      {/* HERO SECTION - Diagonal Overlapping Images with Title */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        {/* Images - Diagonal Overlapping Layout */}
        <div className="absolute inset-0">
          {isLoadingMoodboard && moodboardImages.length === 0 ? (
            // Loading state
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-3 h-12 w-12 animate-spin rounded-full border-2 border-gray-700 border-t-white mx-auto" />
                <p className="text-sm font-light text-gray-500">Loading visuals...</p>
              </div>
            </div>
          ) : (
            moodboardImages.slice(0, 8).map((image, idx) => {
              const position = IMAGE_POSITIONS[idx] || IMAGE_POSITIONS[0];
              return (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: idx * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="group absolute overflow-hidden shadow-2xl"
                  style={{
                    left: position.offsetX,
                    top: position.offsetY,
                    width: '280px',
                    height: '380px',
                    transform: `rotate(${position.rotation}deg)`,
                    zIndex: position.zIndex,
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                    style={{
                      transform: `rotate(${-position.rotation}deg) scale(1.1)`,
                    }}
                  />
                  {/* Subtle overlay on each image */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
                </motion.div>
              );
            })
          )}
        </div>

        {/* Dark Gradient Overlay - Lighter */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/50 to-black pointer-events-none" />

        {/* Campaign Title - Centered */}
        <div className="absolute inset-0 z-50 flex items-center justify-center px-6 pointer-events-none" style={{ fontFamily: 'var(--font-druk-wide)' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
            style={{ mixBlendMode: 'lighten' }}
          >
            <h1 className="text-5xl font-bold uppercase leading-tight tracking-wider text-white md:text-6xl lg:text-7xl xl:text-8xl">
              {report.campaignIdea.title}
            </h1>
          </motion.div>
        </div>

        {/* Action Buttons - Top Right */}
        <div className="absolute right-6 top-6 z-[60] flex items-center space-x-3">
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="rounded-full border border-gray-700 bg-black/50 px-6 py-2 text-sm font-light tracking-wide text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-black/70 hover:text-white disabled:opacity-50"
          >
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="rounded-full border border-white bg-black/50 px-6 py-2 text-sm font-light tracking-wide text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-light uppercase tracking-widest text-gray-400">
              Scroll to explore
            </span>
            <motion.svg
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </div>
        </motion.div>
      </section>

      {/* CAMPAIGN STRATEGY DESCRIPTION */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        {/* Campaign Description */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-xl font-light leading-relaxed text-white md:text-2xl">
            {report.campaignIdea.description}
          </p>
        </motion.div>

        {/* Cultural Insight */}
        <motion.div
          ref={culturalInsightRef}
          initial={{ opacity: 0, y: 40 }}
          animate={culturalInsightInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 px-12 py-8"
        >
          <h2 className="mb-6 text-xs font-light uppercase tracking-[0.2em] text-[#b3b3b3]">
            Cultural Insight
          </h2>
          <p className="whitespace-pre-line text-lg font-light leading-relaxed text-white">
            {report.culturalInsight.description}
          </p>
        </motion.div>



        {/* Market Trends / Cultural Signals */}
        <motion.div
          ref={culturalSignalsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={culturalSignalsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-24 px-12 py-8"
        >
          <h2 className="mb-8 text-xs font-light uppercase tracking-[0.2em] text-[#b3b3b3]">
            Market Trends
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {report.culturalInsight.metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={culturalSignalsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded border border-[#333] bg-[#111] p-6 transition-shadow duration-300 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)]"
              >
                <h3 className="mb-2 text-lg font-light text-white">{metric.trend}</h3>
                <p className="mb-4 text-3xl font-light text-white">{metric.metric}</p>
                <p className="text-sm font-light leading-relaxed text-gray-400">
                  {metric.summary}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* BOTTOM CTA */}
      <section className="border-t border-[#333] px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => router.push('/communities')}
              className="group inline-flex items-center space-x-3 text-2xl font-light text-white transition-all duration-300 hover:text-gray-300"
            >
              <span className="border-b border-transparent group-hover:border-white">
                Explore Communities
              </span>
              <motion.svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
