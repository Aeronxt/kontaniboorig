import React, { useState } from 'react';
import { ArrowRight, Filter, Percent, DollarSign, Building, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// Sample bank data
const banks = [
  {
    id: 1,
    name: "Royal Bank",
    logo: "https://images.pexels.com/photos/7821486/pexels-photo-7821486.jpeg?auto=compress&cs=tinysrgb&w=600",
    savingsRate: "3.25%",
    checkingFee: "$0",
    minDeposit: "$100",
    branches: 1200,
    onlineRating: 4.5,
    mobileRating: 4.7,
    specialOffer: "Sign up bonus: $200",
    tags: ["big-banks", "online-banking", "mobile-app"]
  },
  {
    id: 2,
    name: "First National",
    logo: "https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg?auto=compress&cs=tinysrgb&w=600",
    savingsRate: "3.15%",
    checkingFee: "$5",
    minDeposit: "$0",
    branches: 800,
    onlineRating: 4.2,
    mobileRating: 4.5,
    specialOffer: "No minimum balance",
    tags: ["big-banks", "no-minimum"]
  },
  {
    id: 3,
    name: "Digital Credit Union",
    logo: "https://images.pexels.com/photos/5849577/pexels-photo-5849577.jpeg?auto=compress&cs=tinysrgb&w=600",
    savingsRate: "3.75%",
    checkingFee: "$0",
    minDeposit: "$5",
    branches: 50,
    onlineRating: 4.8,
    mobileRating: 4.9,
    specialOffer: "High-yield savings",
    tags: ["credit-union", "high-interest", "online-banking"]
  },
  {
    id: 4,
    name: "Community Trust",
    logo: "https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=600",
    savingsRate: "3.30%",
    checkingFee: "$0",
    minDeposit: "$25",
    branches: 120,
    onlineRating: 4.0,
    mobileRating: 3.9,
    specialOffer: "Local community focus",
    tags: ["local-bank", "community"]
  },
  {
    id: 5,
    name: "Online Direct",
    logo: "https://images.pexels.com/photos/8353805/pexels-photo-8353805.jpeg?auto=compress&cs=tinysrgb&w=600",
    savingsRate: "4.00%",
    checkingFee: "$0",
    minDeposit: "$0",
    branches: 0,
    onlineRating: 4.9,
    mobileRating: 4.8,
    specialOffer: "Highest savings rate",
    tags: ["online-only", "high-interest", "no-fees"]
  },
];

const BanksPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const filters = [
    { id: 'all', name: 'All Banks' },
    { id: 'big-banks', name: 'Big Banks' },
    { id: 'credit-union', name: 'Credit Unions' },
    { id: 'online-only', name: 'Online Only' },
    { id: 'high-interest', name: 'High Interest' },
    { id: 'no-fees', name: 'No Fees' },
  ];
  
  const filteredBanks = activeFilter === 'all' 
    ? banks 
    : banks.filter(bank => bank.tags.includes(activeFilter));
    
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Compare Banks and Find Your Perfect Match
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-6">
              Compare savings rates, fees, and features to find the bank that best suits your financial needs.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn bg-white text-blue-600 hover:bg-blue-50">
                Compare Savings Accounts
              </button>
              <button className="btn bg-blue-700 text-white hover:bg-blue-800">
                View Checking Accounts
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-blue-600 font-semibold text-2xl md:text-3xl mb-1">4.00%</div>
              <div className="text-gray-600 text-sm">Highest Savings Rate</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 font-semibold text-2xl md:text-3xl mb-1">$0</div>
              <div className="text-gray-600 text-sm">Lowest Monthly Fee</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 font-semibold text-2xl md:text-3xl mb-1">$200</div>
              <div className="text-gray-600 text-sm">Best Sign-Up Bonus</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 font-semibold text-2xl md:text-3xl mb-1">24/7</div>
              <div className="text-gray-600 text-sm">Online Banking Access</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / Filters */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center">
                    <Filter size={18} className="text-gray-500 mr-2" />
                    <h3 className="font-medium">Filters</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2">
                    {filters.map(filter => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          activeFilter === filter.id 
                            ? 'bg-blue-50 text-blue-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {filter.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <h4 className="font-medium mb-3">Key Features</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-gray-700">
                      <input type="checkbox" className="mr-2 h-4 w-4" />
                      Mobile App
                    </label>
                    <label className="flex items-center text-sm text-gray-700">
                      <input type="checkbox" className="mr-2 h-4 w-4" />
                      No Minimum Balance
                    </label>
                    <label className="flex items-center text-sm text-gray-700">
                      <input type="checkbox" className="mr-2 h-4 w-4" />
                      Free ATM Access
                    </label>
                    <label className="flex items-center text-sm text-gray-700">
                      <input type="checkbox" className="mr-2 h-4 w-4" />
                      No Foreign Transaction Fees
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Banks Listing */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {activeFilter === 'all' ? 'All Banks' : filters.find(f => f.id === activeFilter)?.name}
                </h2>
                <div className="text-sm text-gray-600">
                  Showing {filteredBanks.length} results
                </div>
              </div>
              
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredBanks.map(bank => (
                  <motion.div 
                    key={bank.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    variants={itemVariants}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Logo / Image */}
                      <div className="w-full md:w-48 h-48 md:h-auto p-4 flex items-center justify-center bg-white border-b md:border-b-0 md:border-r border-gray-200">
                        <img 
                          src={bank.logo} 
                          alt={bank.name}
                          className="max-w-full max-h-24 object-contain" 
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-grow p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                          <h3 className="text-xl font-semibold mb-2 md:mb-0">{bank.name}</h3>
                          
                          {bank.specialOffer && (
                            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                              {bank.specialOffer}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Percent size={16} className="mr-1" /> Savings Rate
                            </div>
                            <div className="font-semibold">{bank.savingsRate}</div>
                          </div>
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <DollarSign size={16} className="mr-1" /> Checking Fee
                            </div>
                            <div className="font-semibold">{bank.checkingFee}</div>
                          </div>
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <DollarSign size={16} className="mr-1" /> Min Deposit
                            </div>
                            <div className="font-semibold">{bank.minDeposit}</div>
                          </div>
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Building size={16} className="mr-1" /> Branches
                            </div>
                            <div className="font-semibold">{bank.branches}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {bank.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize"
                            >
                              {tag.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <span className="text-gray-600 mr-1">User Rating:</span>
                              <span className="font-medium">{bank.onlineRating}/5</span>
                            </div>
                            <div className="mx-4 text-gray-300">|</div>
                            <div className="flex items-center text-sm">
                              <Users size={16} className="text-gray-500 mr-1" />
                              <span className="text-gray-600">1.2k reviews</span>
                            </div>
                          </div>
                          
                          <a 
                            href="#" 
                            className="btn-primary"
                          >
                            View Details <ArrowRight size={16} className="ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            <div className="py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How do I choose the right bank for me?
              </h3>
              <p className="text-gray-600">
                Consider your specific needs, such as interest rates, fees, minimum balance requirements, 
                ATM access, online and mobile banking features, and branch locations. Our comparison tools 
                can help you evaluate these factors side by side.
              </p>
            </div>
            
            <div className="py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What's the difference between a bank and a credit union?
              </h3>
              <p className="text-gray-600">
                Banks are for-profit institutions owned by shareholders, while credit unions are non-profit 
                and owned by their members. Credit unions often offer better rates and lower fees, but may have 
                membership requirements and fewer branches/ATMs.
              </p>
            </div>
            
            <div className="py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Are online-only banks safe?
              </h3>
              <p className="text-gray-600">
                Yes, legitimate online banks are just as safe as traditional banks. They're typically FDIC-insured 
                (or equivalent in other countries), meaning your deposits are protected up to the legal limit. They 
                often offer better rates due to lower overhead costs.
              </p>
            </div>
            
            <div className="py-5">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                How often are the rates and fees updated on KontaNibo?
              </h3>
              <p className="text-gray-600">
                We update our information regularly to ensure accuracy. However, rates and fees can change frequently, 
                so we always recommend verifying the current details directly with the financial institution before making a decision.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BanksPage;