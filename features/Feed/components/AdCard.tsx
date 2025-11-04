import React, { useState } from 'react';
import { Ad } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AdCardProps {
  data: Ad;
  isActive: boolean;
  onClick: () => void;
  onShowDetails: () => void;
  onShare: () => void;
}

const AdSlide: React.FC = () => (
    <div className="w-full h-full bg-gradient-to-br from-sky-500 to-purple-600 flex flex-col items-center justify-center p-4 text-center text-white">
        <h4 className="font-bold text-base">Want to stand out?</h4>
        <p className="text-xs mt-1">Promote your ad to thousands of buyers.</p>
        <button className="mt-3 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">Learn More</button>
    </div>
);

const AdCard: React.FC<AdCardProps> = ({ data, isActive, onClick, onShowDetails, onShare }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // State for the manual image slider
  const imagesWithAd = [...data.imageUrls, 'ad_placeholder'];
  const totalImages = imagesWithAd.length;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0.5,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0.5,
    }),
  };

  const changeImage = (newDirection: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the main card's onClick from firing
    setDirection(newDirection);
    if (newDirection > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };
  
  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if(index === currentImageIndex) return;
    setDirection(index > currentImageIndex ? 1 : -1);
    setCurrentImageIndex(index);
  }

  return (
    <div 
      className={`bg-maz-surface overflow-hidden cursor-pointer ${isActive ? 'ad-card-active' : ''}`}
      onClick={onClick}
    >
      <div className="relative w-full h-32 overflow-hidden ad-card-image-container">
        <AnimatePresence initial={false} custom={direction}>
           {currentImageIndex < data.imageUrls.length ? (
            <motion.img
              key={currentImageIndex}
              src={data.imageUrls[currentImageIndex]}
              alt={`${data.title} ${currentImageIndex + 1}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <motion.div 
              key="ad-slide" 
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute w-full h-full pointer-events-none"
            >
              <AdSlide />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center space-x-2 z-10">
          {totalImages > 1 && (
            <button
              className="bg-sky-500/70 text-white rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm hover:bg-sky-500 transition-colors"
              onClick={(e) => changeImage(-1, e)}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {imagesWithAd.map((_, index) => (
            <div
              key={index}
              onClick={(e) => goToImage(index, e)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentImageIndex === index ? 'bg-white scale-125 shadow-sm' : 'bg-white/50'
              }`}
            ></div>
          ))}
          {totalImages > 1 && (
            <button
              className="bg-sky-500/70 text-white rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm hover:bg-sky-500 transition-colors"
              onClick={(e) => changeImage(1, e)}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>
        <div className="absolute top-2 right-2 flex flex-col space-y-2 z-10">
            {/* Follow Icon */}
            <button
                onClick={(e) => { e.stopPropagation(); setIsFollowed(!isFollowed); }}
                className={`p-1.5 bg-black/25 backdrop-blur-sm rounded-full ${isFollowed ? 'text-sky-400' : 'text-white/80'}`}
                aria-label={isFollowed ? "Unfollow" : "Follow"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill={isFollowed ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </button>
            {/* Favorite Icon */}
            <button
                onClick={(e) => { e.stopPropagation(); setIsFavorited(!isFavorited); }}
                className={`p-1.5 bg-black/25 backdrop-blur-sm rounded-full ${isFavorited ? 'text-sky-400' : 'text-white/80'}`}
                aria-label="Favorite"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            </button>
            {/* Verified Icon */}
            <button
                onClick={(e) => { e.stopPropagation(); setIsVerified(!isVerified); }}
                className={`p-1.5 bg-black/25 backdrop-blur-sm rounded-full ${isVerified ? 'text-sky-400' : 'text-white/80'}`}
                aria-label="Verified"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>
      </div>
      <div 
        className="p-4 h-24 flex flex-col justify-between ad-card-text-container"
      >
        <div>
          <h3 className="font-semibold text-maz-text truncate">{data.title}</h3>
          <p className="text-maz-primary font-bold mt-1">${data.price}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
                <img src={data.user.avatarUrl} alt={data.user.name} className="w-6 h-6 rounded-full mr-2" />
                <span className="text-sm text-maz-text-secondary">{data.user.name}</span>
            </div>
            <div 
                className="text-sm font-semibold text-maz-primary"
                aria-expanded={isActive}
                aria-controls={`ad-details-${data.id}`}
            >
                {isActive ? 'Less' : 'More'}
            </div>
        </div>
      </div>
      
      {/* Expanded Content - shown when active */}
      <div id={`ad-details-${data.id}`} className={`overflow-hidden ${isActive ? 'max-h-96' : 'max-h-0'}`}>
        <div className="p-4 pt-0">
          <hr className="mb-4 border-gray-200 dark:border-gray-700" />
          <p className="text-sm text-maz-text-secondary mb-4 line-clamp-3">{data.description}</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onShowDetails(); }}
              className="flex-1 bg-maz-primary text-white py-2 rounded-md font-semibold"
            >
              View Details
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onShare(); }}
              className="flex-shrink-0 bg-gray-200 dark:bg-gray-600 text-maz-text py-2 px-3 rounded-md font-semibold"
              aria-label="Share"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;