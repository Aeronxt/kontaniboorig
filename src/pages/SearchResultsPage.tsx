import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, ArrowRight, Building2, Star, ExternalLink, CreditCard, Home, PiggyBank, Wallet, Smartphone, Wifi, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: string;
  name: string;
  brand: string;
  description: string | null;
  features: string[];
  special_offer: string | null;
  logo_url: string | null;
  score: number | null;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  } | null;
  visit_url: string | null;
}

const getProductTypeIcon = (type: string) => {
  switch (type) {
    case 'bank_accounts':
      return <Wallet className="w-6 h-6" />;
    case 'savings_accounts':
      return <PiggyBank className="w-6 h-6" />;
    case 'personal_loans':
      return <CreditCard className="w-6 h-6" />;
    case 'homeloans':
      return <Home className="w-6 h-6" />;
    case 'car_loans':
      return <Star className="w-6 h-6" />;
    case 'credit_cards':
      return <CreditCard className="w-6 h-6" />;
    case 'mobile_plans':
      return <Smartphone className="w-6 h-6" />;
    case 'broadband':
      return <Wifi className="w-6 h-6" />;
    case 'entertainment':
      return <Star className="w-6 h-6" />;
    case 'mobile_payment':
      return <Smartphone className="w-6 h-6" />;
    case 'b1g1':
      return <Star className="w-6 h-6" />;
    case 'ekyc':
      return <Building2 className="w-6 h-6" />;
    case 'fixed_deposits':
      return <PiggyBank className="w-6 h-6" />;
    case 'business_loans':
      return <Building2 className="w-6 h-6" />;
    default:
      return <Building2 className="w-6 h-6" />;
  }
};

const getProductTypeUrl = (type: string) => {
  switch (type) {
    case 'bank_accounts':
      return '/bank-accounts';
    case 'savings_accounts':
      return '/savings-accounts';
    case 'personal_loans':
      return '/personal-loans';
    case 'homeloans':
      return '/home-loans';
    case 'car_loans':
      return '/car-loans';
    case 'credit_cards':
      return '/credit-cards';
    case 'mobile_plans':
      return '/mobile-plans';
    case 'broadband':
      return '/broadband';
    case 'entertainment':
      return '/entertainment';
    case 'mobile_payment':
      return '/mobile-payments';
    case 'b1g1':
      return '/bogo';
    case 'ekyc':
      return '/instant-bank';
    case 'fixed_deposits':
      return '/fixed-deposits';
    case 'business_loans':
      return '/business-loans';
    default:
      return '/';
  }
};

const getProductTypeLabel = (type: string) => {
  switch (type) {
    case 'bank_accounts':
      return 'Bank Account';
    case 'savings_accounts':
      return 'Savings Account';
    case 'personal_loans':
      return 'Personal Loan';
    case 'homeloans':
      return 'Home Loan';
    case 'car_loans':
      return 'Car Loan';
    case 'credit_cards':
      return 'Credit Card';
    case 'mobile_plans':
      return 'Mobile Plan';
    case 'broadband':
      return 'Broadband Plan';
    case 'entertainment':
      return 'Entertainment';
    case 'mobile_payment':
      return 'Mobile Payment';
    case 'b1g1':
      return 'BOGO Offer';
    case 'ekyc':
      return 'Instant Banking';
    case 'fixed_deposits':
      return 'Fixed Deposit';
    case 'business_loans':
      return 'Business Loan';
    default:
      return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('Search results location state:', location.state);
  
  if (!location.state) {
    console.log('No search results state found, redirecting to home');
    navigate('/');
    return null;
  }

  const { searchTerm, results, timestamp } = location.state as {
    searchTerm: string;
    results: SearchResult[];
    timestamp: string;
  };

  console.log('Search results data:', { searchTerm, results, timestamp });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f5f7fa]"
    >
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Search Results</h1>
              <p className="text-sm text-gray-500">
                {results.length} results for "{searchTerm}" • {formatTimestamp(timestamp)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-8">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No results found</h2>
            <p className="text-gray-600">
              Try different keywords or browse our categories
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {results.map((result) => (
              <motion.div
                key={`${result.type}-${result.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Provider Logo */}
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    {result.logo_url ? (
                      <img
                        src={result.logo_url}
                        alt={result.brand}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      getProductTypeIcon(result.type)
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => navigate(getProductTypeUrl(result.type))}
                            className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            {getProductTypeLabel(result.type)}
                          </button>
                          {result.score && (
                            <span className="text-sm font-medium text-gray-600">
                              Score: {result.score}/10
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-semibold mb-1">{result.name}</h2>
                        <p className="text-sm text-gray-500 mb-2">
                          {result.brand}
                        </p>
                        {result.description && (
                          <p className="text-gray-600 mb-3">{result.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => navigate(getProductTypeUrl(result.type))}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View More
                        <ArrowRight size={16} />
                      </button>
                    </div>

                    {/* Features */}
                    {result.features && result.features.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Key Features</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Special Offer */}
                    {result.special_offer && (
                      <div className="mt-4 flex items-center gap-2 text-green-600">
                        <Star size={16} className="fill-current" />
                        <span className="text-sm font-medium">{result.special_offer}</span>
                      </div>
                    )}

                    {/* Reviews */}
                    {result.reviews && result.reviews.average_rating && (
                      <div className="mt-4 flex items-center gap-2 text-gray-600">
                        <Star size={16} className="fill-current text-yellow-400" />
                        <span className="text-sm">
                          {result.reviews.average_rating.toFixed(1)} ({result.reviews.total_reviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchResultsPage; 