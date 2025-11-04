import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ad, PaidAd, Auction } from '../Feed/types';

type AdDetails = Ad | PaidAd | Auction;

interface AdDetailsOverlayProps {
  ad: AdDetails | null;
  onClose: () => void;
  onContactSeller: () => void;
  onShare: (ad: AdDetails) => void;
  onShowProfile: (user: Ad['user']) => void;
}

const mockComments = [
  {
    id: 1,
    user: { name: 'Jane Doe', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
    rating: 5,
    text: 'Absolutely fantastic product! Exactly as described and the seller was very helpful. Highly recommend.',
  },
  {
    id: 2,
    user: { name: 'Mike P.', avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg' },
    rating: 4,
    text: 'Great item, good value for the price. Shipping was a bit slow, but overall a positive experience.',
  },
];

const AdSlideLarge: React.FC = () => (
    <div className="w-full h-full bg-gradient-to-br from-sky-500 to-purple-600 flex flex-col items-center justify-center p-8 text-center text-white rounded-lg">
        <h4 className="font-bold text-3xl">Want to stand out?</h4>
        <p className="text-lg mt-2">Promote your ad to thousands of buyers.</p>
        <button className="mt-6 bg-white/20 text-white text-lg font-bold px-6 py-3 rounded-full backdrop-blur-sm">Learn More</button>
    </div>
);

const AdSpace: React.FC = () => (
    <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <p className="font-bold text-maz-secondary text-sm uppercase">Sponsored</p>
        <p className="text-maz-text-secondary text-sm">Find similar items or boost your own ad with MAZ-AI! 🚀</p>
    </div>
);


const AdDetailsOverlay: React.FC<AdDetailsOverlayProps> = ({ ad, onClose, onContactSeller, onShare, onShowProfile }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [dragConstraints, setDragConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const [isFollowed, setIsFollowed] = useState(false);

  const imageUrls = ad?.imageUrls || [];
  const imagesWithAd = [...imageUrls, 'ad_placeholder'];

  useEffect(() => {
    // Reset state whenever a new ad is selected
    if (ad) {
      setSelectedImageIndex(0);
      setDirection(0);
      setComments(mockComments);
      setNewComment('');
      setRating(0);
      setHoverRating(0);
      setIsFullscreen(false);
      setZoomLevel(1);
      setControlsVisible(true);
      setIsFollowed(false);
    }
  }, [ad]);

  useEffect(() => {
    if (isFullscreen && imageRef.current) {
        const image = imageRef.current;
        const updateConstraints = () => {
            if (zoomLevel > 1) {
                const container = image.parentElement!;
                const scale = zoomLevel;

                const imageWidth = image.offsetWidth;
                const imageHeight = image.offsetHeight;
                const containerWidth = container.offsetWidth;
                const containerHeight = container.offsetHeight;
                
                const surplusX = imageWidth * scale - containerWidth;
                const surplusY = imageHeight * scale - containerHeight;

                setDragConstraints({
                    left: surplusX > 0 ? -surplusX / 2 : 0,
                    right: surplusX > 0 ? surplusX / 2 : 0,
                    top: surplusY > 0 ? -surplusY / 2 : 0,
                    bottom: surplusY > 0 ? -surplusY / 2 : 0,
                });
            } else {
                setDragConstraints({ top: 0, left: 0, right: 0, bottom: 0 });
            }
        };

        if (image.complete) {
            updateConstraints();
        } else {
            image.onload = updateConstraints;
        }
        window.addEventListener('resize', updateConstraints);
        return () => window.removeEventListener('resize', updateConstraints);
    }
  }, [isFullscreen, zoomLevel, selectedImageIndex]);


  const handleShare = async () => {
    if (!ad) return;

    const shareData = {
      title: ad.title,
      text: ad.description,
      url: window.location.href, // Using current page URL as placeholder
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      onShare(ad);
    }
  };

  const handleSaveImage = async () => {
    if (!ad || selectedImageIndex >= ad.imageUrls.length) return;
    const imageUrl = ad.imageUrls[selectedImageIndex];
    const fileName = `${ad.title.replace(/\s/g, '_')}_${selectedImageIndex + 1}.jpg`;

    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Network response was not ok.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading image:', error);
        // Fallback for potential CORS issues: open in a new tab and try to trigger download
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = imageUrl;
        a.target = '_blank';
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '' || rating === 0) {
        alert('Please provide a rating and a comment.');
        return;
    }
    const newCommentObj = {
        id: Date.now(),
        user: { name: 'You', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
        rating: rating,
        text: newComment,
    };
    setComments([newCommentObj, ...comments]);
    setNewComment('');
    setRating(0);
  };

  const Star: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.539 1.118l-3.368-2.446a1 1 0 00-1.175 0l-3.368 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.24 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
    </svg>
  );

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
  
  // Image Slider Logic
  const sliderVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ad) return;
    setZoomLevel(1);
    setDirection(newDirection);
    setSelectedImageIndex(prevIndex => (prevIndex + newDirection + imagesWithAd.length) % imagesWithAd.length);
  };
  
  const goToImage = (newIndex: number) => {
    if (newIndex === selectedImageIndex) return;
    setZoomLevel(1);
    setDirection(newIndex > selectedImageIndex ? 1 : -1);
    setSelectedImageIndex(newIndex);
  }

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  return (
    <AnimatePresence>
      {ad && (
        <>
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex flex-col justify-end"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-maz-surface text-maz-text w-full max-w-4xl mx-auto rounded-t-2xl shadow-2xl relative"
            style={{ height: 'calc(100vh - 80px)' }} // 80px for the top header
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={onClose}
                className="bg-maz-surface/80 text-maz-text rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="h-full overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="relative">
                        <div
                          className="w-full aspect-square relative overflow-hidden rounded-lg shadow-md mb-4 group"
                        >
                           <AnimatePresence initial={false} custom={direction}>
                                {selectedImageIndex < imageUrls.length ? (
                                    <motion.img
                                        key={selectedImageIndex}
                                        src={imageUrls[selectedImageIndex]}
                                        alt={`${ad.title} ${selectedImageIndex + 1}`}
                                        custom={direction}
                                        variants={sliderVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="absolute w-full h-full object-cover cursor-pointer"
                                        onClick={() => { setIsFullscreen(true); setControlsVisible(true); }}
                                    />
                                ) : (
                                    <motion.div
                                        key="ad-slide-main"
                                        custom={direction}
                                        variants={sliderVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="absolute w-full h-full"
                                    >
                                        <AdSlideLarge />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white opacity-0 group-hover:opacity-75 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-3">
                                {imagesWithAd.length > 1 && (
                                    <button
                                        className="bg-sky-500/70 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm hover:bg-sky-500 transition-colors"
                                        onClick={(e) => paginate(-1, e)}
                                        aria-label="Previous image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                )}
                                {imagesWithAd.map((_, index) => (
                                    <div
                                        key={index}
                                        onClick={(e) => { e.stopPropagation(); goToImage(index); }}
                                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${selectedImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                                    />
                                ))}
                                {imagesWithAd.length > 1 && (
                                    <button
                                        className="bg-sky-500/70 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm hover:bg-sky-500 transition-colors"
                                        onClick={(e) => paginate(1, e)}
                                        aria-label="Next image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-2 overflow-x-auto pb-2">
                           {imagesWithAd.map((url, index) => (
                                index < imageUrls.length ? (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200 flex-shrink-0 ${selectedImageIndex === index ? 'ring-2 ring-sky-400' : 'opacity-60 hover:opacity-100'}`}
                                        onClick={() => goToImage(index)}
                                    />
                                ) : (
                                    <div
                                        key={index}
                                        onClick={() => goToImage(index)}
                                        className={`w-20 h-20 bg-gradient-to-br from-sky-400 to-purple-500 rounded-md cursor-pointer transition-all duration-200 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold text-center p-1 ${selectedImageIndex === index ? 'ring-2 ring-sky-400' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        Promote Your Ad
                                    </div>
                                )
                           ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h2 className="text-2xl md:text-3xl font-bold text-maz-text">{ad.title}</h2>
                          <button
                            onClick={handleShare}
                            className="flex-shrink-0 flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-maz-text px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Share Ad"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                            <span className="hidden sm:inline">Share</span>
                          </button>
                        </div>
                        <span className="text-sm text-maz-text-secondary mb-4">{ad.category} &middot; {ad.location}</span>
                        
                        <p className="text-3xl font-extrabold text-maz-primary mb-6">${ad.price}</p>
                        
                        <AdSpace />

                        <div className="mb-6">
                             <h3 className="font-semibold text-maz-text mb-2 border-b pb-2">Description</h3>
                             <p className="text-maz-text-secondary leading-relaxed">{ad.description}</p>
                        </div>
                        
                        {/* Ratings & Comments Section */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-maz-text mb-3 border-b pb-2">Ratings & Comments</h3>
                            <form onSubmit={handleCommentSubmit} className="mb-4">
                                <div className="flex items-center mb-2">
                                    <span className="text-sm font-medium mr-3">Your Rating:</span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div
                                                key={star}
                                                className="cursor-pointer"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            >
                                                <Star filled={(hoverRating || rating) >= star} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-maz-bg text-maz-text focus:ring-2 focus:ring-sky-400 focus:outline-none"
                                    rows={2}
                                ></textarea>
                                <button type="submit" className="mt-2 px-4 py-2 bg-maz-primary text-white text-sm font-semibold rounded-md hover:opacity-90">Submit Review</button>
                            </form>

                            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                                {comments.map(comment => (
                                    <div key={comment.id} className="flex items-start gap-3">
                                        <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-maz-text text-sm">{comment.user.name}</p>
                                            <div className="flex items-center my-1">
                                                {[1, 2, 3, 4, 5].map(star => <Star key={star} filled={comment.rating >= star} />)}
                                            </div>
                                            <p className="text-maz-text-secondary text-sm">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                       
                        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                             <h3 className="font-semibold text-maz-text mb-3">Seller Information</h3>
                              <div className="flex items-center justify-between">
                                <button onClick={() => onShowProfile(ad.user)} className="flex items-center group text-left gap-4 rounded-lg">
                                    <img src={ad.user.avatarUrl} alt={ad.user.name} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-maz-text group-hover:text-maz-primary transition-colors">{ad.user.name}</p>
                                        <p className="text-sm text-maz-text-secondary">View Profile</p>
                                    </div>
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsFollowed(!isFollowed); }}
                                        aria-label={isFollowed ? "Unfollow Seller" : "Follow Seller"}
                                        className={`p-3 rounded-full transition-colors ${isFollowed ? 'bg-sky-100 dark:bg-sky-900/50 text-sky-500' : 'bg-gray-200 dark:bg-gray-700 text-maz-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={isFollowed ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </button>
                                    <button onClick={onContactSeller} className="text-sm font-semibold text-maz-primary bg-maz-primary/10 px-4 py-2 rounded-lg hover:bg-maz-primary/20 transition-colors">Contact Seller</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Fullscreen Viewer */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsFullscreen(false)}
            >
              {/* Image with Navigation */}
              <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <AnimatePresence initial={false} custom={direction}>
                    {selectedImageIndex < imageUrls.length ? (
                        <motion.div
                          key={selectedImageIndex}
                          custom={direction}
                          variants={sliderVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                              x: { type: "spring", stiffness: 300, damping: 30 },
                              opacity: { duration: 0.2 },
                          }}
                          className="absolute w-full h-full flex items-center justify-center"
                          onDragStart={(e) => e.stopPropagation()}
                        >
                          <motion.img
                              ref={imageRef}
                              src={imageUrls[selectedImageIndex]}
                              alt={`${ad.title} fullscreen ${selectedImageIndex + 1}`}
                              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                              onTap={(e) => {
                                  e.stopPropagation();
                                  setControlsVisible(prev => !prev);
                              }}
                              animate={{ scale: zoomLevel }}
                              transition={{ duration: 0.3 }}
                              drag={zoomLevel > 1}
                              dragConstraints={dragConstraints}
                              dragElastic={0.1}
                              style={{
                                  cursor: zoomLevel > 1 ? 'grab' : 'pointer',
                              }}
                              whileDrag={{ cursor: 'grabbing' }}
                          />
                        </motion.div>
                    ) : (
                         <motion.div
                          key="ad-slide-fullscreen"
                          custom={direction}
                          variants={sliderVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                              x: { type: "spring", stiffness: 300, damping: 30 },
                              opacity: { duration: 0.2 },
                          }}
                          className="absolute w-4/5 h-4/5 flex items-center justify-center"
                        >
                            <AdSlideLarge />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <AnimatePresence>
                    {controlsVisible && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                                className="absolute top-4 right-4 z-[110] bg-sky-400 text-white rounded-full p-2 hover:bg-sky-500 transition-colors pointer-events-auto"
                                aria-label="Close fullscreen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>

                            {/* Save Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleSaveImage(); }}
                                className="absolute top-4 left-4 z-[110] bg-sky-400 text-white rounded-full py-2 px-4 flex items-center gap-2 hover:bg-sky-500 transition-colors text-sm font-semibold pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Save image"
                                disabled={selectedImageIndex >= imageUrls.length}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Save
                            </button>
                            
                            {/* Zoom Buttons */}
                            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-[110] flex flex-col items-center space-y-2 pointer-events-auto">
                                <button
                                  onClick={handleZoomIn}
                                  className="bg-sky-400/80 text-white rounded-full p-3 hover:bg-sky-500 transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Zoom in"
                                  disabled={zoomLevel >= 4 || selectedImageIndex >= imageUrls.length}
                                >
                                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>
                                </button>
                                <button
                                  onClick={handleZoomOut}
                                  className="bg-sky-400/80 text-white rounded-full p-3 hover:bg-sky-500 transition-colors backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Zoom out"
                                  disabled={zoomLevel <= 1 || selectedImageIndex >= imageUrls.length}
                                >
                                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" /></svg>
                                </button>
                            </div>

                            {/* Nav Buttons */}
                            {imagesWithAd.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[110] flex items-center space-x-4 pointer-events-auto">
                                    <button
                                        onClick={(e) => paginate(-1, e)}
                                        className="bg-sky-400/80 text-white rounded-full p-3 hover:bg-sky-500 transition-colors backdrop-blur-sm"
                                        aria-label="Previous image"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                     {imagesWithAd.map((_, index) => (
                                        <div
                                            key={index}
                                            onClick={(e) => { e.stopPropagation(); goToImage(index); }}
                                            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${selectedImageIndex === index ? 'bg-white scale-125' : 'bg-white/60'}`}
                                        />
                                    ))}
                                    <button
                                        onClick={(e) => paginate(1, e)}
                                        className="bg-sky-400/80 text-white rounded-full p-3 hover:bg-sky-500 transition-colors backdrop-blur-sm"
                                        aria-label="Next image"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdDetailsOverlay;