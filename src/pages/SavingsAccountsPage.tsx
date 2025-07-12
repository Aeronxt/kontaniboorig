import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronDown, Filter, X, Wallet, ArrowRight, ArrowUpRight, Check, Calculator, Star } from 'lucide-react';
import Speedometer from '../components/Speedometer';

interface SavingsAccount {
  id: string;
  brand: string;
  product_name: string;
  max_variable_rate_pa: number;
  interest_rate: number;
  monthly_maximum_rate_conditions: string;
  minimum_deposit: number;
  cheque_book_fee: number;
  account_fee: number;
  tagline: string;
  recommended: boolean;
  score: number;
  logo_url: string;
  visit_site_link: string;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  };
  features: string[];
  pros: string[];
  cons: string[];
  eligibility: string[];
  required_documents: string[];
  ekyc_enabled: boolean;
  internet_banking: boolean;
  debit_card_facility: boolean;
}

interface CompareModalProps {
  accounts: SavingsAccount[];
  isOpen: boolean;
  onClose: () => void;
}

interface InfoDrawerProps {
  account: SavingsAccount | null;
  isOpen: boolean;
  onClose: () => void;
}

type SortField = 'interest_rate' | 'max_variable_rate_pa' | 'minimum_deposit' | 'account_fee' | 'score';

const SavingsAccountsPage: React.FC = () => {
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('interest_rate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    features: [] as string[],
    minimumDeposit: null as number | null,
    hasInternetBanking: false,
    hasDebitCard: false,
    hasEkyc: false,
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null);

  useEffect(() => {
    fetchSavingsAccounts();
  }, []);

  const fetchSavingsAccounts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('savings_accounts')
        .select('*')
        .order('interest_rate', { ascending: false });

      if (error) throw error;
      if (data) {
        setSavingsAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching savings accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filterName: string) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
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

  const handleCompareToggle = (accountId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(accountId)) {
        return prev.filter(id => id !== accountId);
      }
      if (prev.length < 2) {
        return [...prev, accountId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      setIsCompareModalOpen(true);
    }
  };

  const sortedAccounts = [...savingsAccounts].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  const filteredAccounts = sortedAccounts.filter(account => {
    if (filters.minimumDeposit && account.minimum_deposit < filters.minimumDeposit) {
      return false;
    }
    
    if (filters.hasInternetBanking && !account.internet_banking) {
      return false;
    }

    if (filters.hasDebitCard && !account.debit_card_facility) {
      return false;
    }

    if (filters.hasEkyc && !account.ekyc_enabled) {
      return false;
    }

    if (filters.features.length > 0) {
      const hasAllFeatures = filters.features.every(feature => 
        account.features.includes(feature)
      );
      if (!hasAllFeatures) return false;
    }
    
    return true;
  });

  const selectedAccounts = savingsAccounts.filter(account => 
    selectedForComparison.includes(account.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f5f7fa]"
    >
      {/* Hero Section */}
      <div className="bg-[#1B1F3B] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">Savings account comparison</h1>
          <p className="text-xl font-medium">Compare {savingsAccounts.length}+ savings accounts - interest rates, features and benefits updated daily.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Column */}
          <div className="md:w-1/4">
            <h2 className="text-xl font-extrabold mb-4 tracking-tight">Refine results</h2>
            
            {/* Minimum Deposit Filter */}
            <div className="mb-4 border-b pb-4">
              <button 
                className="w-full flex justify-between items-center"
                onClick={() => toggleFilter('minimumDeposit')}
              >
                <span className="font-medium">Minimum Deposit</span>
                <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'minimumDeposit' ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedFilter === 'minimumDeposit' && (
                <div className="mt-3 space-y-2">
                  {[1000, 5000, 10000, 50000].map(amount => (
                    <label key={amount} className="flex items-center">
                      <input 
                        type="radio" 
                        className="mr-2 rounded" 
                        checked={filters.minimumDeposit === amount}
                        onChange={() => setFilters({...filters, minimumDeposit: amount})}
                      />
                      {formatCurrency(amount)}+ minimum
                    </label>
                  ))}
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setFilters({...filters, minimumDeposit: null})}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Features Filter */}
            <div className="mb-4 border-b pb-4">
              <button 
                className="w-full flex justify-between items-center"
                onClick={() => toggleFilter('features')}
              >
                <span className="font-medium">Features</span>
                <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'features' ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedFilter === 'features' && (
                <div className="mt-3 space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2 rounded" 
                      checked={filters.hasInternetBanking}
                      onChange={(e) => setFilters({...filters, hasInternetBanking: e.target.checked})}
                    />
                    Internet Banking
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2 rounded" 
                      checked={filters.hasDebitCard}
                      onChange={(e) => setFilters({...filters, hasDebitCard: e.target.checked})}
                    />
                    Debit Card Facility
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2 rounded" 
                      checked={filters.hasEkyc}
                      onChange={(e) => setFilters({...filters, hasEkyc: e.target.checked})}
                    />
                    eKYC Enabled
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="bg-white p-8 rounded-lg shadow-sm flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1F3B] mb-4"></div>
                  <p className="text-gray-600">Loading savings accounts...</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    Showing 1 - {filteredAccounts.length} of {savingsAccounts.length} accounts
                  </p>
                  <div className="text-gray-600 text-sm flex items-center">
                    <span className="mr-2">Updated daily</span>
                    <Filter size={16} />
                  </div>
                </div>

                {/* Sort bar */}
                <div className="bg-white rounded-lg shadow-sm mb-4 grid grid-cols-5 text-sm">
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('interest_rate')}
                  >
                    Interest Rate
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'interest_rate' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('max_variable_rate_pa')}
                  >
                    Max Rate
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'max_variable_rate_pa' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('minimum_deposit')}
                  >
                    Min Deposit
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'minimum_deposit' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('account_fee')}
                  >
                    Account Fee
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'account_fee' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('score')}
                  >
                    Score
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'score' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Account listings */}
                <div className="space-y-4">
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => (
                      <div key={account.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="p-6">
                          <div className="grid grid-cols-12 gap-6">
                            {/* Logo and Basic Info */}
                            <div className="col-span-12 md:col-span-3 flex flex-col items-start">
                              <div className="w-40 h-24 mb-4">
                                {account.logo_url ? (
                                  <img 
                                    src={account.logo_url} 
                                    alt={`${account.brand} ${account.product_name}`}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Wallet size={32} className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <h3 className="text-xl font-bold tracking-tight text-[#1B1F3B] mb-2">
                                {account.brand} {account.product_name}
                              </h3>
                              {account.recommended && (
                                <div className="flex items-center text-yellow-500 text-sm mb-2">
                                  <Star size={16} className="mr-1" />
                                  Recommended
                                </div>
                              )}
                              {account.tagline && (
                                <p className="text-sm text-gray-600">{account.tagline}</p>
                              )}
                            </div>

                            {/* Key Features */}
                            <div className="col-span-12 md:col-span-5">
                              <h4 className="text-sm font-semibold text-gray-600 mb-4">KEY FEATURES</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-600">Interest Rate</div>
                                  <div className="text-xl font-bold text-[#1B1F3B]">{formatPercentage(account.interest_rate)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Max Variable Rate</div>
                                  <div className="text-xl font-bold text-[#1B1F3B]">{formatPercentage(account.max_variable_rate_pa)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Min Deposit</div>
                                  <div className="text-base font-semibold text-[#1B1F3B]">{formatCurrency(account.minimum_deposit)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Account Fee</div>
                                  <div className="text-base font-semibold text-[#1B1F3B]">{formatCurrency(account.account_fee)}</div>
                                </div>
                              </div>
                              <div className="mt-4 grid grid-cols-2 gap-2">
                                {account.internet_banking && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Check size={16} className="text-green-500 mr-1" />
                                    Internet Banking
                                  </div>
                                )}
                                {account.debit_card_facility && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Check size={16} className="text-green-500 mr-1" />
                                    Debit Card
                                  </div>
                                )}
                                {account.ekyc_enabled && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Check size={16} className="text-green-500 mr-1" />
                                    eKYC Enabled
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-12 md:col-span-4">
                              <div className="space-y-3">
                                <a 
                                  href={account.visit_site_link || '#'} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full bg-[#1B1F3B] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center gap-2"
                                >
                                  Visit Bank Site
                                  <ArrowUpRight size={16} />
                                </a>
                                <button
                                  onClick={() => setSelectedAccount(account)}
                                  className="w-full border border-[#1B1F3B] text-[#1B1F3B] px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                >
                                  More Information
                                  <ArrowRight size={16} />
                                </button>
                                <div className="flex items-center justify-between pt-2">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      id={`compare-${account.id}`} 
                                      className="mr-2"
                                      checked={selectedForComparison.includes(account.id)}
                                      onChange={() => handleCompareToggle(account.id)}
                                      disabled={selectedForComparison.length >= 2 && !selectedForComparison.includes(account.id)}
                                    />
                                    <label htmlFor={`compare-${account.id}`} className="text-sm">Compare</label>
                                  </div>
                                  {selectedForComparison.length === 2 && selectedForComparison.includes(account.id) && (
                                    <button
                                      onClick={handleCompare}
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                      Compare Selected
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                      <p className="text-gray-600">No savings accounts match your filters. Try adjusting your criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      <CompareModal
        accounts={selectedAccounts}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />

      {/* Info Drawer */}
      <InfoDrawer
        account={selectedAccount}
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </motion.div>
  );
};

const CompareModal: React.FC<CompareModalProps> = ({ accounts, isOpen, onClose }) => {
  const compareFields = [
    { label: 'Interest Rate', field: 'interest_rate', format: (val: number) => formatPercentage(val) },
    { label: 'Maximum Variable Rate', field: 'max_variable_rate_pa', format: (val: number) => formatPercentage(val) },
    { label: 'Minimum Deposit', field: 'minimum_deposit', format: (val: number) => formatCurrency(val) },
    { label: 'Account Fee', field: 'account_fee', format: (val: number) => formatCurrency(val) },
    { label: 'Cheque Book Fee', field: 'cheque_book_fee', format: (val: number) => formatCurrency(val) },
    { label: 'Internet Banking', field: 'internet_banking', format: (val: boolean) => val ? 'Yes' : 'No' },
    { label: 'Debit Card', field: 'debit_card_facility', format: (val: boolean) => val ? 'Yes' : 'No' },
    { label: 'eKYC Enabled', field: 'ekyc_enabled', format: (val: boolean) => val ? 'Yes' : 'No' },
    { label: 'Features', field: 'features', format: (val: string[]) => val.join(', ') },
    { label: 'Required Documents', field: 'required_documents', format: (val: string[]) => val.join(', ') },
    { label: 'Eligibility', field: 'eligibility', format: (val: string[]) => val.join(', ') },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Compare Savings Accounts</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="font-medium text-gray-500 mb-6">Features</div>
              {compareFields.map(({ label }) => (
                <div key={label} className="py-4 border-b">
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
            
            {accounts.map(account => (
              <div key={account.id} className="col-span-1">
                <div className="mb-6">
                  <div className="w-full h-40 mb-4">
                    {account.logo_url ? (
                      <img 
                        src={account.logo_url} 
                        alt={`${account.brand} ${account.product_name}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Wallet size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-[#1B1F3B]">
                    {account.brand} {account.product_name}
                  </h3>
                </div>
                
                {compareFields.map(({ label, field, format }) => (
                  <div key={label} className="py-4 border-b">
                    {format(account[field as keyof SavingsAccount])}
                  </div>
                ))}
                
                <div className="mt-6">
                  <a 
                    href={account.visit_site_link || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1B1F3B] text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center"
                  >
                    Visit Bank
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoDrawer: React.FC<InfoDrawerProps> = ({ account, isOpen, onClose }) => {
  if (!account) return null;

  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      if (value > 1) return formatCurrency(value);
      return formatPercentage(value);
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    return value;
  };

  const sections = [
    {
      title: 'Interest & Rates',
      fields: [
        { label: 'Interest Rate', value: account.interest_rate },
        { label: 'Maximum Variable Rate', value: account.max_variable_rate_pa },
        { label: 'Rate Conditions', value: account.monthly_maximum_rate_conditions },
      ]
    },
    {
      title: 'Fees & Requirements',
      fields: [
        { label: 'Minimum Deposit', value: account.minimum_deposit },
        { label: 'Account Fee', value: account.account_fee },
        { label: 'Cheque Book Fee', value: account.cheque_book_fee },
      ]
    },
    {
      title: 'Features & Services',
      fields: [
        { label: 'Internet Banking', value: account.internet_banking },
        { label: 'Debit Card Facility', value: account.debit_card_facility },
        { label: 'eKYC Enabled', value: account.ekyc_enabled },
        { label: 'Features', value: account.features },
      ]
    },
    {
      title: 'Requirements & Eligibility',
      fields: [
        { label: 'Required Documents', value: account.required_documents },
        { label: 'Eligibility Criteria', value: account.eligibility },
      ]
    },
    {
      title: 'Pros & Cons',
      fields: [
        { label: 'Advantages', value: account.pros },
        { label: 'Disadvantages', value: account.cons },
      ]
    },
  ];

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Account Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16">
              {account.logo_url ? (
                <img 
                  src={account.logo_url} 
                  alt={`${account.brand} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                  <Wallet size={24} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{account.brand}</h3>
              <p className="text-gray-600">{account.product_name}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {sections.map(section => (
            <div key={section.title} className="mb-8">
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <div className="space-y-4">
                {section.fields.map(field => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                    <div className="text-sm text-gray-900">{formatValue(field.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavingsAccountsPage; 