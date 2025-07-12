import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Speedometer from '../components/Speedometer';
import { Filter, ChevronDown, Wifi, X, CreditCard, Clock, Award } from 'lucide-react';
import SEO from '../components/SEO';

interface Broadband {
  id: number;
  features: string[];
  description: string;
  data_allowance: string;
  average_download_speed: string;
  average_upload_speed: string;
  price_monthly: string;
  setup_fees: string;
  recommended: boolean;
  promoted: boolean;
  tagline: string;
  plan_length: string;
  home_phone_included: boolean;
  call_pack_info: string;
  entertainment_included: boolean;
  technology_type: string;
  payment_methods: string[];
  logo_url: string | null;
  site_link: string | null;
  created_at: string;
  updated_at: string;
}

type SortField = 'price_monthly' | 'average_download_speed' | 'data_allowance';

interface CompareModalProps {
  plans: Broadband[];
  isOpen: boolean;
  onClose: () => void;
}

interface Filters {
  speedTier: string[];
  priceRange: string[];
  features: string[];
}

const CompareModal: React.FC<CompareModalProps> = ({ plans, isOpen, onClose }) => {
  if (!isOpen) return null;

  const compareFields = [
    { label: 'Download Speed', field: 'average_download_speed' },
    { label: 'Upload Speed', field: 'average_upload_speed' },
    { label: 'Monthly Price', field: 'price_monthly' },
    { label: 'Data Allowance', field: 'data_allowance' },
    { label: 'Setup Fees', field: 'setup_fees' },
    { label: 'Plan Length', field: 'plan_length' },
    { label: 'Technology Type', field: 'technology_type' },
    { label: 'Home Phone', field: 'home_phone_included' },
    { label: 'Call Pack Info', field: 'call_pack_info' },
    { label: 'Entertainment', field: 'entertainment_included' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold">Compare Internet & Broadband Plans</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-8">
            {/* Headers */}
            <div className="col-span-1">
              <div className="h-40"></div> {/* Spacer for plan images */}
              {compareFields.map(({ label }) => (
                <div key={label} className="py-4 font-medium text-gray-700 border-b">
                  {label}
                </div>
              ))}
            </div>
            
            {/* Plan columns */}
            {plans.map(plan => (
              <div key={plan.id} className="col-span-1">
                {/* Plan image and name */}
                <div className="mb-6">
                  <div className="w-full h-40 mb-4">
                    {plan.logo_url ? (
                      <img 
                        src={plan.logo_url} 
                        alt={plan.tagline}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Wifi size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-[#1B1F3B]">{plan.tagline}</h3>
                </div>
                
                {/* Plan details */}
                {compareFields.map(({ field }) => (
                  <div key={field} className="py-4 border-b">
                    {field === 'home_phone_included' || field === 'entertainment_included' ? (
                      plan[field] ? '✓ Included' : '✗ Not included'
                    ) : (
                      plan[field as keyof Broadband]
                    )}
                  </div>
                ))}
                
                {/* Action buttons */}
                <div className="mt-6">
                  <a 
                    href={plan.site_link || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1B1F3B] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center"
                  >
                    Get Internet Plan
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

const BroadbandComparePage: React.FC = () => {
  const [broadbandPlans, setBroadbandPlans] = useState<Broadband[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('price_monthly');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Filters>({
    speedTier: [],
    priceRange: [],
    features: []
  });
  const [searchAddress, setSearchAddress] = useState('');
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    fetchBroadbandPlans();
  }, []);

  const fetchBroadbandPlans = async () => {
    try {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from('broadband')
        .select('*')
        .order('id', { ascending: true });

      if (queryError) throw queryError;
      setBroadbandPlans(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (category: keyof Filters, value: string) => {
    setFilters(prev => {
      const currentValue = prev[category];
      
      // Only handle array-type filters
      if (!Array.isArray(currentValue)) {
        return prev;
      }

      return {
        ...prev,
        [category]: currentValue.includes(value)
          ? currentValue.filter((item: string) => item !== value)
          : [...currentValue, value]
      };
    });
  };

  const handleAddressSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement address search functionality
    console.log('Searching for address:', searchAddress);
  };

  const extractSpeedValue = (speed: string): number => {
    const match = speed.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const sortedPlans = [...broadbandPlans].sort((a, b) => {
    let valA: number = 0;
    let valB: number = 0;

    if (sortField === 'price_monthly') {
      valA = parseFloat(a.price_monthly.replace(/[৳,]/g, '')) || 0;
      valB = parseFloat(b.price_monthly.replace(/[৳,]/g, '')) || 0;
    } else if (sortField === 'average_download_speed') {
      valA = extractSpeedValue(a.average_download_speed);
      valB = extractSpeedValue(b.average_download_speed);
    } else if (sortField === 'data_allowance') {
      valA = a.data_allowance.toLowerCase().includes('unlimited') ? Infinity : extractSpeedValue(a.data_allowance);
      valB = b.data_allowance.toLowerCase().includes('unlimited') ? Infinity : extractSpeedValue(b.data_allowance);
    }

    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const filterOptions = {
    speedTier: [
      { value: 'basic', label: 'Basic (1-10 Mbps)' },
      { value: 'standard', label: 'Standard (11-30 Mbps)' },
      { value: 'fast', label: 'Fast (31-100 Mbps)' },
      { value: 'superfast', label: 'Super Fast (100+ Mbps)' }
    ],
    priceRange: [
      { value: 'budget', label: 'Budget (৳500-1000)' },
      { value: 'standard', label: 'Standard (৳1001-2000)' },
      { value: 'premium', label: 'Premium (৳2001-5000)' }
    ],
    features: [
      { value: 'recommended', label: 'Recommended Plans' },
      { value: 'static_ip', label: 'Static IP' },
      { value: 'gaming', label: 'Gaming Optimized' },
      { value: '24_7_support', label: '24/7 Support' },
      { value: 'unlimited', label: 'Unlimited Data' }
    ]
  };

  const renderFilters = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filter Internet Plans & Broadband Providers</h2>
        <button
          onClick={() => {
            setFilters({
              speedTier: [],
              priceRange: [],
              features: []
            });
          }}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            hover:bg-gray-50 transition-colors"
        >
          <X size={14} />
          Clear all filters
        </button>
      </div>

      <div className="space-y-6">
        {/* Speed Filter */}
        <div className="relative">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Wifi size={16} className="text-[#1B1F3B]" />
            Internet Speed & WiFi Performance
          </h3>
          <div className="space-y-2">
            {filterOptions.speedTier.map(option => (
              <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer group transition-colors">
                <input
                  type="checkbox"
                  checked={filters.speedTier.includes(option.value)}
                  onChange={() => handleFilterChange('speedTier', option.value)}
                  className="w-4 h-4 text-[#1B1F3B] bg-gray-100 border-gray-300 rounded focus:ring-[#1B1F3B] 
                    focus:ring-2 transition-colors cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="relative border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CreditCard size={16} className="text-[#1B1F3B]" />
            Price Range
          </h3>
          <div className="space-y-2">
            {filterOptions.priceRange.map(option => (
              <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer group transition-colors">
                <input
                  type="checkbox"
                  checked={filters.priceRange.includes(option.value)}
                  onChange={() => handleFilterChange('priceRange', option.value)}
                  className="w-4 h-4 text-[#1B1F3B] bg-gray-100 border-gray-300 rounded focus:ring-[#1B1F3B] 
                    focus:ring-2 transition-colors cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Features Filter */}
        <div className="relative border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Award size={16} className="text-[#1B1F3B]" />
            Features
          </h3>
          <div className="space-y-2">
            {filterOptions.features.map(option => (
              <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer group transition-colors">
                <input
                  type="checkbox"
                  checked={filters.features.includes(option.value)}
                  onChange={() => handleFilterChange('features', option.value)}
                  className="w-4 h-4 text-[#1B1F3B] bg-gray-100 border-gray-300 rounded focus:ring-[#1B1F3B] 
                    focus:ring-2 transition-colors cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filters.speedTier.length > 0 || filters.priceRange.length > 0 || filters.features.length > 0) && (
          <div className="border-t pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {[...filters.speedTier, ...filters.priceRange, ...filters.features].map((filter, index) => {
                const filterOption = Object.values(filterOptions).flat().find(opt => opt.value === filter);
                return filterOption ? (
                  <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#1B1F3B] text-white">
                    {filterOption.label}
                    <button
                      onClick={() => {
                        // Remove this specific filter
                        Object.keys(filters).forEach(key => {
                          if (filters[key as keyof Filters].includes(filter)) {
                            handleFilterChange(key as keyof Filters, filter);
                          }
                        });
                      }}
                      className="ml-1.5 text-white hover:text-gray-200"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper function to get speed range
  const getSpeedRange = (speedTier: string): { min: number; max: number } => {
    switch (speedTier) {
      case 'basic':
        return { min: 1, max: 10 };
      case 'standard':
        return { min: 11, max: 30 };
      case 'fast':
        return { min: 31, max: 100 };
      case 'superfast':
        return { min: 100, max: Infinity };
      default:
        return { min: 0, max: Infinity };
    }
  };

  // Helper function to get price range
  const getPriceRange = (priceRange: string): { min: number; max: number } => {
    switch (priceRange) {
      case 'budget':
        return { min: 500, max: 1000 };
      case 'standard':
        return { min: 1001, max: 2000 };
      case 'premium':
        return { min: 2001, max: 5000 };
      default:
        return { min: 0, max: Infinity };
    }
  };

  const filteredPlans = sortedPlans.filter(plan => {
    // Speed filter
    if (filters.speedTier.length > 0) {
      const planSpeed = extractSpeedValue(plan.average_download_speed);
      const matchesSpeed = filters.speedTier.some(tier => {
        const range = getSpeedRange(tier);
        return planSpeed >= range.min && planSpeed <= range.max;
      });
      if (!matchesSpeed) return false;
    }

    // Price filter
    if (filters.priceRange.length > 0) {
      const planPrice = parseFloat(plan.price_monthly.replace(/[৳,]/g, ''));
      const matchesPrice = filters.priceRange.some(range => {
        const priceRange = getPriceRange(range);
        return planPrice >= priceRange.min && planPrice <= priceRange.max;
      });
      if (!matchesPrice) return false;
    }

    // Features filter
    if (filters.features.length > 0) {
      const hasAllFeatures = filters.features.every(feature => {
        switch (feature) {
          case 'recommended':
            return plan.recommended;
          case 'static_ip':
            return plan.features?.includes('Static IP');
          case 'gaming':
            return plan.tagline.toLowerCase().includes('game');
          case '24_7_support':
            return plan.features?.includes('24/7 Support');
          case 'unlimited':
            return plan.data_allowance.toLowerCase().includes('unlimited');
          default:
            return false;
        }
      });
      if (!hasAllFeatures) return false;
    }

    return true;
  });

  const togglePlanDetails = (planId: number) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  const handleCompareToggle = (planId: number) => {
    setSelectedForComparison(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId);
      } else {
        return [...prev, planId].slice(0, 2);
      }
    });
  };

  const handleCompare = () => {
    // Implement compare functionality
    console.log('Comparing selected plans:', selectedForComparison);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f5f7fa]"
    >
      <SEO
        title="Best Internet Providers Bangladesh 2024 | Broadband Speed Test & WiFi Comparison"
        description="Find the best internet providers in Bangladesh. Compare broadband speeds, WiFi plans from Dot, Amber, Starlink & more. Check internet speed test, DSL, fiber ISP options near you."
        keywords="internet providers bangladesh, broadband internet, wifi speed test, internet speed test, starlink bangladesh, dot internet, amber it, isp bangladesh, fast internet, wifi network, dsl internet, internet companies near me, broadband speed, mobile broadband"
        pageType="broadband"
        canonical="https://kontanibo.com/broadband-compare"
      />

      {/* Hero Section */}
      <div className="bg-[#1B1F3B] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">Compare Best Broadband Internet Providers Bangladesh 2025: WiFi Speed Test & ISP Plans</h1>
          <p className="text-xl font-medium mb-6">Compare {broadbandPlans.length}+ broadband plans, WiFi speeds, and internet providers. Find fast internet access from Dot, Amber, Starlink & top ISPs near you with speed test results updated daily.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full">WiFi Speed Test</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Broadband Internet</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">DSL Providers</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Fiber Internet</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">Mobile Broadband</span>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-[#1B1F3B]">Internet Speed Test & WiFi Performance</h3>
              <p className="text-sm text-gray-700">
                Test your internet speed and compare WiFi performance across Bangladesh's top ISPs. 
                Get accurate speed test results for broadband internet, DSL, and fiber connections.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-[#1B1F3B]">Top Internet Providers Near You</h3>
              <p className="text-sm text-gray-700">
                Find the best internet companies and ISPs in Bangladesh including Dot Internet, 
                Amber IT, Starlink, and other leading broadband providers offering fast internet access.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-[#1B1F3B]">Broadband & Mobile Internet Options</h3>
              <p className="text-sm text-gray-700">
                Compare broadband internet plans, mobile broadband, DSL connections, and WiFi network 
                solutions. Find fast speed internet packages that suit your needs and budget.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Logos Carousel */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-lg font-semibold text-gray-700 mb-2">Compare Internet Speed & Broadband Plans from Top ISPs</h2>
          <p className="text-center text-gray-600 mb-6">Find the best internet providers near you in Bangladesh. Compare WiFi speeds, broadband internet, DSL, and fiber connections from leading ISPs including Dot, Amber IT, and Starlink.</p>
          
          {/* Desktop Marquee Carousel */}
          <div className="hidden md:block">
            <div className="group flex overflow-hidden p-2 [--duration:40s] [--gap:3rem] [gap:var(--gap)] flex-row">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
                  >
                    <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//bradc.PNG" alt="Provider" className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//Capture.PNG" alt="Provider" className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//dot-internet.png" alt="Provider" className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//infolink.png.webp" alt="Provider" className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//ipcommunication_logo.png" alt="Provider" className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//logo%20(1).png" alt="Provider" className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//logo-new.png" alt="Provider" className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//logo.png" alt="Provider" className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                ))}
            </div>
          </div>

          {/* Mobile Simple Grid */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
              <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//bradc.PNG" alt="Provider" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 mx-auto" />
              <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//Capture.PNG" alt="Provider" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 mx-auto" />
              <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//dot-internet.png" alt="Provider" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 mx-auto" />
              <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//infolink.png.webp" alt="Provider" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 mx-auto" />
              <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//ipcommunication_logo.png" alt="Provider" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 mx-auto" />
              <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//logo%20(1).png" alt="Provider" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 mx-auto" />
              <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//logo-new.png" alt="Provider" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 mx-auto" />
              <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/wifi//logo.png" alt="Provider" className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300 mx-auto" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Column - Hidden on mobile */}
          <div className="hidden md:block md:w-1/4">
            {renderFilters()}
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <div className="bg-white p-8 rounded-lg shadow-sm flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1F3B] mb-4"></div>
                  <p className="text-gray-600">Loading internet plans...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : (
              <div>
                {/* Mobile Filter Button */}
                <div className="md:hidden mb-4">
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1B1F3B] text-white rounded-lg font-medium"
                  >
                    <Filter size={16} />
                    Filter Internet Plans
                    {(filters.speedTier.length + filters.priceRange.length + filters.features.length) > 0 && (
                      <span className="bg-white/20 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {filters.speedTier.length + filters.priceRange.length + filters.features.length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    Showing 1 - {filteredPlans.length} of {broadbandPlans.length} plans
                  </p>
                  <div className="text-gray-600 text-sm flex items-center">
                    <span className="mr-2">Updated daily</span>
                    <Filter size={16} />
                  </div>
                </div>

                {/* Sort bar */}
                <div className="bg-white rounded-t-lg shadow-sm grid grid-cols-4 border-b text-sm text-gray-600">
                  <div className="p-3 col-span-1">Plan details</div>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('price_monthly')}
                  >
                    Monthly Price
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'price_monthly' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('average_download_speed')}
                  >
                    Speed
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'average_download_speed' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    className="p-3 flex items-center justify-between hover:bg-gray-50"
                    onClick={() => handleSort('data_allowance')}
                  >
                    Data
                    <ChevronDown size={16} className={`ml-1 ${sortField === 'data_allowance' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Plan listings */}
                {filteredPlans.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPlans.map((plan) => (
                      <React.Fragment key={plan.id}>
                        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                          {/* Desktop Layout */}
                          <div className="hidden md:block p-6">
                            <div className="grid grid-cols-4 gap-6 items-start">
                              {/* Logo/Name Section */}
                              <div className="col-span-1">
                                <div className="flex flex-col items-start gap-4">
                                  {plan.logo_url ? (
                                    <img 
                                      src={plan.logo_url} 
                                      alt={plan.tagline}
                                      className="w-32 h-32 object-contain"
                                    />
                                  ) : (
                                    <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded">
                                      <Wifi size={48} className="text-gray-400" />
                                    </div>
                                  )}
                                  <div className="w-full">
                                    <h3 className="font-semibold text-gray-900">{plan.tagline}</h3>
                                    <div className="mt-2 text-sm">
                                      <span className="text-gray-600">Technology: </span>
                                      <span className="font-medium">{plan.technology_type}</span>
                                    </div>
                                    {plan.home_phone_included && (
                                      <div className="mt-1 text-sm">
                                        <span className="text-gray-600">Call Pack: </span>
                                        <span className="font-medium">{plan.call_pack_info}</span>
                                      </div>
                                    )}
                                    {plan.entertainment_included && (
                                      <div className="mt-1 text-sm text-green-600">
                                        ✓ Entertainment package included
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Plan Details */}
                              <div className="text-center flex flex-col justify-between h-full">
                                <div>
                                  <div className="text-sm text-gray-600 mb-1">Monthly Price</div>
                                  <div className="text-2xl font-bold text-[#1B1F3B]">{plan.price_monthly}</div>
                                  {plan.setup_fees !== '৳0' && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      + {plan.setup_fees} setup
                                    </div>
                                  )}
                                </div>
                                <div className="mt-4">
                                  <div className="text-sm text-gray-600">Contract Length</div>
                                  <div className="font-medium">{plan.plan_length}</div>
                                </div>
                              </div>

                              {/* Speed Details */}
                              <div className="text-center flex flex-col justify-center">
                                <div className="flex justify-center items-center">
                                  <div className="flex flex-col items-center">
                                    <div className="text-sm text-gray-600 mb-1">Download Speed</div>
                                    <Speedometer 
                                      value={plan.average_download_speed ? extractSpeedValue(plan.average_download_speed) : 0}
                                      maxValue={100}
                                      size={80}
                                      label="↓ Mbps"
                                    />
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <div className="text-sm text-gray-600">Data Allowance</div>
                                  <div className="font-medium text-lg">{plan.data_allowance}</div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col justify-center gap-3">
                                <a 
                                  href={plan.site_link || '#'} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={`bg-[#1B1F3B] text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-[#2d325f] transition flex items-center justify-center`}
                                >
                                  Get Internet Plan
                                </a>
                                <div className="flex items-center gap-2 justify-center">
                                  <input 
                                    type="checkbox" 
                                    id={`compare-${plan.id}`} 
                                    className="mr-1"
                                    checked={selectedForComparison.includes(plan.id)}
                                    onChange={() => handleCompareToggle(plan.id)}
                                    disabled={selectedForComparison.length >= 2 && !selectedForComparison.includes(plan.id)}
                                  />
                                  <label htmlFor={`compare-${plan.id}`} className="text-sm">Compare</label>
                                </div>
                                {selectedForComparison.length === 2 && selectedForComparison.includes(plan.id) && (
                                  <button
                                    onClick={handleCompare}
                                    className="bg-[#1B1F3B] text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-[#2d325f] transition"
                                  >
                                    Compare Selected
                                  </button>
                                )}
                                <button
                                  onClick={() => togglePlanDetails(plan.id)}
                                  className="text-[#1B1F3B] hover:text-[#2d325f] text-sm font-medium flex items-center justify-center"
                                >
                                  {expandedPlanId === plan.id ? (
                                    <>Less Info <ChevronDown size={16} className="ml-1" /></>
                                  ) : (
                                    <>More Info <ChevronDown size={16} className="ml-1" /></>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Mobile Layout - Styled like the screenshot */}
                          <div className="md:hidden">
                            {/* Header with logo and plan name */}
                            <div className="flex items-center gap-4 p-4 border-b border-gray-100">
                              {plan.logo_url ? (
                                <img 
                                  src={plan.logo_url} 
                                  alt={plan.tagline}
                                  className="w-16 h-16 object-contain flex-shrink-0"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
                                  <Wifi size={24} className="text-white" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{plan.tagline}</h3>
                                <p className="text-xs text-gray-600 mt-0.5">{plan.plan_length}</p>
                              </div>
                            </div>

                            {/* Promotional Banner */}
                            {(plan.recommended || plan.promoted) && (
                              <div className="bg-yellow-50 px-4 py-2 border-b border-gray-100">
                                <p className="text-xs text-yellow-800">
                                  {plan.setup_fees !== '৳0' 
                                    ? `${plan.price_monthly}/month with ${plan.setup_fees} setup fee. Terms & Conditions apply.`
                                    : `${plan.price_monthly}/month. Terms & Conditions apply.`
                                  }
                                </p>
                              </div>
                            )}

                            {/* Data Row */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600">Data</span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">{plan.data_allowance}</div>
                              </div>
                            </div>

                            {/* Speed Row */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600">Speed</span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-blue-600">{plan.average_download_speed}</div>
                                <div className="text-xs text-gray-500">{plan.technology_type}™</div>
                              </div>
                            </div>

                            {/* Price Row */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600">Price</span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">{plan.price_monthly}</div>
                              </div>
                            </div>

                            {/* CTA Button */}
                            <div className="p-4">
                              <a 
                                href={plan.site_link || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`w-full bg-[#1B1F3B] text-white py-3 px-4 rounded-lg text-sm font-semibold transition text-center block ${plan.site_link ? 'hover:bg-[#2d325f]' : 'opacity-50 cursor-not-allowed'}`}
                              >
                                Get Internet Plan
                              </a>
                            </div>

                            {/* Bottom Actions */}
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id={`compare-mobile-${plan.id}`} 
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                  checked={selectedForComparison.includes(plan.id)}
                                  onChange={() => handleCompareToggle(plan.id)}
                                  disabled={selectedForComparison.length >= 2 && !selectedForComparison.includes(plan.id)}
                                />
                                <label htmlFor={`compare-mobile-${plan.id}`} className="text-sm font-medium text-gray-700">Compare</label>
                              </div>
                              <button
                                onClick={() => togglePlanDetails(plan.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                              >
                                View details
                                <ChevronDown size={14} className={`transition-transform ${expandedPlanId === plan.id ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expandable Details Section */}
                        <AnimatePresence>
                          {expandedPlanId === plan.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-gray-50 rounded-lg mt-1 overflow-hidden"
                            >
                              <div className="p-6">
                                <div className="grid grid-cols-2 gap-8">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Plan Features</h4>
                                    <ul className="space-y-2">
                                      {(plan.features || []).map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                          <span className="text-green-500 mt-1">✓</span>
                                          <span className="text-gray-700">{feature}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">Plan Details</h4>
                                    <div className="space-y-3 text-sm">
                                      <p className="text-gray-700">{plan.description || 'No description available'}</p>
                                      <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                          <div className="text-gray-600">Setup Fee</div>
                                          <div className="font-medium">{plan.setup_fees || 'Not specified'}</div>
                                        </div>
                                        <div>
                                          <div className="text-gray-600">Contract Length</div>
                                          <div className="font-medium">{plan.plan_length || 'Not specified'}</div>
                                        </div>
                                        {plan.home_phone_included && (
                                          <div>
                                            <div className="text-gray-600">Call Pack Details</div>
                                            <div className="font-medium">{plan.call_pack_info || 'Not specified'}</div>
                                          </div>
                                        )}
                                        {plan.entertainment_included && (
                                          <div>
                                            <div className="text-gray-600">Entertainment</div>
                                            <div className="font-medium">Included</div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <p className="text-gray-600">No internet plans match your filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Footer Content */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1B1F3B] mb-8">Internet Providers & Broadband Plans in Bangladesh</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#1B1F3B]">WiFi Speed Test</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Internet speed meter tools</li>
                <li>• WiFi performance testing</li>
                <li>• Network speed analysis</li>
                <li>• Fast speed verification</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#1B1F3B]">Top ISPs Bangladesh</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Dot Internet (Dot com)</li>
                <li>• Amber IT Solutions</li>
                <li>• Starlink Satellite Internet</li>
                <li>• Local ISP providers</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#1B1F3B]">Internet Types</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Broadband internet plans</li>
                <li>• DSL connections</li>
                <li>• Mobile broadband</li>
                <li>• Fiber internet access</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#1B1F3B]">Find ISPs Near You</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Internet companies near me</li>
                <li>• ISP near me search</li>
                <li>• Local broadband providers</li>
                <li>• WiFi network solutions</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-600 max-w-3xl mx-auto">
              Compare the best internet providers in Bangladesh with our comprehensive broadband comparison tool. 
              Find fast internet speeds, WiFi plans, and broadband internet packages from top ISPs including 
              Dot Internet, Amber IT, Starlink, and more. Use our speed test tools to verify internet speeds 
              and network performance before choosing your ideal internet access solution.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 md:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#1B1F3B] text-white">
                <h2 className="text-lg font-semibold">Filter Internet & Broadband Plans</h2>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4">
                {/* Clear Filters Button */}
                {(filters.speedTier.length > 0 || filters.priceRange.length > 0 || filters.features.length > 0) && (
                  <button
                    onClick={() => {
                      setFilters({
                        speedTier: [],
                        priceRange: [],
                        features: []
                      });
                    }}
                    className="w-full mb-6 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <X size={16} />
                    Clear all filters
                  </button>
                )}

                <div className="space-y-6">
                  {/* Speed Filter */}
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Wifi size={16} className="text-[#1B1F3B]" />
                      Internet Speed & WiFi Performance
                    </h3>
                    <div className="space-y-2">
                      {[
                        { value: 'basic', label: 'Basic (1-10 Mbps)' },
                        { value: 'standard', label: 'Standard (11-30 Mbps)' },
                        { value: 'fast', label: 'Fast (31-100 Mbps)' },
                        { value: 'superfast', label: 'Super Fast (100+ Mbps)' }
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer group transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.speedTier.includes(option.value)}
                            onChange={() => handleFilterChange('speedTier', option.value)}
                            className="w-4 h-4 text-[#1B1F3B] bg-gray-100 border-gray-300 rounded focus:ring-[#1B1F3B] 
                              focus:ring-2 transition-colors cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="relative border-t pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard size={16} className="text-[#1B1F3B]" />
                      Price Range
                    </h3>
                    <div className="space-y-2">
                      {[
                        { value: 'budget', label: 'Budget (৳500-1000)' },
                        { value: 'standard', label: 'Standard (৳1001-2000)' },
                        { value: 'premium', label: 'Premium (৳2001-5000)' }
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer group transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.priceRange.includes(option.value)}
                            onChange={() => handleFilterChange('priceRange', option.value)}
                            className="w-4 h-4 text-[#1B1F3B] bg-gray-100 border-gray-300 rounded focus:ring-[#1B1F3B] 
                              focus:ring-2 transition-colors cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Features Filter */}
                  <div className="relative border-t pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award size={16} className="text-[#1B1F3B]" />
                      Features
                    </h3>
                    <div className="space-y-2">
                      {[
                        { value: 'recommended', label: 'Recommended Plans' },
                        { value: 'static_ip', label: 'Static IP' },
                        { value: 'gaming', label: 'Gaming Optimized' },
                        { value: '24_7_support', label: '24/7 Support' },
                        { value: 'unlimited', label: 'Unlimited Data' }
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer group transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.features.includes(option.value)}
                            onChange={() => handleFilterChange('features', option.value)}
                            className="w-4 h-4 text-[#1B1F3B] bg-gray-100 border-gray-300 rounded focus:ring-[#1B1F3B] 
                              focus:ring-2 transition-colors cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="w-full bg-[#1B1F3B] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#2d325f] transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <CompareModal
        plans={selectedForComparison
          .map(id => broadbandPlans.find(p => p.id === id))
          .filter((plan): plan is Broadband => plan !== undefined)}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
    </motion.div>
  );
};

export default BroadbandComparePage; 