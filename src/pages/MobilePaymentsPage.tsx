import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Filter, ArrowRight, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobilePayment {
  id: number;
  name: string | null;
  features: string[];  // JSONB in database storing array of strings
  cash_out_fee: string | null;
  utility_bills_fee: string | null;
  credit_card_payment_fees: string | null;
  digital_to_bank_fees: Record<string, string> | null;  // JSONB in database
  apps_available: string[] | null;  // Array in database
  description: Record<string, string> | null;  // JSONB in database
  eligibility: Record<string, string> | null;  // JSONB in database
  transfer_fees: Record<string, string | Record<string, string>> | null;  // JSONB in database with nested objects
  international_remittance: Record<string, string> | null;  // JSONB in database
  image_url: string | null;
  site_link: string | null;
  created_at: string | null;
  updated_at: string | null;
}

type SortField = 'cash_out_fee' | 'utility_bills_fee' | 'credit_card_payment_fees';

const MobilePaymentsPage: React.FC = () => {
  const [mobilePayments, setMobilePayments] = useState<MobilePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('cash_out_fee');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    appType: [] as string[],
    features: [] as string[],
    hasFreeServices: {
      cashOut: false,
      utilityBills: false,
      creditCardPayments: false,
    },
    hasDigitalBankTransfer: false,
    hasInternationalRemittance: false,
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<MobilePayment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchMobilePayments();
  }, []);

  useEffect(() => {
    // Extract unique features from all mobile payments
    const features = new Set<string>();
    mobilePayments.forEach(payment => {
      payment.features.forEach(feature => features.add(feature));
    });
    setAvailableFeatures(Array.from(features).sort());
  }, [mobilePayments]);

  const fetchMobilePayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mobile_payment')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) {
        setMobilePayments(data);
      }
    } catch (error) {
      console.error('Error fetching mobile payments:', error);
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

  const sortedPayments = [...mobilePayments].sort((a, b) => {
    const valA = String(a[sortField] || '');
    const valB = String(b[sortField] || '');
    
    // Convert fee strings to numbers for proper sorting
    const numA = parseFloat(valA.replace(/[^0-9.]/g, '')) || 0;
    const numB = parseFloat(valB.replace(/[^0-9.]/g, '')) || 0;

    if (sortDirection === 'asc') {
      return numA > numB ? 1 : -1;
    } else {
      return numA < numB ? 1 : -1;
    }
  });

  const filteredPayments = sortedPayments.filter(payment => {
    // Filter by app type if any selected
    if (filters.appType.length > 0 && !filters.appType.some(app => payment.apps_available?.includes(app) || false)) {
      return false;
    }
    
    // Filter by features if any selected
    if (filters.features.length > 0 && !filters.features.some(feature => payment.features.includes(feature))) {
      return false;
    }

    // Filter by free services
    if (filters.hasFreeServices.cashOut && payment.cash_out_fee && payment.cash_out_fee !== 'Free' && payment.cash_out_fee !== '৳0') {
      return false;
    }
    if (filters.hasFreeServices.utilityBills && payment.utility_bills_fee && payment.utility_bills_fee !== 'Free' && payment.utility_bills_fee !== '৳0') {
      return false;
    }
    if (filters.hasFreeServices.creditCardPayments && payment.credit_card_payment_fees && payment.credit_card_payment_fees !== 'Free' && payment.credit_card_payment_fees !== '৳0') {
      return false;
    }

    // Filter by digital bank transfer availability
    if (filters.hasDigitalBankTransfer && Object.keys(payment.digital_to_bank_fees || {}).length === 0) {
      return false;
    }
    
    // Filter by international remittance
    if (filters.hasInternationalRemittance && Object.keys(payment.international_remittance || {}).length === 0) {
      return false;
    }
    
    return true;
  });

  const PaymentDetailsDrawer: React.FC<{ payment: MobilePayment | null; onClose: () => void }> = ({ payment, onClose }) => {
    if (!payment) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
        <div className="bg-white w-full max-w-2xl h-full overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{payment.name}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <ul className="space-y-2">
                {payment.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Transfer Fees */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Transfer Fees</h3>
              {payment.transfer_fees && Object.entries(payment.transfer_fees).map(([key, value]: [string, string | Record<string, string>]) => (
                <div key={key} className="mb-3">
                  <div className="font-medium">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:</div>
                  {typeof value === 'object' ? (
                    <div className="ml-4">
                      {Object.entries(value).map(([subKey, subValue]: [string, string]) => (
                        <div key={subKey} className="text-gray-600">
                          {subKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: {subValue}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="ml-4 text-gray-600">{value}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Other Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Cash Out Fee</h3>
                <p className="text-gray-600">{payment.cash_out_fee}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Utility Bills Fee</h3>
                <p className="text-gray-600">{payment.utility_bills_fee}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Credit Card Payment Fees</h3>
                <p className="text-gray-600">{payment.credit_card_payment_fees}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{payment.description?.summary}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Eligibility</h3>
                <p className="text-gray-600">{payment.eligibility?.requirements}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">Best Mobile Payment Solutions Bangladesh 2025: bKash, Nagad & Digital Wallets</h1>
          <p className="text-xl font-medium">Compare {mobilePayments.length}+ services - fees, features, and transfer options updated daily.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Column */}
          <div className="md:w-1/4">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h2 className="text-xl font-extrabold mb-4 tracking-tight">Refine results</h2>
              
              {/* App Type Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('appType')}
                >
                  <span className="font-medium">App Type</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'appType' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'appType' && (
                  <div className="mt-3 space-y-2">
                    {['iOS', 'Android', 'Web'].map(type => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded" 
                          checked={filters.appType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, appType: [...filters.appType, type]});
                            } else {
                              setFilters({...filters, appType: filters.appType.filter(t => t !== type)});
                            }
                          }}
                        />
                        {type}
                      </label>
                    ))}
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
                    {availableFeatures.map(feature => (
                      <label key={feature} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded" 
                          checked={filters.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, features: [...filters.features, feature]});
                            } else {
                              setFilters({...filters, features: filters.features.filter(f => f !== feature)});
                            }
                          }}
                        />
                        {feature}
                      </label>
                    ))}
                    {availableFeatures.length === 0 && (
                      <p className="text-sm text-gray-500 italic">No features available</p>
                    )}
                  </div>
                )}
              </div>

              {/* Free Services Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('freeServices')}
                >
                  <span className="font-medium">Free Services</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'freeServices' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'freeServices' && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded" 
                        checked={filters.hasFreeServices.cashOut}
                        onChange={(e) => setFilters({
                          ...filters, 
                          hasFreeServices: {...filters.hasFreeServices, cashOut: e.target.checked}
                        })}
                      />
                      Free Cash Out
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded" 
                        checked={filters.hasFreeServices.utilityBills}
                        onChange={(e) => setFilters({
                          ...filters, 
                          hasFreeServices: {...filters.hasFreeServices, utilityBills: e.target.checked}
                        })}
                      />
                      Free Utility Bill Payments
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded" 
                        checked={filters.hasFreeServices.creditCardPayments}
                        onChange={(e) => setFilters({
                          ...filters, 
                          hasFreeServices: {...filters.hasFreeServices, creditCardPayments: e.target.checked}
                        })}
                      />
                      Free Credit Card Payments
                    </label>
                  </div>
                )}
              </div>

              {/* Transfer Options Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('transferOptions')}
                >
                  <span className="font-medium">Transfer Options</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'transferOptions' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'transferOptions' && (
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded" 
                        checked={filters.hasDigitalBankTransfer}
                        onChange={(e) => setFilters({...filters, hasDigitalBankTransfer: e.target.checked})}
                      />
                      Digital to Bank Transfer
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded" 
                        checked={filters.hasInternationalRemittance}
                        onChange={(e) => setFilters({...filters, hasInternationalRemittance: e.target.checked})}
                      />
                      International Remittance
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
                  <p className="text-gray-600">Loading payment services...</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    Showing 1 - {filteredPayments.length} of {mobilePayments.length} services
                  </p>
                  <div className="text-gray-600 text-sm flex items-center">
                    <span className="mr-2">Updated daily</span>
                    <Filter size={16} />
                  </div>
                </div>
                
                {/* Sort bar */}
                <div className="bg-white rounded-t-lg shadow-sm grid grid-cols-6 border-b text-sm text-gray-600">
                  <div className="p-3 col-span-2">Service details</div>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('cash_out_fee')}
                  >
                    Cash Out Fee
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'cash_out_fee' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('utility_bills_fee')}
                  >
                    Utility Bills Fee
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'utility_bills_fee' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('credit_card_payment_fees')}
                  >
                    Card Payment Fee
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'credit_card_payment_fees' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <div className="p-3">Actions</div>
                </div>
                
                {/* Service listings */}
                {filteredPayments.length > 0 ? (
                  <div className="space-y-2">
                    {filteredPayments.map((payment) => (
                      <div key={payment.id} className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="p-4">
                          {/* Mobile-optimized grid */}
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                            {/* Logo/Name Section - Full width on mobile */}
                            <div className="md:col-span-2">
                              <div className="flex items-center gap-3">
                                {payment.image_url ? (
                                  <img 
                                    src={payment.image_url} 
                                    alt={payment.name || ''}
                                    className="w-16 h-16 object-contain"
                                  />
                                ) : (
                                  <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded">
                                    <span className="text-2xl font-bold text-gray-400">{payment.name?.charAt(0) || ''}</span>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h3 className="font-semibold text-base">{payment.name}</h3>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {payment.apps_available?.map((app) => (
                                      <span key={app} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                        {app}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Features list - Mobile only */}
                              <div className="mt-3 md:hidden">
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {(payment.features || []).slice(0, 3).map((feature, index) => (
                                    <li key={index} className="flex items-center gap-1">
                                      <span className="text-green-500 text-xs">✓</span>
                                      {feature}
                                    </li>
                                  ))}
                                  {payment.features.length > 3 && (
                                    <li>
                                      <button 
                                        onClick={() => {
                                          setSelectedPayment(payment);
                                          setIsDrawerOpen(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                      >
                                        + {payment.features.length - 3} more...
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            {/* Fees Section - Stack on mobile */}
                            <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-3 mt-4 md:mt-0">
                              <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xs text-gray-600 mb-1">Charges</div>
                                <span className="text-sm font-medium">{payment.cash_out_fee || 'N/A'}</span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xs text-gray-600 mb-1">Utility Bills</div>
                                <span className="text-sm font-medium">{payment.utility_bills_fee || 'N/A'}</span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded">
                                <div className="text-xs text-gray-600 mb-1">Card Payments</div>
                                <span className="text-sm font-medium">{payment.credit_card_payment_fees || 'N/A'}</span>
                              </div>
                            </div>

                            {/* Actions - Stack on mobile */}
                            <div className="flex flex-col gap-2 md:col-span-1 mt-4 md:mt-0">
                              <button
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setIsDrawerOpen(true);
                                }}
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition hover:bg-blue-700"
                              >
                                GO TO SITE
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setIsDrawerOpen(true);
                                }}
                                className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
                              >
                                Compare
                              </button>
                            </div>

                            {/* Features list - Desktop only */}
                            <div className="hidden md:block md:col-span-2">
                              <ul className="text-xs text-gray-600 space-y-1">
                                {(payment.features || []).slice(0, 3).map((feature, index) => (
                                  <li key={index} className="flex items-center gap-1">
                                    <span className="text-green-500 text-xs">✓</span>
                                    {feature}
                                  </li>
                                ))}
                                {payment.features.length > 3 && (
                                  <li>
                                    <button 
                                      onClick={() => {
                                        setSelectedPayment(payment);
                                        setIsDrawerOpen(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                    >
                                      + {payment.features.length - 3} more...
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <p className="text-gray-600">No payment services match your filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && selectedPayment && (
        <PaymentDetailsDrawer 
          payment={selectedPayment} 
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedPayment(null);
          }} 
        />
      )}
    </motion.div>
  );
};

export default MobilePaymentsPage;