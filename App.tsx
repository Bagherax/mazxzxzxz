import React, { useState, useEffect } from 'react';
import TradingFeed from './features/TradingFeed/TradingFeed';
import AiChat from './features/AiChat/AiChat';
import AdGallery from './features/AdGallery/AdGallery';
import FeedContainer from './features/Feed/FeedContainer';
import FloatingNav from './features/FloatingNav/FloatingNav';
import ChatPopup from './features/Chat/ChatPopup';
import AdDetailsOverlay from './features/AdDetails/AdDetailsOverlay';
import ShareModal from './features/ShareModal/ShareModal';
import UserProfileOverlay from './features/UserProfile/UserProfileOverlay';
import CategoryFolder from './features/CategoryFolder/CategoryFolder';
import AddAdRoom from './features/AddAdRoom/AddAdRoom';
import AddPaidAdRoom from './features/AddPaidAdRoom/AddPaidAdRoom';
import AddSocialBoosterAdRoom from './features/AddSocialBoosterAdRoom/AddSocialBoosterAdRoom';
import { AnimatePresence } from 'framer-motion';
import { Ad, PaidAd, Auction } from './features/Feed/types';

const App: React.FC = () => {
  const [isTradingFeedVisible, setIsTradingFeedVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isCategoryFolderVisible, setIsCategoryFolderVisible] = useState(false);
  const [isAddAdVisible, setIsAddAdVisible] = useState(false);
  const [isAddPaidAdVisible, setIsAddPaidAdVisible] = useState(false);
  const [isAddSocialBoosterAdVisible, setIsAddSocialBoosterAdVisible] = useState(false);
  const [profileUser, setProfileUser] = useState<(Ad | PaidAd | Auction)['user'] | null>(null);
  const [adSize, setAdSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [sortOption, setSortOption] = useState<string>('popular');
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 'light'
  );
  const [selectedAd, setSelectedAd] = useState<Ad | PaidAd | Auction | null>(null);
  const [chatContextAd, setChatContextAd] = useState<Ad | PaidAd | Auction | null>(null);
  const [chatContextUser, setChatContextUser] = useState<Ad['user'] | null>(null);
  const [adToShare, setAdToShare] = useState<Ad | PaidAd | Auction | null>(null);
  const [overlayReturnState, setOverlayReturnState] = useState<'profile' | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleTradingFeed = () => {
    setIsTradingFeedVisible(!isTradingFeedVisible);
  };
  
  const toggleCategoryFolder = () => {
    setIsCategoryFolderVisible(prev => !prev);
  }

  const toggleChat = () => {
    setIsChatVisible(prevState => {
      const isOpening = !prevState;
      if (isOpening) {
        // Prioritize profile context if profile overlay is open
        if (isProfileVisible && profileUser) {
          setChatContextAd(null);
          setChatContextUser(profileUser);
        }
        // Then check for ad context if ad details overlay is open
        else if (selectedAd) {
          setChatContextUser(null);
          setChatContextAd(selectedAd);
        } else {
          // Generic chat, clear both
          setChatContextAd(null);
          setChatContextUser(null);
        }
      } else {
        // If we are closing the chat, clear all contexts
        setChatContextAd(null);
        setChatContextUser(null);
      }
      return !prevState;
    });
  };

  const mainUser = { name: 'John Doe', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' };

  const handleProfileOpen = () => {
    setProfileUser(mainUser);
    setIsProfileVisible(true);
  };

  const handleProfileClose = () => {
    setIsProfileVisible(false);
    // Give time for animation before clearing user
    setTimeout(() => setProfileUser(null), 300);
  };
  
  const handleAdSizeChange = (size: 'small' | 'medium' | 'large') => {
    setAdSize(size);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleShowDetails = (ad: Ad | PaidAd | Auction, from: 'profile' | null = null) => {
    setOverlayReturnState(from);
    setSelectedAd(ad);
  };

  const handleCloseDetails = () => {
    setSelectedAd(null);
    setOverlayReturnState(null);
  };

  const handleOpenShare = (ad: Ad | PaidAd | Auction) => {
    setAdToShare(ad);
  };

  const handleCloseShare = () => {
    setAdToShare(null);
  };

  const handleContactSeller = () => {
    if (selectedAd) {
      // Explicitly set ad context and clear user context
      setChatContextAd(selectedAd);
      setChatContextUser(null);
      setIsChatVisible(true);
    }
  };

  const handleShowSellerProfile = (user: (Ad | PaidAd | Auction)['user']) => {
    // Close ad details first
    handleCloseDetails();
    
    // Then open profile after a short delay to allow ad details to animate out
    setTimeout(() => {
        setProfileUser(user);
        setIsProfileVisible(true);
    }, 200);
  };

  const handleAddAdOpen = () => {
    setIsAddAdVisible(true);
  };

  const handleAddAdClose = () => {
    setIsAddAdVisible(false);
  };

  const handleAddPaidAdOpen = () => {
    setIsAddPaidAdVisible(true);
  };

  const handleAddPaidAdClose = () => {
    setIsAddPaidAdVisible(false);
  };

  const handleAddSocialBoosterAdOpen = () => {
    setIsAddSocialBoosterAdVisible(true);
  };

  const handleAddSocialBoosterAdClose = () => {
    setIsAddSocialBoosterAdVisible(false);
  };


  return (
    <>
      <div className="min-h-screen bg-maz-bg font-sans flex flex-col items-center pb-4 sm:pb-6 md:pb-8 relative">
        {/* Fixed Top Header */}
        <header className="fixed top-0 left-0 right-0 w-full z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex justify-center items-center h-20">
              <AiChat onCategoryClick={toggleCategoryFolder} />
          </div>
        </header>
        
        {/* AdGallery now sits directly under the header */}
        <AdGallery onShowDetails={handleShowDetails} />
        
        <main className="w-full">
          <FeedContainer 
            adSize={adSize} 
            sortOption={sortOption} 
            onShowDetails={handleShowDetails}
            onShare={handleOpenShare}
          />
        </main>

        <footer className="w-full max-w-6xl mt-8 text-center text-xs text-gray-500 px-4 sm:px-6 md:px-8">
          <p>&copy; 2024 MAZDADY. All rights reserved. User data is stored on-device.</p>
        </footer>
      </div>

      {/* FloatingNav now handles the trading feed toggle */}
      <FloatingNav 
        onTradingClick={toggleTradingFeed} 
        onChatClick={toggleChat}
        onAdSizeChange={handleAdSizeChange}
        onThemeToggle={toggleTheme}
        onSortChange={handleSortChange}
        onProfileClick={handleProfileOpen}
        onAddAdClick={handleAddAdOpen}
        onAddPaidAdClick={handleAddPaidAdOpen}
        onAddSocialBoosterAdClick={handleAddSocialBoosterAdOpen}
      />
      
      {/* Trading Feed Overlay */}
      {isTradingFeedVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4 animate-fade-in"
          onClick={toggleTradingFeed}
        >
          <div 
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={toggleTradingFeed}
              className="absolute -top-4 -right-4 bg-maz-surface text-maz-text rounded-full p-2 z-10 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close Trading Feed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <TradingFeed />
          </div>
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      )}

      {/* Chat Popup Overlay */}
      {isChatVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={toggleChat}
        >
          <div 
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatPopup onClose={toggleChat} ad={chatContextAd} user={chatContextUser} />
          </div>
        </div>
      )}

      {/* Ad Details Overlay */}
      <AdDetailsOverlay ad={selectedAd} onClose={handleCloseDetails} onContactSeller={handleContactSeller} onShare={handleOpenShare} onShowProfile={handleShowSellerProfile} />
      
      {/* User Profile Overlay */}
      <UserProfileOverlay 
        isOpen={isProfileVisible} 
        onClose={handleProfileClose} 
        user={profileUser} 
        onShowAdDetails={(ad) => handleShowDetails(ad, 'profile')} 
        isObscured={overlayReturnState === 'profile' && !!selectedAd}
      />

      {/* Share Modal */}
      <ShareModal ad={adToShare} onClose={handleCloseShare} />

      {/* Category Folder Overlay */}
      <AnimatePresence>
        {isCategoryFolderVisible && <CategoryFolder onClose={toggleCategoryFolder} />}
      </AnimatePresence>

      {/* Add Ad Room Overlay */}
      <AnimatePresence>
        {isAddAdVisible && <AddAdRoom onClose={handleAddAdClose} />}
      </AnimatePresence>
      
      {/* Add Paid Ad Room Overlay */}
      <AnimatePresence>
        {isAddPaidAdVisible && <AddPaidAdRoom onClose={handleAddPaidAdClose} />}
      </AnimatePresence>

      {/* Add Social Booster Ad Room Overlay */}
      <AnimatePresence>
        {isAddSocialBoosterAdVisible && <AddSocialBoosterAdRoom onClose={handleAddSocialBoosterAdClose} />}
      </AnimatePresence>
    </>
  );
};

export default App;