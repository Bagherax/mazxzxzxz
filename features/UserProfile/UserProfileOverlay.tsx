import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ad } from '../Feed/types';

interface UserProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  user?: Ad['user'] | null;
  onShowAdDetails: (ad: Ad) => void;
  isObscured?: boolean;
}

const UserProfileOverlay: React.FC<UserProfileOverlayProps> = ({ isOpen, onClose, user, onShowAdDetails, isObscured = false }) => {
  const [activeTab, setActiveTab] = useState('ads');
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [isFollowed, setIsFollowed] = useState(false);

  const displayUser = user || { name: 'John Doe', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' };

  useEffect(() => {
    if (isOpen) {
      const fetchUserAds = async () => {
        try {
          const res = await fetch('/features/Feed/data/masonryAds.json');
          const allAds: Ad[] = await res.json();
          // Simulate fetching ads for this specific user
          setUserAds(allAds.slice(0, 8)); 
        } catch (error) {
          console.error("Failed to fetch user ads:", error);
        }
      };
      fetchUserAds();
      // Reset to the first tab when a new profile is opened
      setActiveTab('ads');
      setIsFollowed(false);
    }
  }, [isOpen]);

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const panelVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } 
    },
    exit: { 
      y: "100%", 
      opacity: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const StatItem = ({ value, label }: { value: string, label: string }) => (
    <div className="text-center">
      <p className="text-xl font-bold text-maz-text">{value}</p>
      <p className="text-xs text-maz-text-secondary">{label}</p>
    </div>
  );

  const TabButton = ({ id, label }: { id: string, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === id
          ? 'bg-maz-primary text-white'
          : 'text-maz-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex flex-col justify-end ${isObscured ? 'pointer-events-none' : ''}`}
          variants={backdropVariants}
          initial="hidden"
          animate={isObscured ? "hidden" : "visible"}
          exit="hidden"
          onClick={isObscured ? undefined : onClose}
        >
          <motion.div
            className="bg-maz-surface text-maz-text w-full max-w-5xl mx-auto rounded-t-2xl shadow-2xl relative"
            style={{ height: 'calc(100vh - 80px)' }}
            variants={panelVariants}
            initial="hidden"
            animate={isObscured ? "exit" : "visible"}
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="bg-maz-surface/80 text-maz-text rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="h-full overflow-y-auto">
              {/* Profile Header */}
              <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src={displayUser.avatarUrl}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full ring-4 ring-maz-primary/50"
                  />
                  <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-maz-text">{displayUser.name}</h2>
                    <p className="text-maz-text-secondary mt-1">Member since 2023</p>
                    <p className="text-sm text-maz-text mt-2 max-w-md">
                      Collector of vintage cameras and rare books. Always open to trades for interesting finds.
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-4 sm:gap-6">
                    <StatItem value="42" label="Listings" />
                    <StatItem value="128" label="Following" />
                    <StatItem value="95" label="Followers" />
                     <button
                        onClick={() => setIsFollowed(!isFollowed)}
                        className={`ml-2 px-6 py-2 font-semibold rounded-lg transition-colors text-sm ${
                        isFollowed
                            ? 'bg-gray-200 dark:bg-gray-700 text-maz-text-secondary'
                            : 'bg-maz-primary text-white hover:opacity-90'
                        }`}
                    >
                        {isFollowed ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 md:px-8 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <TabButton id="ads" label="My Ads" />
                <TabButton id="favorites" label="Favorites" />
                <TabButton id="reviews" label="Reviews" />
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                {activeTab === 'ads' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {userAds.map(ad => (
                      <div key={ad.id} className="group cursor-pointer" onClick={() => onShowAdDetails(ad)}>
                        <div className="aspect-square w-full overflow-hidden rounded-lg shadow-sm bg-gray-200 dark:bg-gray-800">
                           <img
                            src={ad.imageUrls[0]}
                            alt={ad.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                           />
                        </div>
                        <p className="text-sm font-semibold mt-2 truncate group-hover:text-maz-primary transition-colors">{ad.title}</p>
                        <p className="text-sm font-bold text-maz-primary">${ad.price}</p>
                      </div>
                    ))}
                  </div>
                )}
                 {activeTab !== 'ads' && (
                    <div className="text-center py-16 text-maz-text-secondary">
                      <p>This section is under construction.</p>
                    </div>
                 )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileOverlay;