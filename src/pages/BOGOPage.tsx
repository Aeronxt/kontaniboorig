import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { 
  ChevronDown, 
  X, 
  Search, 
  MapPin, 
  CreditCard, 
  Star, 
  Utensils, 
  Filter,
  ExternalLink,
  Zap,
  Award,
  TrendingUp,
  Users,
  Clock,
  Gift,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface BOGOOffer {
  bank_name: string;
  restaurant_name: string[];
  eligible_cards: string[];
  offers: string;
  total_number_of_restaurants: number;
  website_link: string;
  logo_link: string;
  konta_nibo_score: number;
}

interface Filters {
  banks: string[];
  restaurants: string[];
  cards: string[];
  score: string;
}

// Modern Offer Card Component
const ModernOfferCard: React.FC<{ 
  offer: BOGOOffer; 
  index: number;
  onViewDetails: () => void;
}> = ({ offer, index, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    return 'Fair';
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative bg-white rounded-2xl border border-gray-200 overflow-hidden
        transition-all duration-500 ease-out
        ${isHovered ? 'shadow-xl border-blue-200' : 'shadow-md hover:shadow-lg'}
      `}>


        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 p-6">
          {/* Top/Left Section: Bank Info */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative">
              {offer.logo_link ? (
                <img
                  src={offer.logo_link}
                  alt={`${offer.bank_name} logo`}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-medium">
                    {offer.bank_name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              {offer.konta_nibo_score >= 8 && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Award size={10} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{offer.bank_name}</h3>
              <div className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
                ${getScoreColor(offer.konta_nibo_score)}
              `}>
                <Star size={10} className="fill-current" />
                <span>{offer.konta_nibo_score}/10</span>
              </div>
            </div>

            {/* Stats on Mobile - Inline with Bank Info */}
            <div className="flex gap-3 md:hidden">
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg flex items-center justify-center border border-orange-100">
                  <p className="text-sm font-bold text-orange-900">{offer.total_number_of_restaurants}</p>
                </div>
                <p className="text-xs text-gray-600 font-medium mt-1">Restaurants</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center border border-purple-100">
                  <p className="text-sm font-bold text-purple-900">{offer.eligible_cards?.length || 0}</p>
                </div>
                <p className="text-xs text-gray-600 font-medium mt-1">Cards</p>
              </div>
            </div>
          </div>

          {/* Middle Section: Restaurant Preview */}
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Utensils size={14} className="text-orange-500" />
              Partner Restaurants
            </h5>
            <div className="space-y-1">
              {offer.restaurant_name?.slice(0, 2).map((restaurant, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <MapPin size={10} className="text-orange-500 flex-shrink-0" />
                  <span className="truncate">{restaurant}</span>
                </div>
              ))}
              {offer.restaurant_name && offer.restaurant_name.length > 2 && (
                <button
                  onClick={onViewDetails}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <span>+{offer.restaurant_name.length - 2} more</span>
                  <ArrowRight size={10} />
                </button>
              )}
            </div>
          </div>

          {/* Bottom/Right Section: Stats and Actions */}
          <div className="flex items-center justify-between md:flex-col md:items-center gap-4 md:gap-6 flex-shrink-0">
            {/* Stats - Hidden on Mobile (shown inline above) */}
            <div className="hidden md:flex gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center border border-orange-100 mb-1">
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-900">{offer.total_number_of_restaurants}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-medium">Restaurants</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center border border-purple-100 mb-1">
                  <div className="text-center">
                    <p className="text-lg font-bold text-purple-900">{offer.eligible_cards?.length || 0}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-medium">Cards</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onViewDetails}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Sparkles size={14} />
                View BOGO Deal
              </motion.button>
              
              <motion.a
                href={offer.website_link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-700 rounded-xl transition-all duration-200 hover:bg-gray-50 flex items-center"
              >
                <ExternalLink size={14} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className={`
          absolute inset-0 rounded-3xl transition-opacity duration-500 pointer-events-none
          ${isHovered ? 'opacity-100' : 'opacity-0'}
          bg-gradient-to-r from-blue-500/5 to-purple-500/5
        `} />
      </div>
    </motion.div>
  );
};

// Enhanced Filter Component
const EnhancedFilter: React.FC<{
  title: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  icon: React.ReactNode;
  color?: string;
}> = ({ title, options, selected, onChange, icon, color = 'blue' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    orange: 'border-orange-200 bg-orange-50 text-orange-700',
    purple: 'border-purple-200 bg-purple-50 text-purple-700',
    green: 'border-green-200 bg-green-50 text-green-700'
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
          ${isOpen || selected.length > 0
            ? colorClasses[color as keyof typeof colorClasses]
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isOpen || selected.length > 0 ? 'bg-white/50' : 'bg-gray-100'
          }`}>
            {icon}
          </div>
          <span className="font-semibold">{title}</span>
          {selected.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-white text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
            >
              {selected.length}
            </motion.span>
          )}
        </div>
        <ChevronDown 
          size={20} 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 max-h-72 overflow-y-auto"
          >
            <div className="p-4 space-y-2">
              {options.map((option) => (
                <motion.label
                  key={option}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors group"
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
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                    {option}
                  </span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Single Filter Component (for single selection dropdowns)
const EnhancedSingleFilter: React.FC<{
  title: string;
  options: string[];
  values: string[];
  selected: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  color?: string;
}> = ({ title, options, values, selected, onChange, icon, color = 'blue' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100',
      orange: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100',
      purple: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100',
      green: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100',
      gray: 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const selectedIndex = values.indexOf(selected);
  const selectedLabel = selectedIndex >= 0 ? options[selectedIndex] : title;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-4 bg-white border border-gray-200 rounded-2xl text-left
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 flex items-center justify-between
          hover:border-gray-300 font-semibold
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1 rounded-lg ${getColorClasses(color)}`}>
            {icon}
          </div>
          <span className="text-gray-700">
            {selected ? selectedLabel : title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2">
              {/* Clear option */}
              <motion.button
                whileHover={{ backgroundColor: '#f3f4f6' }}
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="w-full p-3 text-left rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <X size={16} className="text-gray-400" />
                <span className="text-gray-600">Clear selection</span>
              </motion.button>
              
              {/* Options */}
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  onClick={() => {
                    onChange(values[index]);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full p-3 text-left rounded-xl transition-colors flex items-center gap-3
                    ${selected === values[index] 
                      ? `${getColorClasses(color)} font-medium` 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                  `}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selected === values[index] 
                      ? 'border-current bg-current' 
                      : 'border-gray-300'
                  }`}>
                    {selected === values[index] && (
                      <CheckCircle size={10} className="text-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Modal Component
const EnhancedOfferModal: React.FC<{
  offer: BOGOOffer;
  isOpen: boolean;
  onClose: () => void;
}> = ({ offer, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </motion.button>
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center justify-center">
              {offer.logo_link ? (
                <img
                  src={offer.logo_link}
                  alt={`${offer.bank_name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-white text-lg font-bold">
                  {offer.bank_name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{offer.bank_name}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star size={16} className="fill-current" />
                  <span className="font-semibold">{offer.konta_nibo_score}/10</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Utensils size={16} />
                  <span className="font-semibold">{offer.total_number_of_restaurants} Restaurants</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Participating Restaurants */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <MapPin className="text-orange-600" size={20} />
                Participating Restaurants
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                  {offer.restaurant_name?.length || 0}
                </span>
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {offer.restaurant_name?.map((restaurant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Utensils size={14} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-800">{restaurant}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Eligible Cards */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <CreditCard className="text-purple-600" size={20} />
                Eligible Cards
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                  {offer.eligible_cards?.length || 0}
                </span>
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {offer.eligible_cards?.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-200 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <CreditCard size={14} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-800">{card}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Ready to enjoy these amazing offers?
            </div>
            <div className="flex gap-4">
              <motion.a
                href={offer.website_link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <ExternalLink size={16} />
                Get BOGO Offer
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BOGOPage = () => {
  const [bogoOffers, setBogoOffers] = useState<BOGOOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<BOGOOffer | null>(null);
  const [filters, setFilters] = useState<Filters>({
    banks: [],
    restaurants: [],
    cards: [],
    score: ''
  });
  const [sortBy, setSortBy] = useState<'score' | 'restaurants' | 'cards'>('score');

  useEffect(() => {
    fetchBOGOOffers();
  }, []);

  const fetchBOGOOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('b1g1')
        .select('*')
        .order('konta_nibo_score', { ascending: false });

      if (error) throw error;
      setBogoOffers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const allBanks = [...new Set(bogoOffers.map(offer => offer.bank_name))];
  const allRestaurants = [...new Set(bogoOffers.flatMap(offer => offer.restaurant_name || []))];
  const allCards = [...new Set(bogoOffers.flatMap(offer => offer.eligible_cards || []))];

  const getFilteredAndSortedOffers = () => {
    let filtered = bogoOffers.filter((offer: BOGOOffer) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          offer.bank_name.toLowerCase().includes(searchLower) ||
          offer.restaurant_name.some(r => r.toLowerCase().includes(searchLower)) ||
          offer.eligible_cards.some(c => c.toLowerCase().includes(searchLower)) ||
          offer.offers.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Apply filters
      if (filters.banks.length > 0 && !filters.banks.includes(offer.bank_name)) return false;
      if (filters.restaurants.length > 0 && !filters.restaurants.some(r => offer.restaurant_name.includes(r))) return false;
      if (filters.cards.length > 0 && !filters.cards.some(c => offer.eligible_cards.includes(c))) return false;
      if (filters.score && offer.konta_nibo_score < parseInt(filters.score)) return false;

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'restaurants':
          return b.total_number_of_restaurants - a.total_number_of_restaurants;
        case 'cards':
          return (b.eligible_cards?.length || 0) - (a.eligible_cards?.length || 0);
        default:
          return b.konta_nibo_score - a.konta_nibo_score;
      }
    });

    return filtered;
  };

  const clearAllFilters = () => {
    setFilters({
      banks: [],
      restaurants: [],
      cards: [],
      score: ''
    });
    setSearchTerm('');
  };

  const hasActiveFilters = () => {
    return searchTerm || 
           filters.banks.length > 0 || 
           filters.restaurants.length > 0 || 
           filters.cards.length > 0 || 
           filters.score;
  };



  const filteredOffers = getFilteredAndSortedOffers();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading amazing dining offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error loading offers</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Component */}
      <SEO
        title="Best BOGO Restaurant Offers Bangladesh 2024 | Buy 1 Get 1 Free Buffet Deals"
        description="Compare Buy 1 Get 1 Free restaurant offers, buffet deals, lunch & dinner coupons from 5-star hotels in Bangladesh. Best BOGO dining deals with credit cards near you."
        keywords="bogo bangladesh, buy 1 get 1 free, buffet near me, buffet lounge, restaurant coupons, lunch buffet, dinner buffet, 5 star hotel buffet, credit card dining offers, restaurant deals bangladesh, buffet offers dhaka, bogo coupon, dining deals"
        pageType="bogo"
        canonical="https://kontanibo.com/bogo"
        ogImage="/og-bogo.png"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full mb-6"
            >
              <Gift size={20} />
              <span className="font-semibold">Buy 1 Get 1 Free Offers</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Best BOGO Restaurant Offers Bangladesh 2025: Buy 1 Get 1 Free
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Buffet & Dining Deals
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover exclusive Buy 1 Get 1 Free restaurant offers, buffet deals, lunch & dinner coupons from 5-star hotels in Bangladesh. 
              Compare {bogoOffers.length}+ BOGO deals and save on your dining experiences near you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>{bogoOffers.length} Bank Offers</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils size={20} />
                <span>{bogoOffers.reduce((sum, offer) => sum + offer.total_number_of_restaurants, 0)} Restaurants</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard size={20} />
                <span>{bogoOffers.reduce((sum, offer) => sum + (offer.eligible_cards?.length || 0), 0)} Cards</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg p-8 mb-8 border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#1B1F3B]">Best BOGO Restaurant Offers & Buffet Deals in Bangladesh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Buffet Near Me</h3>
              <p className="text-gray-600 mb-4">
                Find the best buffet deals and buffet lounge offers near you. Compare lunch buffet and dinner buffet prices from 5-star hotels and premium restaurants in Dhaka and across Bangladesh.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">Lunch Buffet</span>
                <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">Dinner Buffet</span>
                <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">Weekend Buffet</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">BOGO & Coupons</h3>
              <p className="text-gray-600 mb-4">
                Discover Buy 1 Get 1 Free offers, restaurant coupons, and exclusive dining deals. Save money with BOGO coupons from top banks and credit card dining programs.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">BOGO Deals</span>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Restaurant Coupons</span>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Credit Card Offers</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">5-Star Hotel Dining</h3>
              <p className="text-gray-600 mb-4">
                Enjoy premium dining experiences at 5-star hotels with exclusive credit card offers. Compare bank dining programs and hotel restaurant partnerships for the best deals.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">5-Star Hotels</span>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Fine Dining</span>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Hotel Restaurants</span>
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
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search BOGO offers, buffet deals, restaurant coupons, or dining offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-lg"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <EnhancedFilter
              title="Banks"
              options={allBanks}
              selected={filters.banks}
              onChange={(values) => setFilters(prev => ({ ...prev, banks: values }))}
              icon={<Filter size={18} />}
              color="blue"
            />
            <EnhancedFilter
              title="Restaurants"
              options={allRestaurants.slice(0, 20)} // Limit for performance
              selected={filters.restaurants}
              onChange={(values) => setFilters(prev => ({ ...prev, restaurants: values }))}
              icon={<Utensils size={18} />}
              color="orange"
            />
            <EnhancedFilter
              title="Cards"
              options={allCards}
              selected={filters.cards}
              onChange={(values) => setFilters(prev => ({ ...prev, cards: values }))}
              icon={<CreditCard size={18} />}
              color="purple"
            />
            <EnhancedSingleFilter
              title="All Ratings"
              options={['9+ Excellent', '8+ Very Good', '7+ Good', '6+ Fair']}
              values={['9', '8', '7', '6']}
              selected={filters.score}
              onChange={(value) => setFilters(prev => ({ ...prev, score: value }))}
              icon={<Star size={18} />}
              color="green"
            />
            <EnhancedSingleFilter
              title="Sort by"
              options={['Rating', 'Restaurant Count', 'Card Count']}
              values={['score', 'restaurants', 'cards']}
              selected={sortBy}
              onChange={(value) => setSortBy(value as 'score' | 'restaurants' | 'cards')}
              icon={<TrendingUp size={18} />}
              color="gray"
            />
          </div>

          {/* Filter Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                {filteredOffers.length} of {bogoOffers.length} offers
              </span>
              {hasActiveFilters() && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllFilters}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200"
                >
                  <X size={16} />
                  Clear all filters
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {filteredOffers.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {filteredOffers.map((offer, index) => (
              <ModernOfferCard
                key={offer.bank_name}
                offer={offer}
                index={index}
                onViewDetails={() => setSelectedOffer(offer)}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find more dining deals.
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
      </div>

      {/* SEO Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#1B1F3B]">Complete Guide to BOGO Restaurant Offers & Buffet Deals in Bangladesh</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Buffet Deals</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Lunch buffet near me</li>
                <li>• Dinner buffet offers</li>
                <li>• Weekend buffet deals</li>
                <li>• International buffet</li>
                <li>• Buffet lounge access</li>
                <li>• All-you-can-eat deals</li>
                <li>• Breakfast buffet offers</li>
                <li>• Seafood buffet specials</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">BOGO & Coupons</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Buy 1 Get 1 Free meals</li>
                <li>• Restaurant coupons</li>
                <li>• BOGO coupon codes</li>
                <li>• Dining vouchers</li>
                <li>• Food delivery coupons</li>
                <li>• Group dining offers</li>
                <li>• Birthday meal deals</li>
                <li>• Anniversary dining offers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">5-Star Hotel Dining</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Luxury hotel restaurants</li>
                <li>• 5-star buffet deals</li>
                <li>• Hotel dining packages</li>
                <li>• Premium restaurant offers</li>
                <li>• Fine dining experiences</li>
                <li>• Hotel brunch deals</li>
                <li>• Rooftop dining offers</li>
                <li>• Executive dining programs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#1B1F3B]">Credit Card Dining</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Bank dining programs</li>
                <li>• Credit card restaurant offers</li>
                <li>• Cashback dining deals</li>
                <li>• Premium card benefits</li>
                <li>• Dining reward points</li>
                <li>• Exclusive restaurant access</li>
                <li>• Corporate dining offers</li>
                <li>• Platinum card dining</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-[#1B1F3B]">Popular Dining Areas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Dhaka</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Gulshan buffet deals</li>
                      <li>• Banani restaurant offers</li>
                      <li>• Dhanmondi dining</li>
                      <li>• Uttara food courts</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Other Cities</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Chittagong buffet</li>
                      <li>• Sylhet dining offers</li>
                      <li>• Cox's Bazar restaurants</li>
                      <li>• Khulna food deals</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 text-[#1B1F3B]">Best Times to Dine</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-800">Lunch Hours (12PM - 3PM)</p>
                      <p className="text-sm text-gray-600">Best lunch buffet deals and business lunch offers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-800">Dinner Hours (7PM - 10PM)</p>
                      <p className="text-sm text-gray-600">Premium dinner buffet and fine dining experiences</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">Weekend Specials</p>
                      <p className="text-sm text-gray-600">Special weekend buffet deals and family dining packages</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Offer Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <EnhancedOfferModal
            offer={selectedOffer}
            isOpen={!!selectedOffer}
            onClose={() => setSelectedOffer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BOGOPage; 