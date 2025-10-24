'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import communitiesData from '@/lib/communities.json';

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

interface CommunityDetails {
  id: string;
  name: string;
  image: string;
  instagram: string;
  description: string;
  eventTypes: string[];
  reach: {
    instagramFollowers: number;
    averageAttendance: number;
    partnerBrands: string[];
    activeWhatsappMembers: number;
  };
}

interface EnrichedCollaboration extends CommunityCollaboration {
  communityDetails?: CommunityDetails;
}

export default function CommunitiesPage() {
  const router = useRouter();
  const [collaborations, setCollaborations] = useState<EnrichedCollaboration[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = useState<EnrichedCollaboration | null>(null);

  useEffect(() => {
    // Load campaign report from sessionStorage
    const savedReport = sessionStorage.getItem('place-connect-campaign-report');
    if (savedReport) {
      try {
        const report = JSON.parse(savedReport);
        
        // Enrich collaborations with community details from communities.json
        const enriched: EnrichedCollaboration[] = report.potentialCollaborations.map(
          (collab: CommunityCollaboration) => {
            const communityDetails = communitiesData.communities.find(
              (c) => c.id === collab.communityId
            );
            return {
              ...collab,
              communityName: communityDetails?.name || collab.communityName,
              communityDetails,
            };
          }
        );
        
        setCollaborations(enriched);
      } catch (e) {
        console.error('Failed to load campaign report:', e);
      }
    }
  }, []);

  const handleCardClick = (collaboration: EnrichedCollaboration) => {
    setSelectedCollaboration(collaboration);
    setModalOpen(true);
  };

  const handleSelectCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setModalOpen(false);
  };

  const handleNext = () => {
    if (!selectedCommunityId) return;
    
    const selectedCollab = collaborations.find(c => c.communityId === selectedCommunityId);
    
    // Store selected community for contact page
    if (selectedCollab) {
      sessionStorage.setItem('selected-community', JSON.stringify(selectedCollab));
    }
    
    router.push('/contact');
  };

  if (collaborations.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-lg font-light text-gray-400">No collaborations found.</p>
          <Link
            href="/brand"
            className="mt-4 inline-block text-sm font-light text-white underline"
          >
            Return to Brand Discovery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-16 max-w-6xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/brand?view=summary"
            className="text-sm font-light text-gray-500 transition-colors hover:text-white"
          >
            ← Back to Campaign
          </Link>
        </div>

        <h1 className="mb-4 text-4xl font-light tracking-tight text-white md:text-5xl">
          Community Collaborations
        </h1>
        <p className="mb-6 text-lg font-light leading-relaxed text-[#BDBDBD]">
          These are communities vetted by Place and cultural trend analysts — ready to bring your
          campaign to life.
        </p>

        {/* Vetted Badge */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-green-900/50 bg-green-950/20 px-4 py-2">
          <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-light text-green-400">
            Vetted by Place & Cultural Analysts
          </span>
        </div>
      </motion.header>

      {/* Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto max-w-6xl"
      >
        <div className="relative">
          {/* Horizontal scroll container */}
          <div className="no-scrollbar flex gap-6 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory">
            {collaborations.map((collaboration, idx) => (
              <motion.div
                key={collaboration.communityId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleCardClick(collaboration)}
                className={`group relative min-w-[320px] cursor-pointer snap-start overflow-hidden rounded border bg-gradient-to-b from-white/[0.03] to-transparent shadow-xl transition-all duration-300 ${
                  selectedCommunityId === collaboration.communityId
                    ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    : 'border-gray-800 hover:border-gray-600'
                }`}
              >
                {/* Selected indicator */}
                {selectedCommunityId === collaboration.communityId && (
                  <div className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Community Image */}
                {collaboration.communityDetails?.image && (
                  <div className="relative mb-6 h-48 w-full overflow-hidden">
                    <img
                      src={collaboration.communityDetails.image}
                      alt={collaboration.communityName || collaboration.communityId}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-8">
                  {/* Community Name */}
                  <h3 className="mb-3 text-xl font-light text-white">
                    {collaboration.communityName || collaboration.communityId}
                  </h3>

                  {/* Engagement Type Pills */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {collaboration.collaborations.map((collab, collabIdx) => (
                      <span
                        key={collabIdx}
                        className="rounded-full border border-gray-700 bg-white/5 px-3 py-1 text-xs font-light text-gray-300"
                      >
                        {collab.engagementType}
                      </span>
                    ))}
                  </div>

                  {/* Community Description */}
                  {collaboration.communityDetails && (
                    <p className="mb-4 line-clamp-3 text-sm font-light leading-relaxed text-gray-400">
                      {collaboration.communityDetails.description}
                    </p>
                  )}

                  {/* Reach Stats */}
                  {collaboration.communityDetails && (
                    <div className="mt-auto space-y-2 border-t border-gray-800 pt-4">
                      <div className="flex items-center justify-between text-xs font-light">
                        <span className="text-gray-500">Instagram</span>
                        <span className="text-gray-300">
                          {collaboration.communityDetails.reach.instagramFollowers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-light">
                        <span className="text-gray-500">Avg. Attendance</span>
                        <span className="text-gray-300">
                          {collaboration.communityDetails.reach.averageAttendance}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Click indicator */}
                  <div className="mt-6 flex items-center justify-between text-xs font-light text-gray-600">
                    <span>Click to view details</span>
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && selectedCollaboration && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded border border-gray-800 bg-black shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setModalOpen(false)}
                className="sticky right-4 top-4 z-10 ml-auto mr-4 mt-4 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-black/80 text-gray-400 backdrop-blur-sm transition-colors hover:border-white hover:text-white"
              >
                ×
              </button>

              {/* Community Image */}
              {selectedCollaboration.communityDetails?.image && (
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={selectedCollaboration.communityDetails.image}
                    alt={selectedCollaboration.communityName || selectedCollaboration.communityId}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
                </div>
              )}

              <div className="p-8">
                {/* Community Header */}
                <div className="mb-6">
                  <h2 className="mb-2 text-2xl font-light text-white">
                    {selectedCollaboration.communityName || selectedCollaboration.communityId}
                  </h2>
                  {selectedCollaboration.communityDetails && (
                    <p className="text-sm font-light leading-relaxed text-gray-400">
                      {selectedCollaboration.communityDetails.description}
                    </p>
                  )}
                </div>

              {/* Collaborations */}
              <div className="mb-6 space-y-6">
                {selectedCollaboration.collaborations.map((collab, idx) => (
                  <div key={idx} className="border-l-2 border-gray-700 pl-6">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-light text-white">{collab.engagementType}</h3>
                      <span className="text-sm font-light text-gray-400">
                        £{collab.budget.toLocaleString()}
                      </span>
                    </div>

                    <p className="mb-4 text-sm font-light leading-relaxed text-gray-300">
                      {collab.description}
                    </p>

                    {/* Non-monetary offerings */}
                    {collab.nonMonetaryOfferings.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-light uppercase tracking-wider text-gray-500">
                          Included
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {collab.nonMonetaryOfferings.map((offering, offerIdx) => (
                            <span
                              key={offerIdx}
                              className="rounded border border-gray-700 bg-white/5 px-3 py-1 text-xs font-light text-gray-400"
                            >
                              {offering}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Community Stats */}
              {selectedCollaboration.communityDetails && (
                <div className="mb-6 grid grid-cols-2 gap-4 rounded border border-gray-800 bg-white/[0.02] p-4">
                  <div>
                    <p className="mb-1 text-xs font-light uppercase tracking-wider text-gray-500">
                      Instagram Followers
                    </p>
                    <p className="text-lg font-light text-white">
                      {selectedCollaboration.communityDetails.reach.instagramFollowers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-light uppercase tracking-wider text-gray-500">
                      Avg. Attendance
                    </p>
                    <p className="text-lg font-light text-white">
                      {selectedCollaboration.communityDetails.reach.averageAttendance}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-light uppercase tracking-wider text-gray-500">
                      WhatsApp Members
                    </p>
                    <p className="text-lg font-light text-white">
                      {selectedCollaboration.communityDetails.reach.activeWhatsappMembers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-light uppercase tracking-wider text-gray-500">
                      Event Types
                    </p>
                    <p className="text-sm font-light text-gray-300">
                      {selectedCollaboration.communityDetails.eventTypes.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Instagram Link */}
              {selectedCollaboration.communityDetails?.instagram && (
                <div className="mb-6">
                  <a
                    href={selectedCollaboration.communityDetails.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm font-light text-gray-400 transition-colors hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>View on Instagram</span>
                  </a>
                </div>
              )}

                {/* Select Button */}
                <button
                  onClick={() => handleSelectCommunity(selectedCollaboration.communityId)}
                  className="w-full rounded-full border border-white bg-transparent px-8 py-3 text-base font-light tracking-wide text-white transition-all duration-300 hover:bg-white hover:text-black"
                >
                  Select this community
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fixed Next Button */}
      <AnimatePresence>
        {selectedCommunityId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-30"
          >
            <button
              onClick={handleNext}
              className="group flex items-center space-x-2 rounded-full border border-white bg-black px-8 py-4 text-base font-light tracking-wide text-white shadow-2xl transition-all duration-300 hover:bg-white hover:text-black"
            >
              <span>Next</span>
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

