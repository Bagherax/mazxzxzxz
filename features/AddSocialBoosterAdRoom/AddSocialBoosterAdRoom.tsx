import React from 'react';
import { motion } from 'framer-motion';

interface AddSocialBoosterAdRoomProps {
  onClose: () => void;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition" />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition" />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select {...props} className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition appearance-none" />
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
);

const ServiceRadio = ({ label, icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon: string; }) => (
    <label className="flex flex-col items-center justify-center space-y-2 cursor-pointer p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 dark:has-[:checked]:bg-sky-900/50 transition-all text-center">
      <input type="radio" {...props} className="sr-only" />
      <span className="text-3xl">{icon}</span>
      <span className="text-maz-text text-sm font-medium">{label}</span>
    </label>
);

const AddSocialBoosterAdRoom: React.FC<AddSocialBoosterAdRoomProps> = ({ onClose }) => {
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

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-60 z-[10000] flex flex-col justify-end"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-maz-surface text-maz-text w-full max-w-4xl mx-auto rounded-t-2xl shadow-2xl flex flex-col"
        style={{ height: 'calc(100vh - 80px)' }}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-maz-surface z-10">
          <h2 className="text-xl font-bold text-maz-text flex items-center gap-2">
            <span className="text-sky-500">🚀</span>
            Add Social Media Booster
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-maz-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-grow overflow-y-auto p-6 space-y-8">
          {/* Service Selection */}
          <section>
            <h3 className="font-semibold mb-3 text-lg">Choose Service</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                <ServiceRadio name="service" label="Likes" icon="❤️" defaultChecked />
                <ServiceRadio name="service" label="Comments" icon="💬" />
                <ServiceRadio name="service" label="Views" icon="👁️" />
                <ServiceRadio name="service" label="Video Views" icon="🎥" />
                <ServiceRadio name="service" label="Followers" icon="👤" />
            </div>
          </section>

          {/* Booster Details */}
          <section>
            <h3 className="font-semibold mb-3 text-lg">Booster Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="text-sm font-medium text-maz-text-secondary mb-1 block">Platform</label>
                  <Select>
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>YouTube</option>
                    <option>Facebook</option>
                    <option>Twitter / X</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-maz-text-secondary mb-1 block">Quantity</label>
                  <Input type="number" placeholder="e.g., 1000" />
                </div>
              </div>
               <div>
                <label className="text-sm font-medium text-maz-text-secondary mb-1 block">Target Link (Post or Profile URL)</label>
                <Input type="url" placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium text-maz-text-secondary mb-1 block">Optional Notes</label>
                <Textarea rows={3} placeholder="Any specific instructions? (e.g., target audience, comment content)"></Textarea>
              </div>
            </div>
          </section>
        </main>
        
        {/* Sticky Footer */}
        <footer className="flex-shrink-0 p-4 bg-maz-surface border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-4">
          <button className="px-6 py-3 rounded-lg font-semibold text-maz-text bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Preview
          </button>
          <button className="px-6 py-3 rounded-lg font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-sky-500/50">
            Submit Booster Request
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default AddSocialBoosterAdRoom;