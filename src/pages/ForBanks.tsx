import React, { useState } from 'react';
import BankAccountForm from '../components/forms/BankAccountForm';
import SavingsAccountForm from '../components/forms/SavingsAccountForm';
import PersonalLoanForm from '../components/forms/PersonalLoanForm';
import CreditCardForm from '../components/forms/CreditCardForm';

export default function ForBanks() {
  const [activeTab, setActiveTab] = useState('bank');

  const tabs = [
    { id: 'bank', label: 'Bank Accounts' },
    { id: 'savings', label: 'Savings Accounts' },
    { id: 'loans', label: 'Personal Loans' },
    { id: 'cards', label: 'Credit Cards' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">For Banks</h1>
          <p className="text-xl text-gray-600">Submit your banking products for listing on our platform</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'bank' && <BankAccountForm />}
            {activeTab === 'savings' && <SavingsAccountForm />}
            {activeTab === 'loans' && <PersonalLoanForm />}
            {activeTab === 'cards' && <CreditCardForm />}
          </div>
        </div>
      </div>
    </div>
  );
} 