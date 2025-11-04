import React, { useState } from 'react';
import { Auction } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AuctionCardProps {
  data: Auction;
  isActive: boolean;
  onClick: () => void;
  onShowDetails: () => void;
}

const AdSlide: React.FC = () => (
    <div className="w-full h-full bg-gradient-to-br from-sky-500 to-purple-600 flex flex-col items-center justify-center p-4 text-center text-white">
        <h4 className="font-bold text-lg">Want to sell faster?</h4>
        <p className="text-sm mt-1">Boost your auction to reach more bidders.</p>
        <button className="mt-4 bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-full backdrop-blur-sm">Learn More</button>
    </div>
);

const AuctionCard: React.FC<AuctionCardProps> = ({ data, isActive, onClick, onShowDetails }) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
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
    e.stopPropagation(); 
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
      className={`relative cursor-pointer overflow-hidden h-56 auction-card-container ${isActive ? 'auction-card-active' : ''}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
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
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      
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
              aria-label="Follow"
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
      <div className="relative p-4 text-white flex flex-col justify-end h-full">
        <span className="text-xs font-bold uppercase">Auction</span>
        <h3 className="font-semibold text-lg truncate">{data.title}</h3>
      </div>

      {/* Expanded Content - shown when active */}
      <div className={`absolute inset-0 flex items-center justify-center ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="text-center text-white p-4">
            <p className="text-sm">Current Bid</p>
            <p className="text-4xl font-bold">${data.price}</p>
            <p className="text-sm mt-2">Time Left: {data.timeLeft}</p>
            <button
              onClick={(e) => { e.stopPropagation(); onShowDetails(); }}
              className="mt-4 bg-maz-secondary text-white py-2 px-6 font-semibold"
            >
              Place Bid
            </button>
          </div>
      </div>
    </div>
  );
};

export default AuctionCard;
