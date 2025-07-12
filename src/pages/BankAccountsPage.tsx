import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronDown, Filter, X, Wallet, ArrowRight, ArrowUpRight, Check, Calculator } from 'lucide-react';
import Speedometer from '../components/Speedometer';

interface BankAccount {
  id: string;
  brand: string;
  product_name: string;
  monthly_fee: number;
  non_bank_atm_fee: number;
  debit_card_options: string;
  minimum_deposit_required: number;
  account_fee: number;
  max_withdrawal: number;
  cheque_book_fee: number;
  online_banking: boolean;
  discounts_on_retailers: boolean;
  entertainment: boolean;
  ekyc_enabled: boolean;
  score: number;
  internet_banking_score: number;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  };
  logo_url: string;
  eligibility: string;
  visit_site_url: string;
  features: string[];
  savings_account: boolean;
}

type SortField = 'monthly_fee' | 'minimum_deposit_required' | 'account_fee' | 'score' | 'internet_banking_score';

interface CompareModalProps {
  accounts: BankAccount[];
  isOpen: boolean;
  onClose: () => void;
}

interface InfoDrawerProps {
  account: BankAccount | null;
  isOpen: boolean;
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ accounts, isOpen, onClose }) => {
  if (!isOpen) return null;

  const compareFields = [
    { label: 'Account Fee', field: 'account_fee', description: 'Half-yearly maintenance fee' },
    { label: 'Minimum Deposit', field: 'minimum_deposit_required', description: 'Initial deposit required to open account' },
    { label: 'Non-Bank ATM Fee', field: 'non_bank_atm_fee', description: 'Fee per transaction at other banks\' ATMs' },
    { label: 'Maximum Withdrawal', field: 'max_withdrawal', description: 'Maximum daily withdrawal limit' },
    { label: 'Cheque Book Fee', field: 'cheque_book_fee', description: 'Fee per leaf (first book may be free)' },
    { label: 'Debit Card', field: 'debit_card_options', description: 'Available debit card options' },
    { label: 'Features', fields: ['online_banking', 'discounts_on_retailers', 'entertainment', 'ekyc_enabled'], description: 'Account features and benefits' },
    { label: 'Eligibility', field: 'eligibility', description: 'Who can open this account' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

  const renderValue = (account: BankAccount, field: string | string[]): React.ReactNode => {
    if (Array.isArray(field)) {
      const features = [];
      if (account.online_banking) features.push('Online Banking Available');
      if (account.discounts_on_retailers) features.push('Retailer Discounts');
      if (account.entertainment) features.push('Entertainment Benefits');
      if (account.ekyc_enabled) features.push('Digital Account Opening (eKYC)');
      return features.length > 0 ? features.map(f => (
        <div key={f} className="flex items-center gap-2 text-sm">
          <Check size={16} className="text-green-500" />
          {f}
        </div>
      )) : 'Basic features only';
    }

    const value = account[field as keyof BankAccount];
    if (value === null || value === undefined) return 'Not specified';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') {
      if (field.includes('fee') || field.includes('deposit') || field.includes('withdrawal')) {
        return formatCurrency(value);
      }
      if (field.includes('score')) return `${value}/10`;
    }
    return value?.toString() || 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg w-11/12 max-w-7xl my-4">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold">Compare Bank Accounts</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Headers */}
            <div className="col-span-1">
              <div className="h-40"></div> {/* Spacer for account images */}
              {compareFields.map(({ label, description }) => (
                <div key={label} className="py-4 border-b">
                  <div className="font-medium text-gray-700">{label}</div>
                  <div className="text-sm text-gray-500">{description}</div>
                </div>
              ))}
            </div>
            
            {/* Account columns */}
            {accounts.map(account => (
              <div key={account.id} className="col-span-1">
                {/* Account image and name */}
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
                  <h3 className="text-lg font-bold tracking-tight text-[#1B1F3B]">{account.product_name}</h3>
                  <p className="text-sm text-gray-600">{account.brand}</p>
                </div>
                
                {/* Account details */}
                {compareFields.map(({ label, field, fields }) => (
                  <div key={label} className="py-4 border-b">
                    {renderValue(account, fields || field)}
                  </div>
                ))}
                
                {/* Additional Features */}
                {account.features && account.features.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Additional Features</h4>
                    <ul className="space-y-1">
                      {account.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check size={14} className="text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="mt-6">
                  <a 
                    href={account.visit_site_url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1B1F3B] text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center gap-2"
                  >
                    Visit Bank Site
                    <ArrowUpRight size={16} />
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

  const sections = [
    {
      title: 'Key Features',
      items: [
        { label: 'Monthly Fee', value: formatCurrency(account.monthly_fee) },
        { label: 'Minimum Deposit', value: formatCurrency(account.minimum_deposit_required) },
        { label: 'Account Fee', value: formatCurrency(account.account_fee) },
        { label: 'Non-Bank ATM Fee', value: formatCurrency(account.non_bank_atm_fee) },
        { label: 'Maximum Withdrawal', value: formatCurrency(account.max_withdrawal) },
        { label: 'Cheque Book Fee', value: formatCurrency(account.cheque_book_fee) },
      ]
    },
    {
      title: 'Account Features',
      items: [
        { label: 'Online Banking', value: account.online_banking ? 'Yes' : 'No' },
        { label: 'Retailer Discounts', value: account.discounts_on_retailers ? 'Yes' : 'No' },
        { label: 'Entertainment Benefits', value: account.entertainment ? 'Yes' : 'No' },
        { label: 'eKYC Enabled', value: account.ekyc_enabled ? 'Yes' : 'No' },
        { label: 'Savings Account', value: account.savings_account ? 'Yes' : 'No' },
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

        <div className="p-6 space-y-8">
          {/* Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Speedometer value={account.score} maxValue={10} size={100} label="Overall Score" />
            </div>
            <div>
              <Speedometer value={account.internet_banking_score} maxValue={10} size={100} label="Online Banking" />
            </div>
          </div>

          {/* Features and Details */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-gray-600 mb-4">{section.title}</h4>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Additional Features */}
          {account.features && account.features.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-4">Additional Features</h4>
              <ul className="space-y-2">
                {account.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eligibility */}
          {account.eligibility && (
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-4">Eligibility</h4>
              <p className="text-gray-600">{account.eligibility}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4">
            <a 
              href={account.visit_site_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#1B1F3B] text-white px-4 py-3 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center gap-2"
            >
              Visit Bank Website
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const BankAccountsPage: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('monthly_fee');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    accountType: [] as string[],
    features: [] as string[],
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('monthly_fee', { ascending: true });

      if (error) throw error;
      if (data) {
        setBankAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
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
      setSortDirection('asc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
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

  const sortedAccounts = [...bankAccounts].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  const filteredAccounts = sortedAccounts.filter(account => {
    if (filters.accountType.length > 0) {
      const accountType = account.savings_account ? 'savings' : 'current';
      if (!filters.accountType.includes(accountType)) {
        return false;
      }
    }
    
    if (filters.features.length > 0) {
      const hasFeatures = filters.features.every(feature => {
        switch (feature) {
          case 'online': return account.online_banking;
          case 'discounts': return account.discounts_on_retailers;
          case 'entertainment': return account.entertainment;
          case 'ekyc': return account.ekyc_enabled;
          default: return true;
        }
      });
      if (!hasFeatures) return false;
    }
    
    return true;
  });

  const selectedAccounts = bankAccounts.filter(account => selectedForComparison.includes(account.id));

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
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">Bank account comparison</h1>
          <p className="text-xl font-medium">Compare {bankAccounts.length}+ bank accounts - fees, features and benefits updated daily.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Column */}
          <div className="md:w-1/4">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h2 className="text-xl font-extrabold mb-4 tracking-tight">Refine results</h2>
              
              {/* Account Type Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('accountType')}
                >
                  <span className="font-medium">Account Type</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'accountType' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'accountType' && (
                  <div className="mt-3 space-y-2">
                    {['savings', 'current'].map(type => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded" 
                          checked={filters.accountType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, accountType: [...filters.accountType, type]});
                            } else {
                              setFilters({...filters, accountType: filters.accountType.filter(t => t !== type)});
                            }
                          }}
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Features Filter */}
              <div className="mb-4">
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
                        checked={filters.features.includes('online')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, features: [...filters.features, 'online']});
                          } else {
                            setFilters({...filters, features: filters.features.filter(f => f !== 'online')});
                          }
                        }}
                      />
                      Online Banking
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded"
                        checked={filters.features.includes('discounts')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, features: [...filters.features, 'discounts']});
                          } else {
                            setFilters({...filters, features: filters.features.filter(f => f !== 'discounts')});
                          }
                        }}
                      />
                      Retailer Discounts
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded"
                        checked={filters.features.includes('entertainment')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, features: [...filters.features, 'entertainment']});
                          } else {
                            setFilters({...filters, features: filters.features.filter(f => f !== 'entertainment')});
                          }
                        }}
                      />
                      Entertainment Benefits
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded"
                        checked={filters.features.includes('ekyc')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, features: [...filters.features, 'ekyc']});
                          } else {
                            setFilters({...filters, features: filters.features.filter(f => f !== 'ekyc')});
                          }
                        }}
                      />
                      eKYC Enabled
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="bg-white p-8 rounded-lg shadow-sm flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1F3B] mb-4"></div>
                  <p className="text-gray-600">Loading bank accounts...</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    Showing 1 - {filteredAccounts.length} of {bankAccounts.length} accounts
                  </p>
                  <div className="text-gray-600 text-sm flex items-center">
                    <span className="mr-2">Updated daily</span>
                    <Filter size={16} />
                  </div>
                </div>
                
                {/* Sort bar */}
                <div className="bg-white rounded-t-lg shadow-sm grid grid-cols-5 border-b text-sm text-gray-600">
                  <div className="p-3 col-span-2">Account details</div>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('minimum_deposit_required')}
                  >
                    Min deposit
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'minimum_deposit_required' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('account_fee')}
                  >
                    Account fee
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
                <div className="space-y-4 mb-8">
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
                              <h3 className="text-xl font-bold tracking-tight text-[#1B1F3B] mb-2">{account.product_name}</h3>
                              {/* Score Meters */}
                              <div className="mt-2 flex gap-4">
                                {typeof account.score === 'number' ? (
                                  <Speedometer value={account.score} maxValue={10} size={80} label="Score" />
                                ) : (
                                  <div className="text-gray-400 text-xs">No score</div>
                                )}
                                {typeof account.internet_banking_score === 'number' ? (
                                  <Speedometer value={account.internet_banking_score} maxValue={10} size={80} label="Internet Banking" color="#0072bc" />
                                ) : (
                                  <div className="text-gray-400 text-xs">No internet banking score</div>
                                )}
                              </div>
                            </div>

                            {/* Key Features */}
                            <div className="col-span-12 md:col-span-5">
                              <h4 className="text-sm font-semibold text-gray-600 mb-4">KEY FEATURES</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-600">Account Fee</div>
                                  <div className="text-xl font-bold text-[#1B1F3B]">{formatCurrency(account.account_fee)}</div>
                                  <div className="text-xs text-gray-500">Half-yearly maintenance</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Min Deposit</div>
                                  <div className="text-base font-semibold text-[#1B1F3B]">
                                    {account.minimum_deposit_required ? formatCurrency(account.minimum_deposit_required) : 'N/A'}
                                  </div>
                                  <div className="text-xs text-gray-500">Initial deposit required</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">ATM Fee</div>
                                  <div className="text-base font-semibold text-[#1B1F3B]">{formatCurrency(account.non_bank_atm_fee)}</div>
                                  <div className="text-xs text-gray-500">Other bank ATMs</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Cheque Book</div>
                                  <div className="text-base font-semibold text-[#1B1F3B]">{formatCurrency(account.cheque_book_fee)}</div>
                                  <div className="text-xs text-gray-500">Per leaf charge</div>
                                </div>
                              </div>
                              <div className="mt-4">
                                <div className="text-sm text-gray-600 mb-2">Account Features</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {account.online_banking && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Check size={16} className="text-green-500 mr-1" />
                                      Online Banking
                                    </div>
                                  )}
                                  {account.discounts_on_retailers && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Check size={16} className="text-green-500 mr-1" />
                                      Retailer Discounts
                                    </div>
                                  )}
                                  {account.entertainment && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Check size={16} className="text-green-500 mr-1" />
                                      Entertainment
                                    </div>
                                  )}
                                  {account.ekyc_enabled && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Check size={16} className="text-green-500 mr-1" />
                                      Digital Opening
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-12 md:col-span-4">
                              <div className="space-y-3">
                                <a 
                                  href={account.visit_site_url || '#'} 
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
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t px-6 py-3 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center gap-4">
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
                          </div>
                          {selectedForComparison.length === 2 && selectedForComparison.includes(account.id) && (
                            <button
                              onClick={handleCompare}
                              className="bg-[#1B1F3B] text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-[#2d325f] transition"
                            >
                              Compare Selected
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                      <p className="text-gray-600">No bank accounts match your filters. Try adjusting your criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CompareModal
        accounts={selectedAccounts}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
      <InfoDrawer
        account={selectedAccount}
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
      />
    </motion.div>
  );
};

export default BankAccountsPage; 