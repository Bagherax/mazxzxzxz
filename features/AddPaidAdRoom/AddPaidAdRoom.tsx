import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AddPaidAdRoomProps {
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

const Radio = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg has-[:checked]:bg-sky-50 dark:has-[:checked]:bg-sky-900/50 has-[:checked]:border-sky-500 transition">
      <input type="radio" {...props} className="h-5 w-5 border-gray-300 text-sky-600 focus:ring-sky-500" />
      <span className="text-maz-text">{label}</span>
    </label>
);

const AddPaidAdRoom: React.FC<AddPaidAdRoomProps> = ({ onClose }) => {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentImageCount = images.length;
    const filesToProcess = files.slice(0, 5 - currentImageCount);

    filesToProcess.forEach(file => {
      if (file instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
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
      className="fixed inset-0 bg-black bg-opacity-60 z-[9999] flex flex-col justify-end"
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
            <span className="text-sky-500">📢</span>
            Add Paid Ad
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-maz-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-grow overflow-y-auto p-6 space-y-8">
          {/* Image Upload */}
          <section>
            <h3 className="font-semibold mb-3 text-lg">Upload Images</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={image} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                  <button onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">&times;</button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center text-maz-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  <span className="text-xs mt-1">Upload</span>
                </button>
              )}
            </div>
            <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
          </section>

          {/* Ad Details */}
          <section>
            <h3 className="font-semibold mb-3 text-lg">Ad Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-maz-text-secondary mb-1 block">Ad Title</label>
                <Input type="text" placeholder="e.g., Premium Wireless Earbuds" />
              </div>
              <div>
                <label className="text-sm font-medium text-maz-text-secondary mb-1 block">Description</label>
                <Textarea rows={4} placeholder="Describe your item..."></Textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="text-sm font-medium text-maz-text-secondary mb-1 block">Price</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-maz-text-secondary">$</span>
                    <Input type="number" placeholder="0.00" className="pl-7" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-maz-text-secondary mb-1 block">Category</label>
                  <Select>
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Home Goods</option>
                    <option>Collectibles</option>
                  </Select>
                </div>
              </div>
            </div>
          </section>
          
           {/* Promotion Details */}
          <section>
            <h3 className="font-semibold mb-3 text-lg">Promotion Details</h3>
            <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-maz-text-secondary mb-1 block">Ad Duration</label>
                  <Select>
                    <option>7 Days - $10</option>
                    <option>14 Days - $18</option>
                    <option>30 Days - $35</option>
                  </Select>
                </div>
                <div>
                    <label className="text-sm font-medium text-maz-text-secondary mb-2 block">Payment Method</label>
                    <div className="space-y-2">
                        <Radio name="payment" label="Credit Card" defaultChecked />
                        <Radio name="payment" label="MAZ Wallet" />
                        <Radio name="payment" label="Crypto" />
                    </div>
                </div>
            </div>
          </section>
        </main>
        
        {/* Sticky Footer */}
        <footer className="flex-shrink-0 p-4 bg-maz-surface border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-4">
          <button className="px-6 py-3 rounded-lg font-semibold text-maz-text bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            Preview Ad
          </button>
          <button className="px-6 py-3 rounded-lg font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-sky-500/50">
            Submit Paid Ad
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default AddPaidAdRoom;