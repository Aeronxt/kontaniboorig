import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  ArrowRight, 
  ArrowLeft,
  CreditCard,
  Home,
  PiggyBank,
  Wallet,
  Smartphone,
  Wifi,
  Shield,
  Car,
  Building2,
  DollarSign,
  Percent,
  Calendar,
  CheckCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';

interface ProductType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  minAmount?: string;
  maxAmount?: string;
  interestRate?: string;
  path: string;
}

const productTypes: ProductType[] = [
  {
    id: 'personal-loans',
    name: 'Personal Loan',
    icon: <Wallet className="w-8 h-8" />,
    description: 'Flexible loans for any purpose with competitive rates',
    minAmount: '৳50,000',
    maxAmount: '৳20,00,000',
    interestRate: '9% - 16%',
    path: '/personal-loans'
  },
  {
    id: 'home-loans',
    name: 'Home Loan',
    icon: <Home className="w-8 h-8" />,
    description: 'Mortgage loans for buying or refinancing your home',
    minAmount: '৳5,00,000',
    maxAmount: '৳5,00,00,000',
    interestRate: '7% - 12%',
    path: '/home-loans'
  },
  {
    id: 'car-loans',
    name: 'Car Loan',
    icon: <Car className="w-8 h-8" />,
    description: 'Auto financing with competitive rates and flexible terms',
    minAmount: '৳3,00,000',
    maxAmount: '৳50,00,000',
    interestRate: '8% - 14%',
    path: '/car-loans'
  },
  {
    id: 'credit-cards',
    name: 'Credit Card',
    icon: <CreditCard className="w-8 h-8" />,
    description: 'Cards with rewards, cashback, and travel benefits',
          path: '/credit-cards'
  },
  {
    id: 'savings-accounts',
    name: 'Savings Account',
    icon: <PiggyBank className="w-8 h-8" />,
    description: 'High-interest savings accounts for your money',
    interestRate: '4% - 8%',
    path: '/savings-accounts'
  },
  {
    id: 'bank-accounts',
    name: 'Bank Account',
    icon: <Building2 className="w-8 h-8" />,
    description: 'Everyday banking accounts with great features',
    path: '/bank-accounts'
  },
  {
    id: 'mobile-plans',
    name: 'Mobile Plan',
    icon: <Smartphone className="w-8 h-8" />,
    description: 'Data, calls, and text plans from top providers',
    path: '/mobile-plans'
  },
  {
    id: 'broadband',
    name: 'Broadband',
    icon: <Wifi className="w-8 h-8" />,
    description: 'High-speed internet plans for home and business',
    path: '/broadband'
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: <Shield className="w-8 h-8" />,
    description: 'Protection for your health, home, and vehicle',
    path: '/insurance'
  }
];

const BestRatesFinderPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [duration, setDuration] = useState('');

  const handleProductSelect = (product: ProductType) => {
    setSelectedProduct(product);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedProduct(null);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleContinue = () => {
    if (step === 2 && selectedProduct) {
      setStep(3);
    } else if (step === 3 && selectedProduct) {
      // Navigate to the product page with the search parameters
      navigate(selectedProduct.path, {
        state: {
          amount: amount ? parseFloat(amount) : undefined,
          purpose,
          duration: duration ? parseInt(duration) : undefined
        }
      });
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">What type of product are you looking for?</h2>
        <p className="text-gray-600">Select a category to find the best rates and deals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productTypes.map((product) => (
          <ProductCard
            key={product.id}
            icon={product.icon}
            title={product.name}
            description={product.description}
            minAmount={product.minAmount}
            maxAmount={product.maxAmount}
            interestRate={product.interestRate}
            onClick={() => handleProductSelect(product)}
          />
        ))}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Tell us more about your needs</h2>
        <p className="text-gray-600">Help us find the best {selectedProduct?.name.toLowerCase()} for you</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How much do you need?
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {selectedProduct?.minAmount && selectedProduct?.maxAmount && (
            <p className="mt-1 text-sm text-gray-500">
              Range: {selectedProduct.minAmount} - {selectedProduct.maxAmount}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What will you use it for?
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Home renovation, Education, Business"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {selectedProduct?.id.includes('loan') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How long do you need it for? (in years)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Ready to find your best rate!</h2>
        <p className="text-gray-600">
          We'll show you the best {selectedProduct?.name.toLowerCase()} options based on your needs
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mr-4">
            {selectedProduct?.icon}
          </div>
          <div className="text-left">
            <h3 className="font-semibold">{selectedProduct?.name}</h3>
            <p className="text-sm text-gray-600">{selectedProduct?.description}</p>
          </div>
        </div>

        <div className="space-y-3 text-left">
          {amount && (
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Amount: </span>
              <span className="ml-2 font-medium">৳{parseFloat(amount).toLocaleString()}</span>
            </div>
          )}
          {purpose && (
            <div className="flex items-center text-sm">
              <Sparkles className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Purpose: </span>
              <span className="ml-2 font-medium">{purpose}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-600">Duration: </span>
              <span className="ml-2 font-medium">{duration} years</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <SEO 
        title="Best Loan Rates Finder Bangladesh 2025 | Compare Bank Loans & Easy Approval"
        description="Find best bank loan rates in Bangladesh. Compare personal loans, home loans, student loans with easy approval & online application. Get urgent personal loan, education loan & mortgage from top banks with instant approval."
        keywords="bank loan, loan, approval, easy loans, bangladesh loans, emi calculation, personal loans, online loans, home loan, mortgage, loan application, online lenders, online loan bangladesh, urgent personal loan in bangladesh, student loan bd, student loan in bangladesh, loan bd, education loan in bangladesh, study loan in bangladesh, loan from bangladesh, student loan"
        pageType="best-rates-finder"
        canonical="https://kontanibo.com/best-rates-finder"
        ogUrl="https://kontanibo.com/best-rates-finder"
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
              Best Loan Rates Finder Bangladesh 2025: Compare Bank Loans & Easy Approval
            </h1>
            <p className="text-base md:text-xl font-medium text-blue-100 mb-6 max-w-4xl mx-auto">
              Find best bank loan rates in Bangladesh. Compare personal loans, home loans, student loans with easy approval & online application. Get urgent personal loan & education loan from top banks.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Percent className="mr-2" size={16} />
                <span>Best Loan Rates</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <CheckCircle className="mr-2" size={16} />
                <span>Easy Approval</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Sparkles className="mr-2" size={16} />
                <span>Online Application</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-8 md:py-12">
        <div className="container-custom">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600">Step {step} of 3</div>
            <div className="text-sm font-medium text-blue-600">
              {step === 1 ? 'Select Product' : step === 2 ? 'Enter Details' : 'Review & Compare'}
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            )}
            {step < 3 && (
              <button
                onClick={handleContinue}
                disabled={step === 2 && !amount}
                className={`ml-auto flex items-center px-6 py-3 rounded-lg text-white ${
                  step === 2 && !amount
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleContinue}
                className="ml-auto flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Find Best Rates
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
      
      {/* SEO Content Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Best Loan Rates Bangladesh</h3>
                <p className="text-gray-600">Compare personal loans, home loans, student loans with lowest interest rates from top banks in Bangladesh including BRAC Bank, City Bank, and Dutch Bangla Bank.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center p-6 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Loan Approval</h3>
                <p className="text-gray-600">Get urgent personal loan in Bangladesh with quick approval process. Online loan application with minimal documentation for instant loan processing.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Student Loan BD</h3>
                <p className="text-gray-600">Education loan in Bangladesh for students. Study loan with flexible repayment options for higher education, professional courses, and skill development programs.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* SEO Footer */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Loan Types Bangladesh</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Personal Loans</li>
                  <li>Home Loans</li>
                  <li>Car Loans</li>
                  <li>Student Loans</li>
                  <li>Education Loans</li>
                  <li>Business Loans</li>
                  <li>Mortgage Loans</li>
                  <li>Quick Loans</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Online Loan Services</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Online Loan Bangladesh</li>
                  <li>Urgent Personal Loan</li>
                  <li>Easy Loan Approval</li>
                  <li>Instant Loan Processing</li>
                  <li>Digital Loan Application</li>
                  <li>Online Lenders</li>
                  <li>Quick Loan Bangladesh</li>
                  <li>Fast Loan Approval</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Top Banks Bangladesh</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>BRAC Bank Loan</li>
                  <li>City Bank Loan</li>
                  <li>Dutch Bangla Bank</li>
                  <li>Eastern Bank</li>
                  <li>Prime Bank</li>
                  <li>Standard Bank</li>
                  <li>Mutual Trust Bank</li>
                  <li>Bank Asia</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Loan Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>EMI Calculation</li>
                  <li>Best Interest Rates</li>
                  <li>Loan Comparison</li>
                  <li>Flexible Repayment</li>
                  <li>Minimal Documentation</li>
                  <li>Loan Eligibility Check</li>
                  <li>Instant Approval</li>
                  <li>Online Application</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Popular Loan Searches Bangladesh</h4>
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Bank Loan</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Personal Loans</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Home Loan</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">Student Loan BD</span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Education Loan</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">Online Loan</span>
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">Easy Approval</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">Urgent Loan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BestRatesFinderPage; 