'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, MapPin, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { communities, findMatchingCommunities, Community } from '@/data/communities';

interface Brief {
  campaignIdea: string;
  activationExample: string;
  toneAesthetic: string;
}

export default function ResultsPage() {
  const [brandName, setBrandName] = useState('');
  const [vibes, setVibes] = useState('');
  const [brief, setBrief] = useState<Brief | null>(null);
  const [matchingCommunities, setMatchingCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showConnection, setShowConnection] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get data from sessionStorage
    const storedBrandName = sessionStorage.getItem('brandName');
    const storedVibes = sessionStorage.getItem('vibes');
    
    if (!storedBrandName) {
      router.push('/moodboard');
      return;
    }

    setBrandName(storedBrandName);
    setVibes(storedVibes || '');
    
    // Generate brief and find communities
    generateBriefAndCommunities(storedBrandName, storedVibes || '');
  }, [router]);

  const generateBriefAndCommunities = async (brand: string, brandVibes: string) => {
    try {
      // Generate AI brief
      const response = await fetch('/api/brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandName: brand,
          vibes: brandVibes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const briefText = data.brief;
        
        // Parse the brief into sections (simple parsing)
        const sections = briefText.split(/\d+\.\s+/).filter(section => section.trim());
        const parsedBrief: Brief = {
          campaignIdea: sections[0]?.replace(/Campaign Idea[:\-\s]*/i, '').trim() || sections[0] || '',
          activationExample: sections[1]?.replace(/Activation Example[:\-\s]*/i, '').trim() || sections[1] || '',
          toneAesthetic: sections[2]?.replace(/Tone & Aesthetic[:\-\s]*/i, '').trim() || sections[2] || '',
        };
        
        setBrief(parsedBrief);
      } else {
        // Fallback brief if API fails
        setBrief({
          campaignIdea: `A cultural movement that positions ${brand} at the intersection of authentic community engagement and brand storytelling. By tapping into grassroots communities that share ${brand}'s core values, we create meaningful connections that feel organic rather than corporate.`,
          activationExample: `Host a series of intimate gatherings in unexpected venues - think converted warehouses, rooftop gardens, or underground spaces. Each event features local artists, musicians, or thought leaders who embody the community's spirit, with ${brand} products seamlessly integrated into the experience.`,
          toneAesthetic: `Raw, authentic, and culturally intelligent. Visual language that feels like it was created by the community itself - think hand-drawn elements, candid photography, and a color palette that reflects the local environment. Typography that's bold but not corporate, with plenty of white space for breathing room.`
        });
      }

      // Find matching communities
      const matches = findMatchingCommunities(brandVibes, brand);
      setMatchingCommunities(matches);
      
    } catch (error) {
      console.error('Error generating brief:', error);
      // Set fallback brief
      setBrief({
        campaignIdea: `A cultural movement that positions ${brand} at the intersection of authentic community engagement and brand storytelling.`,
        activationExample: `Host intimate gatherings in unexpected venues with local artists and community leaders.`,
        toneAesthetic: `Raw, authentic, and culturally intelligent with bold typography and plenty of white space.`
      });
      setMatchingCommunities(findMatchingCommunities(brandVibes, brand));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollaboration = (community: Community) => {
    setSelectedCommunity(community);
    setShowConnection(true);
    
    // Show success modal after animation
    setTimeout(() => {
      setShowSuccess(true);
    }, 2000);
  };

  const resetConnection = () => {
    setShowConnection(false);
    setShowSuccess(false);
    setSelectedCommunity(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="p-8 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-light tracking-wider hover:text-gray-300 transition-colors">
            CultureMesh
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/moodboard"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Moodboard
            </Link>
            <div className="text-sm text-gray-400">
              Step 3 of 3
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 space-y-16">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-thin mb-4">
            Campaign Brief for <span className="italic">{brandName}</span>
          </h1>
          <p className="text-xl text-gray-300 font-light">
            AI-generated cultural strategy
          </p>
        </motion.div>

        {/* AI Brief */}
        {brief && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-900 rounded-2xl p-8 space-y-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-light">AI-Generated Campaign Brief</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-3">Campaign Idea</h3>
                <p className="text-gray-100 leading-relaxed">{brief.campaignIdea}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-3">Activation Example</h3>
                <p className="text-gray-100 leading-relaxed">{brief.activationExample}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-3">Tone & Aesthetic</h3>
                <p className="text-gray-100 leading-relaxed">{brief.toneAesthetic}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Community Matches */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-light">Matching Communities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingCommunities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{community.logo}</div>
                  <div className="text-sm text-gray-400">
                    {community.memberCount} members
                  </div>
                </div>

                <h3 className="text-xl font-medium mb-2 group-hover:text-white transition-colors">
                  {community.name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  {community.location}
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {community.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {community.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleCollaboration(community)}
                  className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors group-hover:bg-gray-100"
                >
                  Propose Collaboration
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Connection Animation */}
      <AnimatePresence>
        {showConnection && selectedCommunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          >
            <div className="relative">
              {/* Brand Logo */}
              <motion.div
                initial={{ x: -200, y: 0 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-black">
                  {brandName.charAt(0)}
                </div>
              </motion.div>

              {/* Community Logo */}
              <motion.div
                initial={{ x: 200, y: 0 }}
                animate={{ x: 0, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2"
              >
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                  {selectedCommunity.logo}
                </div>
              </motion.div>

              {/* Connection Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-0.5 bg-gradient-to-r from-white to-gray-400"
              />

              {/* Sparkle Effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-md mx-4 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-6xl mb-4"
              >
                <Heart className="w-16 h-16 mx-auto text-red-400" />
              </motion.div>
              
              <h3 className="text-2xl font-light mb-4">Partnership Formed!</h3>
              <p className="text-gray-300 mb-6">
                Your collaboration proposal has been sent to <strong>{selectedCommunity?.name}</strong>. 
                They'll review your campaign brief and get back to you within 48 hours.
              </p>
              
              <button
                onClick={resetConnection}
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Continue Exploring
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
