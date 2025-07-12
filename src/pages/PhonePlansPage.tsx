import React from 'react';
import { motion } from 'framer-motion';

const PhonePlansPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Phone Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Phone plan content will go here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Coming Soon</h2>
          <p className="text-gray-600">
            We're currently working on bringing you the best phone plan comparisons.
            Check back soon for updates!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PhonePlansPage;