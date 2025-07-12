import React from 'react';
import BankProductForms from '../../src/components/BankProductForms';

export default function ForBanks() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">For Banks</h1>
          <p className="text-xl text-gray-600">Submit your banking products for listing on our platform</p>
        </div>
        <BankProductForms />
      </div>
    </div>
  );
} 