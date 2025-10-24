'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ContactPage() {
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null);
  const [brandAnswers, setBrandAnswers] = useState<any>(null);
  const [campaignReport, setCampaignReport] = useState<any>(null);
  const [emailText, setEmailText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load selected community
    const saved = sessionStorage.getItem('selected-community');
    if (saved) {
      try {
        const community = JSON.parse(saved);
        setSelectedCommunity(community);
      } catch (e) {
        console.error('Failed to parse selected community:', e);
      }
    }

    // Load brand answers
    const answers = sessionStorage.getItem('place-connect-brand-answers');
    if (answers) {
      try {
        setBrandAnswers(JSON.parse(answers));
      } catch (e) {
        console.error('Failed to parse brand answers:', e);
      }
    }

    // Load campaign report
    const report = sessionStorage.getItem('place-connect-campaign-report');
    if (report) {
      try {
        setCampaignReport(JSON.parse(report));
      } catch (e) {
        console.error('Failed to parse campaign report:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Generate email once all data is loaded
    if (selectedCommunity && brandAnswers && campaignReport && !emailText && !isGenerating) {
      generateEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommunity, brandAnswers, campaignReport]);

  const generateEmail = async () => {
    if (!selectedCommunity || !brandAnswers || !campaignReport) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Find the collaboration for this community
      const collaboration = selectedCommunity.collaborations?.[0];
      
      if (!collaboration) {
        throw new Error('No collaboration details found');
      }

      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brandAnswers.mission?.split(' ').slice(0, 3).join(' ') || 'Our Brand',
          brandTone: brandAnswers.tone || 'professional, friendly',
          campaignTitle: campaignReport.campaignIdea?.title || 'Campaign',
          campaignDescription: campaignReport.campaignIdea?.description || '',
          communityName: selectedCommunity.communityName || selectedCommunity.communityId,
          communityDescription: selectedCommunity.communityDetails?.description || '',
          engagementType: collaboration.engagementType,
          budget: collaboration.budget,
          nonMonetaryOfferings: collaboration.nonMonetaryOfferings,
          collaborationDescription: collaboration.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setEmailText(data.email);
    } catch (err) {
      console.error('Error generating email:', err);
      setError('Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailto = () => {
    const subject = `Partnership Opportunity: ${campaignReport?.campaignIdea?.title || 'Collaboration'}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailText)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-8">
          <Link
            href="/communities"
            className="text-sm font-light text-gray-500 transition-colors hover:text-white"
          >
            ← Back to Communities
          </Link>
        </div>

        <h1 className="mb-4 text-4xl font-light tracking-tight text-white md:text-5xl">
          Reach Out to Community
        </h1>

        {selectedCommunity ? (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-lg font-light text-gray-400">
                Ready to reach out to{' '}
                <span className="text-white">{selectedCommunity.communityName}</span>
              </p>
              <p className="text-sm font-light text-gray-500">
                We've drafted a personalized email based on your brand profile and campaign details.
              </p>
            </div>

            {/* Community Info */}
            {selectedCommunity.communityDetails && (
              <div className="rounded border border-gray-800 bg-white/[0.02] p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-light text-white">
                      {selectedCommunity.communityName}
                    </h3>
                    <p className="text-sm font-light text-gray-400">
                      {selectedCommunity.communityDetails.description}
                    </p>
                  </div>
                  {selectedCommunity.communityDetails.image && (
                    <img
                      src={selectedCommunity.communityDetails.image}
                      alt={selectedCommunity.communityName}
                      className="h-16 w-16 rounded object-cover"
                    />
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs font-light text-gray-500">
                  <span>
                    {selectedCommunity.communityDetails.reach.instagramFollowers.toLocaleString()}{' '}
                    followers
                  </span>
                  <span>•</span>
                  <span>
                    {selectedCommunity.communityDetails.reach.averageAttendance} avg. attendance
                  </span>
                </div>
              </div>
            )}

            {/* Email Editor */}
            <div className="rounded border border-gray-800 bg-white/[0.02] p-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-light uppercase tracking-wider text-gray-500">
                  Outreach Email
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={generateEmail}
                    disabled={isGenerating}
                    className="text-sm font-light text-gray-500 transition-colors hover:text-white disabled:opacity-50"
                  >
                    {isGenerating ? 'Regenerating...' : 'Regenerate'}
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={!emailText}
                    className="text-sm font-light text-gray-500 transition-colors hover:text-white disabled:opacity-50"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {isGenerating ? (
                <div className="space-y-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-800" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-800" />
                  <p className="mt-4 text-center text-xs font-light text-gray-600">
                    Crafting your message...
                  </p>
                </div>
              ) : error ? (
                <div className="rounded border border-red-900/50 bg-red-950/20 p-4">
                  <p className="text-sm font-light text-red-400">{error}</p>
                  <button
                    onClick={generateEmail}
                    className="mt-2 text-sm font-light text-red-300 underline hover:text-red-200"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="min-h-[400px] w-full resize-y rounded border border-gray-700 bg-black/50 p-4 font-light leading-relaxed text-white placeholder-gray-600 focus:border-gray-500 focus:outline-none"
                  placeholder="Your personalized email will appear here..."
                />
              )}
            </div>

            {/* Action Buttons */}
            {emailText && !isGenerating && (
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={handleCopy}
                  className="rounded-full border border-gray-700 bg-transparent px-6 py-3 text-sm font-light tracking-wide text-gray-300 transition-all duration-300 hover:border-white hover:text-white"
                >
                  {copied ? '✓ Copied to Clipboard' : 'Copy to Clipboard'}
                </button>
                <button
                  onClick={handleMailto}
                  className="rounded-full border border-white bg-transparent px-6 py-3 text-sm font-light tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-black"
                >
                  Open in Email Client
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg font-light text-gray-400">
              No community selected. Please return to the communities page.
            </p>
            <Link
              href="/communities"
              className="inline-block text-sm font-light text-white underline"
            >
              Go to Communities
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
