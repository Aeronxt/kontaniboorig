import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import SearchButton from '../ui/SearchButton';
import { LineShadowText } from '../magicui/line-shadow-text';
import { Meteors } from '../magicui/meteors';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';
import { WordRotate } from '../ui/WordRotate';
import BreathingDot from '../ui/BreathingDot';
import CrystalLoader from '../ui/CrystalLoader';
import CategoryDevelopmentModal from '../ui/CategoryDevelopmentModal';

const categories = [
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//credit-card.png" alt="Credit cards" className="w-10 h-10 object-contain" />, 
    label: 'Credit cards', 
    path: '/credit-cards' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//notification.png" alt="Mobile plans" className="w-10 h-10 object-contain" />, 
    label: 'Mobile plans', 
    path: '/mobile-plans' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//wifi.png" alt="Broadband" className="w-10 h-10 object-contain" />, 
    label: 'Broadband', 
    path: '/broadband' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//cinema.png" alt="Entertainment" className="w-10 h-10 object-contain" />, 
    label: 'Entertainment', 
    path: '/entertainment' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/icn//serving-dish.png" alt="BOGO" className="w-10 h-10 object-contain" />, 
    label: 'BOGO', 
    path: '/bogo' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/icn//face-scan.png" alt="Instant Bank" className="w-10 h-10 object-contain" />, 
    label: 'Instant Bank', 
    path: '/instant-bank' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//loan.png" alt="Personal Loans" className="w-10 h-10 object-contain" />, 
    label: 'Personal Loans', 
    path: '/personal-loans' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//shopping_4856381.png" alt="Car Loans" className="w-10 h-10 object-contain" />, 
    label: 'Car Loans', 
    path: '/car-loans' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//house.png" alt="Home loans" className="w-10 h-10 object-contain" />, 
    label: 'Home loans', 
    path: '/home-loans' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//heart-love.png" alt="Health insurance" className="w-10 h-10 object-contain" />, 
    label: 'Health insurance', 
    path: '/insurance' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//jar.png" alt="Savings accounts" className="w-10 h-10 object-contain" />, 
    label: 'Savings accounts', 
    path: '/savings-accounts' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//passbook.png" alt="Bank Accounts" className="w-10 h-10 object-contain" />, 
    label: 'Bank Accounts', 
    path: '/bank-accounts' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//car-insurance.png" alt="Car insurance" className="w-10 h-10 object-contain" />, 
    label: 'Car insurance', 
    path: '/insurance' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//plane-ticket.png" alt="Travel insurance" className="w-10 h-10 object-contain" />, 
    label: 'Travel insurance', 
    path: '/insurance' 
  },
  { 
    icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//cashless-payment.png" alt="Mobile payments" className="w-10 h-10 object-contain" />, 
    label: 'Mobile payments', 
    path: '/mobile-payments' 
  }
];

const SearchHero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState('');
  const navigate = useNavigate();

  const handleCategoryClick = (category: any, shouldShowDot: boolean) => {
    if (shouldShowDot) {
      // Show modal for categories with red breathing dot
      setPendingPath(category.path);
      setIsModalOpen(true);
    } else {
      // Navigate directly for other categories
      navigate(category.path);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPendingPath('');
  };

  const handleModalContinue = () => {
    setIsModalOpen(false);
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath('');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    console.log('Starting search with term:', searchTerm);
    setIsSearching(true);
    try {
      // Search across all product tables with comprehensive field mappings
      const tableConfigs = [
        {
          table: 'bank_accounts',
          searchFields: `brand.ilike.%${searchTerm}%,product_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%`,
          nameField: 'product_name',
          brandField: 'brand',
          logoField: 'logo_url',
          visitField: 'visit_site_link'
        },
        {
          table: 'savings_accounts',
          searchFields: `brand.ilike.%${searchTerm}%,product_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%`,
          nameField: 'product_name',
          brandField: 'brand',
          logoField: 'logo_url',
          visitField: 'visit_site_link'
        },
        {
          table: 'personal_loans',
          searchFields: `brand.ilike.%${searchTerm}%,product_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%`,
          nameField: 'product_name',
          brandField: 'brand',
          logoField: 'logo_url',
          visitField: 'site_visit_url'
        },
        {
          table: 'homeloans',
          searchFields: `brand.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%`,
          nameField: 'name',
          brandField: 'brand',
          logoField: 'logo_url',
          visitField: 'website_link'
        },
        {
          table: 'credit_cards',
          searchFields: `brand.ilike.%${searchTerm}%,card_name.ilike.%${searchTerm}%,card_type.ilike.%${searchTerm}%,rewards.ilike.%${searchTerm}%,bogo.ilike.%${searchTerm}%,lounge_access.ilike.%${searchTerm}%,annual_fee.ilike.%${searchTerm}%,purchase_rate.ilike.%${searchTerm}%`,
          nameField: 'card_name',
          brandField: 'brand',
          logoField: 'image_link',
          visitField: 'link_to_site'
        },
        {
          table: 'mobile_plans',
          searchFields: `brand.ilike.%${searchTerm}%,product_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%,data.ilike.%${searchTerm}%,talk_time.ilike.%${searchTerm}%,sms.ilike.%${searchTerm}%`,
          nameField: 'product_name',
          brandField: 'brand',
          logoField: 'logo_url',
          visitField: 'visit_site_link'
        },
        {
          table: 'broadband',
          searchFields: `description.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%,technology_type.ilike.%${searchTerm}%,average_download_speed.ilike.%${searchTerm}%,data_allowance.ilike.%${searchTerm}%,price_monthly.ilike.%${searchTerm}%`,
          nameField: 'tagline',
          brandField: 'description',
          logoField: 'logo_url',
          visitField: 'site_link'
        },
        {
          table: 'entertainment',
          searchFields: `brand_name.ilike.%${searchTerm}%,subscription_name.ilike.%${searchTerm}%,video_quality.ilike.%${searchTerm}%`,
          nameField: 'subscription_name',
          brandField: 'brand_name',
          logoField: 'logo_link',
          visitField: 'visit_site'
        },
        {
          table: 'mobile_payment',
          searchFields: `name.ilike.%${searchTerm}%,cash_out_fee.ilike.%${searchTerm}%,utility_bills_fee.ilike.%${searchTerm}%,credit_card_payment_fees.ilike.%${searchTerm}%`,
          nameField: 'name',
          brandField: 'name',
          logoField: 'image_url',
          visitField: 'site_link'
        },
        {
          table: 'car_loans',
          searchFields: `brand.ilike.%${searchTerm}%,product_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%`,
          nameField: 'product_name',
          brandField: 'brand',
          logoField: 'logo_url',
          visitField: 'site_visit_url'
        },
        {
          table: 'b1g1',
          searchFields: `bank_name.ilike.%${searchTerm}%,offers.ilike.%${searchTerm}%`,
          nameField: 'offers',
          brandField: 'bank_name',
          logoField: 'logo_link',
          visitField: 'website_link'
        },
        {
          table: 'ekyc',
          searchFields: `bank_name.ilike.%${searchTerm}%,account_name.ilike.%${searchTerm}%`,
          nameField: 'account_name',
          brandField: 'bank_name',
          logoField: 'logo_url',
          visitField: 'visit_site_link'
        },
        {
          table: 'fixed_deposits',
          searchFields: `brand.ilike.%${searchTerm}%,product_name.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%,minimum_tenure.ilike.%${searchTerm}%`,
          nameField: 'product_name',
          brandField: 'brand',
          logoField: 'logo_url',
          visitField: 'visit_site_link'
        },
        {
          table: 'business_loans',
          searchFields: `brand.ilike.%${searchTerm}%,product_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tagline.ilike.%${searchTerm}%`,
          nameField: 'product_name',
          brandField: 'brand',
          logoField: 'logo_url',
          visitField: 'site_visit_url'
        }
      ];

      console.log('Searching tables:', tableConfigs.map(c => c.table));

      const searchPromises = tableConfigs.map(config => {
        console.log(`Searching table: ${config.table}`);
        return supabase
          .from(config.table)
          .select('*')
          .or(config.searchFields)
          .limit(5);
      });

      const results = await Promise.all(searchPromises);
      console.log('Raw search results:', results);
      
      // Combine and format results
      const combinedResults = results.flatMap((result, index) => {
        if (result.error) {
          console.error(`Error searching ${tableConfigs[index].table}:`, result.error);
          return [];
        }
        
        const config = tableConfigs[index];
        const formattedResults = (result.data || []).map(item => {
          console.log(`Formatting result from ${config.table}:`, item);
          
          // Extract features based on table type
          let features = [];
          if (Array.isArray(item.features)) {
            features = item.features;
          } else if (config.table === 'credit_cards') {
            // For credit cards, extract benefits and other relevant info
            if (item.card_benefits && typeof item.card_benefits === 'object') {
              const benefits = item.card_benefits;
              if (benefits.travel) features.push('Travel Benefits');
              if (benefits.rewards) features.push('Rewards Program');
              if (benefits.insurance) features.push('Insurance Coverage');
            }
            if (item.rewards === 'Yes') features.push('Reward Points');
            if (item.lounge_access) features.push('Lounge Access');
            if (item.bogo) features.push('BOGO Offers');
            if (item.annual_fee) features.push(`Annual Fee: ${item.annual_fee}`);
            if (item.interest_free_days) features.push(`${item.interest_free_days} Interest-Free Days`);
          } else if (config.table === 'mobile_plans') {
            // For mobile plans, create features from data fields
            if (item.data) features.push(`Data: ${item.data}`);
            if (item.talk_time) features.push(`Talk Time: ${item.talk_time}`);
            if (item.sms) features.push(`SMS: ${item.sms}`);
            if (item.has_4g) features.push('4G Network');
            if (item.has_app) features.push('Mobile App');
          } else if (config.table === 'broadband') {
            // For broadband, create features from plan details
            if (item.average_download_speed) features.push(`Download: ${item.average_download_speed}`);
            if (item.data_allowance) features.push(`Data: ${item.data_allowance}`);
            if (item.technology_type) features.push(item.technology_type);
            if (item.home_phone_included) features.push('Phone Included');
          } else if (config.table === 'b1g1') {
            // For BOGO offers, parse JSON data and create meaningful features
            try {
              // Parse restaurant names
              let restaurants = [];
              if (item.restaurant_name) {
                if (typeof item.restaurant_name === 'string') {
                  restaurants = JSON.parse(item.restaurant_name);
                } else if (Array.isArray(item.restaurant_name)) {
                  restaurants = item.restaurant_name;
                }
              }
              
              // Parse eligible cards
              let cards = [];
              if (item.eligible_cards) {
                if (typeof item.eligible_cards === 'string') {
                  cards = JSON.parse(item.eligible_cards);
                } else if (Array.isArray(item.eligible_cards)) {
                  cards = item.eligible_cards;
                }
              }
              
              // Parse offers to show sample restaurants
              let sampleOffers: string[] = [];
              if (item.offers) {
                try {
                  let offersObj = {};
                  if (typeof item.offers === 'string') {
                    offersObj = JSON.parse(item.offers);
                  } else if (typeof item.offers === 'object') {
                    offersObj = item.offers;
                  }
                  
                  // Get first 2-3 restaurant names from offers
                  const offerKeys = Object.keys(offersObj);
                  sampleOffers = offerKeys.slice(0, 3);
                } catch (offerError) {
                  console.warn('Error parsing offers JSON:', offerError);
                }
              }
              
              // Add features
              if (item.total_number_of_restaurants) {
                features.push(`${item.total_number_of_restaurants} Restaurants`);
              }
              
              // Show sample restaurants from offers if available, otherwise from restaurant_name
              const restaurantsToShow = sampleOffers.length > 0 ? sampleOffers : restaurants;
              if (restaurantsToShow.length > 0) {
                features.push(`Includes: ${restaurantsToShow.slice(0, 3).join(', ')}${restaurantsToShow.length > 3 ? ` +${restaurantsToShow.length - 3} more` : ''}`);
              }
              
              if (cards.length > 0) {
                features.push(`Cards: ${cards.slice(0, 2).join(', ')}${cards.length > 2 ? ` +${cards.length - 2} more` : ''}`);
              }
            } catch (error) {
              console.error('Error parsing BOGO data:', error);
              if (item.total_number_of_restaurants) {
                features.push(`${item.total_number_of_restaurants} Restaurants`);
              }
            }
          }
          
          // Extract description based on table type
          let description = null;
          if (config.table === 'b1g1') {
            // For BOGO offers, create a meaningful description
            description = `Buy 1 Get 1 Free dining offers at ${item.total_number_of_restaurants || 'multiple'} restaurants`;
          } else if (item.description) {
            if (typeof item.description === 'string') {
              description = item.description;
            } else if (typeof item.description === 'object' && item.description.summary) {
              description = item.description.summary;
            }
          }
          if (!description) {
            description = item.tagline || item.offers || null;
          }
          
          return {
            id: item.id,
            type: config.table,
            name: config.table === 'b1g1' ? 
              'BOGO Dining Offers' : 
              (item[config.nameField] || item.name || 'Unknown'),
            brand: item[config.brandField] || item.brand || 'Unknown',
            description: description,
            features: features,
            special_offer: config.table === 'b1g1' ? 
              `Buy 1 Get 1 Free at ${item.total_number_of_restaurants || 'multiple'} restaurants` : 
              (item.special_offer || item.offers || null),
            logo_url: item[config.logoField] || null,
            score: item.score || item.konta_nibo_score || null,
            reviews: item.reviews,
            visit_url: item[config.visitField] || null
          };
        });
        
        console.log(`Formatted results from ${config.table}:`, formattedResults);
        return formattedResults;
      });

      console.log('Final combined results:', combinedResults);

      // Navigate to search results page with the search term and results
      navigate('/search', { 
        state: { 
          searchTerm,
          results: combinedResults,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative bg-[#1B1F3B] min-h-[500px] px-4 py-16 flex flex-col items-center justify-center overflow-hidden">
      {/* Logo */}
      <div className="absolute top-8 right-8 md:right-auto md:left-8 z-20">
        <img 
          src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//LOGPN2.png" 
          alt="Logo" 
          className="h-12 w-auto"
        />
      </div>

      {/* Meteors Effect */}
      <Meteors number={20} />

      {/* Content */}
      <div className="text-center relative z-10 mt-24 md:mt-8 mb-16">
        <div className="text-balance text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-none tracking-tighter text-white inline-flex flex-col sm:flex-row items-center justify-center gap-2">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="whitespace-nowrap"
          >
            One Click.
          </motion.span>
          <LineShadowText className="italic" shadowColor="white">
            <WordRotate
              words={["All Your Options", "Clear Comparisons", "Smarter Choices"]}
              duration={2500}
              className="inline-block text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-none tracking-tighter"
              motionProps={{
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 20 },
                transition: { duration: 0.3, ease: "easeOut" },
              }}
            />
          </LineShadowText>
        </div>
      </div>

      <form onSubmit={handleSearch} className="w-full max-w-2xl mb-16 relative z-10">
        <div className="form relative">
          <button type="button" className="absolute left-2 -translate-y-1/2 top-1/2 p-1">
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
              className="w-5 h-5 text-gray-700"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="input w-full rounded-full px-8 py-3 border-2 border-transparent focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md pr-28"
            required
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <InteractiveHoverButton 
              type="submit"
              className="!py-1.5 !px-4 text-sm"
            >
              Find
            </InteractiveHoverButton>
          </div>
          {searchTerm && (
            <button 
              type="reset" 
              onClick={() => setSearchTerm('')}
              className="absolute right-28 -translate-y-1/2 top-1/2 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-w-6xl relative z-10">
        {categories.map((category, index) => {
          // Categories that should show the red breathing dot
          const categoriesWithDot = [
            'Health insurance',
            'Savings accounts',
            'Bank Accounts',
            'Car insurance',
            'Travel insurance',
            'Mobile payments'
          ];
          
          const shouldShowDot = categoriesWithDot.includes(category.label);
          
          // Special handling for BOGO and Instant Bank
          if (category.label === 'BOGO' || category.label === 'Instant Bank') {
            return (
              <Link to={category.path} key={index}>
                <motion.div
                  className="bg-white rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow text-center relative"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="text-blue-600 mb-1">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{category.label}</span>
                </motion.div>
              </Link>
            );
          }
          
          if (shouldShowDot) {
            // For categories with red breathing dot, use click handler
            return (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow text-center relative"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleCategoryClick(category, shouldShowDot)}
              >
                {shouldShowDot && <BreathingDot />}
                <div className="text-blue-600 mb-1">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{category.label}</span>
              </motion.div>
            );
          } else {
            // For other categories, use Link component
            return (
              <Link to={category.path} key={index}>
                <motion.div
                  className="bg-white rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow text-center relative"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {shouldShowDot && <BreathingDot />}
                  <div className="text-blue-600 mb-1">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{category.label}</span>
                </motion.div>
              </Link>
            );
          }
        })}
      </div>

      {/* Category Development Modal */}
      <CategoryDevelopmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onContinue={handleModalContinue}
      />
    </div>
  );
};

export default SearchHero; 