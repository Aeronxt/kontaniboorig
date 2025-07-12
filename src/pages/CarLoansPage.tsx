import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronDown, Filter, X, Car, ArrowRight, ArrowUpRight, Check, Calculator, Star, TrendingUp, Shield, Award, Clock, DollarSign, Calendar, Grid, Info, Eye } from 'lucide-react';
import Speedometer from '../components/Speedometer';
import SEO from '../components/SEO';
import { generateSEO } from '../constants/seo';

interface CarLoan {
  id: string;
  brand: string;
  product_name: string;
  interest_rate_min: number | null;
  interest_rate_max: number | null;
  minimum_income: number;
  max_loan_amount: number;
  processing_fee_percentage: number | null;
  processing_fee_max: number;
  processing_fee_description: string | null;
  early_settlement_fee: number | null;
  early_settlement_conditions: string | null;
  loan_tenure_new_vehicle: number;
  loan_tenure_recondition_vehicle: number;
  loan_to_value_hybrid_electric: string | null;
  loan_to_value_non_hybrid: string | null;
  minimum_age: number;
  maximum_age: number;
  features: string[] | null;
  eligibility: string[] | null;
  description: string | null;
  tagline: string | null;
  recommended: boolean;
  promoted: boolean;
  score: number | null;
  pros: string[] | null;
  cons: string[] | null;
  required_documents: string[] | null;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  } | null;
  logo_url: string | null;
  site_visit_url: string | null;
}

interface CompareModalProps {
  loans: CarLoan[];
  isOpen: boolean;
  onClose: () => void;
}

interface InfoDrawerProps {
  loan: CarLoan | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CalculatorInputs {
  loanAmount: number;
  loanTerm: number;
  vehicleType: 'new' | 'reconditioned';
  vehicleCategory: 'hybrid' | 'non-hybrid';
}

type SortField = 'interest_rate_min' | 'interest_rate_max' | 'monthly_repayment' | 'max_loan_amount'; 

const InfoDrawer: React.FC<InfoDrawerProps> = ({ loan, isOpen, onClose }) => {
  if (!loan || !isOpen) return null;

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value == null) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[520px] bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-100">
      <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Car Loan Details</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Logo and basic info */}
        <div className="mb-8">
          <div className="w-56 h-36 mb-6 flex items-center justify-center">
            {loan.logo_url ? (
              <img 
                src={loan.logo_url} 
                alt={`${loan.brand} ${loan.product_name}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                <Car size={48} className="text-gray-400" />
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{loan.brand} {loan.product_name}</h3>
          {loan.tagline && <p className="text-gray-600 text-lg">{loan.tagline}</p>}
        </div>

        {/* Key rates */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="text-sm font-medium text-blue-700 mb-1">Interest Rate (p.a.)</div>
            <div className="text-3xl font-bold text-blue-900">
              {formatPercentage(loan.interest_rate_min)} - {formatPercentage(loan.interest_rate_max)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="text-sm font-medium text-green-700 mb-1">Max Loan Amount</div>
            <div className="text-3xl font-bold text-green-900">{formatCurrency(loan.max_loan_amount)}</div>
          </div>
        </div>

        {/* Features */}
        {loan.features && loan.features.length > 0 && (
        <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Award className="mr-2 text-blue-600" size={20} />
              Features
            </h4>
            <div className="space-y-3">
              {loan.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <Check size={16} className="mr-3 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Loan Terms */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
            <Calendar className="mr-2 text-purple-600" size={20} />
            Loan Terms
          </h4>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">New Vehicle Term</span>
                <span className="font-semibold text-gray-900">{loan.loan_tenure_new_vehicle} years</span>
            </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Reconditioned Vehicle Term</span>
                <span className="font-semibold text-gray-900">{loan.loan_tenure_recondition_vehicle} years</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Processing Fee</span>
                <span className="font-semibold text-gray-900">{formatPercentage(loan.processing_fee_percentage)} (Max: {formatCurrency(loan.processing_fee_max)})</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Early Settlement Fee</span>
                <span className="font-semibold text-gray-900">{formatPercentage(loan.early_settlement_fee)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loan to Value Ratios */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
            <TrendingUp className="mr-2 text-orange-600" size={20} />
            Loan to Value Ratios
          </h4>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Hybrid & Electric Vehicle</span>
                <span className="font-semibold text-gray-900">{loan.loan_to_value_hybrid_electric || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Non-Hybrid Vehicle</span>
                <span className="font-semibold text-gray-900">{loan.loan_to_value_non_hybrid || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pros and Cons */}
        {(loan.pros || loan.cons) && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {loan.pros && loan.pros.length > 0 && (
          <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center text-green-700">
                  <Check className="mr-2" size={20} />
                  Pros
                </h4>
                <ul className="space-y-3">
                  {loan.pros.map((pro, index) => (
                    <li key={index} className="flex items-start bg-green-50 p-3 rounded-lg">
                      <Check size={16} className="mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-green-800">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
            )}
            {loan.cons && loan.cons.length > 0 && (
          <div>
                <h4 className="text-lg font-semibold mb-4 flex items-center text-red-700">
                  <X className="mr-2" size={20} />
                  Cons
                </h4>
                <ul className="space-y-3">
                  {loan.cons.map((con, index) => (
                    <li key={index} className="flex items-start bg-red-50 p-3 rounded-lg">
                      <X size={16} className="mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                      <span className="text-red-800">{con}</span>
                </li>
              ))}
            </ul>
          </div>
            )}
        </div>
        )}

        {/* Eligibility */}
        {loan.eligibility && loan.eligibility.length > 0 && (
        <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Shield className="mr-2 text-blue-600" size={20} />
              Eligibility
            </h4>
            <ul className="space-y-3">
              {loan.eligibility.map((item, index) => (
                <li key={index} className="flex items-start bg-blue-50 p-3 rounded-lg">
                  <Check size={16} className="mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span className="text-blue-800">{item}</span>
                </li>
              ))}
            </ul>
        </div>
        )}

        {/* Required Documents */}
        {loan.required_documents && loan.required_documents.length > 0 && (
        <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Shield className="mr-2 text-purple-600" size={20} />
              Required Documents
            </h4>
            <ul className="space-y-3">
              {loan.required_documents.map((doc, index) => (
                <li key={index} className="flex items-start bg-purple-50 p-3 rounded-lg">
                  <Check size={16} className="mr-3 mt-0.5 text-purple-500 flex-shrink-0" />
                  <span className="text-purple-800">{doc}</span>
                </li>
              ))}
            </ul>
        </div>
        )}

        {/* Action Button */}
        <div className="border-t border-gray-100 pt-6">
          <a 
            href={loan.site_visit_url || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-6 py-4 rounded-xl text-lg font-semibold hover:from-[#2d325f] hover:to-[#1B1F3B] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
                                              Get Car Loan
            <ArrowUpRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

const CarLoansPage: React.FC = () => {
  const [carLoans, setCarLoans] = useState<CarLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('interest_rate_min');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    banks: [] as string[],
    loanAmount: [] as string[],
    loanTerm: [] as string[],
    interestRate: [] as string[],
    fees: [] as string[],
    special: [] as string[],
    vehicleType: [] as string[],
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
    loanAmount: 1000000,
    loanTerm: 5,
    vehicleType: 'new',
    vehicleCategory: 'non-hybrid'
  });
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<CarLoan | null>(null);

  useEffect(() => {
    fetchCarLoans();
  }, []);

  const fetchCarLoans = async () => {
      setLoading(true);
    try {
      const { data, error } = await supabase
        .from('car_loans')
        .select('*')
        .order('interest_rate_min', { ascending: true });

      if (error) throw error;
      if (data) {
        setCarLoans(data);
      }
    } catch (error) {
      console.error('Error fetching car loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value == null) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  const calculateMonthlyRepayment = (loanAmount: number, annualInterestRate: number, years: number): number => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    const monthlyPayment = 
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return Math.round(monthlyPayment * 100) / 100;
  };

  const getEffectiveInterestRate = (loan: CarLoan): number => {
    if (loan.interest_rate_min && loan.interest_rate_max) {
      return (loan.interest_rate_min + loan.interest_rate_max) / 2;
    }
    return loan.interest_rate_min || loan.interest_rate_max || 12;
  };

  const getEffectiveLoanTerm = (loan: CarLoan, vehicleType: 'new' | 'reconditioned'): number => {
    return vehicleType === 'new' ? loan.loan_tenure_new_vehicle : loan.loan_tenure_recondition_vehicle;
  };

  const handleCalculatorInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setCalculatorInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const toggleFilter = (filterName: string) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const clearAllFilters = () => {
    setFilters({
      banks: [],
      loanAmount: [],
      loanTerm: [],
      interestRate: [],
      fees: [],
      special: [],
      vehicleType: [],
    });
  };

  const getActiveFilterCount = () => {
    return filters.banks.length + 
           filters.loanAmount.length + 
           filters.loanTerm.length + 
           filters.interestRate.length + 
           filters.fees.length + 
           filters.special.length + 
           filters.vehicleType.length;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCompareToggle = (loanId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(loanId)) {
        return prev.filter(id => id !== loanId);
      }
      if (prev.length < 2) {
        return [...prev, loanId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      setIsCompareModalOpen(true);
    }
  };

  const sortedLoans = [...carLoans].sort((a, b) => {
    if (sortField === 'monthly_repayment') {
      const rateA = getEffectiveInterestRate(a);
      const rateB = getEffectiveInterestRate(b);
      const termA = getEffectiveLoanTerm(a, calculatorInputs.vehicleType);
      const termB = getEffectiveLoanTerm(b, calculatorInputs.vehicleType);
      
      const repaymentA = calculateMonthlyRepayment(calculatorInputs.loanAmount, rateA, termA);
      const repaymentB = calculateMonthlyRepayment(calculatorInputs.loanAmount, rateB, termB);
      
      return sortDirection === 'asc' ? repaymentA - repaymentB : repaymentB - repaymentA;
    }

    const valA = a[sortField] ?? 0;
    const valB = b[sortField] ?? 0;

    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  const filteredLoans = sortedLoans.filter(loan => {
    // Bank filter
    if (filters.banks.length > 0) {
      if (!filters.banks.includes(loan.brand)) return false;
    }

    // Loan amount filter (based on calculator input)
    if (filters.loanAmount.length > 0) {
      const amount = calculatorInputs.loanAmount;
      const matchesAmount = filters.loanAmount.some(range => {
        switch (range) {
          case 'up-to-500k': return amount <= 500000;
          case '500k-1m': return amount > 500000 && amount <= 1000000;
          case '1m-2m': return amount > 1000000 && amount <= 2000000;
          case '2m-plus': return amount > 2000000;
          default: return false;
        }
      });
      if (!matchesAmount) return false;
    }

    // Loan term filter
    if (filters.loanTerm.length > 0) {
      const effectiveTerm = calculatorInputs.loanTerm;
      const matchesTerm = filters.loanTerm.some(term => {
        switch (term) {
          case '1-3': return effectiveTerm <= 3;
          case '3-5': return effectiveTerm > 3 && effectiveTerm <= 5;
          case '5-7': return effectiveTerm > 5 && effectiveTerm <= 7;
          case '7-plus': return effectiveTerm > 7;
          default: return false;
        }
      });
      if (!matchesTerm) return false;
    }

    // Interest rate filter
    if (filters.interestRate.length > 0) {
      const effectiveRate = getEffectiveInterestRate(loan);
      const matchesRate = filters.interestRate.some(range => {
        switch (range) {
          case '0-8': return effectiveRate <= 8;
          case '8-12': return effectiveRate > 8 && effectiveRate <= 12;
          case '12-16': return effectiveRate > 12 && effectiveRate <= 16;
          case '16-plus': return effectiveRate > 16;
          default: return false;
        }
      });
      if (!matchesRate) return false;
    }

    // Fee preferences filter
    if (filters.fees.length > 0) {
      const matchesFees = filters.fees.some(preference => {
        switch (preference) {
          case 'no-processing-fee': return !loan.processing_fee_percentage || loan.processing_fee_percentage === 0;
          case 'no-early-settlement-fee': return !loan.early_settlement_fee || loan.early_settlement_fee === 0;
          case 'low-total-fees': 
            const totalFees = (loan.processing_fee_max || 0) + (loan.early_settlement_fee || 0);
            return totalFees <= 5000;
          default: return false;
        }
      });
      if (!matchesFees) return false;
    }

    // Special options filter
    if (filters.special.length > 0) {
      const matchesSpecial = filters.special.some(option => {
        switch (option) {
          case 'recommended': return loan.recommended;
          case 'promoted': return loan.promoted;
          default: return false;
        }
      });
      if (!matchesSpecial) return false;
    }

    // Vehicle type filter
    if (filters.vehicleType.length > 0) {
      // This would be based on loan-to-value ratios or specific vehicle features
      // For now, we'll include all loans as the filter affects calculator inputs
    }
    
    return true;
  });

  const selectedLoans = carLoans.filter(loan => selectedForComparison.includes(loan.id));
  const activeFilterCount = getActiveFilterCount();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <SEO 
        title="Best Car Loans Bangladesh 2025 | Compare Auto Loan Interest Rates & Car Dealers"
        description="Compare car loan interest rates from top banks in Bangladesh. Find best car dealers near me, Range Rover prices, cars for sale & buy sell cars with lowest auto financing rates. Get instant approval for new & used car loans."
        keywords="car dealers near me, range rover price, car loan, car loan bangladesh, cars for sale, sell car, car loan interest rates, buy and sell cars, car finance interest rates"
        pageType="car-loans"
        canonical="https://kontanibo.com/car-loans"
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1B1F3B] via-[#2d325f] to-[#1B1F3B] text-white py-8 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-6xl font-extrabold mb-2 md:mb-4 tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Best Car Loans Bangladesh 2025: Compare Auto Loan Rates & Apply Online
            </h1>
            <p className="text-sm md:text-xl font-medium text-blue-100 mb-4 md:mb-8">
              Compare {carLoans.length}+ car loan interest rates from top banks. Find car dealers near me, Range Rover prices & cars for sale with lowest auto financing rates.
            </p>
          </motion.div>
          
          {/* Calculator Section */}
          <motion.div 
            className="mt-4 md:mt-6 bg-[#EBF5FF] rounded-xl p-3 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              {/* Borrowing Amount Input */}
              <div className="md:col-span-5">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex flex-col px-3 py-1">
                    <div className="text-xs text-gray-600 -mb-0.5">Borrowing amount</div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">৳</span>
                      <input
                        type="number"
                        value={calculatorInputs.loanAmount}
                        onChange={(e) => handleCalculatorInputChange('loanAmount', e.target.value)}
                        className="w-[calc(100%-12px)] text-base font-medium text-gray-900 focus:outline-none py-0.5"
                        placeholder="500,000"
                      />
                    </div>
                    <div className="mt-0.5">
                      <input
                        type="range"
                        min="100000"
                        max="7000000"
                        step="100000"
                        value={calculatorInputs.loanAmount}
                        onChange={(e) => handleCalculatorInputChange('loanAmount', e.target.value)}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B1F3B]"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 -mt-0.5">
                        <span>1L</span>
                        <span>70L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Period Input */}
              <div className="md:col-span-4">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="flex flex-col px-3 py-1">
                    <div className="text-xs text-gray-600 -mb-0.5">Period</div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={calculatorInputs.loanTerm}
                        onChange={(e) => handleCalculatorInputChange('loanTerm', e.target.value)}
                        className="w-12 text-base font-medium text-gray-900 focus:outline-none py-0.5"
                        min="1"
                        max="7"
                      />
                      <span className="text-xs text-gray-600 ml-1">years</span>
                    </div>
                    <div className="mt-0.5">
                      <input
                        type="range"
                        min="1"
                        max="7"
                        step="1"
                        value={calculatorInputs.loanTerm}
                        onChange={(e) => handleCalculatorInputChange('loanTerm', e.target.value)}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1B1F3B]"
                      />
                      <div className="flex justify-between text-[10px] text-gray-500 -mt-0.5">
                        <span>1yr</span>
                        <span>7yrs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <div className="md:col-span-3">
                <button
                  onClick={() => {
                    const element = document.querySelector('[data-loan-cards]');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full h-full min-h-[52px] bg-[#1B1F3B] text-white font-bold rounded-lg hover:bg-[#2d325f] transition-colors text-sm"
                >
                  CALCULATE
                </button>
              </div>
            </div>
          </motion.div>
                </div>
              </div>
              
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 lg:py-12" data-loan-cards>
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between touch-manipulation relative"
            >
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-[#1B1F3B]" />
                <span className="font-semibold text-gray-900">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
            </button>
                      </div>
                      
          {/* Filter Column */}
          <div className="lg:w-1/4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}
            >
              <div className="bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Filter size={20} className="md:w-6 md:h-6" />
                    <h2 className="text-lg md:text-xl font-bold">Refine Results</h2>
                        </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-blue-200 hover:text-white underline"
                    >
                      Clear All ({activeFilterCount})
                    </button>
                  )}
                        </div>
                <p className="text-blue-100 text-sm mt-1 hidden md:block">Filter loans by your preferences</p>
                        </div>
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                      
                {/* Bank Filter */}
                <div className="border-b border-gray-100 pb-6">
                      <button
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('banks')}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Banks</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'banks' ? 'rotate-180' : ''}`} />
                      </button>
                  
                <AnimatePresence>
                    {expandedFilter === 'banks' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3 max-h-40 overflow-y-auto"
                    >
                        {['AB Bank', 'Bank Asia', 'BRAC Bank', 'City Bank', 'Dhaka Bank', 'Dutch Bangla Bank', 'Eastern Bank Limited (EBL)', 'Jamuna Bank', 'NCC Bank', 'Premier Bank', 'Prime Bank', 'Standard Bank', 'Trust Bank', 'UCB Bank'].map(bank => (
                          <label key={bank} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors touch-manipulation">
                        <input
                          type="checkbox"
                              className="mr-3 rounded text-blue-500 focus:ring-blue-500 w-4 h-4" 
                              checked={filters.banks.includes(bank)}
                          onChange={(e) => {
                            if (e.target.checked) {
                                  setFilters({...filters, banks: [...filters.banks, bank]});
                            } else {
                                  setFilters({...filters, banks: filters.banks.filter(b => b !== bank)});
                            }
                          }}
                        />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{bank}</span>
                      </label>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
                    </div>

              {/* Loan Amount Filter */}
                <div className="border-b border-gray-100 pb-6">
                <button
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                  onClick={() => toggleFilter('loanAmount')}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Loan Amount</span>
              </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'loanAmount' ? 'rotate-180' : ''}`} />
                </button>
                  
                <AnimatePresence>
                {expandedFilter === 'loanAmount' && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3"
                      >
                        {[
                          { id: 'up-to-500k', label: 'Up to ৳5L' },
                          { id: '500k-1m', label: '৳5L - ৳10L' },
                          { id: '1m-2m', label: '৳10L - ৳20L' },
                          { id: '2m-plus', label: '৳20L+' },
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-green-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-green-500 focus:ring-green-500 w-4 h-4" 
                              checked={filters.loanAmount.includes(id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, loanAmount: [...filters.loanAmount, id]});
                                } else {
                                  setFilters({...filters, loanAmount: filters.loanAmount.filter(a => a !== id)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                          </label>
                        ))}
           </motion.div>
                    )}
                  </AnimatePresence>
         </div>

                {/* Loan Term Filter */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('loanTerm')}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-purple-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Loan Term</span>
       </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'loanTerm' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'loanTerm' && (
                      <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                      >
                        {[
                          { id: '1-3', label: '1-3 years' },
                          { id: '3-5', label: '3-5 years' },
                          { id: '5-7', label: '5-7 years' },
                          { id: '7-plus', label: '7+ years' },
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors touch-manipulation">
                        <input
                          type="checkbox"
                              className="mr-3 rounded text-purple-500 focus:ring-purple-500 w-4 h-4" 
                              checked={filters.loanTerm.includes(id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                                  setFilters({...filters, loanTerm: [...filters.loanTerm, id]});
                            } else {
                                  setFilters({...filters, loanTerm: filters.loanTerm.filter(t => t !== id)});
                            }
                          }}
                        />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                      </label>
                        ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>
              
                {/* Interest Rate Filter */}
                <div className="border-b border-gray-100 pb-6">
                <button
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('interestRate')}
                  >
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Interest Rate</span>
            </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'interestRate' ? 'rotate-180' : ''}`} />
                </button>
                  
                <AnimatePresence>
                    {expandedFilter === 'interestRate' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                    >
                        {[
                          { id: '0-8', label: '0-8%' },
                          { id: '8-12', label: '8-12%' },
                          { id: '12-16', label: '12-16%' },
                          { id: '16-plus', label: '16%+' },
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors touch-manipulation">
                        <input
                          type="checkbox"
                              className="mr-3 rounded text-yellow-500 focus:ring-yellow-500 w-4 h-4" 
                              checked={filters.interestRate.includes(id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                                  setFilters({...filters, interestRate: [...filters.interestRate, id]});
                            } else {
                                  setFilters({...filters, interestRate: filters.interestRate.filter(r => r !== id)});
                            }
                          }}
                        />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                      </label>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>

                {/* Fee Preferences Filter */}
                <div className="border-b border-gray-100 pb-6">
                <button
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('fees')}
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-red-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Fee Preferences</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'fees' ? 'rotate-180' : ''}`} />
                </button>
                  
                <AnimatePresence>
                    {expandedFilter === 'fees' && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-3"
                      >
                        {[
                          { id: 'no-processing-fee', label: 'No Processing Fee' },
                          { id: 'no-early-settlement-fee', label: 'No Early Settlement Fee' },
                          { id: 'low-total-fees', label: 'Low Total Fees' },
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-red-500 focus:ring-red-500 w-4 h-4" 
                              checked={filters.fees.includes(id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, fees: [...filters.fees, id]});
                                } else {
                                  setFilters({...filters, fees: filters.fees.filter(f => f !== id)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Special Options Filter */}
                <div>
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('special')}
                  >
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-indigo-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Special Options</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'special' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'special' && (
                      <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                    >
                        {[
                          { id: 'recommended', label: 'Recommended Only' },
                          { id: 'promoted', label: 'Promoted Offers' },
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors touch-manipulation">
                        <input
                          type="checkbox"
                              className="mr-3 rounded text-indigo-500 focus:ring-indigo-500 w-4 h-4" 
                              checked={filters.special.includes(id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                                  setFilters({...filters, special: [...filters.special, id]});
                            } else {
                                  setFilters({...filters, special: filters.special.filter(s => s !== id)});
                            }
                          }}
                        />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                      </label>
                        ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>
            </div>
            </motion.div>
          </div>

          {/* Results Column */}
          <div className="lg:w-3/4">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-12 rounded-2xl shadow-lg flex justify-center"
              >
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-6"></div>
                  <p className="text-gray-600 text-lg font-medium">Loading car loans...</p>
                  <p className="text-gray-400 text-sm mt-2">Finding the best rates for you</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
                >
              <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                      {filteredLoans.length} Car Loans Available
                    </h3>
                  <p className="text-sm md:text-base text-gray-600">
                      Showing {filteredLoans.length} of {carLoans.length} loans matching your criteria
                  </p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="md:w-4 md:h-4" />
                      <span>Updated daily</span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live rates</span>
                  </div>
                </motion.div>

                    {/* Mobile Sort Dropdown */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
                  <div className="p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
                      <select
                        value={`${sortField}-${sortDirection}`}
                        onChange={(e) => {
                        const [field, direction] = e.target.value.split('-');
                        setSortField(field as SortField);
                        setSortDirection(direction as 'asc' | 'desc');
                        }}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                      >
                        <option value="interest_rate_min-asc">Interest Rate (Low to High)</option>
                        <option value="interest_rate_min-desc">Interest Rate (High to Low)</option>
                        <option value="max_loan_amount-asc">Max Amount (Low to High)</option>
                      <option value="max_loan_amount-desc">Max Amount (High to Low)</option>
                        <option value="monthly_repayment-asc">Monthly Payment (Low to High)</option>
                        <option value="monthly_repayment-desc">Monthly Payment (High to Low)</option>
                      </select>
                    </div>
                </div>

                {/* Loan cards */}
                <div className="space-y-6">
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan, index) => (
                      <motion.div 
                        key={loan.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white shadow-lg rounded-xl overflow-hidden relative border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                      >
                        {loan.recommended && (
                          <div className="absolute -left-8 top-4 z-10">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-1 text-xs font-bold transform -rotate-45 shadow-lg tracking-wider" style={{ width: '140px', paddingLeft: 'calc(2.5rem - 3px)' }}>
                              RECOMMENDED
                            </div>
                          </div>
                        )}
                        {loan.promoted && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1.5 text-xs font-semibold">
                            ⭐ PROMOTED OFFER
                          </div>
                        )}
                        <div className="p-3 md:p-4">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
                            {/* Logo and Basic Info */}
                            <div className="md:col-span-3">
                              <div className="flex md:flex-col items-center md:items-start gap-2">
                                <div className="w-16 h-10 md:w-24 md:h-14 mb-0 md:mb-2 flex items-center justify-center flex-shrink-0">
                                  {loan.logo_url ? (
                                    <img 
                                      src={loan.logo_url} 
                                      alt={`${loan.brand} ${loan.product_name}`}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                                      <Car size={16} className="md:w-5 md:h-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 md:flex-none">
                                  <h3 className="text-sm font-bold tracking-tight text-[#1B1F3B] mb-0.5 group-hover:text-blue-600 transition-colors">{loan.brand}</h3>
                                  <p className="text-xs text-gray-600">{loan.product_name}</p>
                                </div>
                              </div>
                              {/* Score Meter */}
                              <div className="mt-2 flex justify-center md:justify-start">
                                {typeof loan.score === 'number' ? (
                                  <Speedometer value={loan.score} maxValue={10} size={40} label="Score" />
                                ) : (
                                  <div className="text-gray-400 text-xs">No score available</div>
                              )}
                              </div>
                            </div>

                            {/* Key Features */}
                            <div className="md:col-span-5 space-y-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Star className="text-yellow-500" size={12} />
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Key Features</h4>
                                  </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-1.5 rounded">
                                  <div className="text-xs text-gray-600">Interest Rate (p.a.)</div>
                                  <div className="text-sm font-bold text-[#1B1F3B]">
                                    {loan.interest_rate_min && loan.interest_rate_max 
                                      ? `${formatPercentage(loan.interest_rate_min)} - ${formatPercentage(loan.interest_rate_max)}`
                                      : formatPercentage(loan.interest_rate_min || loan.interest_rate_max || 0) || 'Contact Bank'
                                    }
                                </div>
                                  </div>
                                <div className="bg-gray-50 p-1.5 rounded">
                                  <div className="text-xs text-gray-600">Max Loan Amount</div>
                                  <div className="text-sm font-bold text-[#1B1F3B]">{formatCurrency(loan.max_loan_amount)}</div>
                                </div>
                              </div>

                              {loan.features && loan.features.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {loan.features.slice(0, 4).map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-[10px] text-gray-600 bg-green-50 px-1.5 py-0.5 rounded">
                                      <Check size={10} className="text-green-500 mr-0.5" />
                                      {feature}
                                    </div>
                                  ))}
                                  {loan.features.length > 4 && (
                                    <div className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                      +{loan.features.length - 4} more
                                  </div>
                                  )}
                                </div>
                              )}

                              {/* Loan Term and Details */}
                              <div className="bg-blue-50 p-1.5 rounded text-[10px]">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Calculator size={10} className="text-blue-500" />
                                  <span className="font-semibold text-gray-700">Loan Details</span>
                                </div>
                                <div className="grid grid-cols-1 gap-0.5">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">New Vehicle:</span>
                                    <span className="text-gray-900">{loan.loan_tenure_new_vehicle} years</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Reconditioned:</span>
                                    <span className="text-gray-900">{loan.loan_tenure_recondition_vehicle} years</span>
                                  </div>
                              </div>
                            </div>

                              {loan.pros && loan.pros.length > 0 && (
                                <div className="text-[10px] text-gray-600">
                                  <span className="font-medium text-green-600">Pros:</span> {loan.pros[0]}
                                </div>
                              )}
                                </div>

                            {/* Monthly Repayment Calculation */}
                            <div className="md:col-span-4">
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 border border-blue-100 mb-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Calculator size={12} className="text-blue-500" />
                                  <div className="text-xs text-gray-600 font-medium">Monthly Repayment</div>
                                </div>
                                {((): React.ReactNode => {
                                  const effectiveRate = getEffectiveInterestRate(loan);
                                  const effectiveTerm = calculatorInputs.loanTerm;
                                  const usedDefaultRate = !loan.interest_rate_min && !loan.interest_rate_max;
                                  const monthlyPayment = calculateMonthlyRepayment(
                                    calculatorInputs.loanAmount,
                                    effectiveRate,
                                    effectiveTerm
                                  );
                                  return (
                                    <>
                                      <div className="text-base font-bold text-[#1B1F3B]">
                                        {formatCurrency(monthlyPayment)}
                              </div>
                                      <div className="text-[10px] text-blue-600">
                                        {formatPercentage(effectiveRate)} over {effectiveTerm} years
                              </div>
                                      {usedDefaultRate && (
                                        <div className="text-[10px] text-orange-500 font-semibold mt-1">Used Avg interest rate</div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>

                              <div className="grid grid-cols-1 gap-1.5">
                                <a 
                                  href={loan.site_visit_url || '#'} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group touch-manipulation"
                                >
                                  Get Car Loan
                                  <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </a>
                                <button
                                  onClick={() => setSelectedLoan(loan)}
                                  className="w-full border border-[#1B1F3B] text-[#1B1F3B] px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#1B1F3B] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group touch-manipulation"
                                >
                                  View Details
                                  <ArrowRight size={12} className="group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 px-3 md:px-4 lg:px-5 py-2 md:py-3 bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id={`compare-${loan.id}`} 
                                className="mr-2 md:mr-3 rounded text-blue-500 focus:ring-blue-500 w-4 h-4"
                                checked={selectedForComparison.includes(loan.id)}
                                onChange={() => handleCompareToggle(loan.id)}
                                disabled={selectedForComparison.length >= 2 && !selectedForComparison.includes(loan.id)}
                              />
                              <label htmlFor={`compare-${loan.id}`} className="text-xs md:text-sm font-medium text-gray-700 cursor-pointer touch-manipulation">
                                Add to Compare
                              </label>
                            </div>
                            {selectedForComparison.includes(loan.id) && (
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                Selected
                              </div>
                            )}
                          </div>
                          {selectedForComparison.length === 2 && selectedForComparison.includes(loan.id) && (
                            <button
                              onClick={handleCompare}
                              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
                            >
                              <Grid size={14} />
                              Compare Now
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-100"
                    >
                      <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Car size={32} className="text-gray-400" />
                      </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No loans match your criteria</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your filters to see more loan options</p>
                        <button
                          onClick={clearAllFilters}
                          className="bg-[#1B1F3B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d325f] transition-colors"
                        >
                          Clear All Filters
                        </button>
                    </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-8 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Car Loan Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <Car className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Car Loan Interest Rates Bangladesh</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Compare the best car loan interest rates from top banks in Bangladesh. Get competitive auto financing rates starting from 8.5% to 16% per annum for new and used cars.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>New Car Loan Rates: 8.5% - 14%</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Used Car Loan Rates: 10% - 16%</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Hybrid/Electric Car Special Rates</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <TrendingUp className="text-green-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Car Dealers Near Me & Cars for Sale</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Find authorized car dealers near you offering Range Rover, Toyota, Honda, and other premium brands. Buy and sell cars with easy financing options.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Range Rover Price & Financing</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>New & Used Cars for Sale</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Buy and Sell Cars Platform</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <Calculator className="text-purple-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Car Finance & Auto Loan Process</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Get instant car loan approval with minimal documentation. Calculate your EMI, check eligibility, and apply online for the best car finance deals.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Online Car Loan Application</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>EMI Calculator & Eligibility Check</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Quick Approval & Disbursement</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Banks for Car Loans */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="text-yellow-500 mr-3" size={28} />
              Top Banks for Car Loans in Bangladesh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['BRAC Bank', 'City Bank', 'Dutch Bangla Bank', 'Eastern Bank Limited', 'Prime Bank', 'Standard Bank'].map((bank) => (
                <div key={bank} className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{bank} Car Loan</h3>
                  <div className="text-sm text-gray-600">
                    <p>✓ Competitive interest rates</p>
                    <p>✓ Quick processing</p>
                    <p>✓ Flexible repayment terms</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Car Loan Types */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Grid className="text-blue-600 mr-3" size={28} />
              Types of Car Loans Available
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">New Car Loans</h3>
                  <p className="text-gray-600 text-sm">Finance your brand new car with attractive interest rates and longer repayment terms up to 7 years.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Used Car Loans</h3>
                  <p className="text-gray-600 text-sm">Get financing for pre-owned vehicles with competitive rates and flexible terms up to 5 years.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Reconditioned Car Loans</h3>
                  <p className="text-gray-600 text-sm">Special financing options for imported reconditioned vehicles with tailored loan terms.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Hybrid & Electric Car Loans</h3>
                  <p className="text-gray-600 text-sm">Eco-friendly financing with special rates and higher loan-to-value ratios for green vehicles.</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Luxury Car Financing</h3>
                  <p className="text-gray-600 text-sm">Premium financing solutions for luxury brands like Range Rover, BMW, Mercedes-Benz, and Audi.</p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Commercial Vehicle Loans</h3>
                  <p className="text-gray-600 text-sm">Business vehicle financing for commercial use with attractive rates and extended terms.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Footer Section */}
      <div className="bg-gradient-to-br from-[#1B1F3B] to-[#2d325f] text-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Car Loan Rates */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Car Loan Interest Rates</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ Best car loan rates Bangladesh</p>
                <p className="text-gray-300">✓ Low interest car loan 8.5%</p>
                <p className="text-gray-300">✓ Car finance interest rates comparison</p>
                <p className="text-gray-300">✓ Auto loan interest rates 2024</p>
                <p className="text-gray-300">✓ Car loan calculator with EMI</p>
                <p className="text-gray-300">✓ Zero down payment car loan</p>
              </div>
            </div>

            {/* Car Dealers & Sales */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Car Dealers & Sales</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ Car dealers near me Bangladesh</p>
                <p className="text-gray-300">✓ Range Rover price in Bangladesh</p>
                <p className="text-gray-300">✓ New cars for sale Dhaka</p>
                <p className="text-gray-300">✓ Used cars for sale Bangladesh</p>
                <p className="text-gray-300">✓ Buy and sell cars online</p>
                <p className="text-gray-300">✓ Car showroom near me</p>
              </div>
            </div>

            {/* Loan Types */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Car Loan Types</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ New car loan Bangladesh</p>
                <p className="text-gray-300">✓ Used car loan rates</p>
                <p className="text-gray-300">✓ Reconditioned car loan</p>
                <p className="text-gray-300">✓ Hybrid car loan special rates</p>
                <p className="text-gray-300">✓ Electric car financing</p>
                <p className="text-gray-300">✓ Luxury car loan Range Rover</p>
              </div>
            </div>

            {/* Banks & Process */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Top Banks & Process</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ BRAC Bank car loan</p>
                <p className="text-gray-300">✓ City Bank auto loan</p>
                <p className="text-gray-300">✓ Dutch Bangla Bank car finance</p>
                <p className="text-gray-300">✓ Online car loan application</p>
                <p className="text-gray-300">✓ Quick car loan approval</p>
                <p className="text-gray-300">✓ Car loan eligibility check</p>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-8 pt-8 border-t border-blue-800">
            <h3 className="text-lg font-bold mb-4 text-blue-200">Popular Car Loan Searches</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'car loan bangladesh', 'car dealers near me', 'range rover price', 'cars for sale',
                'buy and sell cars', 'car loan interest rates', 'car finance rates', 'auto loan',
                'vehicle financing', 'car loan calculator', 'best car loan rates', 'new car loan',
                'used car loan', 'car loan eligibility', 'online car loan', 'quick car loan approval',
                'car loan emi calculator', 'car loan documents', 'car loan process', 'zero down payment',
                'low interest car loan', 'car loan comparison', 'instant car loan', 'car refinancing'
              ].map((term, index) => (
                <span key={index} className="bg-blue-800 text-blue-200 px-3 py-1 rounded-full text-xs">
                  {term}
                </span>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 pt-6 border-t border-blue-800 text-center">
            <p className="text-gray-400 text-sm">
              Car loan interest rates and terms are subject to change. Please verify current rates with respective banks. 
              Konta Nibo helps you compare the best car loan deals in Bangladesh for informed financial decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <CompareModal
          loans={selectedLoans}
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}
      
      <InfoDrawer
        loan={selectedLoan}
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
      />
    </motion.div>
  );
};

// Simple Compare Modal Component
const CompareModal: React.FC<CompareModalProps> = ({ loans, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value == null) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Car Loan Comparison</h2>
            <p className="text-gray-600 mt-1">Compare selected car loans side by side</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loans.map(loan => (
              <div key={loan.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">{loan.brand}</h3>
                  {loan.recommended && <Award className="text-yellow-500" size={20} />}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Interest Rate</span>
                    <span className="font-semibold">{formatPercentage(loan.interest_rate_min)} - {formatPercentage(loan.interest_rate_max)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Max Loan Amount</span>
                    <span className="font-semibold">{formatCurrency(loan.max_loan_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">New Vehicle Term</span>
                    <span className="font-semibold">{loan.loan_tenure_new_vehicle} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processing Fee</span>
                    <span className="font-semibold">{formatPercentage(loan.processing_fee_percentage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Min Income</span>
                    <span className="font-semibold">{formatCurrency(loan.minimum_income)}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <a 
                    href={loan.site_visit_url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-[#2d325f] hover:to-[#1B1F3B] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Get Car Loan
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CarLoansPage; 
