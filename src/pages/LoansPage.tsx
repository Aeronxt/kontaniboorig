import React, { useState } from 'react';
import { ArrowRight, Filter, BadgeDollarSign, Percent, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Sample loans data
const loans = [
  {
    id: 1,
    name: "Personal Loan Plus",
    provider: "Royal Bank",
    logo: "https://images.pexels.com/photos/7821486/pexels-photo-7821486.jpeg?auto=compress&cs=tinysrgb&w=600",
    interestRate: "7.99%",
    maxAmount: "৳50,000",
    term: "1-7 years",
    monthlyPayment: "৳657",
    totalRepayment: "৳39,432",
    specialOffer: "No application fee",
    approvalTime: "Same day",
    tags: ["personal-loan", "fast-approval", "good-credit"]
  },
  {
    id: 2,
    name: "Home Owner Loan",
    provider: "First National",
    logo: "https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg?auto=compress&cs=tinysrgb&w=600",
    interestRate: "5.45%",
    maxAmount: "৳250,000",
    term: "5-30 years",
    monthlyPayment: "৳1,418",
    totalRepayment: "৳340,320",
    specialOffer: "Low interest rate",
    approvalTime: "2-3 days",
    tags: ["home-loan", "low-interest", "large-amount"]
  },
  {
    id: 3,
    name: "Quick Cash Advance",
    provider: "EasyMoney",
    logo: "https://images.pexels.com/photos/5849577/pexels-photo-5849577.jpeg?auto=compress&cs=tinysrgb&w=600",
    interestRate: "15.99%",
    maxAmount: "৳5,000",
    term: "3-24 months",
    monthlyPayment: "৳242",
    totalRepayment: "৳5,808",
    specialOffer: "Instant approval",
    approvalTime: "1 hour",
    tags: ["personal-loan", "fast-approval", "bad-credit"]
  },
  {
    id: 4,
    name: "Auto Finance",
    provider: "Drive Credit",
    logo: "https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=600",
    interestRate: "4.99%",
    maxAmount: "৳75,000",
    term: "1-7 years",
    monthlyPayment: "৳1,087",
    totalRepayment: "৳65,220",
    specialOffer: "0% down payment",
    approvalTime: "24 hours",
    tags: ["auto-loan", "low-interest", "new-vehicles"]
  },
  {
    id: 5,
    name: "Student Loan Refinance",
    provider: "Education Finance",
    logo: "https://images.pexels.com/photos/8353805/pexels-photo-8353805.jpeg?auto=compress&cs=tinysrgb&w=600",
    interestRate: "3.75%",
    maxAmount: "৳100,000",
    term: "5-20 years",
    monthlyPayment: "৳594",
    totalRepayment: "৳107,077",
    specialOffer: "No refinance fee",
    approvalTime: "3-5 days",
    tags: ["student-loan", "refinance", "low-interest"]
  },
];

const LoansPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const filters = [
    { id: 'all', name: 'All Loans' },
    { id: 'personal-loan', name: 'Personal Loans' },
    { id: 'home-loan', name: 'Home Loans' },
    { id: 'auto-loan', name: 'Auto Loans' },
    { id: 'student-loan', name: 'Student Loans' },
    { id: 'fast-approval', name: 'Fast Approval' },
  ];
  
  const filteredLoans = activeFilter === 'all' 
    ? loans 
    : loans.filter(loan => loan.tags.includes(activeFilter));
    
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
      <section className="bg-purple-600 text-white py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Best Loans Bangladesh 2025: Compare Personal, Home & Car Loan Rates Online
            </h1>
            <p className="text-lg md:text-xl text-purple-100 mb-6">
              Compare loan rates, terms, and features to find the loan that suits your needs and budget.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn bg-white text-purple-600 hover:bg-purple-50">
                Compare Personal Loans
              </button>
              <Link 
                to="/calculator" 
                className="btn bg-purple-700 text-white hover:bg-purple-800"
              >
                Loan Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Loan Calculator */}
      <section className="py-10 bg-white border-b">
        <div className="container-custom">
          <div className="bg-purple-50 rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6">Quick Loan Calculator</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">৳</span>
                  </div>
                  <input 
                    type="number" 
                    defaultValue="25000"
                    className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    defaultValue="5.99"
                    step="0.01"
                    className="block w-full pr-7 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term (years)
                </label>
                <div className="relative">
                  <select 
                    className="block w-full py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="1">1 year</option>
                    <option value="3">3 years</option>
                    <option value="5" selected>5 years</option>
                    <option value="7">7 years</option>
                    <option value="10">10 years</option>
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Payment</p>
                    <p className="text-2xl font-semibold text-purple-600">৳483</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Repayment</p>
                    <p className="text-2xl font-semibold text-purple-600">৳28,980</p>
                  </div>
                </div>
              </div>
              
              <button className="btn bg-purple-600 text-white hover:bg-purple-700">
                Find Matching Loans
              </button>
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
                            ? 'bg-purple-50 text-purple-600 font-medium' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {filter.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <h4 className="font-medium mb-3">Loan Amount</h4>
                  <div className="mb-4">
                    <input
                      type="range"
                      min="1000"
                      max="200000"
                      step="1000"
                      defaultValue="50000"
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>৳1,000</span>
                      <span>৳200,000</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <h4 className="font-medium mb-3">Credit Score</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-gray-700">
                      <input type="checkbox" className="mr-2 h-4 w-4" />
                      Excellent (720+)
                    </label>
                    <label className="flex items-center text-sm text-gray-700">
                      <input type="checkbox" className="mr-2 h-4 w-4" />
                      Good (690-719)
                    </label>
                    <label className="flex items-center text-sm text-gray-700">
                      <input type="checkbox" className="mr-2 h-4 w-4" />
                      Fair (630-689)
                    </label>
                    <label className="flex items-center text-sm text-gray-700">
                      <input type="checkbox" className="mr-2 h-4 w-4" />
                      Poor (629 or less)
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Loans Listing */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {activeFilter === 'all' ? 'All Loans' : filters.find(f => f.id === activeFilter)?.name}
                </h2>
                <div className="text-sm text-gray-600">
                  Showing {filteredLoans.length} results
                </div>
              </div>
              
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredLoans.map(loan => (
                  <motion.div 
                    key={loan.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    variants={itemVariants}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Logo / Image */}
                      <div className="w-full md:w-48 h-48 md:h-auto p-4 flex items-center justify-center bg-white border-b md:border-b-0 md:border-r border-gray-200">
                        <img 
                          src={loan.logo} 
                          alt={loan.provider}
                          className="max-w-full max-h-24 object-contain" 
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-grow p-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{loan.name}</h3>
                            <p className="text-gray-600">{loan.provider}</p>
                          </div>
                          
                          {loan.specialOffer && (
                            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium mt-2 md:mt-0">
                              {loan.specialOffer}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Percent size={16} className="mr-1" /> Interest Rate
                            </div>
                            <div className="font-semibold">{loan.interestRate}</div>
                          </div>
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <BadgeDollarSign size={16} className="mr-1" /> Max Amount
                            </div>
                            <div className="font-semibold">{loan.maxAmount}</div>
                          </div>
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Calendar size={16} className="mr-1" /> Term
                            </div>
                            <div className="font-semibold">{loan.term}</div>
                          </div>
                          <div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <AlertCircle size={16} className="mr-1" /> Approval
                            </div>
                            <div className="font-semibold">{loan.approvalTime}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {loan.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize"
                            >
                              {tag.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Monthly Payment</p>
                              <p className="font-semibold">{loan.monthlyPayment}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Repayment</p>
                              <p className="font-semibold">{loan.totalRepayment}</p>
                            </div>
                          </div>
                          
                          <a 
                            href="#" 
                            className="btn bg-purple-600 text-white hover:bg-purple-700 whitespace-nowrap"
                          >
                            Apply Now <ArrowRight size={16} className="ml-1" />
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
      
      {/* Educational Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8">
            Loan Guides & Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3">
                How to Choose the Right Loan
              </h3>
              <p className="text-gray-600 mb-4">
                Understand the different types of loans available and how to determine 
                which one best suits your financial situation and needs.
              </p>
              <a 
                href="#" 
                className="text-purple-600 font-medium inline-flex items-center hover:text-purple-700"
              >
                Read More <ArrowRight size={14} className="ml-1" />
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3">
                Improving Your Credit Score
              </h3>
              <p className="text-gray-600 mb-4">
                Learn strategies to improve your credit score to qualify for better loan terms 
                and lower interest rates.
              </p>
              <a 
                href="#" 
                className="text-purple-600 font-medium inline-flex items-center hover:text-purple-700"
              >
                Read More <ArrowRight size={14} className="ml-1" />
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3">
                Understanding Loan Terms
              </h3>
              <p className="text-gray-600 mb-4">
                Get familiar with common loan terms and conditions so you can 
                make informed decisions about your borrowing options.
              </p>
              <a 
                href="#" 
                className="text-purple-600 font-medium inline-flex items-center hover:text-purple-700"
              >
                Read More <ArrowRight size={14} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoansPage;