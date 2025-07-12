import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { 
  ChevronDown, 
  Filter, 
  X, 
  CheckCircle, 
  Check, 
  Star,
  CreditCard,
  Smartphone,
  Zap,
  Shield,
  Search,
  ArrowUpDown,
  ExternalLink,
  Plus,
  Minus
} from 'lucide-react';
import BankLogos from '../components/ui/BankLogos';

interface InstantBank {
  id: number;
  bank_name: string;
  account_name: string;
  features: string[];
  logo_link: string;
  site_link: string;
  konta_nibo_app_score: number;
  debit_card: boolean;
  credit_card: boolean;
  google_pay: boolean;
  virtual_card: boolean;
}

interface Filters {
  banks: string[];
  paymentMethods: string[];
  features: string[];
  score: string;
}

// Comparison Modal Component
const ComparisonModal: React.FC<{
  banks: InstantBank[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ banks, isOpen, onClose }) => {
  if (!isOpen || banks.length === 0) return null;

  const comparisonCategories = [
    {
      title: 'Basic Information',
      items: [
        { label: 'Bank Name', key: 'bank_name' as keyof InstantBank },
        { label: 'Account Type', key: 'account_name' as keyof InstantBank },
        { label: 'Rating', key: 'konta_nibo_app_score' as keyof InstantBank }
      ]
    },
    {
      title: 'Payment Methods',
      items: [
        { label: 'Debit Card', key: 'debit_card' as keyof InstantBank },
        { label: 'Credit Card', key: 'credit_card' as keyof InstantBank },
        { label: 'Google Pay', key: 'google_pay' as keyof InstantBank },
        { label: 'Virtual Card', key: 'virtual_card' as keyof InstantBank }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900">Compare Banks</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Bank Headers */}
          <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: `200px repeat(${banks.length}, 1fr)` }}>
            <div></div> {/* Empty space for labels */}
            {banks.map((bank) => (
              <div key={bank.id} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2 flex items-center justify-center">
                  {bank.logo_link ? (
                    <img
                      src={bank.logo_link}
                      alt={bank.bank_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs font-medium">
                        {bank.bank_name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{bank.account_name}</h3>
                <p className="text-sm text-gray-600">{bank.bank_name}</p>
              </div>
            ))}
          </div>

          {/* Comparison Categories */}
          {comparisonCategories.map((category) => (
            <div key={category.title} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 px-4 py-2 bg-gray-50 rounded-lg">
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.key} className="grid gap-6 py-3 border-b border-gray-100 last:border-b-0" style={{ gridTemplateColumns: `200px repeat(${banks.length}, 1fr)` }}>
                    <div className="font-medium text-gray-700 flex items-center">
                      {item.label}
                    </div>
                    {banks.map((bank) => (
                      <div key={`${bank.id}-${item.key}`} className="text-center flex items-center justify-center">
                        {typeof bank[item.key] === 'boolean' ? (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            bank[item.key] ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {bank[item.key] ? (
                              <Check size={16} />
                            ) : (
                              <X size={16} />
                            )}
                          </div>
                        ) : item.key === 'konta_nibo_app_score' ? (
                          <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-400 fill-current" />
                            <span className="font-semibold">{bank[item.key]}/10</span>
                          </div>
                        ) : (
                          <span className="font-medium">{bank[item.key]?.toString() || 'N/A'}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Features Comparison */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 px-4 py-2 bg-gray-50 rounded-lg">
              Key Features
            </h3>
            <div className="grid gap-6" style={{ gridTemplateColumns: `200px repeat(${banks.length}, 1fr)` }}>
              <div className="font-medium text-gray-700 flex items-start pt-2">
                Available Features
              </div>
              {banks.map((bank) => (
                <div key={`${bank.id}-features`} className="space-y-2">
                  {bank.features.map((feature, index) => (
                    <div key={index} className="text-xs p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                      {feature}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-4 pt-6 border-t border-gray-200" style={{ gridTemplateColumns: `200px repeat(${banks.length}, 1fr)` }}>
            <div></div>
            {banks.map((bank) => (
              <motion.a
                key={bank.id}
                href={bank.site_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold text-sm text-center transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <Zap size={16} />
                Open Account Online
                <ExternalLink size={14} />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Modern Bank Card Component
const ModernBankCard: React.FC<{ 
  bank: InstantBank; 
  onCompare: (id: number) => void; 
  isSelected: boolean; 
  index: number;
}> = ({ bank, onCompare, isSelected, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const paymentMethods = [
    { name: 'Debit', icon: <CreditCard size={14} />, available: bank.debit_card },
    { name: 'Credit', icon: <CreditCard size={14} />, available: bank.credit_card },
    { name: 'Google Pay', icon: <Smartphone size={14} />, available: bank.google_pay },
    { name: 'Virtual', icon: <Shield size={14} />, available: bank.virtual_card }
  ].filter(method => method.available);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative bg-white rounded-2xl border border-gray-200 overflow-hidden
        transition-all duration-300 ease-out
        ${isHovered ? 'shadow-xl border-blue-200' : 'shadow-sm hover:shadow-lg'}
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}>
        {/* Featured Badge */}
        {bank.bank_name === 'Ekhoni' && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              FEATURED
            </span>
          </div>
        )}

        {/* Main Card Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex items-center justify-center overflow-hidden">
                  {bank.logo_link ? (
                    <img
                      src={bank.logo_link}
                      alt={bank.bank_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs font-medium">
                        {bank.bank_name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {bank.konta_nibo_app_score >= 8 && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                  {bank.account_name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{bank.bank_name}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">
                      {bank.konta_nibo_app_score}/10
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Rating</span>
                </div>
              </div>
            </div>

            {/* Compare Checkbox */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCompare(bank.id)}
              className={`
                relative w-6 h-6 rounded-md border-2 transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-300 hover:border-blue-400'
                }
              `}
            >
              {isSelected && (
                <Check size={14} className="text-white absolute inset-0 m-auto" />
              )}
            </motion.button>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap gap-2 mb-4">
            {paymentMethods.map((method) => (
              <motion.div
                key={method.name}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-100"
              >
                {method.icon}
                <span>{method.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Key Features Preview */}
          <div className="space-y-2 mb-4">
            {bank.features.slice(0, isExpanded ? bank.features.length : 2).map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                <span className="line-clamp-1">{feature}</span>
              </motion.div>
            ))}
            
            {bank.features.length > 2 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
              >
                {isExpanded ? (
                  <>
                    <Minus size={12} />
                    Show less
                  </>
                ) : (
                  <>
                    <Plus size={12} />
                    {bank.features.length - 2} more features
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <motion.a
              href={bank.site_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold text-sm text-center transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Zap size={16} />
              Open Account Online
              <ExternalLink size={14} />
            </motion.a>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className={`
          absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none
          ${isHovered ? 'opacity-100' : 'opacity-0'}
          bg-gradient-to-r from-blue-500/5 to-indigo-500/5
        `} />
      </div>
    </motion.div>
  );
};

// Modern Filter Component
const ModernFilter: React.FC<{
  title: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  icon: React.ReactNode;
}> = ({ title, options, selected, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200
          ${isOpen || selected.length > 0
            ? 'border-blue-200 bg-blue-50 text-blue-700' 
            : 'border-gray-200 bg-white hover:border-gray-300'
          }
        `}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
          {selected.length > 0 && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown 
          size={20} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto"
          >
            <div className="p-3 space-y-2">
              {options.map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange([...selected, option]);
                      } else {
                        onChange(selected.filter(item => item !== option));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InstantBankPage: React.FC = () => {
  const [instantBanks, setInstantBanks] = useState<InstantBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    banks: [],
    paymentMethods: [],
    features: [],
    score: ''
  });
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'score'>('score');
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  useEffect(() => {
    fetchInstantBanks();
  }, []);

  const fetchInstantBanks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ekyc')
        .select('*')
        .order('konta_nibo_app_score', { ascending: false });

      if (error) throw error;
      setInstantBanks(data || []);
    } catch (error) {
      console.error('Error fetching instant banks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const allBanks = [...new Set(instantBanks.map(bank => bank.bank_name))];
  const allPaymentMethods = ['Debit Card', 'Credit Card', 'Google Pay', 'Virtual Card'];
  const allFeatures = [...new Set(instantBanks.flatMap(bank => bank.features))].slice(0, 10);

  // Filter and sort logic
  const getFilteredAndSortedBanks = () => {
    let filtered = instantBanks.filter(bank => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          bank.bank_name.toLowerCase().includes(searchLower) ||
          bank.account_name.toLowerCase().includes(searchLower) ||
          bank.features.some(feature => feature.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Bank filter
      if (filters.banks.length > 0 && !filters.banks.includes(bank.bank_name)) {
        return false;
      }

      // Payment methods filter
      if (filters.paymentMethods.length > 0) {
        const bankMethods: string[] = [];
        if (bank.debit_card) bankMethods.push('Debit Card');
        if (bank.credit_card) bankMethods.push('Credit Card');
        if (bank.google_pay) bankMethods.push('Google Pay');
        if (bank.virtual_card) bankMethods.push('Virtual Card');
        
        const hasSelectedMethod = filters.paymentMethods.some(method => bankMethods.includes(method));
        if (!hasSelectedMethod) return false;
      }

      // Features filter
      if (filters.features.length > 0) {
        const hasSelectedFeature = filters.features.some(feature => 
          bank.features.some(bankFeature => bankFeature.includes(feature))
        );
        if (!hasSelectedFeature) return false;
      }

      // Score filter
      if (filters.score && bank.konta_nibo_app_score < parseInt(filters.score)) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.bank_name.localeCompare(b.bank_name);
      } else {
        return b.konta_nibo_app_score - a.konta_nibo_app_score;
      }
    });

    return filtered;
  };

  const handleCompareToggle = (bankId: number) => {
    setSelectedForComparison(prev => {
      if (prev.includes(bankId)) {
        return prev.filter(id => id !== bankId);
      } else if (prev.length < 3) {
        return [...prev, bankId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    setIsComparisonModalOpen(true);
  };

  const clearAllFilters = () => {
    setFilters({
      banks: [],
      paymentMethods: [],
      features: [],
      score: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = () => {
    return searchTerm || 
           filters.banks.length > 0 || 
           filters.paymentMethods.length > 0 || 
           filters.features.length > 0 || 
           filters.score;
  };

  const filteredBanks = getFilteredAndSortedBanks();
  const selectedBanks = instantBanks.filter(bank => selectedForComparison.includes(bank.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* SEO Component */}
      <SEO
        title="Best Instant Bank Account Opening Bangladesh 2024 | eKYC, Google Pay, City Bank"
        description="Open bank account online instantly with eKYC verification. Compare City Bank, HSBC, Ekhoni account opening with Google Pay, student bank accounts & digital banking services in Bangladesh."
        keywords="city bank, ekhoni account, google pay, google payment, kyc, bank account, gpay, hsbc online banking, k yc, ekyc, open bank account online, online bank account, open bank account, google pay app, google wallet app, student bank account, kyc verification, open up a bank account online"
        pageType="instant-bank"
        canonical="https://kontanibo.com/instant-bank"
        ogImage="/og-instant-bank.png"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Instant Bank Account Opening Bangladesh: Open Digital Account Online in Minutes
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Compare {instantBanks.length}+ banks offering instant online bank account opening with eKYC verification. 
              Find City Bank, HSBC, Ekhoni account with Google Pay, student bank accounts & digital banking services.
            </p>
          </motion.div>
        </div>
      </div>

      <BankLogos />

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg p-8 mb-8 border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#1B1F3B]">Best Instant Bank Account Opening with eKYC Verification in Bangladesh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">eKYC & Online KYC</h3>
              <p className="text-gray-600 mb-4">
                Open bank account online instantly with eKYC verification and KYC verification. Complete your K YC process digitally without visiting branches. Fast, secure, and convenient online account opening.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">eKYC Verification</span>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Online KYC</span>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Digital Identity</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Google Pay & Digital Payments</h3>
              <p className="text-gray-600 mb-4">
                Get instant access to Google Pay, Google Payment, GPay, and Google Wallet App integration. Enjoy seamless digital payments and mobile banking with your new bank account.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Google Pay</span>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">GPay Integration</span>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Google Wallet</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Top Banks & Account Types</h3>
              <p className="text-gray-600 mb-4">
                Compare City Bank, HSBC Online Banking, Ekhoni Account, and other leading banks. Choose from student bank account, savings account, and premium banking services.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">City Bank</span>
                <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">HSBC Online</span>
                <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">Ekhoni Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search City Bank, HSBC, Ekhoni account, Google Pay, eKYC verification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ModernFilter
              title="Banks"
              options={allBanks}
              selected={filters.banks}
              onChange={(values) => setFilters(prev => ({ ...prev, banks: values }))}
              icon={<Filter size={18} />}
            />
            <ModernFilter
              title="Payment Methods"
              options={allPaymentMethods}
              selected={filters.paymentMethods}
              onChange={(values) => setFilters(prev => ({ ...prev, paymentMethods: values }))}
              icon={<CreditCard size={18} />}
            />
            <ModernFilter
              title="Features"
              options={allFeatures}
              selected={filters.features}
              onChange={(values) => setFilters(prev => ({ ...prev, features: values }))}
              icon={<CheckCircle size={18} />}
            />
            <div className="relative">
              <select
                value={filters.score}
                onChange={(e) => setFilters(prev => ({ ...prev, score: e.target.value }))}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Ratings</option>
                <option value="9">9+ Rating</option>
                <option value="8">8+ Rating</option>
                <option value="7">7+ Rating</option>
                <option value="6">6+ Rating</option>
              </select>
              <Star className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          {/* Filter Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {filteredBanks.length} of {instantBanks.length} banks
              </span>
              {hasActiveFilters() && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                >
                  <X size={16} />
                  Clear all filters
                </motion.button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy(sortBy === 'name' ? 'score' : 'name')}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <ArrowUpDown size={16} />
                <span className="text-sm font-medium">
                  {sortBy === 'name' ? 'Name' : 'Rating'}
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading instant bank accounts...</p>
            </div>
          </div>
        ) : filteredBanks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBanks.map((bank, index) => (
              <ModernBankCard
                key={bank.id}
                bank={bank}
                onCompare={handleCompareToggle}
                isSelected={selectedForComparison.includes(bank.id)}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No banks found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms to find more results.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Clear all filters
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Comparison Bar */}
        <AnimatePresence>
          {selectedForComparison.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 left-6 right-6 z-50"
            >
              <div className="max-w-7xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          {selectedForComparison.length}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {selectedForComparison.length} bank{selectedForComparison.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedForComparison([])}
                      className="text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Clear
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCompare}
                      disabled={selectedForComparison.length < 2}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Compare ({selectedForComparison.length})
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEO Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#1B1F3B]">Complete Guide to Opening Bank Account Online with eKYC in Bangladesh</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Top Banks</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• City Bank account opening</li>
                  <li>• HSBC online banking</li>
                  <li>• Ekhoni account features</li>
                  <li>• Dutch Bangla Bank online</li>
                  <li>• Standard Chartered digital</li>
                  <li>• BRAC Bank instant account</li>
                  <li>• Eastern Bank online</li>
                  <li>• Prime Bank digital services</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">eKYC & Verification</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• eKYC verification process</li>
                  <li>• Online KYC verification</li>
                  <li>• K YC document requirements</li>
                  <li>• Digital identity verification</li>
                  <li>• Instant KYC approval</li>
                  <li>• Mobile KYC verification</li>
                  <li>• Biometric verification</li>
                  <li>• Document verification online</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Digital Payments</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Google Pay integration</li>
                  <li>• Google Payment setup</li>
                  <li>• GPay account linking</li>
                  <li>• Google Wallet App features</li>
                  <li>• Mobile payment solutions</li>
                  <li>• Digital wallet services</li>
                  <li>• Contactless payments</li>
                  <li>• UPI payment integration</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Account Types</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Student bank account</li>
                  <li>• Savings account online</li>
                  <li>• Current account opening</li>
                  <li>• Salary account setup</li>
                  <li>• Premium banking services</li>
                  <li>• Business account online</li>
                  <li>• NRB account opening</li>
                  <li>• Joint account services</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-[#1B1F3B]">How to Open Bank Account Online</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">1</div>
                      <div>
                        <p className="font-medium text-gray-800">Choose Your Bank</p>
                        <p className="text-sm text-gray-600">Compare City Bank, HSBC, Ekhoni account features and select the best option</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">2</div>
                      <div>
                        <p className="font-medium text-gray-800">Complete eKYC Verification</p>
                        <p className="text-sm text-gray-600">Upload documents and complete KYC verification process online</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">3</div>
                      <div>
                        <p className="font-medium text-gray-800">Setup Digital Payments</p>
                        <p className="text-sm text-gray-600">Enable Google Pay, GPay, and other digital payment services</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-[#1B1F3B]">Benefits of Online Account Opening</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500" />
                      <div>
                        <p className="font-medium text-gray-800">Instant Account Opening</p>
                        <p className="text-sm text-gray-600">Open up a bank account online within minutes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500" />
                      <div>
                        <p className="font-medium text-gray-800">No Branch Visit Required</p>
                        <p className="text-sm text-gray-600">Complete process from home with eKYC verification</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500" />
                      <div>
                        <p className="font-medium text-gray-800">Immediate Digital Access</p>
                        <p className="text-sm text-gray-600">Get instant access to online banking and Google Pay</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <h4 className="text-lg font-semibold mb-4 text-[#1B1F3B]">Popular Searches</h4>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">City Bank online account</span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">HSBC digital banking</span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">Ekhoni account benefits</span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">Google Pay bank account</span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">Student bank account online</span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">eKYC verification process</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Modal */}
        <ComparisonModal
          banks={selectedBanks}
          isOpen={isComparisonModalOpen}
          onClose={() => setIsComparisonModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default InstantBankPage; 