import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Filter, X, ArrowUpRight, Play, Info, Check, Menu } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NetworkAnimation from '../components/NetworkAnimation';
import SEO from '../components/SEO';
import styles from './EntertainmentPage.module.css';

interface Entertainment {
  id: string;
  brand_name: string;
  subscription_name: string;
  monthly_price: number;
  video_quality: string;
  devices: number;
  free_trial: boolean;
  ads: boolean;
  offline: boolean;
  logo_link: string | null;
  created_at: string;
  updated_at: string;
  visit_site: string | null;
  is_promoted?: boolean;
  is_recommended?: boolean;
  features?: string[] | null;
  pros?: string[] | null;
  cons?: string[] | null;
  details?: string | null;
}

interface CompareModalProps {
  plans: Entertainment[];
  isOpen: boolean;
  onClose: () => void;
}

interface InfoDrawerProps {
  plan: Entertainment | null;
  isOpen: boolean;
  onClose: () => void;
}

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    provider: string[];
    features: {
      hasAds: boolean;
      hasOffline: boolean;
      hasFreeTrials: boolean;
    };
    priceRange: string;
    videoQuality: string[];
    devices: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    provider: string[];
    features: {
      hasAds: boolean;
      hasOffline: boolean;
      hasFreeTrials: boolean;
    };
    priceRange: string;
    videoQuality: string[];
    devices: string;
  }>>;
  expandedFilter: string | null;
  toggleFilter: (filterName: string) => void;
}

interface ImageDimensions {
  width: number;
  height: number;
}

const compareFields = [
  { label: 'Video Quality', field: 'video_quality' },
  { label: 'Number of Devices', field: 'devices' },
  { label: 'Monthly Price', field: 'monthly_price' },
  { label: 'Free Trial', field: 'free_trial' },
  { label: 'Ad-Free', field: 'ads' },
  { label: 'Offline Mode', field: 'offline' },
];

// Price Filter Component
const PriceFilter: React.FC<{
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  min: number;
  max: number;
}> = ({ priceRange, setPriceRange, min, max }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>৳{priceRange[0]}</span>
        <span>৳{priceRange[1]}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={priceRange[0]}
          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
          className="absolute w-full"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="absolute w-full"
        />
      </div>
    </div>
  );
};

const EntertainmentPage: React.FC = () => {
  const [entertainmentPlans, setEntertainmentPlans] = useState<Entertainment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'brand_name' | 'monthly_price'>('monthly_price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    provider: [] as string[],
    features: {
      hasAds: false,
      hasOffline: false,
      hasFreeTrials: false,
    },
    priceRange: '' as string,
    videoQuality: [] as string[],
    devices: '' as string,
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Entertainment | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(20);

  const movieImages = [
    "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mob//AAAABbehqRasR6VJlNHdl2Fymq0GPvJI9KyK9F3MzdYlJKN5PLHOtPWybpQlXhT50LdSBJXKlSWNpH_JHYKEg_eKGA_fjEfDZxfOqM0.jpg",
    "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mob//AAAABQYlOae8wO6Al--IVC3PcJeJF08ri_MDsUpUB04XHsWkG1RpvGPcnugD1nLh0AA05VgToKnwlJwaRj5a_QYOVJSsvKD_jK1-5m0.jpg",
    "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mob//Gl7p327WcAAW8HA.jfif",
    "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mob//MV5BYTg0YmNjYmYtYmZhNC00MGEyLWIxMjYtNGY5NTlhZWJhMDAzXkEyXkFqcGc@._V1_.jpg",
    "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mob//MV5BZmMwZTk1MDctMjM1My00YTA5LTg0YmYtZWE5Y2Q4N2JhZGQ1XkEyXkFqcGc@._V1_.jpg",
    "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/mob//ohTVNvJ0jIYO7hasBGniyRLDDgw.jpg"
  ];

  // Update price range options to match actual data
  const priceRangeOptions = [
    { label: 'Under ৳100', value: '0-100' },
    { label: '৳100 - ৳250', value: '100-250' },
    { label: '৳250 - ৳500', value: '250-500' },
    { label: '৳500 - ৳1000', value: '500-1000' },
    { label: 'Above ৳1000', value: '1000-' }
  ];

  // Update video quality options to match actual data
  const videoQualityOptions = [
    '480p',
    '720p (HD)',
    '1080p (full HD)',
    '4K (Ultra HD) + HDR',
    'Up to 4K',
    'HD'
  ];

  // Update device range options to match actual data
  const deviceRangeOptions = [
    { label: '1 Device', value: '1-1' },
    { label: '2-3 Devices', value: '2-3' },
    { label: '4+ Devices', value: '4-' }
  ];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchEntertainmentPlans();
  }, []);

  const fetchEntertainmentPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('entertainment')
        .select('*')
        .order('monthly_price', { ascending: true });

      if (error) throw error;
      if (data) {
        setEntertainmentPlans(data);
      }
    } catch (error) {
      console.error('Error fetching entertainment plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filterName: string) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const handleSort = (field: 'brand_name' | 'monthly_price') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'brand_name' ? 'asc' : 'asc');
    }
  };

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

  const handleCloseMobileFilter = () => {
    setIsMobileFilterOpen(false);
    window.scrollTo(0, 0);
  };

  const handleCloseInfoDrawer = () => {
    setSelectedPlan(null);
    window.scrollTo(0, 0);
  };

  const sortedPlans = [...entertainmentPlans].sort((a, b) => {
    let valA: any;
    let valB: any;

    switch (sortField) {
      case 'brand_name':
        valA = a.brand_name.toLowerCase();
        valB = b.brand_name.toLowerCase();
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);

      case 'monthly_price':
        valA = a.monthly_price || 0;
        valB = b.monthly_price || 0;
        return sortDirection === 'asc' ? valA - valB : valB - valA;

      default:
        return 0;
    }
  });

  const filteredPlans = sortedPlans.filter(plan => {
    // Filter by provider
    if (filters.provider.length > 0 && !filters.provider.includes(plan.brand_name)) {
      return false;
    }
    
    // Filter by features
    if (filters.features.hasAds && plan.ads) return false;
    if (filters.features.hasOffline && !plan.offline) return false;
    if (filters.features.hasFreeTrials && !plan.free_trial) return false;

    // Filter by video quality
    if (filters.videoQuality.length > 0 && !filters.videoQuality.includes(plan.video_quality)) {
      return false;
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (plan.monthly_price === null) return false;
      
      if (max) {
        // For ranges like "0-100", "100-250", etc.
        if (plan.monthly_price < min || plan.monthly_price > max) return false;
      } else {
        // For "1000-" (above 1000)
        if (plan.monthly_price < min) return false;
      }
    }

    // Filter by number of devices
    if (filters.devices) {
      const [min, max] = filters.devices.split('-').map(Number);
      if (plan.devices === null) return false;
      
      if (max) {
        // For ranges like "1-1", "2-3"
        if (plan.devices < min || plan.devices > max) return false;
      } else {
        // For "4-" (4 or more devices)
        if (plan.devices < min) return false;
      }
    }
    
    return true;
  });

  const selectedPlans = entertainmentPlans.filter(plan => selectedForComparison.includes(plan.id));

  // Get unique providers from actual data
  const getUniqueProviders = () => {
    return Array.from(new Set(entertainmentPlans.map(plan => plan.brand_name))).sort();
  };

  const CompareModal: React.FC<CompareModalProps> = ({ plans, isOpen, onClose }) => {
    const renderValue = (value: any, field: string) => {
      switch (field) {
        case 'monthly_price':
          return `৳${value}`;
        case 'free_trial':
        case 'ads':
        case 'offline':
          return value ? 'Yes' : 'No';
        default:
          return value;
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Compare Plans</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
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
                    {plan.logo_link ? (
                      <img 
                        src={plan.logo_link} 
                        alt={`${plan.brand_name} ${plan.subscription_name}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-[#1B1F3B] truncate" title={plan.subscription_name}>
                    {plan.subscription_name}
                  </h3>
                </div>
                
                {compareFields.map(({ field }) => (
                  <div key={field} className="py-4 border-b">
                    {renderValue(plan[field as keyof Entertainment], field)}
                  </div>
                ))}
                
                <div className="mt-6">
                  <a 
                    href={plan.visit_site || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1B1F3B] text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center"
                  >
                    SUBSCRIBE NOW
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

    const sections = [
      {
        title: 'Plan Details',
        items: [
          { label: 'Video Quality', value: plan.video_quality },
          { label: 'Number of Devices', value: plan.devices },
          { label: 'Monthly Price', value: `৳${plan.monthly_price}` },
          { label: 'Free Trial', value: plan.free_trial ? 'Yes' : 'No' },
          { label: 'Ads', value: plan.ads ? 'Yes' : 'No' },
          { label: 'Offline Mode', value: plan.offline ? 'Yes' : 'No' },
        ],
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
                  {plan.logo_link ? (
                    <img 
                      src={plan.logo_link} 
                      alt={`${plan.brand_name} logo`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                      <Play size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{plan.brand_name}</h3>
                  <p className="text-gray-600">{plan.subscription_name}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
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
                        <Check size={16} className="text-green-500" />
                        <span>{feature}</span>
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

              {/* Details */}
              {plan.details && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-4">Additional Details</h4>
                  <p className="text-gray-600">{plan.details}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4">
                <a 
                  href={plan.visit_site || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#1B1F3B] text-white w-full py-2 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center"
                >
                  Subscribe Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
    isOpen,
    onClose,
    filters,
    setFilters,
    expandedFilter,
    toggleFilter,
  }) => {
    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
        
        {/* Drawer */}
        <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 z-50">
          <div className="h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Filters</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Provider Filter */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleFilter('provider')}
                  >
                    <span className="font-medium">Provider</span>
                    <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'provider' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilter === 'provider' && (
                    <div className="mt-3 space-y-2">
                      {getUniqueProviders().map(provider => (
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

                {/* Video Quality Filter */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleFilter('videoQuality')}
                  >
                    <span className="font-medium">Video Quality</span>
                    <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'videoQuality' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilter === 'videoQuality' && (
                    <div className="mt-3 space-y-2">
                      {videoQualityOptions.map(quality => (
                        <label key={quality} className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={filters.videoQuality.includes(quality)}
                            onChange={(e) => {
                              setFilters(prev => ({
                                ...prev,
                                videoQuality: e.target.checked 
                                  ? [...prev.videoQuality, quality]
                                  : prev.videoQuality.filter(q => q !== quality)
                              }));
                            }}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                          />
                          {quality}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Features Filter */}
                <div className="border-b border-gray-200 pb-6">
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
                          checked={filters.features.hasOffline}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              features: {
                                ...prev.features,
                                hasOffline: e.target.checked
                              }
                            }));
                          }}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        Offline Downloads
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={!filters.features.hasAds}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              features: {
                                ...prev.features,
                                hasAds: !e.target.checked
                              }
                            }));
                          }}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        Ad-Free
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.features.hasFreeTrials}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              features: {
                                ...prev.features,
                                hasFreeTrials: e.target.checked
                              }
                            }));
                          }}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        Free Trial Available
                      </label>
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleFilter('priceRange')}
                  >
                    <span className="font-medium">Monthly Price</span>
                    <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'priceRange' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilter === 'priceRange' && (
                    <div className="mt-3 space-y-2">
                      {priceRangeOptions.map(range => (
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

                {/* Devices Filter */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleFilter('devices')}
                  >
                    <span className="font-medium">Number of Devices</span>
                    <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'devices' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilter === 'devices' && (
                    <div className="mt-3 space-y-2">
                      {deviceRangeOptions.map(range => (
                        <label key={range.value} className="flex items-center">
                          <input 
                            type="radio" 
                            checked={filters.devices === range.value}
                            onChange={() => {
                              setFilters(prev => ({
                                ...prev,
                                devices: range.value
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
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setFilters({
                    provider: [],
                    features: {
                      hasAds: false,
                      hasOffline: false,
                      hasFreeTrials: false,
                    },
                    priceRange: '',
                    videoQuality: [],
                    devices: '',
                  });
                }}
                className="mt-6 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderContent = () => {
    const view = isMobile ? (
      // Mobile View
      <div className={styles.container}>
        {/* SEO Component */}
        <SEO
          title="Best Entertainment & OTT Platforms Bangladesh 2024 | Netflix, Chorki, Hoichoi, Bongo"
          description="Compare Netflix, Chorki, Hoichoi, Bongo streaming platforms in Bangladesh. Watch Bangla natok, new movies, Squid Game, romantic movies, English movies & cinema. Find the best entertainment subscription deals."
          keywords="netflix bangladesh, chorki, hoichoi, bongo, bangla natok, squid game, new movies, romantic movies, english movies, cinema, mission impossible, ott platform bangladesh, streaming service, movie subscription, entertainment bangladesh, natok, netflix price, streaming platform comparison"
          pageType="entertainment"
          canonical="https://kontanibo.com/entertainment"
          ogImage="/og-entertainment.png"
        />
        {/* Hero Section with Movie Grid */}
        <div className="w-full bg-gradient-to-r from-[#1A1F36] to-[#2d325f] py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-white">Best Entertainment & Streaming Packages Bangladesh 2025: Netflix, Disney+ & More</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 md:mb-8">
              {movieImages.map((image, index) => (
                <div 
                  key={index}
                  className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-900"
                >
                  <div className="w-full h-full relative group">
                    <img
                      src={image}
                      alt={`Popular ${index === 0 ? 'Netflix' : index === 1 ? 'Bangla Natok' : index === 2 ? 'Squid Game' : index === 3 ? 'Mission Impossible' : index === 4 ? 'Romantic Movies' : 'English Movies'} content`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
              Compare Netflix, Chorki, Hoichoi, Bongo and more entertainment platforms in Bangladesh. Watch Bangla natok, new movies, Squid Game, romantic movies, English movies & cinema. Find the best streaming subscription deals with HD quality, device support, and pricing that fits your budget.
            </p>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-[#1B1F3B]">Compare Entertainment Platforms in Bangladesh</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#1B1F3B]">Netflix & International OTT</h3>
                <p className="text-gray-600 text-sm">
                  Watch Squid Game, Mission Impossible, romantic movies, English movies and Netflix originals. Compare subscription plans and pricing.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Netflix</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Prime Video</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Disney+</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#1B1F3B]">Bangla Natok & Local Content</h3>
                <p className="text-gray-600 text-sm">
                  Enjoy Bangla natok, local cinema, and Bengali entertainment on Chorki, Hoichoi, and Bongo platforms.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Chorki</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Hoichoi</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Bongo</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-[#1B1F3B]">New Movies & Cinema</h3>
                <p className="text-gray-600 text-sm">
                  Stream latest movies, blockbuster cinema, and trending entertainment content across all platforms.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">New Movies</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Cinema</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Blockbusters</span>
                </div>
              </div>
            </div>
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
              <span className="text-sm font-medium">Filter Entertainment Plans</span>
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
                  sortField === 'monthly_price' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => handleSort('monthly_price')}
              >
                Price {sortField === 'monthly_price' && (sortDirection === 'asc' ? '↑' : '↓')}
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
            /* Entertainment Plan Cards */
            <div className="space-y-2">
              {filteredPlans.map(plan => (
                <div key={plan.id} className={`${styles.entertainmentPlanCard} border-gray-200`}>
                  {/* Promotion Tag */}
                  {plan.is_promoted && (
                    <div className={styles.promotedTag}>PROMOTED</div>
                  )}
                  
                  <div className={styles.cardHeader}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0">
                          {plan.logo_link ? (
                            <img 
                              src={plan.logo_link} 
                              alt={plan.brand_name}
                              className={styles.providerLogo}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                              <Play size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className={styles.planName}>{plan.subscription_name}</h3>
                          <p className={styles.providerName}>{plan.brand_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={styles.priceTag}>৳{plan.monthly_price}</div>
                        <div className={styles.priceSubtext}>per month</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardContent}>
                    {/* Plan Features */}
                    <div className={styles.planFeatures}>
                      <div className={styles.featureItem}>
                        <Check size={14} className="text-green-500" />
                        <span>{plan.video_quality} Quality</span>
                      </div>
                      <div className={styles.featureItem}>
                        <Check size={14} className="text-green-500" />
                        <span>{plan.devices} {plan.devices === 1 ? 'Device' : 'Devices'}</span>
                      </div>
                      {plan.offline && (
                        <div className={styles.featureItem}>
                          <Check size={14} className="text-green-500" />
                          <span>Offline Downloads</span>
                        </div>
                      )}
                    </div>

                    {/* Plan Tags */}
                    <div className={styles.planTags}>
                      {!plan.ads && (
                        <span className={styles.tag}>Ad-Free</span>
                      )}
                      {plan.free_trial && (
                        <span className={styles.tag}>Free Trial</span>
                      )}
                      {plan.offline && (
                        <span className={styles.tag}>Offline</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actionButtons}>
                      <a 
                        href={plan.visit_site || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.primaryButton}
                      >
                        <ArrowUpRight size={14} className="mr-1" />
                        Subscribe Now
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

        {/* SEO Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-[#1B1F3B]">Popular Entertainment Content</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800">Netflix Bangladesh</h4>
                    <p className="text-sm text-gray-600">Watch Squid Game, Stranger Things, Money Heist, and Netflix originals with HD/4K quality streaming.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Bangla Natok & Cinema</h4>
                    <p className="text-sm text-gray-600">Enjoy premium Bangla natok, local cinema, and Bengali web series on Chorki, Hoichoi, and Bongo.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">New Movies & Blockbusters</h4>
                    <p className="text-sm text-gray-600">Stream Mission Impossible, romantic movies, English movies, and latest cinema releases.</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-[#1B1F3B]">Streaming Platform Features</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800">Video Quality & Devices</h4>
                    <p className="text-sm text-gray-600">Compare HD, 4K, and HDR streaming quality across multiple devices and simultaneous streams.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Subscription Plans</h4>
                    <p className="text-sm text-gray-600">Find the best entertainment subscription deals with free trials, ad-free options, and offline downloads.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Local vs International</h4>
                    <p className="text-sm text-gray-600">Choose between international OTT platforms and local Bangladeshi streaming services for your content preferences.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      // Desktop View
      <div className={styles.container}>
        {/* SEO Component */}
        <SEO
          title="Best Entertainment & OTT Platforms Bangladesh 2024 | Netflix, Chorki, Hoichoi, Bongo"
          description="Compare Netflix, Chorki, Hoichoi, Bongo streaming platforms in Bangladesh. Watch Bangla natok, new movies, Squid Game, romantic movies, English movies & cinema. Find the best entertainment subscription deals."
          keywords="netflix bangladesh, chorki, hoichoi, bongo, bangla natok, squid game, new movies, romantic movies, english movies, cinema, mission impossible, ott platform bangladesh, streaming service, movie subscription, entertainment bangladesh, natok, netflix price, streaming platform comparison"
          pageType="entertainment"
          canonical="https://kontanibo.com/entertainment"
          ogImage="/og-entertainment.png"
        />
        {/* Hero Section with Movie Grid */}
        <div className="w-full bg-gradient-to-r from-[#1A1F36] to-[#2d325f] py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-white">Best Entertainment & Streaming Packages Bangladesh 2025: Netflix, Disney+ & More</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 md:mb-8">
              {movieImages.map((image, index) => (
                <div 
                  key={index}
                  className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-900"
                >
                  <div className="w-full h-full relative group">
                    <img
                      src={image}
                      alt={`Popular ${index === 0 ? 'Netflix' : index === 1 ? 'Bangla Natok' : index === 2 ? 'Squid Game' : index === 3 ? 'Mission Impossible' : index === 4 ? 'Romantic Movies' : 'English Movies'} content`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
              Compare Netflix, Chorki, Hoichoi, Bongo and more entertainment platforms in Bangladesh. Watch Bangla natok, new movies, Squid Game, romantic movies, English movies & cinema. Find the best streaming subscription deals with HD quality, device support, and pricing that fits your budget.
            </p>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-8 mb-8 border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#1B1F3B]">Compare Entertainment Platforms in Bangladesh</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Netflix & International OTT</h3>
                <p className="text-gray-600 mb-4">
                  Watch Squid Game, Mission Impossible, romantic movies, English movies and Netflix originals. Compare subscription plans and pricing for international streaming platforms.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Netflix</span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Prime Video</span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Disney+</span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">HBO Max</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Bangla Natok & Local Content</h3>
                <p className="text-gray-600 mb-4">
                  Enjoy premium Bangla natok, local cinema, and Bengali entertainment on top local streaming platforms. Quality content from Bangladesh's best creators.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Chorki</span>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Hoichoi</span>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Bongo</span>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Bioscope</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">New Movies & Cinema</h3>
                <p className="text-gray-600 mb-4">
                  Stream latest movies, blockbuster cinema, and trending entertainment content. From Hollywood blockbusters to Bollywood hits and local cinema.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">New Movies</span>
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">Cinema</span>
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">Blockbusters</span>
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">Web Series</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Button */}
            <div className="md:hidden flex justify-between items-center mb-4">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm"
              >
                <Filter size={20} />
                <span>Entertainment Filters</span>
              </button>
              <div className="text-gray-600">
                {entertainmentPlans.length} streaming plans available
              </div>
            </div>

            {/* Filters Sidebar */}
            <div className="w-1/4 bg-white p-6 rounded-lg border border-gray-200 h-fit">
              <h2 className="text-lg font-semibold mb-6">Filters</h2>
              <div className="space-y-6">
                {/* Provider Filter */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleFilter('provider')}
                  >
                    <span className="font-medium">Provider</span>
                    <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'provider' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilter === 'provider' && (
                    <div className="mt-3 space-y-2">
                      {getUniqueProviders().map(provider => (
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

                {/* Video Quality Filter */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleFilter('videoQuality')}
                  >
                    <span className="font-medium">Video Quality</span>
                    <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'videoQuality' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilter === 'videoQuality' && (
                    <div className="mt-3 space-y-2">
                      {videoQualityOptions.map(quality => (
                        <label key={quality} className="flex items-center">
                          <input 
                            type="checkbox" 
                            checked={filters.videoQuality.includes(quality)}
                            onChange={(e) => {
                              setFilters(prev => ({
                                ...prev,
                                videoQuality: e.target.checked 
                                  ? [...prev.videoQuality, quality]
                                  : prev.videoQuality.filter(q => q !== quality)
                              }));
                            }}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                          />
                          {quality}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Features Filter */}
                <div className="border-b border-gray-200 pb-6">
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
                          checked={filters.features.hasOffline}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              features: {
                                ...prev.features,
                                hasOffline: e.target.checked
                              }
                            }));
                          }}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        Offline Downloads
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={!filters.features.hasAds}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              features: {
                                ...prev.features,
                                hasAds: !e.target.checked
                              }
                            }));
                          }}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        Ad-Free
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={filters.features.hasFreeTrials}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              features: {
                                ...prev.features,
                                hasFreeTrials: e.target.checked
                              }
                            }));
                          }}
                          className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        />
                        Free Trial Available
                      </label>
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleFilter('priceRange')}
                  >
                    <span className="font-medium">Monthly Price</span>
                    <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'priceRange' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilter === 'priceRange' && (
                    <div className="mt-3 space-y-2">
                      {priceRangeOptions.map(range => (
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

                {/* Devices Filter */}
                <div className="border-b border-gray-200 pb-6">
                  <button 
                    className="w-full flex justify-between items-center"
                    onClick={() => toggleFilter('devices')}
                  >
                    <span className="font-medium">Number of Devices</span>
                    <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'devices' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilter === 'devices' && (
                    <div className="mt-3 space-y-2">
                      {deviceRangeOptions.map(range => (
                        <label key={range.value} className="flex items-center">
                          <input 
                            type="radio" 
                            checked={filters.devices === range.value}
                            onChange={() => {
                              setFilters(prev => ({
                                ...prev,
                                devices: range.value
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
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setFilters({
                    provider: [],
                    features: {
                      hasAds: false,
                      hasOffline: false,
                      hasFreeTrials: false,
                    },
                    priceRange: '',
                    videoQuality: [],
                    devices: '',
                  });
                }}
                className="mt-6 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition"
              >
                Clear All Filters
              </button>
            </div>

            {/* Main Content */}
            <div className="w-3/4">
              {loading ? (
                <div className="bg-white p-8 rounded-lg border border-gray-200 flex justify-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading streaming services...</p>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Results Header */}
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">
                      1 - {filteredPlans.length} of {entertainmentPlans.length}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Sort by</span>
                      <div className="flex border rounded-lg overflow-hidden">
                        <button 
                          className={`px-4 py-2 text-sm font-medium ${
                            sortField === 'brand_name' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          } border-r`}
                          onClick={() => handleSort('brand_name')}
                        >
                          Provider {sortField === 'brand_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                        <button 
                          className={`px-4 py-2 text-sm font-medium ${
                            sortField === 'monthly_price' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleSort('monthly_price')}
                        >
                          Price {sortField === 'monthly_price' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                        
                        <div className="p-6">
                          <div className="grid grid-cols-12 gap-6 items-center">
                            {/* Provider Logo */}
                            <div className="col-span-3">
                              <div className="w-32 h-16">
                                {plan.logo_link ? (
                                  <img 
                                    src={plan.logo_link} 
                                    alt={plan.brand_name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                                    <Play size={24} className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <h3 className="font-bold mt-2">{plan.subscription_name}</h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {!plan.ads && (
                                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Ad-Free</span>
                                )}
                                {plan.free_trial && (
                                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Free Trial</span>
                                )}
                              </div>
                            </div>

                            {/* Plan Features */}
                            <div className="col-span-4">
                              <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                  <Check size={16} className="text-green-500" />
                                  <span>{plan.video_quality} Quality</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <Check size={16} className="text-green-500" />
                                  <span>{plan.devices} {plan.devices === 1 ? 'Device' : 'Devices'}</span>
                                </li>
                                {plan.offline && (
                                  <li className="flex items-center gap-2">
                                    <Check size={16} className="text-green-500" />
                                    <span>Offline Downloads</span>
                                  </li>
                                )}
                              </ul>
                            </div>

                            {/* Price */}
                            <div className="col-span-3 text-center">
                              <div className="text-3xl font-bold text-[#1B1F3B]">
                                ৳{plan.monthly_price}
                              </div>
                              <div className="text-sm text-gray-500">per month</div>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-3 mt-4">
                                <a 
                                  href={plan.visit_site || '#'} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <ArrowUpRight size={16} />
                                  Subscribe Now
                                </a>
                                <button
                                  onClick={() => setSelectedPlan(plan)}
                                  className="flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  <Info size={16} />
                                  View details
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
        </div>

        {/* SEO Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#1B1F3B]">Entertainment & Streaming Guide Bangladesh</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#1B1F3B]">Netflix & International</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Netflix Bangladesh pricing</li>
                  <li>• Squid Game & Netflix originals</li>
                  <li>• Prime Video & Disney+</li>
                  <li>• HBO Max & international content</li>
                  <li>• 4K & HDR streaming quality</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#1B1F3B]">Bangla Content</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Chorki original series</li>
                  <li>• Hoichoi Bangla natok</li>
                  <li>• Bongo entertainment</li>
                  <li>• Bioscope local cinema</li>
                  <li>• Bengali web series</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#1B1F3B]">Movies & Cinema</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• New movies 2024</li>
                  <li>• Mission Impossible series</li>
                  <li>• Romantic movies collection</li>
                  <li>• English movies HD</li>
                  <li>• Blockbuster cinema</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#1B1F3B]">Subscription Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Free trial offers</li>
                  <li>• Ad-free streaming</li>
                  <li>• Offline downloads</li>
                  <li>• Multiple device support</li>
                  <li>• HD/4K quality options</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Compare entertainment and OTT platforms in Bangladesh. Find the best streaming subscription deals for Netflix, Chorki, Hoichoi, Bongo and more. 
                Watch Bangla natok, new movies, Squid Game, romantic movies, English movies & cinema with the perfect plan for your entertainment needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
    return view;
  };
  
  return renderContent();
};

export default EntertainmentPage; 