import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryFolderProps {
    onClose: () => void;
}

const categories = [
    { 
        name: 'Trading', 
        subcategories: ['Crypto', 'Commodities', 'Stocks'] 
    },
    { 
        name: 'Auction', 
        subcategories: ['Cars', 'Art', 'Collectibles'] 
    },
    { 
        name: 'Real Estate', 
        subcategories: ['For Sale', 'For Rent'] 
    },
    { 
        name: 'Electronics', 
        subcategories: ['Phones', 'Laptops', 'Cameras', 'Audio'] 
    },
    { 
        name: 'Vehicles', 
        subcategories: ['Cars', 'Motorcycles', 'Boats'] 
    },
    { 
        name: 'Home & Garden', 
        subcategories: ['Furniture', 'Appliances', 'Gardening'] 
    }
];

const FolderItem: React.FC<{ name: string; children: React.ReactNode }> = ({ name, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-3 px-2 text-left font-semibold text-maz-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <span>{name}</span>
                <motion.svg
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 text-maz-text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </motion.svg>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pl-6 pr-2 py-2 bg-gray-50 dark:bg-gray-900/50">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FileItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-center py-2 px-2 text-maz-text-secondary hover:text-maz-primary cursor-pointer transition-colors">
        <svg className="w-4 h-4 mr-3 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>{children}</span>
    </div>
);

const CategoryFolder: React.FC<CategoryFolderProps> = ({ onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-[998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="fixed bottom-0 left-0 right-0 bg-maz-surface rounded-t-2xl shadow-lg border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                style={{ maxHeight: 'calc(100vh - 100px)', maxWidth: '640px', margin: '0 auto' }}
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-sky-500">Categories</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                         <svg className="w-6 h-6 text-maz-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                    </button>
                </div>
                <div className="overflow-y-auto" style={{maxHeight: 'calc(100vh - 165px)'}}>
                    {categories.map(category => (
                        <FolderItem key={category.name} name={category.name}>
                            {category.subcategories.map(sub => (
                                <FileItem key={sub}>{sub}</FileItem>
                            ))}
                        </FolderItem>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CategoryFolder;