import React from 'react';
import { motion } from 'framer-motion';
import LoanCalculator from '../components/LoanCalculator';
import SEO from '../components/SEO';
import { Calculator, TrendingUp, DollarSign, PieChart, BarChart3, Home, CreditCard, Car, Check, Star, Award, Clock } from 'lucide-react';

export default function CalculatorPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <SEO 
        title="Best EMI Calculator Bangladesh 2025 | Free Online Loan Calculator & EMI Estimator"
        description="Free EMI calculator online for home loan, personal loan, car loan EMI calculation. Use our EMI estimator & loan calculator to calculate equated monthly installment with City Bank & other banks. Get accurate EMI calculation instantly."
        keywords="emi calculator, emi estimator, emi cal, e mi calculator, emi calculation calculator, emi calculator emi, emi installment calculator, emi, loan calculator, city bank loan calculator, equated monthly installment, home loan emi calculator, personal loan emi calculator, house loan emi calculator, loan emi calculator, car loan calculator, loan installment calculator, emi calculator online, bank emi calculator, loan emi calculator home loan, finance calculator, interest rate calculator"
        pageType="calculator"
        canonical="https://kontanibo.com/calculator"
        ogUrl="https://kontanibo.com/calculator"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1B1F3B] via-[#2d325f] to-[#1B1F3B] text-white py-8 md:py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Free EMI Calculator Bangladesh 2025: Loan, Home & Car EMI Calculation Online
            </h1>
            <p className="text-base md:text-xl font-medium text-blue-100 mb-6 max-w-4xl mx-auto">
              Free online EMI calculator for home loan, personal loan, car loan EMI calculation. Calculate equated monthly installment with our EMI estimator & loan calculator for all major banks.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Calculator className="mr-2" size={16} />
                <span>Free EMI Calculator</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <TrendingUp className="mr-2" size={16} />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <DollarSign className="mr-2" size={16} />
                <span>All Loan Types</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Calculator Section */}
      <main className="py-8 md:py-12">
        <LoanCalculator />
      </main>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-8 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* EMI Calculator Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <Calculator className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">EMI Calculator Online Bangladesh</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Use our free EMI calculator online to calculate equated monthly installments for all types of loans. Get accurate EMI calculation for home loans, personal loans, and car loans from top banks in Bangladesh.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Free EMI calculator with instant results</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>EMI estimator for all loan types</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Detailed amortization schedule</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <PieChart className="text-green-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Loan Calculator & EMI Estimator</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Our comprehensive loan calculator helps you estimate EMI for different loan amounts, interest rates, and tenures. Use our EMI cal tool to compare loan options and make informed decisions.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>EMI calculation calculator with charts</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Interest rate calculator included</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Loan comparison features</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <BarChart3 className="text-purple-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Bank EMI Calculator & Finance Calculator</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Calculate EMI for loans from major banks including City Bank loan calculator, BRAC Bank, and other leading financial institutions. Our finance calculator supports all major banks in Bangladesh.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>City Bank loan calculator supported</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>All major banks covered</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Real-time interest rate updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Types Section */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">EMI Calculator for All Loan Types</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Use our specialized EMI calculators for different loan types. Calculate accurate EMI for home loans, personal loans, car loans, and more with our comprehensive loan calculator tools.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Home Loan EMI Calculator</h3>
                <p className="text-blue-700 text-sm mb-4">Calculate EMI for home loans and house loans with our specialized calculator</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center text-blue-600">
                    <Check className="mr-2" size={14} />
                    <span>House loan EMI calculator</span>
                  </div>
                  <div className="flex items-center justify-center text-blue-600">
                    <Check className="mr-2" size={14} />
                    <span>Mortgage calculator included</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Personal Loan EMI Calculator</h3>
                <p className="text-green-700 text-sm mb-4">Calculate EMI for personal loans with our accurate EMI estimator</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center text-green-600">
                    <Check className="mr-2" size={14} />
                    <span>Instant EMI calculation</span>
                  </div>
                  <div className="flex items-center justify-center text-green-600">
                    <Check className="mr-2" size={14} />
                    <span>Flexible tenure options</span>
                  </div>
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-purple-900 mb-2">Car Loan Calculator</h3>
                <p className="text-purple-700 text-sm mb-4">Calculate EMI for car loans and auto loans with our specialized calculator</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center text-purple-600">
                    <Check className="mr-2" size={14} />
                    <span>Auto loan EMI calculator</span>
                  </div>
                  <div className="flex items-center justify-center text-purple-600">
                    <Check className="mr-2" size={14} />
                    <span>Vehicle loan calculator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Why Choose Our EMI Calculator?</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Our EMI calculator offers the most accurate and comprehensive loan calculation tools for all your financial planning needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calculator className="text-blue-600" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Free & Accurate</h3>
                <p className="text-sm text-gray-600">100% free EMI calculator with accurate calculations</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-green-600" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-sm text-gray-600">Get EMI calculations instantly without delays</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <PieChart className="text-purple-600" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Detailed Charts</h3>
                <p className="text-sm text-gray-600">Visual charts and amortization schedules</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="text-orange-600" size={20} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">All Banks Supported</h3>
                <p className="text-sm text-gray-600">Works with all major banks in Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Footer Section */}
      <div className="bg-gradient-to-br from-[#1B1F3B] to-[#2d325f] text-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* EMI Calculator Types */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">EMI Calculator Types</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ Home Loan EMI Calculator</p>
                <p className="text-gray-300">✓ Personal Loan EMI Calculator</p>
                <p className="text-gray-300">✓ Car Loan Calculator</p>
                <p className="text-gray-300">✓ House Loan EMI Calculator</p>
                <p className="text-gray-300">✓ Loan EMI Calculator</p>
                <p className="text-gray-300">✓ EMI Installment Calculator</p>
                <p className="text-gray-300">✓ Loan Installment Calculator</p>
                <p className="text-gray-300">✓ Finance Calculator</p>
              </div>
            </div>

            {/* Calculator Features */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Calculator Features</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ EMI Calculation Calculator</p>
                <p className="text-gray-300">✓ EMI Estimator Tools</p>
                <p className="text-gray-300">✓ EMI Cal Quick Calculator</p>
                <p className="text-gray-300">✓ E MI Calculator</p>
                <p className="text-gray-300">✓ Interest Rate Calculator</p>
                <p className="text-gray-300">✓ Loan Tenure Calculator</p>
                <p className="text-gray-300">✓ Principal Amount Calculator</p>
                <p className="text-gray-300">✓ Prepayment Calculator</p>
              </div>
            </div>

            {/* Supported Banks */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Supported Banks</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ City Bank Loan Calculator</p>
                <p className="text-gray-300">✓ BRAC Bank EMI Calculator</p>
                <p className="text-gray-300">✓ Dutch Bangla Bank</p>
                <p className="text-gray-300">✓ Eastern Bank Limited</p>
                <p className="text-gray-300">✓ Prime Bank Limited</p>
                <p className="text-gray-300">✓ Standard Bank Limited</p>
                <p className="text-gray-300">✓ Mutual Trust Bank</p>
                <p className="text-gray-300">✓ Bank Asia Limited</p>
              </div>
            </div>

            {/* Benefits & Services */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Benefits & Services</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ EMI Calculator Online Free</p>
                <p className="text-gray-300">✓ Bank EMI Calculator</p>
                <p className="text-gray-300">✓ Loan EMI Calculator Home Loan</p>
                <p className="text-gray-300">✓ Equated Monthly Installment</p>
                <p className="text-gray-300">✓ Instant EMI Calculation</p>
                <p className="text-gray-300">✓ Detailed Amortization Schedule</p>
                <p className="text-gray-300">✓ Mobile Responsive Calculator</p>
                <p className="text-gray-300">✓ No Registration Required</p>
              </div>
            </div>
          </div>

          {/* Popular Calculator Searches */}
          <div className="mt-8 pt-8 border-t border-gray-600">
            <h3 className="text-lg font-bold mb-4 text-blue-200 text-center">Popular EMI Calculator Searches Bangladesh</h3>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">EMI Calculator</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Loan Calculator</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">EMI Estimator</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">EMI Cal</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Home Loan EMI Calculator</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Personal Loan EMI Calculator</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Car Loan Calculator</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">City Bank Loan Calculator</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">EMI Calculator Online</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Bank EMI Calculator</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 