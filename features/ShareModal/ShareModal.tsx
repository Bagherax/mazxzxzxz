import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ad, PaidAd, Auction } from '../Feed/types';

type AdDetails = Ad | PaidAd | Auction;

interface ShareModalProps {
  ad: AdDetails | null;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ ad, onClose }) => {
  const [copied, setCopied] = useState(false);

  const adUrl = window.location.href; // Using current page URL as a placeholder
  const adTitle = ad?.title || 'Check out this item on MAZDADY';

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(adUrl);
    setCopied(true);
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' } 
    },
    exit: { 
      scale: 0.9, 
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  const socialLinks = [
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(adUrl)}`, icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.14 9.5 5.32v2.14H6.1v3.56h3.4v8.94h4V11.02h4.14l.23-3.56z"></path></svg> },
    { name: 'Twitter', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(adUrl)}&text=${encodeURIComponent(adTitle)}`, icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085a4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg> },
    { name: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(adTitle + ' ' + adUrl)}`, icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6.1-1.6c1.6.9 3.5 1.5 5.3 1.5h.1c6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.1-.1.2-.3.2-.4.1-.1.1-.3 0-.4s-.7-.9-.9-1.2c-.2-.2-.4-.3-.7-.3h-.6c-.2 0-.5.2-.7.5-.2.3-.8 1-.8 2.1s.8 2.4 1 2.5c.2.2 1.7 2.5 4 3.5.5.2.9.3 1.2.5.3.2.6.1.8.1.2-.1.5-.6.7-.8.1-.2.1-.4 0-.5z"></path></svg> },
  ];

  return (
    <AnimatePresence>
      {ad && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-maz-surface text-maz-text w-full max-w-md rounded-lg shadow-xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-maz-text">Share this ad</h3>
                 <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-maz-text rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-700"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
              </div>
              <p className="text-maz-text-secondary mt-1 mb-6 truncate">Share "{ad.title}" via...</p>

              <div className="flex justify-around items-center mb-6">
                {socialLinks.map(link => (
                   <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-maz-text-secondary hover:text-maz-primary transition-colors group">
                     <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2 group-hover:bg-maz-primary/10">
                        {link.icon}
                     </div>
                     <span className="text-xs">{link.name}</span>
                   </a>
                ))}
              </div>

              <div className="relative">
                <input type="text" readOnly value={adUrl} className="w-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg p-3 text-sm pr-24" />
                <button 
                  onClick={handleCopy}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-maz-primary text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
