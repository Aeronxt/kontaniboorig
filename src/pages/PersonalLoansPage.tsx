import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronDown, Filter, X, CreditCard, ArrowRight, ArrowUpRight, Check, Calculator, Star, TrendingUp, Shield, Award, Clock, DollarSign, Calendar, Grid, Info, Eye } from 'lucide-react';
import Speedometer from '../components/Speedometer';
import SEO from '../components/SEO';
import { generateSEO } from '../constants/seo';

interface PersonalLoan {
  id: string;
  brand: string;
  product_name: string;
  interest_rate_pa: number;
  comparison_rate_pa: number;
  application_fee: number | null;
  monthly_fee: number | null;
  tagline: string | null;
  features: string[] | null;
  description: string | null;
  recommended: boolean;
  promoted: boolean;
  loan_term_max: number | null;
  score: number | null;
  pros: string[] | null;
  cons: string[] | null;
  eligibility: string[] | null;
  required_documents: string[] | null;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  } | null;
  logo_url: string | null;
  site_visit_url: string | null;
  max_amount: number | null;
}

interface CompareModalProps {
  loans: PersonalLoan[];
  isOpen: boolean;
  onClose: () => void;
}

interface InfoDrawerProps {
  loan: PersonalLoan | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CalculatorInputs {
  loanAmount: number;
  loanTerm: number;
}

type SortField = 'interest_rate_pa' | 'comparison_rate_pa' | 'monthly_repayment' | 'loan_term_max';

const InfoDrawer: React.FC<InfoDrawerProps> = ({ loan, isOpen, onClose }) => {
  if (!loan || !isOpen) return null;

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[520px] bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-100">
      <div className="p-4 md:p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Loan Details</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Logo and basic info */}
        <div className="mb-6 md:mb-8">
          {/* Mobile: Horizontal layout */}
          <div className="md:hidden flex items-start gap-3 mb-4">
            <div className="w-20 h-12 flex items-center justify-center flex-shrink-0">
              {loan.logo_url ? (
                <img 
                  src={loan.logo_url} 
                  alt={`${loan.brand} ${loan.product_name}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                  <CreditCard size={24} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{loan.brand} {loan.product_name}</h3>
              {loan.tagline && <p className="text-gray-600 text-sm leading-relaxed">{loan.tagline}</p>}
            </div>
          </div>

          {/* Desktop: Vertical layout */}
          <div className="hidden md:block">
            <div className="w-56 h-36 mb-6 flex items-center justify-center">
              {loan.logo_url ? (
                <img 
                  src={loan.logo_url} 
                  alt={`${loan.brand} ${loan.product_name}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                  <CreditCard size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{loan.brand} {loan.product_name}</h3>
            {loan.tagline && <p className="text-gray-600 text-lg">{loan.tagline}</p>}
          </div>
        </div>

        {/* Key rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl border border-blue-200">
            <div className="text-xs md:text-sm font-medium text-blue-700 mb-1">Interest Rate (p.a.)</div>
            <div className="text-2xl md:text-3xl font-bold text-blue-900">{formatPercentage(loan.interest_rate_pa)}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-xl border border-green-200">
            <div className="text-xs md:text-sm font-medium text-green-700 mb-1">Comparison Rate (p.a.)</div>
            <div className="text-2xl md:text-3xl font-bold text-green-900">{formatPercentage(loan.comparison_rate_pa)}</div>
          </div>
        </div>

        {/* Features */}
        {loan.features && loan.features.length > 0 && (
        <div className="mb-6 md:mb-8">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center text-gray-900">
              <Award className="mr-2 text-blue-600" size={18} />
              Features
            </h4>
            <div className="space-y-2 md:space-y-3">
              {loan.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <Check size={14} className="mr-2 md:mr-3 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-sm md:text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Fees */}
        <div className="mb-6 md:mb-8">
          <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center text-gray-900">
            <TrendingUp className="mr-2 text-purple-600" size={18} />
            Fees
          </h4>
          <div className="bg-gray-50 rounded-xl p-3 md:p-4">
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center py-2 md:py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium text-sm md:text-base">Application Fee</span>
                <span className="font-semibold text-gray-900 text-sm md:text-base">{formatCurrency(loan.application_fee)}</span>
            </div>
              <div className="flex justify-between items-center py-2 md:py-3">
                <span className="text-gray-600 font-medium text-sm md:text-base">Monthly Fee</span>
                <span className="font-semibold text-gray-900 text-sm md:text-base">{formatCurrency(loan.monthly_fee)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pros and Cons */}
        {(loan.pros || loan.cons) && (
          <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6 md:mb-8">
            {loan.pros && loan.pros.length > 0 && (
          <div>
                <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center text-green-700">
                  <Check className="mr-2" size={18} />
                  Pros
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {loan.pros.map((pro, index) => (
                    <li key={index} className="flex items-start bg-green-50 p-3 rounded-lg">
                      <Check size={14} className="mr-2 md:mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                      <span className="text-green-800 text-sm md:text-base">{pro}</span>
                </li>
              ))}
            </ul>
          </div>
            )}
            {loan.cons && loan.cons.length > 0 && (
          <div>
                <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center text-red-700">
                  <X className="mr-2" size={18} />
                  Cons
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {loan.cons.map((con, index) => (
                    <li key={index} className="flex items-start bg-red-50 p-3 rounded-lg">
                      <X size={14} className="mr-2 md:mr-3 mt-0.5 text-red-500 flex-shrink-0" />
                      <span className="text-red-800 text-sm md:text-base">{con}</span>
                </li>
              ))}
            </ul>
          </div>
            )}
        </div>
        )}

        {/* Eligibility */}
        {loan.eligibility && loan.eligibility.length > 0 && (
        <div className="mb-6 md:mb-8">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center text-gray-900">
              <Shield className="mr-2 text-blue-600" size={18} />
              Eligibility
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {loan.eligibility.map((item, index) => (
                <li key={index} className="flex items-start bg-blue-50 p-3 rounded-lg">
                  <Check size={14} className="mr-2 md:mr-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span className="text-blue-800 text-sm md:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        )}

        {/* Required Documents */}
        {loan.required_documents && loan.required_documents.length > 0 && (
        <div className="mb-6 md:mb-8">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center text-gray-900">
              <Clock className="mr-2 text-orange-600" size={18} />
              Required Documents
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {loan.required_documents.map((doc, index) => (
                <li key={index} className="flex items-start bg-orange-50 p-3 rounded-lg">
                  <Check size={14} className="mr-2 md:mr-3 mt-0.5 text-orange-500 flex-shrink-0" />
                  <span className="text-orange-800 text-sm md:text-base">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
        )}

        {/* Description */}
        {loan.description && (
          <div className="mb-6 md:mb-8">
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-900">About this Loan</h4>
            <div className="bg-gray-50 p-3 md:p-4 rounded-xl">
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">{loan.description}</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="sticky bottom-0 bg-white pt-4 md:pt-6 border-t border-gray-100">
          <a 
            href={loan.site_visit_url || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-4 md:px-6 py-3 md:py-4 rounded-xl text-sm font-semibold hover:from-[#2d325f] hover:to-[#1B1F3B] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 touch-manipulation"
          >
            Visit Lender Site
            <ArrowUpRight size={16} className="md:hidden" />
            <ArrowUpRight size={18} className="hidden md:block" />
          </a>
        </div>
      </div>
    </div>
  );
};

const PersonalLoansPage: React.FC = () => {
  const [personalLoans, setPersonalLoans] = useState<PersonalLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('interest_rate_pa');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    banks: [] as string[],
    loanAmount: [] as string[],
    loanTerm: [] as string[],
    interestRate: [] as string[],
    fees: [] as string[],
    special: [] as string[],
    features: [] as string[],
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<PersonalLoan | null>(null);
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
    loanAmount: 10000,
    loanTerm: 3,
  });

  useEffect(() => {
    fetchPersonalLoans();
  }, []);

  const fetchPersonalLoans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personal_loans')
        .select('*, max_amount')
        .order('interest_rate_pa', { ascending: true });

      if (error) throw error;
      if (data) {
        setPersonalLoans(data);
      }
    } catch (error) {
      console.error('Error fetching personal loans:', error);
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

  const formatPercentage = (value: number) => {
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

  const handleCalculatorInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (field === 'loanTerm' && numValue > 7) return; // Max 7 years for personal loans
    setCalculatorInputs(prev => ({
      ...prev,
      [field]: numValue
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
      features: [],
    });
  };

  const getActiveFilterCount = () => {
    return filters.banks.length + 
           filters.loanAmount.length + 
           filters.loanTerm.length + 
           filters.interestRate.length + 
           filters.fees.length + 
           filters.special.length + 
           filters.features.length;
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

  const sortedLoans = [...personalLoans].sort((a, b) => {
    if (sortField === 'monthly_repayment') {
      const repaymentA = calculateMonthlyRepayment(
        calculatorInputs.loanAmount,
        a.interest_rate_pa,
        calculatorInputs.loanTerm
      );
      const repaymentB = calculateMonthlyRepayment(
        calculatorInputs.loanAmount,
        b.interest_rate_pa,
        calculatorInputs.loanTerm
      );
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
          case 'up-to-50k': return amount <= 50000;
          case '50k-100k': return amount > 50000 && amount <= 100000;
          case '100k-500k': return amount > 100000 && amount <= 500000;
          case '500k-plus': return amount > 500000;
          default: return false;
        }
      });
      if (!matchesAmount) return false;
    }

    // Loan term filter
    if (filters.loanTerm.length > 0) {
      const matchesTerm = filters.loanTerm.some(term => {
        switch (term) {
          case '0-2': return loan.loan_term_max && loan.loan_term_max <= 24;
          case '2-5': return loan.loan_term_max && loan.loan_term_max > 24 && loan.loan_term_max <= 60;
          case '5-7': return loan.loan_term_max && loan.loan_term_max > 60 && loan.loan_term_max <= 84;
          case '7-plus': return loan.loan_term_max && loan.loan_term_max > 84;
          default: return false;
        }
      });
      if (!matchesTerm) return false;
    }

    // Interest rate filter
    if (filters.interestRate.length > 0) {
      const matchesRate = filters.interestRate.some(range => {
        switch (range) {
          case '0-5': return loan.interest_rate_pa <= 5;
          case '5-10': return loan.interest_rate_pa > 5 && loan.interest_rate_pa <= 10;
          case '10-15': return loan.interest_rate_pa > 10 && loan.interest_rate_pa <= 15;
          case '15-plus': return loan.interest_rate_pa > 15;
          default: return false;
        }
      });
      if (!matchesRate) return false;
    }

    // Fee preferences filter
    if (filters.fees.length > 0) {
      const matchesFees = filters.fees.some(preference => {
        switch (preference) {
          case 'no-application-fee': return !loan.application_fee || loan.application_fee === 0;
          case 'no-monthly-fee': return !loan.monthly_fee || loan.monthly_fee === 0;
          case 'low-total-fees': 
            const totalFees = (loan.application_fee || 0) + ((loan.monthly_fee || 0) * 12);
            return totalFees <= 1000;
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

    // Features filter
    if (filters.features.length > 0) {
      const hasFeatures = filters.features.every(feature => 
        loan.features?.includes(feature)
      );
      if (!hasFeatures) return false;
    }
    
    return true;
  });

  const selectedLoans = personalLoans.filter(loan => selectedForComparison.includes(loan.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <SEO 
        title="Best Personal Loans Bangladesh 2025 | Compare EMI Calculator & Online Loan Application"
        description="Compare personal loan interest rates from top banks in Bangladesh. Get easy loans, online loan application, quick loan approval with EMI calculator. Best bank loans for students & salaried professionals with instant approval."
        keywords="emi calculation, loan, personal loans, online loans, easy loans, loan application, bank loan, car loan, quick loans, loans for students, emi calculator, emi cal"
        pageType="personal-loans"
        canonical="https://kontanibo.com/personal-loans"
        ogUrl="https://kontanibo.com/personal-loans"
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
              Best Personal Loans Bangladesh 2025
            </h1>
            <p className="text-base md:text-xl font-medium text-blue-100 mb-4 md:mb-8">
              Compare {personalLoans.length}+ personal loan interest rates with EMI calculator. Get easy loans, online loan application & quick approval for students & professionals.
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
                    <div className="text-xs text-gray-600 -mb-0.5">Personal Loan Amount</div>
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
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold flex items-center text-gray-900">
                  <Filter className="mr-2 text-blue-600" size={18} />
                  Refine Results
                  {getActiveFilterCount() > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </h2>
                {getActiveFilterCount() > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Bank Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilter('banks')}
                  className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    Bank
                    {filters.banks.length > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {filters.banks.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform text-gray-600 ${
                      expandedFilter === 'banks' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                {expandedFilter === 'banks' && (
                    <motion.div 
                      className="mt-3 space-y-3 max-h-64 overflow-y-auto"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                    {Array.from(new Set(personalLoans.map(loan => loan.brand))).sort().map(bank => (
                        <label key={bank} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.banks.includes(bank)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                banks: [...prev.banks, bank]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                banks: prev.banks.filter(b => b !== bank)
                              }));
                            }
                          }}
                            className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                          <span className="text-gray-700 font-medium text-sm">{bank}</span>
                      </label>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Loan Amount Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilter('loanAmount')}
                  className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    Loan Amount
                    {filters.loanAmount.length > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {filters.loanAmount.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform text-gray-600 ${
                      expandedFilter === 'loanAmount' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                {expandedFilter === 'loanAmount' && (
                    <motion.div 
                      className="mt-3 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                    {[
                      { key: 'up-to-50k', label: 'Up to ৳50K' },
                      { key: '50k-100k', label: '৳50K - ৳1L' },
                      { key: '100k-500k', label: '৳1L - ৳5L' },
                      { key: '500k-plus', label: '৳5L+' }
                    ].map(range => (
                        <label key={range.key} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.loanAmount.includes(range.key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                loanAmount: [...prev.loanAmount, range.key]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                loanAmount: prev.loanAmount.filter(r => r !== range.key)
                              }));
                            }
                          }}
                            className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                          <span className="text-gray-700 font-medium">{range.label}</span>
                      </label>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Loan Term Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilter('loanTerm')}
                  className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    Loan Term
                    {filters.loanTerm.length > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {filters.loanTerm.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform text-gray-600 ${
                      expandedFilter === 'loanTerm' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                {expandedFilter === 'loanTerm' && (
                    <motion.div 
                      className="mt-3 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                    {[
                      { key: '0-2', label: '0-2 years' },
                      { key: '2-5', label: '2-5 years' },
                      { key: '5-7', label: '5-7 years' },
                      { key: '7-plus', label: '7+ years' }
                    ].map(term => (
                        <label key={term.key} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.loanTerm.includes(term.key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                loanTerm: [...prev.loanTerm, term.key]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                loanTerm: prev.loanTerm.filter(t => t !== term.key)
                              }));
                            }
                          }}
                            className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                          <span className="text-gray-700 font-medium">{term.label}</span>
                      </label>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Interest Rate Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilter('interestRate')}
                  className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    Interest Rate
                    {filters.interestRate.length > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {filters.interestRate.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform text-gray-600 ${
                      expandedFilter === 'interestRate' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                {expandedFilter === 'interestRate' && (
                    <motion.div 
                      className="mt-3 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                    {[
                      { key: '0-5', label: '0-5%' },
                      { key: '5-10', label: '5-10%' },
                      { key: '10-15', label: '10-15%' },
                      { key: '15-plus', label: '15%+' }
                    ].map(rate => (
                        <label key={rate.key} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.interestRate.includes(rate.key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                interestRate: [...prev.interestRate, rate.key]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                interestRate: prev.interestRate.filter(r => r !== rate.key)
                              }));
                            }
                          }}
                            className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                          <span className="text-gray-700 font-medium">{rate.label}</span>
                      </label>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Fee Preferences Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilter('fees')}
                  className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    Fee Preferences
                    {filters.fees.length > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {filters.fees.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform text-gray-600 ${
                      expandedFilter === 'fees' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                {expandedFilter === 'fees' && (
                    <motion.div 
                      className="mt-3 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                    {[
                      { key: 'no-application-fee', label: 'No Application Fee' },
                      { key: 'no-monthly-fee', label: 'No Monthly Fee' },
                      { key: 'low-total-fees', label: 'Low Total Fees' }
                    ].map(fee => (
                        <label key={fee.key} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.fees.includes(fee.key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                fees: [...prev.fees, fee.key]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                fees: prev.fees.filter(f => f !== fee.key)
                              }));
                            }
                          }}
                            className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                          <span className="text-gray-700 font-medium">{fee.label}</span>
                      </label>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Special Options Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilter('special')}
                  className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    Special Options
                    {filters.special.length > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {filters.special.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform text-gray-600 ${
                      expandedFilter === 'special' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                {expandedFilter === 'special' && (
                    <motion.div 
                      className="mt-3 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                    {[
                      { key: 'recommended', label: 'Recommended Only' },
                      { key: 'promoted', label: 'Promoted Offers' }
                    ].map(option => (
                        <label key={option.key} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.special.includes(option.key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                special: [...prev.special, option.key]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                special: prev.special.filter(s => s !== option.key)
                              }));
                            }
                          }}
                            className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                          <span className="text-gray-700 font-medium">{option.label}</span>
                      </label>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Features Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleFilter('features')}
                  className="w-full flex items-center justify-between text-left p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    Features
                    {filters.features.length > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {filters.features.length}
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform text-gray-600 ${
                      expandedFilter === 'features' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                {expandedFilter === 'features' && (
                    <motion.div 
                      className="mt-3 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                    {['Early repayment', 'Redraw facility', 'Fixed rate', 'Variable rate'].map(feature => (
                        <label key={feature} className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                features: [...prev.features, feature]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                features: prev.features.filter(f => f !== feature)
                              }));
                            }
                          }}
                            className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                          <span className="text-gray-700 font-medium">{feature}</span>
                      </label>
                    ))}
                    </motion.div>
                )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Loan Listings */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg flex justify-center border border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-4 border-[#1B1F3B] mb-4 md:mb-6"></div>
                  <p className="text-gray-600 text-base md:text-lg font-medium">Loading personal loans...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
                >
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                      {filteredLoans.length} Personal Loans Available
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Showing {filteredLoans.length} of {personalLoans.length} loans matching your criteria
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
                
                {/* Sort bar - Hidden on mobile, shown on desktop */}
                <div className="hidden md:block bg-white rounded-t-lg shadow-sm">
                  <div className="grid grid-cols-5 border-b text-sm text-gray-600">
                    <div className="p-3 col-span-2">Loan details</div>
                    <button 
                      className="p-3 flex items-center justify-between hover:bg-gray-50 touch-manipulation"
                      onClick={() => handleSort('interest_rate_pa')}
                    >
                      Interest rate p.a.
                      <ChevronDown size={16} className={`ml-1 ${sortField === 'interest_rate_pa' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      className="p-3 flex items-center justify-between hover:bg-gray-50 touch-manipulation"
                      onClick={() => handleSort('comparison_rate_pa')}
                    >
                      Comparison rate
                      <ChevronDown size={16} className={`ml-1 ${sortField === 'comparison_rate_pa' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      className="p-3 flex items-center justify-between hover:bg-gray-50 touch-manipulation"
                      onClick={() => handleSort('monthly_repayment')}
                    >
                      Monthly repayment
                      <ChevronDown size={16} className={`ml-1 ${sortField === 'monthly_repayment' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Mobile Sort Dropdown */}
                <div className="md:hidden bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
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
                      <option value="interest_rate_pa-asc">Interest Rate (Low to High)</option>
                      <option value="interest_rate_pa-desc">Interest Rate (High to Low)</option>
                      <option value="comparison_rate_pa-asc">Comparison Rate (Low to High)</option>
                      <option value="comparison_rate_pa-desc">Comparison Rate (High to Low)</option>
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
                                      <CreditCard size={16} className="md:w-5 md:h-5 text-gray-400" />
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
                                    {loan.interest_rate_pa === 0 ? 'Not Provided by Bank' : formatPercentage(loan.interest_rate_pa)}
                                  </div>
                                </div>
                                <div className="bg-gray-50 p-1.5 rounded">
                                  <div className="text-xs text-gray-600">Max Loan Amount</div>
                                  <div className="text-sm font-bold text-[#1B1F3B]">
                                    {loan.max_amount ? formatCurrency(loan.max_amount) : 'Not Provided'}
                                  </div>
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

                              {/* Loan Term and Eligibility */}
                              <div className="bg-blue-50 p-1.5 rounded text-[10px]">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Calculator size={10} className="text-blue-500" />
                                  <span className="font-semibold text-gray-700">Loan Details</span>
                                </div>
                                <div className="grid grid-cols-1 gap-0.5">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Max Term:</span>
                                    <span className="text-gray-900">{loan.loan_term_max ? `${Math.round(loan.loan_term_max / 12)} years` : 'N/A'}</span>
                                  </div>
                                  {loan.eligibility && loan.eligibility.length > 0 && (
                                    <div className="text-gray-600">
                                      <span className="font-medium">Eligibility:</span> {loan.eligibility[0]}
                                    </div>
                                  )}
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
                                  const usedDefaultRate = !loan.interest_rate_pa || loan.interest_rate_pa === 0;
                                  const rateForCalc = usedDefaultRate ? 12 : loan.interest_rate_pa;
                                  const monthlyPayment = calculateMonthlyRepayment(
                                    calculatorInputs.loanAmount,
                                    rateForCalc,
                                    calculatorInputs.loanTerm
                                  );
                                  return (
                                    <>
                                      <div className="text-base font-bold text-[#1B1F3B]">
                                        {formatCurrency(monthlyPayment)}
                                      </div>
                                      <div className="text-[10px] text-blue-600">
                                        {formatPercentage(rateForCalc)} over {calculatorInputs.loanTerm} years
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
                                  Get Personal Loan
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
                          <CreditCard size={32} className="text-gray-400" />
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
          {/* Personal Loan Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <CreditCard className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Personal Loan Interest Rates Bangladesh</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Compare the best personal loan interest rates from top banks in Bangladesh. Get competitive rates starting from 8% to 18% with flexible EMI options and quick approval process.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Lowest interest rates from top banks</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>No collateral required for unsecured loans</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Flexible repayment terms up to 7 years</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <Calculator className="text-green-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">EMI Calculator & Online Loan Application</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Use our EMI calculator to calculate monthly payments for your personal loan. Apply online with easy loan application process and get instant approval from top banks.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Free EMI calculator & EMI cal tools</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Online loan application in minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Quick loans with instant approval</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <Star className="text-purple-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Easy Loans for Students & Professionals</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Get easy loans designed for students and salaried professionals. Special loan offers with competitive rates, minimal documentation, and quick processing.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Loans for students with education focus</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Bank loans for salaried professionals</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="text-green-500 mr-2" size={14} />
                  <span>Minimal documentation required</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Banks Section */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Top Banks Offering Personal Loans Bangladesh</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Compare personal loan offers from leading banks in Bangladesh. Get the best rates, terms, and features for your financial needs.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="font-bold text-blue-900 mb-1">BRAC Bank</div>
                <div className="text-sm text-blue-700">Personal Loans</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="font-bold text-green-900 mb-1">City Bank</div>
                <div className="text-sm text-green-700">Easy Loans</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="font-bold text-purple-900 mb-1">Dutch Bangla Bank</div>
                <div className="text-sm text-purple-700">Quick Loans</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <div className="font-bold text-orange-900 mb-1">Eastern Bank</div>
                <div className="text-sm text-orange-700">Online Loans</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Footer Section */}
      <div className="bg-gradient-to-br from-[#1B1F3B] to-[#2d325f] text-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Personal Loan Types */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Personal Loan Types</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ Unsecured Personal Loans</p>
                <p className="text-gray-300">✓ Instant Personal Loans</p>
                <p className="text-gray-300">✓ Loans for Students</p>
                <p className="text-gray-300">✓ Salary Loans</p>
                <p className="text-gray-300">✓ Emergency Loans</p>
                <p className="text-gray-300">✓ Business Personal Loans</p>
                <p className="text-gray-300">✓ Wedding Loans</p>
                <p className="text-gray-300">✓ Medical Emergency Loans</p>
              </div>
            </div>

            {/* EMI Calculator & Tools */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">EMI Calculator & Tools</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ Personal Loan EMI Calculator</p>
                <p className="text-gray-300">✓ EMI Calculation Tools</p>
                <p className="text-gray-300">✓ EMI Cal for Quick Calculation</p>
                <p className="text-gray-300">✓ Loan Eligibility Calculator</p>
                <p className="text-gray-300">✓ Interest Rate Comparison</p>
                <p className="text-gray-300">✓ Loan Amount Calculator</p>
                <p className="text-gray-300">✓ Prepayment Calculator</p>
                <p className="text-gray-300">✓ Total Cost Calculator</p>
              </div>
            </div>

            {/* Online Application Process */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Online Loan Application</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ Easy Online Application</p>
                <p className="text-gray-300">✓ Quick Loan Approval</p>
                <p className="text-gray-300">✓ Instant Loan Processing</p>
                <p className="text-gray-300">✓ Digital Documentation</p>
                <p className="text-gray-300">✓ Online Verification</p>
                <p className="text-gray-300">✓ Fast Disbursement</p>
                <p className="text-gray-300">✓ Mobile Banking Support</p>
                <p className="text-gray-300">✓ 24/7 Application Process</p>
              </div>
            </div>

            {/* Loan Features & Benefits */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Loan Features & Benefits</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ No Collateral Required</p>
                <p className="text-gray-300">✓ Competitive Interest Rates</p>
                <p className="text-gray-300">✓ Flexible Repayment Terms</p>
                <p className="text-gray-300">✓ Quick Processing Time</p>
                <p className="text-gray-300">✓ Minimal Documentation</p>
                <p className="text-gray-300">✓ Pre-approved Offers</p>
                <p className="text-gray-300">✓ Balance Transfer Options</p>
                <p className="text-gray-300">✓ Top-up Loan Facility</p>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-8 pt-8 border-t border-gray-600">
            <h3 className="text-lg font-bold mb-4 text-blue-200 text-center">Popular Personal Loan Searches Bangladesh</h3>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Personal Loan Bangladesh</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">EMI Calculator</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Online Loan Application</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Quick Loans</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Easy Loans</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Loans for Students</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Bank Loan</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Instant Loan</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Personal Loan Interest Rate</span>
              <span className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full text-gray-300">Loan Eligibility</span>
            </div>
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

const CompareModal: React.FC<CompareModalProps> = ({ loans, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'calculator'>('overview');
  const [comparisonAmount, setComparisonAmount] = useState(10000);
  const [comparisonTerm, setComparisonTerm] = useState(3);

  if (!isOpen) return null;

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

  const formatPercentage = (value: number) => {
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

  const calculateTotalCost = (loan: PersonalLoan, amount: number, term: number): number => {
    const monthlyPayment = calculateMonthlyRepayment(amount, loan.interest_rate_pa, term);
    const totalPayments = monthlyPayment * term * 12;
    const applicationFee = loan.application_fee || 0;
    const monthlyFee = (loan.monthly_fee || 0) * term * 12;
    return totalPayments + applicationFee + monthlyFee;
  };

  const calculateTotalInterest = (loan: PersonalLoan, amount: number, term: number): number => {
    const totalCost = calculateTotalCost(loan, amount, term);
    return totalCost - amount;
  };

  const getBestLoan = (criteria: 'rate' | 'cost' | 'monthly'): PersonalLoan => {
    if (criteria === 'rate') {
      return loans.reduce((best, current) => 
        current.interest_rate_pa < best.interest_rate_pa ? current : best
      );
    }
    if (criteria === 'cost') {
      return loans.reduce((best, current) => 
        calculateTotalCost(current, comparisonAmount, comparisonTerm) < 
        calculateTotalCost(best, comparisonAmount, comparisonTerm) ? current : best
      );
    }
    return loans.reduce((best, current) => 
      calculateMonthlyRepayment(comparisonAmount, current.interest_rate_pa, comparisonTerm) < 
      calculateMonthlyRepayment(comparisonAmount, best.interest_rate_pa, comparisonTerm) ? current : best
    );
  };

  const getComparisonIcon = (loan: PersonalLoan, field: 'rate' | 'cost' | 'monthly'): React.ReactNode => {
    const bestLoan = getBestLoan(field);
    if (loan.id === bestLoan.id) {
      return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
    }
    return <div className="w-2 h-2 bg-gray-300 rounded-full"></div>;
  };

  const renderOverview = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {loans.map(loan => (
          <div key={loan.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 md:p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="font-bold text-gray-900 text-sm md:text-base">{loan.brand}</h3>
              {loan.recommended && <Award className="text-yellow-500" size={16} />}
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between">
                <span className="text-xs md:text-sm text-gray-600">Interest Rate</span>
                <span className="font-semibold text-sm md:text-base">{formatPercentage(loan.interest_rate_pa)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs md:text-sm text-gray-600">Monthly Payment</span>
                <span className="font-semibold text-sm md:text-base">
                  {formatCurrency(calculateMonthlyRepayment(comparisonAmount, loan.interest_rate_pa, comparisonTerm))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs md:text-sm text-gray-600">Total Cost</span>
                <span className="font-semibold text-sm md:text-base">
                  {formatCurrency(calculateTotalCost(loan, comparisonAmount, comparisonTerm))}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-4 bg-gray-50 border-b">
          <div className="p-4 font-semibold text-gray-700">Criteria</div>
          {loans.map(loan => (
            <div key={loan.id} className="p-4 font-semibold text-gray-700 text-center">
              {loan.brand}
            </div>
          ))}
        </div>
        
        {[
          { label: 'Interest Rate (p.a.)', field: 'interest_rate_pa', type: 'percentage', best: 'rate' },
          { label: 'Comparison Rate (p.a.)', field: 'comparison_rate_pa', type: 'percentage', best: 'rate' },
          { label: 'Application Fee', field: 'application_fee', type: 'currency', best: 'cost' },
          { label: 'Monthly Fee', field: 'monthly_fee', type: 'currency', best: 'cost' },
          { label: 'Max Loan Term', field: 'loan_term_max', type: 'years', best: null },
        ].map(({ label, field, type, best }) => (
          <div key={label} className="grid grid-cols-4 border-b border-gray-100 hover:bg-gray-50">
            <div className="p-4 font-medium text-gray-700">{label}</div>
            {loans.map(loan => {
              const value = loan[field as keyof PersonalLoan];
              let displayValue = 'N/A';

    if (typeof value === 'number') {
                if (type === 'percentage') displayValue = formatPercentage(value);
                else if (type === 'currency') displayValue = formatCurrency(value);
                else if (type === 'years') displayValue = `${value} years`;
              }
              
              return (
                <div key={loan.id} className="p-4 text-center flex items-center justify-center gap-2">
                  {best && getComparisonIcon(loan, best as 'rate' | 'cost' | 'monthly')}
                  <span className="font-semibold">{displayValue}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-8">
      {/* Winner Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="text-white" size={20} />
            </div>
            <h3 className="font-bold text-green-900">Lowest Interest Rate</h3>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-lg text-green-900">
              {getBestLoan('rate').brand} {getBestLoan('rate').product_name}
            </p>
            <p className="text-green-700 text-2xl font-bold">
              {formatPercentage(getBestLoan('rate').interest_rate_pa)}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <DollarSign className="text-white" size={20} />
            </div>
            <h3 className="font-bold text-blue-900">Lowest Total Cost</h3>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-lg text-blue-900">
              {getBestLoan('cost').brand} {getBestLoan('cost').product_name}
            </p>
            <p className="text-blue-700 text-2xl font-bold">
              {formatCurrency(calculateTotalCost(getBestLoan('cost'), comparisonAmount, comparisonTerm))}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Calendar className="text-white" size={20} />
            </div>
            <h3 className="font-bold text-purple-900">Lowest Monthly Payment</h3>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-lg text-purple-900">
              {getBestLoan('monthly').brand} {getBestLoan('monthly').product_name}
            </p>
            <p className="text-purple-700 text-2xl font-bold">
              {formatCurrency(calculateMonthlyRepayment(comparisonAmount, getBestLoan('monthly').interest_rate_pa, comparisonTerm))}
            </p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Total Cost Breakdown</h3>
        <div className="space-y-6">
          {loans.map(loan => {
            const totalCost = calculateTotalCost(loan, comparisonAmount, comparisonTerm);
            const totalInterest = calculateTotalInterest(loan, comparisonAmount, comparisonTerm);
            const fees = (loan.application_fee || 0) + ((loan.monthly_fee || 0) * comparisonTerm * 12);
            const principal = comparisonAmount;

  return (
              <div key={loan.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900">{loan.brand} {loan.product_name}</h4>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(totalCost)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full"
                    style={{ width: `${(principal / totalCost) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-red-400 h-full absolute top-0"
                    style={{ 
                      left: `${(principal / totalCost) * 100}%`,
                      width: `${(totalInterest / totalCost) * 100}%` 
                    }}
                  ></div>
                  <div 
                    className="bg-yellow-400 h-full absolute top-0"
                    style={{ 
                      left: `${((principal + totalInterest) / totalCost) * 100}%`,
                      width: `${(fees / totalCost) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Principal: {formatCurrency(principal)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span>Interest: {formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span>Fees: {formatCurrency(fees)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
        
      {/* Savings Analysis */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <h3 className="text-xl font-bold text-orange-900 mb-4">Potential Savings</h3>
        <div className="space-y-4">
          {loans.map(loan => {
            const bestCost = calculateTotalCost(getBestLoan('cost'), comparisonAmount, comparisonTerm);
            const thisCost = calculateTotalCost(loan, comparisonAmount, comparisonTerm);
            const savings = thisCost - bestCost;
            
            return (
              <div key={loan.id} className="flex justify-between items-center">
                <span className="font-medium text-orange-900">{loan.brand}</span>
                <span className={`font-bold ${savings === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {savings === 0 ? 'Best Option' : `+${formatCurrency(savings)}`}
                </span>
                </div>
            );
          })}
            </div>
      </div>
    </div>
  );

  const renderCalculator = () => (
    <div className="space-y-8">
      {/* Calculator Controls */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Loan Calculator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">Loan Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">৳</span>
              <input
                type="number"
                value={comparisonAmount}
                onChange={(e) => setComparisonAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="Enter loan amount"
                min="0"
              />
                      </div>
                  </div>
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">Loan Term (Years)</label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <input
                type="range"
                value={comparisonTerm}
                onChange={(e) => setComparisonTerm(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
                min="1"
                max="7"
              />
              <div className="text-right text-gray-700 font-bold text-lg mt-2">{comparisonTerm} years</div>
            </div>
          </div>
        </div>
                </div>
                
      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loans.map(loan => {
          const monthlyPayment = calculateMonthlyRepayment(comparisonAmount, loan.interest_rate_pa, comparisonTerm);
          const totalCost = calculateTotalCost(loan, comparisonAmount, comparisonTerm);
          const totalInterest = calculateTotalInterest(loan, comparisonAmount, comparisonTerm);
          
          return (
            <div key={loan.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-900">{loan.brand}</h4>
                {loan.recommended && <Award className="text-yellow-500" size={20} />}
                  </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700 font-medium">Monthly Payment</div>
                  <div className="text-2xl font-bold text-blue-900">{formatCurrency(monthlyPayment)}</div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate</span>
                    <span className="font-semibold">{formatPercentage(loan.interest_rate_pa)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Interest</span>
                    <span className="font-semibold text-red-600">{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cost</span>
                    <span className="font-semibold">{formatCurrency(totalCost)}</span>
                  </div>
                </div>

                  <a 
                    href={loan.site_visit_url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:from-[#2d325f] hover:to-[#1B1F3B] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                  Get Personal Loan
                  <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
      <motion.div 
        className="bg-white rounded-xl md:rounded-2xl w-full max-w-7xl max-h-[98vh] md:max-h-[95vh] overflow-hidden shadow-2xl border border-gray-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-gray-900">Smart Loan Comparison</h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base hidden md:block">Comprehensive analysis of your selected loans</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: <Grid size={14} /> },
              { id: 'analysis', label: 'Analysis', icon: <TrendingUp size={14} /> },
              { id: 'calculator', label: 'Calculator', icon: <Calculator size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 md:gap-2 px-3 md:px-6 py-3 md:py-4 font-medium transition-colors text-sm md:text-base touch-manipulation ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(98vh-120px)] md:max-h-[calc(95vh-200px)]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'analysis' && renderAnalysis()}
          {activeTab === 'calculator' && renderCalculator()}
      </div>
      </motion.div>
    </div>
  );
};

export default PersonalLoansPage; 