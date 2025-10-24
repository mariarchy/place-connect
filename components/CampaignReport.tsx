'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { MoodboardGrid, type MoodboardImage } from './MoodboardGrid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

interface CampaignReportData {
  brandEssence: string;
  culturalInsight: string;
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

export function CampaignReport({
  report,
  keywords,
  onRegenerate,
  isRegenerating = false,
}: CampaignReportProps) {
  const [moodboardImages, setMoodboardImages] = useState<MoodboardImage[]>([]);
  const [isLoadingMoodboard, setIsLoadingMoodboard] = useState(false);
  const [moodboardSeed, setMoodboardSeed] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Fetch moodboard on mount
  useEffect(() => {
    fetchMoodboard();
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
    <div ref={reportRef}>
      {/* Header with Actions */}
      <div className="mb-8 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h2 className="text-2xl font-light tracking-tight text-white" style={{ fontFamily: 'var(--font-druk-wide)' }}>Campaign Strategy Report</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="rounded-full border border-gray-700 bg-transparent px-6 py-2 text-sm font-light tracking-wide text-gray-400 transition-all duration-300 hover:border-white hover:text-white disabled:opacity-50"
          >
            {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="rounded-full border border-white bg-transparent px-6 py-2 text-sm font-light tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Export Deck (PDF)'}
          </button>
        </div>
      </div>

      {/* Two-Column Layout: Report (left) + Moodboard (right) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left Column: Strategy Report (3/5) */}
        <div className="lg:col-span-3">
          <div className="space-y-8 border border-gray-800 bg-white/[0.03] p-8 shadow-2xl lg:p-12">
            {/* Campaign Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-serif text-4xl font-normal leading-tight text-white md:text-5xl">
                {report.campaignIdea.title}
              </h3>
              <p className="mt-4 text-lg font-light leading-relaxed text-gray-300">
                {report.campaignIdea.description}
              </p>
            </motion.div>

            <div className="border-t border-gray-800" />

            {/* Brand Essence Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="mb-3 text-xs font-light uppercase tracking-widest text-gray-500">
                Brand Essence
              </h4>
              <p className="text-base font-light leading-relaxed text-gray-200">
                {report.brandEssence}
              </p>
            </motion.section>

            {/* Cultural Insight Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="mb-3 text-xs font-light uppercase tracking-widest text-gray-500">
                Cultural Insight
              </h4>
              <p className="whitespace-pre-line text-base font-light leading-relaxed text-gray-200">
                {report.culturalInsight}
              </p>
            </motion.section>

            {/* Potential Collaborations Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="mb-4 text-xs font-light uppercase tracking-widest text-gray-500">
                Potential Collaborations
              </h4>
              <div className="space-y-6">
                {report.potentialCollaborations.map((communityCollab, idx) => (
                  <div key={idx} className="border-l-2 border-gray-700 pl-6">
                    <h5 className="mb-3 text-lg font-light text-white">
                      {communityCollab.communityName || communityCollab.communityId}
                    </h5>
                    <div className="space-y-4">
                      {communityCollab.collaborations.map((collab, collabIdx) => (
                        <div
                          key={collabIdx}
                          className="rounded border border-gray-800 bg-white/[0.02] p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-light text-white">{collab.engagementType}</span>
                            <span className="text-sm font-light text-gray-400">
                              £{collab.budget.toLocaleString()}
                            </span>
                          </div>
                          <p className="mb-3 text-sm font-light leading-relaxed text-gray-300">
                            {collab.description}
                          </p>
                          {collab.nonMonetaryOfferings.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {collab.nonMonetaryOfferings.map((offering, offerIdx) => (
                                <span
                                  key={offerIdx}
                                  className="border border-gray-700 bg-transparent px-2 py-1 text-xs font-light text-gray-400"
                                >
                                  {offering}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Next Steps Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="mb-4 text-xs font-light uppercase tracking-widest text-gray-500">
                Next Steps
              </h4>
              <ul className="space-y-3">
                {report.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white" />
                    <span className="flex-1 text-base font-light text-gray-200">{step}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          {/* Footer note */}
          <p className="mt-4 text-xs font-light text-gray-700">
            Generated by AI · Review and customize before presenting to stakeholders
          </p>
        </div>

        {/* Right Column: Moodboard (2/5) */}
        <div className="lg:col-span-2">
          <div className="sticky top-8">
            {isLoadingMoodboard && moodboardImages.length === 0 ? (
              <div className="flex h-64 items-center justify-center border border-gray-800 bg-white/[0.02]">
                <div className="text-center">
                  <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-white mx-auto" />
                  <p className="text-sm font-light text-gray-500">Loading moodboard...</p>
                </div>
              </div>
            ) : (
              <MoodboardGrid
                images={moodboardImages}
                onRegenerate={handleRegenerateMoodboard}
                isRegenerating={isLoadingMoodboard}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
