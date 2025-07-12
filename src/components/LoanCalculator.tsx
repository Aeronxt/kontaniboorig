import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaCar, FaUser } from 'react-icons/fa';
import { ArrowRight, Calculator, Coins, Clock, Percent } from 'lucide-react';

type LoanType = 'home' | 'car' | 'personal';

interface LoanDetails {
  type: LoanType;
  icon: React.ReactNode;
  title: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  defaultRate: number;
  color: string;
}

const loanTypes: Record<LoanType, LoanDetails> = {
  home: {
    type: 'home',
    icon: <FaHome className="text-4xl" />,
    title: 'Home Loan',
    description: 'Calculate EMI for your dream home',
    minAmount: 100000,
    maxAmount: 10000000,
    minTerm: 5,
    maxTerm: 30,
    defaultRate: 7.5,
    color: 'from-blue-500 to-blue-600',
  },
  car: {
    type: 'car',
    icon: <FaCar className="text-4xl" />,
    title: 'Car Loan',
    description: 'Plan your vehicle financing',
    minAmount: 50000,
    maxAmount: 2000000,
    minTerm: 1,
    maxTerm: 7,
    defaultRate: 8.5,
    color: 'from-green-500 to-green-600',
  },
  personal: {
    type: 'personal',
    icon: <FaUser className="text-4xl" />,
    title: 'Personal Loan',
    description: 'Quick personal financing calculator',
    minAmount: 10000,
    maxAmount: 1000000,
    minTerm: 1,
    maxTerm: 5,
    defaultRate: 12,
    color: 'from-purple-500 to-purple-600',
  },
};

const LoanCalculator: React.FC = () => {
  const [selectedLoan, setSelectedLoan] = useState<LoanType | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [result, setResult] = useState<{
    emi: number;
    totalInterest: number;
    totalAmount: number;
  } | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(amount);
    const ratePerMonth = parseFloat(rate) / 12 / 100;
    const termMonths = parseFloat(term) * 12;

    const emi =
      (principal * ratePerMonth * Math.pow(1 + ratePerMonth, termMonths)) /
      (Math.pow(1 + ratePerMonth, termMonths) - 1);

    const totalAmount = emi * termMonths;
    const totalInterest = totalAmount - principal;

    setResult({
      emi: parseFloat(emi.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    });
  };

  const handleLoanSelect = (type: LoanType) => {
    setSelectedLoan(type);
    setRate(loanTypes[type].defaultRate.toString());
    setAmount('');
    setTerm('');
    setResult(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

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
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Loan EMI Calculator
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Choose your loan type and calculate your EMI with our easy-to-use calculator
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Object.values(loanTypes).map((loan) => (
          <motion.button
            key={loan.type}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLoanSelect(loan.type)}
            className={`p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-4 transition-all duration-300 ${
              selectedLoan === loan.type
                ? `bg-gradient-to-r ${loan.color} text-white`
                : 'bg-white text-gray-800 hover:shadow-xl'
            }`}
          >
            <div className={`p-4 rounded-full ${
              selectedLoan === loan.type 
                ? 'bg-white/20' 
                : 'bg-gray-100'
            }`}>
              {loan.icon}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">{loan.title}</h3>
              <p className={`text-sm ${
                selectedLoan === loan.type 
                  ? 'text-white/80' 
                  : 'text-gray-600'
              }`}>
                {loan.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedLoan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Coins size={20} />
                  <label className="block text-sm font-medium">
                    Loan Amount
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={selectedLoan ? loanTypes[selectedLoan].minAmount : 0}
                    max={selectedLoan ? loanTypes[selectedLoan].maxAmount : 0}
                    className="w-full pl-8 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter loan amount"
                  />
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Calculator size={12} />
                  Min: {formatCurrency(loanTypes[selectedLoan].minAmount)} - Max:{' '}
                  {formatCurrency(loanTypes[selectedLoan].maxAmount)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock size={20} />
                  <label className="block text-sm font-medium">
                    Loan Term (Years)
                  </label>
                </div>
                <input
                  type="range"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  min={loanTypes[selectedLoan].minTerm}
                  max={loanTypes[selectedLoan].maxTerm}
                  step="1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{term || loanTypes[selectedLoan].minTerm} Years</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {loanTypes[selectedLoan].minTerm} - {loanTypes[selectedLoan].maxTerm} years
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Percent size={20} />
                  <label className="block text-sm font-medium">
                    Interest Rate (%)
                  </label>
                </div>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  step="0.1"
                  min="1"
                  max="30"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter interest rate"
                />
                <div className="text-xs text-gray-500">
                  Recommended: {loanTypes[selectedLoan].defaultRate}%
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={calculateEMI}
              className={`w-full bg-gradient-to-r ${loanTypes[selectedLoan].color} text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
            >
              Calculate EMI
              <ArrowRight size={20} />
            </motion.button>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <motion.div 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl"
                    variants={itemVariants}
                  >
                    <h3 className="text-sm font-medium text-blue-800 mb-2">Monthly EMI</h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(result.emi)}
                    </p>
                  </motion.div>
                  <motion.div 
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl"
                    variants={itemVariants}
                  >
                    <h3 className="text-sm font-medium text-purple-800 mb-2">Total Interest</h3>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatCurrency(result.totalInterest)}
                    </p>
                  </motion.div>
                  <motion.div 
                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl"
                    variants={itemVariants}
                  >
                    <h3 className="text-sm font-medium text-green-800 mb-2">Total Amount</h3>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(result.totalAmount)}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoanCalculator; 