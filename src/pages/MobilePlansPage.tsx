import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Filter, X, ArrowUpRight, Smartphone, Info, Check, Menu } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NetworkAnimation from '../components/NetworkAnimation';
import styles from './MobilePlansPage.module.css';
import SEO from '../components/SEO';

interface MobilePlan {
  id: string;
  brand: string;
  product_name: string;
  tagline: string | null;
  recommended: boolean;
  data: string | null;
  talk_time: string | null;
  sms: string | null;
  score: number | null;
  app_score: number | null;
  logo_url: string | null;
  visit_site_link: string | null;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  } | null;
  features: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  eligibility: string | null;
  has_4g: boolean;
  has_4g_plus: boolean;
  has_app: boolean;
  is_prepaid: boolean;
  is_postpaid: boolean;
  has_esim: boolean;
  validity_days: number | null;
  terms_and_conditions: string | null;
  has_roaming: boolean;
  has_entertainment: boolean;
  has_retail_travel_discounts: boolean;
  has_mobile_payment: boolean;
  has_bonus: boolean;
  details: string | null;
  price: number | null;
  is_promoted: boolean;
  is_recommended: boolean;
}

type SortField = 'brand' | 'data' | 'price';

interface CompareModalProps {
  plans: MobilePlan[];
  isOpen: boolean;
  onClose: () => void;
}

interface InfoDrawerProps {
  plan: MobilePlan | null;
  isOpen: boolean;
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ plans, isOpen, onClose }) => {
  if (!isOpen) return null;

  const compareFields = [
    { label: 'Data', field: 'data' },
    { label: 'Talk Time', field: 'talk_time' },
    { label: 'SMS', field: 'sms' },
    { label: 'Validity', field: 'validity_days' },
    { label: 'Price', field: 'price' },
    { label: 'Score', field: 'score' },
    { label: 'Features', field: 'features' },
    { label: '4G', field: 'has_4g' },
    { label: '4G+', field: 'has_4g_plus' },
    { label: 'eSIM', field: 'has_esim' },
    { label: 'Roaming', field: 'has_roaming' },
    { label: 'Entertainment', field: 'has_entertainment' },
    { label: 'Mobile Payment', field: 'has_mobile_payment' },
  ];

  const renderValue = (value: any, field: string) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ') || 'N/A';
    if (typeof value === 'number' && field === 'validity_days') return `${value} days`;
    if (typeof value === 'number' && field === 'price') return `৳${value}`;
    return value;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Compare Plans</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="mb-6 h-40"></div>
            {compareFields.map(({ label }) => (
              <div key={label} className="py-4 border-b font-medium text-gray-600">
                {label}
              </div>
            ))}
          </div>
          
          {plans.map(plan => (
            <div key={plan.id} className="col-span-1">
              <div className="mb-6">
                <div className="w-full h-40 mb-4">
                  {plan.logo_url ? (
                    <img 
                      src={plan.logo_url} 
                      alt={`${plan.brand} ${plan.product_name}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[#1B1F3B] truncate" title={plan.product_name}>
                  {plan.product_name}
                </h3>
              </div>
              
              {compareFields.map(({ field }) => (
                <div key={field} className="py-4 border-b">
                  {renderValue(plan[field as keyof MobilePlan], field)}
                </div>
              ))}
              
              <div className="mt-6">
                <a 
                  href={plan.visit_site_link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#1B1F3B] text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center"
                >
                  VIEW PLAN
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoDrawer: React.FC<InfoDrawerProps> = ({ plan, isOpen, onClose }) => {
  if (!plan) return null;

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A';
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

  const sections = [
    {
      title: 'Plan Details',
      items: [
        { label: 'Data', value: plan.data || 'N/A' },
        { label: 'Talk Time', value: plan.talk_time || 'N/A' },
        { label: 'SMS', value: plan.sms || 'N/A' },
        { label: 'Price', value: formatCurrency(plan.price) },
        { label: 'Validity', value: plan.validity_days ? `${plan.validity_days} days` : 'N/A' },
        { label: 'Plan Type', value: plan.is_prepaid ? 'Prepaid' : 'Postpaid' },
      ]
    },
    {
      title: 'Network Features',
      items: [
        { label: '4G', value: plan.has_4g ? 'Yes' : 'No' },
        { label: '4G+', value: plan.has_4g_plus ? 'Yes' : 'No' },
        { label: 'eSIM', value: plan.has_esim ? 'Yes' : 'No' },
        { label: 'Roaming', value: plan.has_roaming ? 'Yes' : 'No' },
      ]
    },
    {
      title: 'Additional Benefits',
      items: [
        { label: 'Entertainment', value: plan.has_entertainment ? 'Yes' : 'No' },
        { label: 'Mobile App', value: plan.has_app ? 'Yes' : 'No' },
        { label: 'Mobile Payment', value: plan.has_mobile_payment ? 'Yes' : 'No' },
        { label: 'Retail & Travel Discounts', value: plan.has_retail_travel_discounts ? 'Yes' : 'No' },
      ]
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Plan Details</h2>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16">
                {plan.logo_url ? (
                  <img 
                    src={plan.logo_url} 
                    alt={`${plan.brand} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                    <Smartphone size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{plan.brand}</h3>
                <p className="text-gray-600">{plan.product_name}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[#1B1F3B]">{plan.score || 'N/A'}</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-[#1B1F3B]">{plan.app_score || 'N/A'}</div>
                <div className="text-sm text-gray-600">App Score</div>
              </div>
            </div>

            {/* Plan Details */}
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

            {/* Features */}
            {plan.features && plan.features.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-4">Features</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span>• {feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pros & Cons */}
            <div className="grid grid-cols-2 gap-4">
              {plan.pros && plan.pros.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Pros</h4>
                  <ul className="space-y-1">
                    {plan.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-green-600">+ {pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {plan.cons && plan.cons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Cons</h4>
                  <ul className="space-y-1">
                    {plan.cons.map((con, index) => (
                      <li key={index} className="text-sm text-red-600">- {con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Eligibility */}
            {plan.eligibility && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-4">Eligibility</h4>
                <p className="text-gray-600">{plan.eligibility}</p>
              </div>
            )}

            {/* Terms & Conditions */}
            {plan.terms_and_conditions && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-4">Terms & Conditions</h4>
                <p className="text-gray-600">{plan.terms_and_conditions}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4">
              <a 
                href={plan.visit_site_link || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#1B1F3B] text-white px-4 py-3 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center gap-2"
              >
                Get Offer
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    planType: string[];
    provider: string[];
    features: {
      has4G: boolean;
      has4GPlus: boolean;
      hasESIM: boolean;
      hasRoaming: boolean;
      hasEntertainment: boolean;
      hasBonus: boolean;
      hasMobilePayment: boolean;
      hasRetailDiscounts: boolean;
    };
    dataRange: string;
    priceRange: string;
    validityPeriod: string;
    planCategory: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    planType: string[];
    provider: string[];
    features: {
      has4G: boolean;
      has4GPlus: boolean;
      hasESIM: boolean;
      hasRoaming: boolean;
      hasEntertainment: boolean;
      hasBonus: boolean;
      hasMobilePayment: boolean;
      hasRetailDiscounts: boolean;
    };
    dataRange: string;
    priceRange: string;
    validityPeriod: string;
    planCategory: string[];
  }>>;
  expandedFilter: string | null;
  toggleFilter: (filterName: string) => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  expandedFilter,
  toggleFilter
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-lg font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button className="text-sm text-blue-600 font-medium">Share my filters</button>
            <button 
              className="text-sm text-gray-600"
              onClick={() => {
                setFilters({
                  planType: [],
                  provider: [],
                  features: {
                    has4G: false,
                    has4GPlus: false,
                    hasESIM: false,
                    hasRoaming: false,
                    hasEntertainment: false,
                    hasBonus: false,
                    hasMobilePayment: false,
                    hasRetailDiscounts: false,
                  },
                  dataRange: '',
                  priceRange: '',
                  validityPeriod: '',
                  planCategory: [],
                });
              }}
            >
              Clear all
            </button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(Object.entries(filters.features) as [string, boolean][]).map(([key, value]) => value && (
              <span key={key} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                {key.replace('has', '')}
                <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    setFilters(prevFilters => ({
                      ...prevFilters,
                      features: {
                        ...prevFilters.features,
                        [key]: false
                      }
                    }));
                  }}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          {/* Filter Sections - Same as desktop but optimized for touch */}
          <div className="space-y-4">
            {/* Plan Type Filter */}
            <div className="border-b border-gray-200 pb-4">
              <button 
                className="w-full flex justify-between items-center py-2"
                onClick={() => toggleFilter('planType')}
              >
                <span className="font-medium">Plan Type</span>
                <ChevronDown size={20} className={`transition-transform ${expandedFilter === 'planType' ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedFilter === 'planType' && (
                <div className="mt-3 space-y-3">
                  {['Prepaid', 'Postpaid'].map(type => (
                    <label key={type} className="flex items-center py-1">
                      <input 
                        type="checkbox" 
                        checked={filters.planType.includes(type)}
                        onChange={(e) => {
                          setFilters(prevFilters => ({
                            ...prevFilters,
                            planType: e.target.checked 
                              ? [...prevFilters.planType, type]
                              : prevFilters.planType.filter(t => t !== type)
                          }));
                        }}
                        className="w-5 h-5 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                      {type}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Provider Filter */}
            <div className="border-b border-gray-200 pb-4">
              <button 
                className="w-full flex justify-between items-center py-2"
                onClick={() => toggleFilter('provider')}
              >
                <span className="font-medium">Provider</span>
                <ChevronDown size={20} className={`transition-transform ${expandedFilter === 'provider' ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedFilter === 'provider' && (
                <div className="mt-3 space-y-3">
                  {['Airtel', 'Robi', 'Grameenphone', 'Teletalk', 'Banglalink'].map(provider => (
                    <label key={provider} className="flex items-center py-1">
                      <input 
                        type="checkbox" 
                        checked={filters.provider.includes(provider)}
                        onChange={(e) => {
                          setFilters(prevFilters => ({
                            ...prevFilters,
                            provider: e.target.checked 
                              ? [...prevFilters.provider, provider]
                              : prevFilters.provider.filter(p => p !== provider)
                          }));
                        }}
                        className="w-5 h-5 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                      {provider}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Features Filter */}
            <div className="border-b border-gray-200 pb-4">
              <button 
                className="w-full flex justify-between items-center py-2"
                onClick={() => toggleFilter('features')}
              >
                <span className="font-medium">Features</span>
                <ChevronDown size={20} className={`transition-transform ${expandedFilter === 'features' ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedFilter === 'features' && (
                <div className="mt-3 space-y-3">
                  {[
                    { label: '4G', key: 'has4G' },
                    { label: '4G+', key: 'has4GPlus' },
                    { label: 'eSIM', key: 'hasESIM' },
                    { label: 'Roaming', key: 'hasRoaming' },
                    { label: 'Entertainment', key: 'hasEntertainment' },
                    { label: 'Mobile Payment', key: 'hasMobilePayment' }
                  ].map(feature => (
                    <label key={feature.key} className="flex items-center py-1">
                      <input 
                        type="checkbox" 
                        checked={filters.features[feature.key as keyof typeof filters.features]}
                        onChange={(e) => {
                          setFilters(prevFilters => ({
                            ...prevFilters,
                            features: {
                              ...prevFilters.features,
                              [feature.key]: e.target.checked
                            }
                          }));
                        }}
                        className="w-5 h-5 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                      {feature.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Data Range Filter */}
            <div className="border-b border-gray-200 pb-4">
              <button 
                className="w-full flex justify-between items-center py-2"
                onClick={() => toggleFilter('dataRange')}
              >
                <span className="font-medium">Data Amount</span>
                <ChevronDown size={20} className={`transition-transform ${expandedFilter === 'dataRange' ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedFilter === 'dataRange' && (
                <div className="mt-3 space-y-3">
                  {[
                    { label: '1GB - 5GB', value: '1-5' },
                    { label: '5GB - 10GB', value: '5-10' },
                    { label: '10GB - 20GB', value: '10-20' },
                    { label: '20GB+', value: '20+' }
                  ].map(range => (
                    <label key={range.value} className="flex items-center py-1">
                      <input 
                        type="radio" 
                        name="dataRange"
                        value={range.value}
                        checked={filters.dataRange === range.value}
                        onChange={(e) => {
                          setFilters(prevFilters => ({
                            ...prevFilters,
                            dataRange: e.target.value
                          }));
                        }}
                        className="w-5 h-5 mr-3 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="border-b border-gray-200 pb-4">
              <button 
                className="w-full flex justify-between items-center py-2"
                onClick={() => toggleFilter('priceRange')}
              >
                <span className="font-medium">Price Range</span>
                <ChevronDown size={20} className={`transition-transform ${expandedFilter === 'priceRange' ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedFilter === 'priceRange' && (
                <div className="mt-3 space-y-3">
                  {[
                    { label: '৳0 - ৳300', value: '0-300' },
                    { label: '৳301 - ৳600', value: '301-600' },
                    { label: '৳601 - ৳1000', value: '601-1000' },
                    { label: '৳1000+', value: '1000-' }
                  ].map(range => (
                    <label key={range.value} className="flex items-center py-1">
                      <input 
                        type="radio" 
                        name="priceRange"
                        value={range.value}
                        checked={filters.priceRange === range.value}
                        onChange={(e) => {
                          setFilters(prevFilters => ({
                            ...prevFilters,
                            priceRange: e.target.value
                          }));
                        }}
                        className="w-5 h-5 mr-3 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" 
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="w-full bg-[#1B1F3B] text-white py-3 rounded-lg font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

const MobilePlansPage: React.FC = () => {
  const [mobilePlans, setMobilePlans] = useState<MobilePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'brand' | 'data' | 'price'>('data');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    planType: [] as string[],
    provider: [] as string[],
    features: {
      has4G: false,
      has4GPlus: false,
      hasESIM: false,
      hasRoaming: false,
      hasEntertainment: false,
      hasBonus: false,
      hasMobilePayment: false,
      hasRetailDiscounts: false,
    },
    dataRange: '' as string,
    priceRange: '' as string,
    validityPeriod: '' as string,
    planCategory: [] as string[],
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MobilePlan | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        // Scroll to top when mobile view is detected
        window.scrollTo(0, 0);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchMobilePlans();
  }, []);

  const fetchMobilePlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mobile_plans')
        .select('*')
        .order('score', { ascending: false });

      if (error) throw error;
      if (data) {
        setMobilePlans(data);
      }
    } catch (error) {
      console.error('Error fetching mobile plans:', error);
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
      setSortDirection(field === 'brand' ? 'asc' : 'desc');
    }
  };

  const parseDataValue = (dataStr: string | null): number => {
    if (!dataStr) return 0;
    const match = dataStr.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const parseTalkTimeValue = (talkStr: string | null): number => {
    if (!talkStr) return 0;
    const match = talkStr.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const sortedPlans = [...mobilePlans].sort((a, b) => {
    let valA: any;
    let valB: any;

    switch (sortField) {
      case 'brand':
        valA = a.brand.toLowerCase();
        valB = b.brand.toLowerCase();
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);

      case 'data':
        valA = parseDataValue(a.data);
        valB = parseDataValue(b.data);
        return sortDirection === 'asc' ? valA - valB : valB - valA;

      case 'price':
        valA = a.price || 0;
        valB = b.price || 0;
        return sortDirection === 'asc' ? valA - valB : valB - valA;

      default:
        return 0;
    }
  });

  const filteredPlans = sortedPlans.filter(plan => {
    // Filter by plan type if any selected
    if (filters.planType.length > 0) {
      const planType = plan.is_prepaid ? 'Prepaid' : 'Postpaid';
      if (!filters.planType.includes(planType)) {
        return false;
      }
    }

    // Filter by provider
    if (filters.provider.length > 0 && !filters.provider.includes(plan.brand)) {
      return false;
    }
    
    // Filter by features
    if (filters.features.has4G && !plan.has_4g) return false;
    if (filters.features.has4GPlus && !plan.has_4g_plus) return false;
    if (filters.features.hasESIM && !plan.has_esim) return false;
    if (filters.features.hasRoaming && !plan.has_roaming) return false;
    if (filters.features.hasEntertainment && !plan.has_entertainment) return false;
    if (filters.features.hasBonus && !plan.has_bonus) return false;
    if (filters.features.hasMobilePayment && !plan.has_mobile_payment) return false;
    if (filters.features.hasRetailDiscounts && !plan.has_retail_travel_discounts) return false;

    // Filter by data range
    if (filters.dataRange) {
      const dataValue = parseDataValue(plan.data);
      switch (filters.dataRange) {
        case '1-5':
          if (dataValue < 1 || dataValue > 5) return false;
          break;
        case '5-10':
          if (dataValue < 5 || dataValue > 10) return false;
          break;
        case '10-20':
          if (dataValue < 10 || dataValue > 20) return false;
          break;
        case '20+':
          if (dataValue < 20) return false;
          break;
      }
    }

    // Filter by price range
    if (filters.priceRange && plan.price) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (max) {
        if (plan.price < min || plan.price > max) return false;
      } else {
        if (plan.price < min) return false;
      }
    }

    // Filter by validity period
    if (filters.validityPeriod && plan.validity_days) {
      const [min, max] = filters.validityPeriod.split('-').map(Number);
      if (max) {
        if (plan.validity_days < min || plan.validity_days > max) return false;
      } else {
        if (plan.validity_days < min) return false;
      }
    }

    // Filter by plan category
    if (filters.planCategory.length > 0) {
      const matchesCategory = filters.planCategory.some(category => {
        switch (category) {
          case 'budget':
            return plan.price && plan.price <= 300;
          case 'value':
            return plan.price && plan.price > 300 && plan.price <= 600;
          case 'premium':
            return plan.price && plan.price > 600;
          default:
            return true;
        }
      });
      if (!matchesCategory) return false;
    }
    
    return true;
  });

  const handleCompareToggle = (planId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      }
      if (prev.length < 2) {
        return [...prev, planId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      setIsCompareModalOpen(true);
    }
  };

  const selectedPlans = mobilePlans.filter(plan => selectedForComparison.includes(plan.id));

  // Add scroll to top when closing drawers
  const handleCloseMobileFilter = () => {
    setIsMobileFilterOpen(false);
    window.scrollTo(0, 0);
  };

  const handleCloseInfoDrawer = () => {
    setSelectedPlan(null);
    window.scrollTo(0, 0);
  };

  // Mobile version
  if (isMobile) {
    const operatorLogos = [
      {
        src: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Airtel_Bangladesh-Logo.wine.png",
        alt: "Airtel Bangladesh"
      },
      {
        src: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Grameenphone-logo.png",
        alt: "Grameenphone"
      },
      {
        src: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Logo_of_Banglalink.svg.png",
        alt: "Banglalink"
      },
      {
        src: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//robi.png",
        alt: "Robi"
      },
      {
        src: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Teletalk_Bangladesh_Limited.svg.png",
        alt: "Teletalk"
      }
    ];

    // Split logos into groups of 3
    const logoGroups = [];
    for (let i = 0; i < operatorLogos.length; i += 3) {
      logoGroups.push(operatorLogos.slice(i, i + 3));
    }

    return (
      <div className="min-h-screen bg-white">
        <SEO
          title="Best Mobile Recharge Offers Bangladesh 2024 | GP, Robi, Airtel, Banglalink & Teletalk"
          description="Compare best mobile recharge offers, internet packs & minute offers in Bangladesh. Find GP recharge offers, Robi minute packs, Airtel internet packs, Banglalink & Teletalk offers. eSIM support available."
          keywords="mobile recharge, gp recharge offer, grameenphone recharge, robi minute offer, airtel internet pack, banglalink recharge offer, teletalk minute offer, sim card, esim, mobile phone recharge, top up, best cell phone deals"
          pageType="mobile-plans"
          canonical="https://kontanibo.com/mobile-plans"
        />
        {/* Mobile Hero Section */}
        <div className="bg-[#1A1F36] text-white py-4 px-4 relative overflow-hidden">
          <NetworkAnimation />
          <div className="relative z-10">
            <h1 className="text-xl font-bold mb-2">Best Mobile Plans Bangladesh 2025: Compare Grameenphone, Robi & Banglalink Offers</h1>
            <p className="text-sm text-gray-300">Compare {mobilePlans.length}+ recharge offers, internet packs & minute offers from GP, Robi, Airtel, Banglalink & Teletalk</p>
          </div>
        </div>

        {/* Operator Logos Section */}
        <div className="bg-white py-4 px-3 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-600 mb-3">Compare Recharge Offers from Top Mobile Operators</h2>
          <p className="text-xs text-gray-500 mb-3">Best mobile recharge offers, internet packs & minute offers from GP, Robi, Airtel, Banglalink & Teletalk</p>
          <div className="space-y-3">
            {logoGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="grid grid-cols-3 gap-3">
                {group.map((logo, logoIndex) => (
                  <div 
                    key={logoIndex} 
                    className="flex items-center justify-center h-16"
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>
                ))}
                {group.length < 3 && Array(3 - group.length).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="h-16" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile SEO Content */}
        <div className="bg-gray-50 mx-3 rounded-lg p-4 mb-3">
          <h2 className="text-lg font-bold text-[#1C1E23] mb-2">Best Mobile Recharge Offers</h2>
          <p className="text-sm text-gray-600 mb-3">
            Find the best mobile recharge offers from GP, Robi, Airtel, Banglalink & Teletalk. 
            Compare minute packs, internet offers, and top-up deals with eSIM support.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">GP Recharge</span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Robi Minutes</span>
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Airtel Internet</span>
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">eSIM Plans</span>
          </div>
        </div>

        <div className="px-3 py-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span className="text-sm font-medium">Filter Recharge Offers</span>
            </div>
            <ChevronDown size={16} />
          </button>

          {/* Mobile Sort Controls */}
          <div className="bg-white rounded-lg p-2 mb-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Sort by</span>
              <span className="text-xs text-gray-500">{filteredPlans.length} plans</span>
            </div>
            <div className="flex gap-1">
              <button 
                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded ${
                  sortField === 'data' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => handleSort('data')}
              >
                Data {sortField === 'data' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`flex-1 px-2 py-1.5 text-xs font-medium rounded ${
                  sortField === 'price' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => handleSort('price')}
              >
                Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white p-6 rounded-lg flex justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-xs text-gray-600">Loading plans...</p>
              </div>
            </div>
          ) : (
            /* Mobile Plan Cards */
            <div className="space-y-2">
              {filteredPlans.map(plan => (
                <div key={plan.id} className={`${styles.mobilePlanCard} border-gray-200`}>
                  {/* Promotion Tag */}
                  {plan.is_promoted && (
                    <div className={styles.promotedTag}>PROMOTED</div>
                  )}
                  
                  <div className={styles.cardHeader}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0">
                          {plan.logo_url ? (
                            <img 
                              src={plan.logo_url} 
                              alt={plan.brand}
                              className={styles.providerLogo}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                              <Smartphone size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className={styles.planName}>{plan.product_name}</h3>
                          <p className={styles.providerName}>{plan.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={styles.priceTag}>৳{plan.price}</div>
                        <div className={styles.priceSubtext}>per month</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    {/* Plan Features */}
                    <div className={styles.planFeatures}>
                      <div className={styles.featureItem}>
                        <Check size={14} className="text-green-500" />
                        <span>{plan.data} Data</span>
                      </div>
                      {plan.talk_time && (
                        <div className={styles.featureItem}>
                          <Check size={14} className="text-green-500" />
                          <span>{plan.talk_time}</span>
                        </div>
                      )}
                      {plan.validity_days && (
                        <div className={styles.featureItem}>
                          <Check size={14} className="text-green-500" />
                          <span>{plan.validity_days} days validity</span>
                        </div>
                      )}
                    </div>

                    {/* Plan Tags */}
                    <div className={styles.planTags}>
                      <span className={styles.tag}>
                        {plan.is_prepaid ? 'Prepaid' : 'Postpaid'}
                      </span>
                      {plan.has_esim && (
                        <span className={styles.tag}>eSIM</span>
                      )}
                      {plan.has_4g && (
                        <span className={styles.tag}>4G</span>
                      )}
                      {plan.has_roaming && (
                        <span className={styles.tag}>Roaming</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                      <a 
                        href={plan.visit_site_link || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.primaryButton}
                      >
                        Get Offer
                      </a>
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        className={styles.secondaryButton}
                      >
                        <Info size={14} />
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Filter Drawer */}
        <MobileFilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={handleCloseMobileFilter}
          filters={filters}
          setFilters={setFilters}
          expandedFilter={expandedFilter}
          toggleFilter={toggleFilter}
        />

        {/* Mobile Info Drawer */}
        <InfoDrawer
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={handleCloseInfoDrawer}
        />
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Best Mobile Recharge Offers Bangladesh 2024 | GP, Robi, Airtel, Banglalink & Teletalk"
        description="Compare best mobile recharge offers, internet packs & minute offers in Bangladesh. Find GP recharge offers, Robi minute packs, Airtel internet packs, Banglalink & Teletalk offers. eSIM support available."
        keywords="mobile recharge, gp recharge offer, grameenphone recharge, robi minute offer, airtel internet pack, banglalink recharge offer, teletalk minute offer, sim card, esim, mobile phone recharge, top up, best cell phone deals"
        pageType="mobile-plans"
        canonical="https://kontanibo.com/mobile-plans"
      />
      {/* Hero Section */}
      <div className="bg-[#1A1F36] text-white py-12 px-4 relative overflow-hidden">
        <NetworkAnimation />
        <div className="max-w-6xl mx-auto relative z-10">
                      <h1 className="text-4xl font-bold mb-4">Best Mobile Plans Bangladesh 2025: Compare Grameenphone, Robi & Banglalink Offers</h1>
          <p className="text-xl mb-6">Compare {mobilePlans.length}+ mobile recharge offers, internet packs, and minute offers from Grameenphone, Robi, Airtel, Banglalink & Teletalk. Find the best cell phone deals with top-up options, eSIM support, and exclusive recharge offers updated daily!</p>
          <div className="flex flex-wrap gap-2 mt-4 text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full">GP Recharge Offer</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Robi Minute Pack</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Airtel Internet Pack</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">eSIM Support</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Mobile Phone Recharge</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* SEO Content Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-[#1C1E23] mb-4">Find the Best Mobile Recharge Offers in Bangladesh</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Popular Recharge Offers</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Grameenphone Recharge Offer:</strong> GP minute offers, internet packs, and top-up deals</li>
                <li>• <strong>Robi Minute Pack:</strong> 30-day validity packs with bonus minutes</li>
                <li>• <strong>Airtel Internet Pack:</strong> High-speed data packages with flexible validity</li>
                <li>• <strong>Banglalink Recharge Offer:</strong> Affordable recharge plans with bonus benefits</li>
                <li>• <strong>Teletalk Minute Offer:</strong> Government operator with competitive rates</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Features Available</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>eSIM Support:</strong> Digital SIM card activation for modern devices</li>
                <li>• <strong>Mobile Phone Recharge:</strong> Easy top-up options for all operators</li>
                <li>• <strong>Best Cell Phone Deals:</strong> Compare prices to find the lowest rates</li>
                <li>• <strong>SIM Card Plans:</strong> Prepaid and postpaid options available</li>
                <li>• <strong>4G/5G Networks:</strong> High-speed internet connectivity</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Provider Logos */}
        <div className={`mb-8 ${styles.carouselContainer}`}>
          <h2 className="text-2xl font-bold text-[#1C1E23] mb-6">Compare Mobile Recharge Offers from Top Operators</h2>
          <p className="text-gray-600 mb-6">Find the best recharge offers, internet packs, and minute offers from Bangladesh's leading mobile operators. Compare GP recharge offers, Robi minute packs, Airtel internet packs, Banglalink recharge offers, and Teletalk minute offers.</p>
          <div className="relative">
            <div className={`flex gap-12 ${styles.animateCarousel}`}>
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Airtel_Bangladesh-Logo.wine.png"
                  alt="Airtel Bangladesh"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//robi.png"
                  alt="Robi"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Grameenphone-logo.png"
                  alt="Grameenphone"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Teletalk_Bangladesh_Limited.svg.png"
                  alt="Teletalk Bangladesh"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Logo_of_Banglalink.svg.png"
                  alt="Banglalink"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              {/* Duplicate logos for seamless scrolling */}
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Airtel_Bangladesh-Logo.wine.png"
                  alt="Airtel Bangladesh"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//robi.png"
                  alt="Robi"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Grameenphone-logo.png"
                  alt="Grameenphone"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Teletalk_Bangladesh_Limited.svg.png"
                  alt="Teletalk Bangladesh"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-shrink-0 w-48">
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/logogsm//Logo_of_Banglalink.svg.png"
                  alt="Banglalink"
                  className="w-full h-24 object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Column */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold">Filter Mobile Recharge Offers</h2>
                <p className="text-sm text-gray-600 mt-1">Find the best recharge deals for your needs</p>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <button className="text-sm text-blue-600 font-medium">Share my filters</button>
                  <button className="text-sm text-gray-600">Clear all</button>
                </div>

                {/* Active Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(filters.features).map(([key, value]) => value && (
                    <span key={key} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                      {key.replace('has', '')}
                      <button className="text-gray-400 hover:text-gray-600">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Filter Sections */}
                <div className="space-y-4">
                  {/* Plan Type Filter */}
                  <div className="border-b border-gray-200 pb-4">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => toggleFilter('planType')}
                    >
                      <span className="font-medium">Plan Type</span>
                      <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'planType' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedFilter === 'planType' && (
                      <div className="mt-3 space-y-2">
                        {['Prepaid', 'Postpaid'].map(type => (
                          <label key={type} className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.planType.includes(type)}
                              onChange={(e) => {
                                setFilters(prev => ({
                                  ...prev,
                                  planType: e.target.checked 
                                    ? [...prev.planType, type]
                                    : prev.planType.filter(t => t !== type)
                                }));
                              }}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Provider Filter */}
                  <div className="border-b border-gray-200 pb-4">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => toggleFilter('provider')}
                    >
                      <span className="font-medium">Provider</span>
                      <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'provider' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedFilter === 'provider' && (
                      <div className="mt-3 space-y-2">
                        {['Airtel', 'Robi', 'Grameenphone', 'Teletalk', 'Banglalink'].map(provider => (
                          <label key={provider} className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.provider.includes(provider)}
                              onChange={(e) => {
                                setFilters(prev => ({
                                  ...prev,
                                  provider: e.target.checked 
                                    ? [...prev.provider, provider]
                                    : prev.provider.filter(p => p !== provider)
                                }));
                              }}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            {provider}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Data Range Filter */}
                  <div className="border-b border-gray-200 pb-4">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => toggleFilter('dataRange')}
                    >
                      <span className="font-medium">Data Amount</span>
                      <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'dataRange' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedFilter === 'dataRange' && (
                      <div className="mt-3 space-y-2">
                        {[
                          { label: '1GB - 5GB', value: '1-5' },
                          { label: '5GB - 10GB', value: '5-10' },
                          { label: '10GB - 20GB', value: '10-20' },
                          { label: '20GB+', value: '20+' }
                        ].map(range => (
                          <label key={range.value} className="flex items-center">
                            <input 
                              type="radio" 
                              name="dataRange"
                              value={range.value}
                              checked={filters.dataRange === range.value}
                              onChange={(e) => {
                                setFilters(prev => ({
                                  ...prev,
                                  dataRange: e.target.value
                                }));
                              }}
                              className="mr-2 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            {range.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Range Filter */}
                  <div className="border-b border-gray-200 pb-4">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => toggleFilter('priceRange')}
                    >
                      <span className="font-medium">Price Range</span>
                      <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'priceRange' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedFilter === 'priceRange' && (
                      <div className="mt-3 space-y-2">
                        {[
                          { label: '৳0 - ৳300', value: '0-300' },
                          { label: '৳301 - ৳600', value: '301-600' },
                          { label: '৳601 - ৳1000', value: '601-1000' },
                          { label: '৳1000+', value: '1000-' }
                        ].map(range => (
                          <label key={range.value} className="flex items-center">
                            <input 
                              type="radio" 
                              name="priceRange"
                              value={range.value}
                              checked={filters.priceRange === range.value}
                              onChange={(e) => {
                                setFilters(prev => ({
                                  ...prev,
                                  priceRange: e.target.value
                                }));
                              }}
                              className="mr-2 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            {range.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Validity Period Filter */}
                  <div className="border-b border-gray-200 pb-4">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => toggleFilter('validityPeriod')}
                    >
                      <span className="font-medium">Validity Period</span>
                      <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'validityPeriod' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedFilter === 'validityPeriod' && (
                      <div className="mt-3 space-y-2">
                        {[
                          { label: '1-7 days', value: '1-7' },
                          { label: '8-30 days', value: '8-30' },
                          { label: '31-90 days', value: '31-90' },
                          { label: '90+ days', value: '90-' }
                        ].map(range => (
                          <label key={range.value} className="flex items-center">
                            <input 
                              type="radio" 
                              name="validityPeriod"
                              value={range.value}
                              checked={filters.validityPeriod === range.value}
                              onChange={(e) => {
                                setFilters(prev => ({
                                  ...prev,
                                  validityPeriod: e.target.value
                                }));
                              }}
                              className="mr-2 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            {range.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Features Filter */}
                  <div className="border-b border-gray-200 pb-4">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => toggleFilter('features')}
                    >
                      <span className="font-medium">Features</span>
                      <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'features' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedFilter === 'features' && (
                      <div className="mt-3 space-y-2">
                        {[
                          { label: '4G', key: 'has4G' },
                          { label: '4G+', key: 'has4GPlus' },
                          { label: 'eSIM', key: 'hasESIM' },
                          { label: 'Roaming', key: 'hasRoaming' },
                          { label: 'Entertainment', key: 'hasEntertainment' },
                          { label: 'Bonus', key: 'hasBonus' },
                          { label: 'Mobile Payment', key: 'hasMobilePayment' },
                          { label: 'Retail Discounts', key: 'hasRetailDiscounts' }
                        ].map(feature => (
                          <label key={feature.key} className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.features[feature.key as keyof typeof filters.features]}
                              onChange={(e) => {
                                setFilters(prev => ({
                                  ...prev,
                                  features: {
                                    ...prev.features,
                                    [feature.key]: e.target.checked
                                  }
                                }));
                              }}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            {feature.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Plan Category Filter */}
                  <div className="border-b border-gray-200 pb-4">
                    <button 
                      className="w-full flex justify-between items-center"
                      onClick={() => toggleFilter('planCategory')}
                    >
                      <span className="font-medium">Plan Category</span>
                      <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'planCategory' ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedFilter === 'planCategory' && (
                      <div className="mt-3 space-y-2">
                        {[
                          { label: 'Budget (৳0 - ৳300)', value: 'budget' },
                          { label: 'Value (৳301 - ৳600)', value: 'value' },
                          { label: 'Premium (৳600+)', value: 'premium' }
                        ].map(category => (
                          <label key={category.value} className="flex items-center">
                            <input 
                              type="checkbox" 
                              checked={filters.planCategory.includes(category.value)}
                              onChange={(e) => {
                                setFilters(prev => ({
                                  ...prev,
                                  planCategory: e.target.checked 
                                    ? [...prev.planCategory, category.value]
                                    : prev.planCategory.filter(c => c !== category.value)
                                }));
                              }}
                              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            {category.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="bg-white p-8 rounded-lg border border-gray-200 flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading mobile plans...</p>
                </div>
              </div>
            ) : (
              <div>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    1 - {filteredPlans.length} of {mobilePlans.length}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Sort by</span>
                    <div className="flex border rounded-lg overflow-hidden">
                      <button 
                        className={`px-4 py-2 text-sm font-medium ${
                          sortField === 'brand' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        } border-r`}
                        onClick={() => handleSort('brand')}
                      >
                        Brand {sortField === 'brand' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                      <button 
                        className={`px-4 py-2 text-sm font-medium ${
                          sortField === 'data' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        } border-r`}
                        onClick={() => handleSort('data')}
                      >
                        Data {sortField === 'data' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                      <button 
                        className={`px-4 py-2 text-sm font-medium ${
                          sortField === 'price' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => handleSort('price')}
                      >
                        Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Plan Cards */}
                <div className="space-y-4">
                  {filteredPlans.map(plan => (
                    <div key={plan.id} className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${plan.is_recommended ? 'border-t-4 border-t-blue-600' : ''}`}>
                      {/* Promotion Tag - only show if promoted */}
                      {plan.is_promoted && (
                        <div className="bg-yellow-400 text-xs font-medium px-3 py-1">PROMOTED</div>
                      )}
                      
                      {/* Bonus Banner */}
                      {plan.has_bonus && (
                        <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1">Bonus Included</div>
                      )}
                      
                      <div className="p-6">
                        <div className="grid grid-cols-12 gap-6 items-center">
                          {/* Provider Logo */}
                          <div className="col-span-3">
                            <div className="w-32 h-16">
                              {plan.logo_url ? (
                                <img 
                                  src={plan.logo_url} 
                                  alt={plan.brand}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                                  <Smartphone size={24} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-bold mt-2">{plan.product_name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {plan.is_prepaid && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Prepaid</span>
                              )}
                              {!plan.is_prepaid && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Postpaid</span>
                              )}
                              {plan.has_esim && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">eSIM</span>
                              )}
                            </div>
                          </div>

                          {/* Plan Features */}
                          <div className="col-span-4">
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2">
                                <Check size={16} className="text-green-500" />
                                <span>{plan.data} Data</span>
                              </li>
                              {plan.talk_time && (
                                <li className="flex items-center gap-2">
                                  <Check size={16} className="text-green-500" />
                                  <span>{plan.talk_time}</span>
                                </li>
                              )}
                              {plan.has_4g && (
                                <li className="flex items-center gap-2">
                                  <Check size={16} className="text-green-500" />
                                  <span>4G network</span>
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Price */}
                          <div className="col-span-3 text-center">
                            <div className="text-3xl font-bold text-[#1B1F3B]">
                              ৳{plan.price}
                            </div>
                            <div className="text-sm text-gray-500">per month</div>
                            {plan.validity_days && (
                              <div className="text-xs text-gray-500 mt-1">
                                {plan.validity_days} days validity
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="col-span-2">
                            <div className="flex flex-col gap-2">
                              <a 
                                href={plan.visit_site_link || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-[#1A1F36] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#2d325f] transition text-center"
                              >
                                Get Offer
                              </a>
                              <button
                                onClick={() => setSelectedPlan(plan)}
                                className="text-blue-600 text-sm font-medium hover:text-blue-700 transition flex items-center justify-center gap-1"
                              >
                                View details
                                <ChevronDown size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Footer Content */}
        <div className="bg-gray-50 mt-12 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1C1E23] mb-6">About Mobile Recharge Offers in Bangladesh</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Grameenphone (GP) Offers</h3>
                <p className="text-sm text-gray-700">
                  Grameenphone recharge offers include the best GP minute offers, internet packs, and special top-up deals. 
                  Compare Grameenphone eSIM plans and find the perfect GP recharge offer for your needs.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Robi & Airtel Packages</h3>
                <p className="text-sm text-gray-700">
                  Robi minute packs with 30-day validity and Airtel internet packs offer great value. 
                  Find the best Robi recharge offers and Airtel offers for mobile phone recharge.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Banglalink & Teletalk</h3>
                <p className="text-sm text-gray-700">
                  Banglalink recharge offers and Teletalk minute offers provide affordable mobile recharge options. 
                  Compare all operators to find the best cell phone deals and SIM card plans.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Compare mobile recharge offers, internet packs, minute offers, and eSIM plans from all major operators in Bangladesh. 
                Find the best top-up deals and mobile phone recharge options updated daily.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CompareModal
        plans={selectedPlans}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
      <InfoDrawer
        plan={selectedPlan}
        isOpen={!!selectedPlan}
        onClose={handleCloseInfoDrawer}
      />
    </div>
  );
};

export default MobilePlansPage; 