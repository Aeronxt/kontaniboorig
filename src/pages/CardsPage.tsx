import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronDown, Filter, Info, X, SlidersHorizontal, Grid, List, Star, CreditCard, Shield, Gift, Plane, ExternalLink, MapPin, CheckCircle, AlertCircle, DollarSign, Calendar, Users, Percent, ArrowUpDown, Building2 } from 'lucide-react';
import Speedometer from '../components/Speedometer';
import Card from '../components/Card';
import BankLogos from '../components/ui/BankLogos';
import SEO from '../components/SEO';

interface Eligibility {
  age?: string;
  income?: string;
  employment?: string;
  residency?: string;
  credit_score?: string;
}

interface CardBenefits {
  travel?: boolean;
  insurance?: boolean;
  rewards?: boolean;
  [key: string]: boolean | undefined;
}

interface RatesAndFees {
  annual_fee?: string;
  purchase_rate?: string;
  balance_transfer_rate?: string;
  cash_advance_rate?: string;
  [key: string]: string | undefined;
}

interface Reviews {
  average_rating?: number;
  total_reviews?: number;
  [key: string]: number | undefined;
}

interface CreditCard {
  id: number;
  brand: string;
  card_type: string;
  card_name: string;
  recommended: string;
  promoted: string;
  frequent_flyer: string;
  bonus_points: string;
  purchase_rate: string;
  reward_points_per_dollar: string;
  rewards: string;
  annual_fee: string;
  interest_free_days: string;
  min_credit_limit: string;
  max_credit_limit: string;
  balance_transfer_limit: string;
  eligibility: Eligibility;
  minimum_monthly_repayment: string;
  late_payment_fee: string;
  foreign_currency: string;
  foreign_currency_conversion_fee: string;
  additional_card_holder_fee: string;
  number_of_additional_cardholders: string;
  card_benefits: CardBenefits;
  rates_and_fees: RatesAndFees;
  pros: Record<string, string>;
  cons: Record<string, string>;
  description: Record<string, string>;
  reviews: Reviews;
  link_to_site: string;
  image_link: string;
  konta_nibo_score?: number;
  lounge_access?: string;
  number_of_lounge_entitlements?: number;
}

type SortField = 'purchase_rate' | 'annual_fee' | 'interest_free_days' | 'rewards' | 'lounge_access';

interface CompareModalProps {
  cards: CreditCard[];
  isOpen: boolean;
  onClose: () => void;
}

interface CardDetailsModalProps {
  card: CreditCard;
  isOpen: boolean;
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ cards, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rates' | 'benefits' | 'limits'>('overview');
  
  if (!isOpen) return null;

  // Helper function to format lounge access display
  const formatLoungeAccess = (loungeAccess?: string, loungeEntitlements?: number): string => {
    if (loungeAccess === 'Yes' && loungeEntitlements && loungeEntitlements > 0) {
      return `${loungeEntitlements} Visit${loungeEntitlements > 1 ? 's' : ''}`;
    }
    return 'No';
  };



  // Helper function to parse numeric values from strings
  const parseNumericValue = (value: string | undefined | null): number => {
    if (!value) return 0;
    const numericString = String(value).replace(/[^0-9.]/g, '');
    return parseFloat(numericString) || 0;
  };

  // Helper function to determine winner for numeric fields (lower is better for rates/fees, higher for limits/benefits)
  const getWinner = (field: string, values: number[]): number => {
    const lowerIsBetter = ['purchase_rate', 'annual_fee', 'late_payment_fee', 'foreign_currency_conversion_fee'];
    if (lowerIsBetter.includes(field)) {
      const minValue = Math.min(...values.filter(v => v > 0));
      return values.indexOf(minValue);
    } else {
      const maxValue = Math.max(...values);
      return values.indexOf(maxValue);
    }
  };

  // Helper function to get comparison status
  const getComparisonStatus = (field: string, cardValues: number[], cardIndex: number): 'winner' | 'loser' | 'tie' => {
    const winnerIndex = getWinner(field, cardValues);
    if (cardValues.every(v => v === cardValues[0])) return 'tie';
    return cardIndex === winnerIndex ? 'winner' : 'loser';
  };

  // Calculate overall score for each card
  const calculateScore = (card: CreditCard): number => {
    let score = 50; // Base score
    
    // Purchase rate (lower is better)
    const purchaseRate = parseNumericValue(card.purchase_rate);
    if (purchaseRate <= 20) score += 15;
    else if (purchaseRate <= 25) score += 10;
    else score += 5;
    
    // Annual fee (lower is better)
    const annualFee = parseNumericValue(card.annual_fee);
    if (annualFee === 0) score += 15;
    else if (annualFee <= 1000) score += 10;
    else score += 5;
    
    // Rewards and benefits
    if (card.rewards === 'Yes') score += 10;
    if (card.lounge_access === 'Yes') score += 10;
    if (card.bonus_points) score += 5;
    
    // Interest free days (higher is better)
    const interestFreeDays = parseNumericValue(card.interest_free_days);
    if (interestFreeDays >= 50) score += 10;
    else if (interestFreeDays >= 45) score += 7;
    else score += 3;
    
    return Math.min(100, score);
  };

  const overviewFields = [
    { label: 'Purchase Rate', field: 'purchase_rate', type: 'percentage', lowerIsBetter: true },
    { label: 'Annual Fee', field: 'annual_fee', type: 'currency', lowerIsBetter: true },
    { label: 'Interest-Free Days', field: 'interest_free_days', type: 'days', lowerIsBetter: false },
    { label: 'Rewards Program', field: 'rewards', type: 'text', lowerIsBetter: false },
    { label: 'Lounge Access', field: 'lounge_access', type: 'lounge', lowerIsBetter: false },
  ];

  const ratesAndFeesFields = [
    { label: 'Purchase Rate p.a.', field: 'purchase_rate', type: 'percentage', lowerIsBetter: true },
    { label: 'Annual Fee', field: 'annual_fee', type: 'currency', lowerIsBetter: true },
    { label: 'Late Payment Fee', field: 'late_payment_fee', type: 'currency', lowerIsBetter: true },
    { label: 'Foreign Currency Fee', field: 'foreign_currency_conversion_fee', type: 'percentage', lowerIsBetter: true },
    { label: 'Interest-Free Period', field: 'interest_free_days', type: 'days', lowerIsBetter: false },
  ];

  const limitsFields = [
    { label: 'Min Credit Limit', field: 'min_credit_limit', type: 'currency', lowerIsBetter: false },
    { label: 'Max Credit Limit', field: 'max_credit_limit', type: 'currency', lowerIsBetter: false },
    { label: 'Balance Transfer Limit', field: 'balance_transfer_limit', type: 'currency', lowerIsBetter: false },
  ];

  const benefitsFields = [
    { label: 'Rewards Program', field: 'rewards', type: 'text', lowerIsBetter: false },
    { label: 'Bonus Points', field: 'bonus_points', type: 'text', lowerIsBetter: false },
    { label: 'Lounge Access', field: 'lounge_access', type: 'lounge', lowerIsBetter: false },
    { label: 'Frequent Flyer', field: 'frequent_flyer', type: 'text', lowerIsBetter: false },
  ];

  const renderProgressBar = (value: number, maxValue: number, color: string) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${(value / maxValue) * 100}%` }}
      ></div>
    </div>
  );

  const renderComparison = (fields: any[]) => {
    return (
      <div className="space-y-6">
        {fields.map(({ label, field, type, lowerIsBetter }) => {
          const values = cards.map(card => {
            if (field === 'lounge_access') {
              return card.lounge_access === 'Yes' ? (card.number_of_lounge_entitlements || 1) : 0;
            }
            return parseNumericValue(card[field as keyof CreditCard] as string);
          });
          
          const maxValue = Math.max(...values);
          const hasNumericData = values.some(v => v > 0);

          return (
            <div key={field} className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">{label}</h3>
              
              <div className="grid grid-cols-2 gap-6">
                {cards.map((card, index) => {
                  const rawValue = card[field as keyof CreditCard];
                  const numericValue = field === 'lounge_access' 
                    ? (card.lounge_access === 'Yes' ? (card.number_of_lounge_entitlements || 1) : 0)
                    : parseNumericValue(rawValue as string);
                  
                  let displayValue = '';
                  let status: 'winner' | 'loser' | 'tie' = 'tie';
                  
                  if (type === 'lounge') {
                    displayValue = formatLoungeAccess(card.lounge_access, card.number_of_lounge_entitlements);
                  } else if (type === 'text') {
                    displayValue = String(rawValue || 'N/A');
                  } else {
                    displayValue = String(rawValue || 'N/A');
                  }
                  
                  if (hasNumericData && type !== 'text') {
                    status = getComparisonStatus(field, values, index);
                  }

                  return (
                    <div key={card.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-700">
                          {card.brand} {card.card_name.length > 15 ? card.card_name.substring(0, 15) + '...' : card.card_name}
                        </div>
                        {status === 'winner' && hasNumericData && type !== 'text' && (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            BEST
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xl font-bold text-[#1B1F3B]">
                        {displayValue}
                      </div>
                      
                      {hasNumericData && type !== 'text' && maxValue > 0 && (
                        <div className="space-y-2">
                          {renderProgressBar(
                            lowerIsBetter ? (maxValue - numericValue + 1) : numericValue,
                            lowerIsBetter ? maxValue + 1 : maxValue,
                            status === 'winner' ? 'bg-green-500' : status === 'loser' ? 'bg-red-400' : 'bg-gray-400'
                          )}
                          {type === 'percentage' && (
                            <div className="text-xs text-gray-500">
                              {lowerIsBetter ? 'Lower is better' : 'Higher is better'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white p-6">
          <button
            onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Card Comparison</h2>
                <p className="text-white/80">Side-by-side analysis of your selected cards</p>
        </div>
        
              {/* Card Overview */}
              <div className="flex gap-4">
                {cards.map((card) => {
                  const score = calculateScore(card);
                  return (
                    <div key={card.id} className="bg-white/10 rounded-xl p-4 text-center min-w-[140px]">
                      <div className="w-16 h-10 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                        {card.image_link ? (
                          <img 
                            src={card.image_link} 
                            alt={`${card.brand} ${card.card_name} Bangladesh credit card comparison`}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <CreditCard size={20} className="text-white/60" />
                        )}
                </div>
                      <div className="text-sm font-medium mb-1">
                        {card.brand}
                      </div>
                      <div className="text-xs text-white/70 mb-2">
                        {card.card_name.length > 12 ? card.card_name.substring(0, 12) + '...' : card.card_name}
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <div className="text-lg font-bold">{score}</div>
                        <div className="text-xs">/100</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'rates', label: 'Rates & Fees', icon: '💰' },
              { key: 'benefits', label: 'Benefits', icon: '🎁' },
              { key: 'limits', label: 'Credit Limits', icon: '💳' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.key
                    ? 'text-[#1B1F3B] border-b-2 border-[#1B1F3B] bg-white'
                    : 'text-gray-600 hover:text-[#1B1F3B] hover:bg-white/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
              ))}
            </div>
            
          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto bg-gray-50">
            {activeTab === 'overview' && renderComparison(overviewFields)}
            {activeTab === 'rates' && renderComparison(ratesAndFeesFields)}
            {activeTab === 'benefits' && renderComparison(benefitsFields)}
            {activeTab === 'limits' && renderComparison(limitsFields)}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-white">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-gray-600">
                Ready to apply? Choose the card that best fits your needs.
              </div>
              <div className="flex gap-3">
                {cards.map((card) => (
                  <a 
                    key={card.id}
                    href={card.link_to_site || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-6 py-3 rounded-xl font-medium hover:from-[#2d325f] hover:to-[#1B1F3B] transition-all duration-200 flex items-center gap-2 shadow-lg text-sm"
                  >
                    Apply for {card.brand}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'fees' | 'eligibility'>('overview');

  // Helper function to check if a value exists and is not empty
  const hasValue = (value: any): boolean => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'object') {
      return Object.keys(value).length > 0 && Object.values(value).some(v => v !== null && v !== undefined && v !== '');
    }
    return true;
  };

  // Helper function to format lounge access display
  const formatLoungeAccess = (loungeAccess?: string, loungeEntitlements?: number): string => {
    if (loungeAccess === 'Yes' && loungeEntitlements && loungeEntitlements > 0) {
      return `${loungeEntitlements} Visit${loungeEntitlements > 1 ? 's' : ''} per year`;
    }
    return loungeAccess === 'Yes' ? 'Yes' : 'No';
  };

  // Helper function to format credit limits with Taka symbol
  const formatCreditLimit = (value?: string): string => {
    if (!value) return 'N/A';
    // Remove any existing currency symbols and extra spaces
    const cleanValue = value.replace(/[$৳,\s]/g, '');
    // If it's a valid number, format it with Taka symbol
    if (cleanValue && !isNaN(Number(cleanValue))) {
      return `৳${Number(cleanValue).toLocaleString()}`;
    }
    // If it already contains Taka symbol, return as is
    if (value.includes('৳')) {
      return value;
    }
    // Otherwise replace $ with ৳ if present, or add ৳ prefix
    return value.replace('$', '৳').replace(/^(?!৳)/, '৳');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-0 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ 
            scale: 0.95, 
            opacity: 0,
            y: window.innerWidth < 768 ? '100%' : 0
          }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: 0
          }}
          exit={{ 
            scale: 0.95, 
            opacity: 0,
            y: window.innerWidth < 768 ? '100%' : 0
          }}
          transition={{ duration: 0.3, type: 'spring', damping: 25 }}
          className="bg-white rounded-none md:rounded-2xl shadow-2xl w-full h-full md:max-w-4xl md:w-full md:max-h-[90vh] md:h-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white p-4 md:p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X size={20} className="md:hidden" />
              <X size={24} className="hidden md:block" />
            </button>
            
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 pr-12 md:pr-0">
              <div className="w-24 h-16 md:w-32 md:h-20 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                    {card.image_link ? (
                      <img 
                        src={card.image_link} 
                        alt={`${card.brand} ${card.card_name} Bangladesh credit card details`}
                    className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                  <>
                    <CreditCard size={32} className="text-white/60 md:hidden" />
                    <CreditCard size={40} className="text-white/60 hidden md:block" />
                  </>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 mb-2">
                  <h2 className="text-lg md:text-2xl font-bold leading-tight">{card.brand} {card.card_name}</h2>
                  {card.recommended === 'Yes' && (
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1">
                      <Star size={12} className="fill-yellow-900 md:hidden" />
                      <Star size={16} className="fill-yellow-900 hidden md:block" />
                      Recommended
                      </div>
                    )}
                  </div>
                <p className="text-white/80 text-sm md:text-lg mb-3 md:mb-0">{card.card_type}</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-3 md:mt-4">
                  {hasValue(card.purchase_rate) && (
                    <div>
                      <div className="text-white/70 text-xs">Purchase Rate</div>
                      <div className="font-semibold text-sm md:text-base">{card.purchase_rate}</div>
                    </div>
                  )}
                  {hasValue(card.annual_fee) && (
                    <div>
                      <div className="text-white/70 text-xs">Annual Fee</div>
                      <div className="font-semibold text-sm md:text-base">{card.annual_fee}</div>
                    </div>
                  )}
                  {card.lounge_access && (
                    <div>
                      <div className="text-white/70 text-xs">Lounge Access</div>
                      <div className="font-semibold text-sm md:text-base">{formatLoungeAccess(card.lounge_access, card.number_of_lounge_entitlements)}</div>
                    </div>
                  )}
                  {card.konta_nibo_score && (
                    <div>
                      <div className="text-white/70 text-xs">Score</div>
                      <div className="font-semibold text-sm md:text-base">{card.konta_nibo_score}/10</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
                </div>
                
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {['overview', 'benefits', 'fees', 'eligibility'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 md:px-6 py-3 md:py-4 font-medium capitalize transition-colors whitespace-nowrap text-sm md:text-base ${
                  activeTab === tab
                    ? 'text-[#1B1F3B] border-b-2 border-[#1B1F3B] bg-blue-50'
                    : 'text-gray-600 hover:text-[#1B1F3B] hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
                  </div>

          {/* Content */}
          <div className="p-4 md:p-6 flex-1 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {hasValue(card.interest_free_days) && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <Calendar className="text-blue-600 mb-2" size={24} />
                      <div className="text-sm text-gray-600">Interest-free days</div>
                      <div className="font-semibold text-lg">{card.interest_free_days}</div>
                    </div>
                  )}
                  
                  {hasValue(card.min_credit_limit) && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-green-600 mb-2 text-2xl font-bold">৳</div>
                      <div className="text-sm text-gray-600">Min Credit Limit</div>
                      <div className="font-semibold text-lg">{formatCreditLimit(card.min_credit_limit)}</div>
                    </div>
                  )}
                  
                  {hasValue(card.max_credit_limit) && (
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="text-purple-600 mb-2 text-2xl font-bold">৳</div>
                      <div className="text-sm text-gray-600">Max Credit Limit</div>
                      <div className="font-semibold text-lg">{formatCreditLimit(card.max_credit_limit)}</div>
                    </div>
                  )}
                  
                  {hasValue(card.rewards) && (
                    <div className="bg-orange-50 rounded-xl p-4">
                      <Gift className="text-orange-600 mb-2" size={24} />
                      <div className="text-sm text-gray-600">Rewards Program</div>
                      <div className="font-semibold text-lg">{card.rewards}</div>
                    </div>
                  )}
                  
                  {hasValue(card.bonus_points) && (
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <Star className="text-yellow-600 mb-2" size={24} />
                      <div className="text-sm text-gray-600">Bonus Points</div>
                      <div className="font-semibold text-lg">{card.bonus_points}</div>
                    </div>
                  )}
                  
                  {hasValue(card.frequent_flyer) && (
                    <div className="bg-indigo-50 rounded-xl p-4">
                      <Plane className="text-indigo-600 mb-2" size={24} />
                      <div className="text-sm text-gray-600">Frequent Flyer</div>
                      <div className="font-semibold text-lg">{card.frequent_flyer}</div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {hasValue(card.description) && (
                  <div className="bg-white border border-gray-100 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Info size={20} />
                      About This Card
                    </h3>
                    {Object.entries(card.description).map(([key, value]) => {
                      if (hasValue(value)) {
                        return (
                          <p key={key} className="text-gray-700 mb-3 leading-relaxed">{value}</p>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-6">
                {hasValue(card.card_benefits) && (
                  <div>
                    {typeof card.card_benefits === 'object' && Object.entries(card.card_benefits).map(([key, value]) => {
                      if (Array.isArray(value) && value.length > 0) {
                        return (
                          <div key={key} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 capitalize">
                              <Shield size={20} className="text-blue-600" />
                              {key.replace(/_/g, ' ')}
                            </h3>
                            <ul className="space-y-3">
                              {value.map((item: string, index: number) => (
                                <li key={index} className="flex items-start gap-3">
                                  <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      } else if (typeof value === 'string' && value && String(value).trim() !== '') {
                        return (
                          <div key={key} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-3 capitalize flex items-center gap-2">
                              <Shield size={20} className="text-blue-600" />
                              {key.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{value}</p>
                          </div>
                        );
                      } else if (typeof value === 'boolean' && value) {
                        return (
                          <div key={key} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl mb-3">
                            <CheckCircle size={20} className="text-green-500" />
                            <span className="capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
                
                {/* Pros & Cons */}
                {(hasValue(card.pros) || hasValue(card.cons)) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hasValue(card.pros) && (
                      <div className="bg-green-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
                          <CheckCircle size={20} />
                          Pros
                        </h3>
                        <ul className="space-y-2">
                          {Object.entries(card.pros).map(([key, value]) => {
                            if (hasValue(value)) {
                              return (
                                <li key={key} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-1">✓</span>
                                  <span className="text-green-800">{value}</span>
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                      </div>
                    )}
                    
                    {hasValue(card.cons) && (
                      <div className="bg-red-50 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-red-800 flex items-center gap-2">
                          <AlertCircle size={20} />
                          Cons
                        </h3>
                        <ul className="space-y-2">
                          {Object.entries(card.cons).map(([key, value]) => {
                            if (hasValue(value)) {
                              return (
                                <li key={key} className="flex items-start gap-2">
                                  <span className="text-red-600 mt-1">✗</span>
                                  <span className="text-red-800">{value}</span>
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="space-y-6">
                {/* Core Rates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hasValue(card.purchase_rate) && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Percent size={20} className="text-blue-600" />
                        <h3 className="font-semibold">Purchase Rate</h3>
                      </div>
                      <div className="text-2xl font-bold text-[#1B1F3B]">{card.purchase_rate}</div>
                    </div>
                  )}
                  
                  {hasValue(card.annual_fee) && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-green-600 text-xl font-bold">৳</div>
                        <h3 className="font-semibold">Annual Fee</h3>
                      </div>
                      <div className="text-2xl font-bold text-[#1B1F3B]">{card.annual_fee}</div>
                    </div>
                  )}
                </div>

                {/* Additional Fees */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Fees & Terms</h3>
                  <div className="space-y-4">
                    {hasValue(card.foreign_currency_conversion_fee) && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Foreign currency conversion fee</span>
                        <span className="font-semibold">{card.foreign_currency_conversion_fee}</span>
                      </div>
                    )}
                    {hasValue(card.late_payment_fee) && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Late payment fee</span>
                        <span className="font-semibold">{card.late_payment_fee}</span>
                      </div>
                    )}
                    {hasValue(card.minimum_monthly_repayment) && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Minimum monthly repayment</span>
                        <span className="font-semibold">{card.minimum_monthly_repayment}</span>
                      </div>
                    )}
                    {hasValue(card.additional_card_holder_fee) && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Additional cardholder fee</span>
                        <span className="font-semibold">{card.additional_card_holder_fee}</span>
                      </div>
                    )}
                    {hasValue(card.balance_transfer_limit) && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Balance transfer limit</span>
                        <span className="font-semibold">{card.balance_transfer_limit}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rates and Fees Object */}
                {hasValue(card.rates_and_fees) && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Detailed Rates & Fees</h3>
                    <div className="space-y-3">
                      {Object.entries(card.rates_and_fees).map(([key, value]) => {
                        if (hasValue(value)) {
                          return (
                            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                              <span className="font-semibold">{value}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="space-y-6">
                {hasValue(card.eligibility) && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <Users size={20} className="text-blue-600" />
                      Eligibility Requirements
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(card.eligibility).map(([key, value]) => {
                        if (hasValue(value)) {
                          return (
                            <div key={key} className="border border-gray-100 rounded-lg p-4">
                              <div className="text-sm text-gray-600 mb-2 capitalize font-medium">
                                {key.replace(/_/g, ' ')}
                              </div>
                              <div className="font-semibold text-gray-900">{value}</div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 md:p-6 bg-white sticky bottom-0 md:static">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
              <div className="text-xs md:text-sm text-gray-600 text-center md:text-left">
                Ready to apply? Visit the bank's website to get started.
              </div>
                  <a 
                    href={card.link_to_site || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-6 md:px-8 py-3 rounded-xl font-medium hover:from-[#2d325f] hover:to-[#1B1F3B] transition-all duration-200 flex items-center gap-2 shadow-lg w-full md:w-auto justify-center"
                  >
                Apply Now
                <ExternalLink size={16} />
                  </a>
                </div>
              </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Add new MobileFilterDrawer component
interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  expandedFilter: string | null;
  toggleFilter: (filterName: string) => void;
  cardTypes: string[];
  bankBrands: string[];
  cardBenefits: string[];
  specialFeatures: string[];
  purchaseRateRanges: { label: string; value: string; }[];
  ratingRanges: { label: string; value: string; }[];
}

interface MobileSortDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  onSort: (field: SortField) => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  expandedFilter,
  toggleFilter,
  cardTypes,
  bankBrands,
  cardBenefits,
  specialFeatures,
  purchaseRateRanges,
  ratingRanges
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-white z-50 md:hidden overflow-y-auto"
          >
            <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={onClose} className="p-2">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Brand Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('brands')}
                >
                  <span className="font-medium">Bank Brand</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'brands' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'brands' && (
                  <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                    {bankBrands.map(brand => (
                      <label key={brand} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded" 
                          checked={filters.brands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, brands: [...filters.brands, brand]});
                            } else {
                              setFilters({...filters, brands: filters.brands.filter((b: string) => b !== brand)});
                            }
                          }}
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Type Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('cardType')}
                >
                  <span className="font-medium">Card type</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'cardType' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'cardType' && (
                  <div className="mt-3 space-y-2">
                    {cardTypes.map(type => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded" 
                          checked={filters.cardType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, cardType: [...filters.cardType, type]});
                            } else {
                              setFilters({...filters, cardType: filters.cardType.filter((t: string) => t !== type)});
                            }
                          }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase Rate Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('purchaseRate')}
                >
                  <span className="font-medium">Purchase Rate</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'purchaseRate' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'purchaseRate' && (
                  <div className="mt-3">
                    <select
                      className="w-full border rounded px-2 py-1.5 bg-white"
                      value={filters.purchaseRate}
                      onChange={(e) => setFilters({...filters, purchaseRate: e.target.value})}
                    >
                      {purchaseRateRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Card Benefits Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('benefits')}
                >
                  <span className="font-medium">Card Benefits</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'benefits' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'benefits' && (
                  <div className="mt-3 space-y-2">
                    {cardBenefits.map(benefit => (
                      <label key={benefit} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded" 
                          checked={filters.benefits.includes(benefit)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, benefits: [...filters.benefits, benefit]});
                            } else {
                              setFilters({...filters, benefits: filters.benefits.filter((b: string) => b !== benefit)});
                            }
                          }}
                        />
                        {benefit}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Features Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('features')}
                >
                  <span className="font-medium">Special Features</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'features' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'features' && (
                  <div className="mt-3 space-y-2">
                    {specialFeatures.map(feature => (
                      <label key={feature} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded" 
                          checked={filters.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, features: [...filters.features, feature]});
                            } else {
                              setFilters({...filters, features: filters.features.filter((f: string) => f !== feature)});
                            }
                          }}
                        />
                        {feature}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('rating')}
                >
                  <span className="font-medium">Konta Nibo Rating</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'rating' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'rating' && (
                  <div className="mt-3">
                    <select
                      className="w-full border rounded px-2 py-1.5 bg-white"
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: e.target.value})}
                    >
                      {ratingRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Lounge Access Filter */}
              <div className="mb-4 border-b pb-4">
                <button 
                  className="w-full flex justify-between items-center"
                  onClick={() => toggleFilter('loungeAccess')}
                >
                  <span className="font-medium">Lounge Access</span>
                  <ChevronDown size={18} className={`transition-transform ${expandedFilter === 'loungeAccess' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'loungeAccess' && (
                  <div className="mt-3">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 rounded" 
                        checked={filters.loungeAccess}
                        onChange={(e) => setFilters({...filters, loungeAccess: e.target.checked})}
                      />
                      <span>Only cards with lounge access</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Helper functions to categorize cards for SEO sections
const getCashbackCards = (cards: CreditCard[]): CreditCard[] => {
  return cards.filter(card => 
    card.rewards === 'Yes' || 
    card.card_type.toLowerCase().includes('cashback') ||
    card.card_name.toLowerCase().includes('cashback')
  );
};

const getLowFeeCards = (cards: CreditCard[]): CreditCard[] => {
  return cards.filter(card => {
    const annualFee = parseFloat(card.annual_fee?.replace(/[^0-9.]/g, '') || '0');
    return annualFee <= 1000; // Cards with annual fee <= 1000 BDT
  });
};

const getStudentAndSecuredCards = (cards: CreditCard[]): CreditCard[] => {
  return cards.filter(card => 
    card.card_type.toLowerCase().includes('student') ||
    card.card_type.toLowerCase().includes('secured') ||
    card.card_name.toLowerCase().includes('student') ||
    card.card_name.toLowerCase().includes('secured')
  );
};

const MobileSortDrawer: React.FC<MobileSortDrawerProps> = ({
  isOpen,
  onClose,
  sortField,
  sortDirection,
  onSort
}) => {
  const sortOptions = [
    { field: 'purchase_rate' as SortField, label: 'Purchase Rate', icon: Percent },
    { field: 'annual_fee' as SortField, label: 'Annual Fee', icon: () => <span className="text-lg font-bold">৳</span> },
    { field: 'interest_free_days' as SortField, label: 'Interest-Free Days', icon: Calendar },
    { field: 'rewards' as SortField, label: 'Rewards', icon: Gift },
    { field: 'lounge_access' as SortField, label: 'Lounge Access', icon: Plane }
  ];

  const handleSortSelection = (field: SortField) => {
    onSort(field);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={onClose}
          />
          
          {/* Sort Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowUpDown size={22} />
                Sort Cards
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Sort Options */}
            <div className="p-6">
              <div className="space-y-3">
                {sortOptions.map(({ field, label, icon: Icon }) => (
                  <button
                    key={field}
                    onClick={() => handleSortSelection(field)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                      sortField === field
                        ? 'border-[#1B1F3B] bg-[#1B1F3B]/5 text-[#1B1F3B]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={sortField === field ? 'text-[#1B1F3B]' : 'text-gray-500'} />
                      <span className="font-medium">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {sortField === field && (
                        <div className="flex items-center gap-1 text-sm text-[#1B1F3B]">
                          <span>{sortDirection === 'asc' ? 'Low to High' : 'High to Low'}</span>
                          <ChevronDown size={16} className={`transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Current Sort Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Current Sort</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Sorted by: </span>
                  <span className="font-medium text-[#1B1F3B]">
                    {sortOptions.find(opt => opt.field === sortField)?.label}
                  </span>
                  <span>({sortDirection === 'asc' ? 'Low to High' : 'High to Low'})</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CardsPage: React.FC = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('annual_fee');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    cardType: [] as string[],
    annualFee: [] as string[],
    brands: [] as string[],
    rewards: false,
    noFee: false,
    purchaseRate: '',
    benefits: [] as string[],
    features: [] as string[],
    rating: '',
    loungeAccess: false
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCardForDetails, setSelectedCardForDetails] = useState<CreditCard | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Card types from database
  const cardTypes = ['Visa', 'Mastercard', 'American Express'];

  // Bank brands from database
  const bankBrands = [
    'AB Bank',
    'BASIC Bank',
    'Bank Asia',
    'Brac Bank',
    'City Bank',
    'Dhaka Bank',
    'Dutch-Bangla Bank',
    'Eastern Bank',
    'IFIC Bank',
    'Jamuna Bank',
    'Janata Bank',
    'NCC Bank',
    'Premier Bank',
    'Prime Bank',
    'Sonali Bank',
    'Standard Bank',
    'Standard Chartered Bank',
    'Trust Bank',
    'United Commercial Bank (UCB)'
  ];

  // Card benefits from database
  const cardBenefits = [
    'Travel',
    'Insurance',
    'Rewards'
  ];

  // Special features from database
  const specialFeatures = [
    'Frequent Flyer Program',
    'Bonus Points',
    'Balance Transfer',
    'Foreign Currency',
    'Additional Cardholders'
  ];

  // Purchase rate ranges
  const purchaseRateRanges = [
    { label: 'Any', value: '' },
    { label: 'Up to 20%', value: '20' },
    { label: '20% - 25%', value: '25' },
    { label: 'Above 25%', value: '26' }
  ];

  // Rating ranges
  const ratingRanges = [
    { label: 'Any', value: '' },
    { label: '9+ Excellent', value: '9' },
    { label: '8+ Very Good', value: '8' },
    { label: '7+ Good', value: '7' },
    { label: '6+ Above Average', value: '6' }
  ];

  useEffect(() => {
    fetchCreditCards();
  }, []);

  const fetchCreditCards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) {
        setCreditCards(data);
      }
    } catch (error) {
      console.error('Error fetching credit cards:', error);
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

  const sortedCards = [...creditCards].sort((a, b) => {
    // First sort by presence of image_link
    if (a.image_link && !b.image_link) return -1;
    if (!a.image_link && b.image_link) return 1;

    // Then apply the existing sort criteria
    let valA: string | number = a[sortField] || '';
    let valB: string | number = b[sortField] || '';
    
    // Convert percentage strings to numbers for proper sorting
    if (sortField === 'purchase_rate') {
      valA = parseFloat(String(valA).replace(/[^0-9.]/g, '')) || 0;
      valB = parseFloat(String(valB).replace(/[^0-9.]/g, '')) || 0;
    }
    // Convert dollar amounts to numbers for proper sorting
    else if (sortField === 'annual_fee') {
      valA = parseFloat(String(valA).replace(/[^0-9.]/g, '')) || 0;
      valB = parseFloat(String(valB).replace(/[^0-9.]/g, '')) || 0;
    }
    // Convert number strings to numbers
    else if (sortField === 'interest_free_days') {
      valA = parseFloat(String(valA).replace(/[^0-9.]/g, '')) || 0;
      valB = parseFloat(String(valB).replace(/[^0-9.]/g, '')) || 0;
    }
    // For rewards field, convert Yes/No to 1/0 for sorting
    else if (sortField === 'rewards') {
      valA = String(valA) === 'Yes' ? 1 : 0;
      valB = String(valB) === 'Yes' ? 1 : 0;
    }
    // For lounge access, prioritize by number of visits, then by availability
    else if (sortField === 'lounge_access') {
      const accessA = a.lounge_access === 'Yes' ? 1 : 0;
      const accessB = b.lounge_access === 'Yes' ? 1 : 0;
      const visitsA = a.number_of_lounge_entitlements || 0;
      const visitsB = b.number_of_lounge_entitlements || 0;
      
      // Sort by access first, then by number of visits
      if (accessA !== accessB) {
        valA = accessA;
        valB = accessB;
      } else {
        valA = visitsA;
        valB = visitsB;
      }
    }

    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  const filteredCards = sortedCards.filter(card => {
    // Filter by card type
    if (filters.cardType.length > 0 && !filters.cardType.includes(card.card_type)) {
      return false;
    }

    // Filter by brand
    if (filters.brands.length > 0 && !filters.brands.includes(card.brand)) {
      return false;
    }

    // Filter by annual fee
    if (filters.noFee && card.annual_fee !== '$0') {
      return false;
    }

    // Filter by rewards
    if (filters.rewards && card.rewards === 'No') {
      return false;
    }

    // Filter by purchase rate
    if (filters.purchaseRate) {
      const rate = parseFloat(card.purchase_rate?.replace('%', '') || '0');
      const filterRate = parseFloat(filters.purchaseRate);
      if (filters.purchaseRate === '20' && rate > 20) return false;
      if (filters.purchaseRate === '25' && (rate <= 20 || rate > 25)) return false;
      if (filters.purchaseRate === '26' && rate <= 25) return false;
    }

    // Filter by benefits
    if (filters.benefits.length > 0) {
      const cardBenefitsObj = card.card_benefits as any;
      if (!cardBenefitsObj) return false;
      const hasBenefits = filters.benefits.every(benefit => 
        cardBenefitsObj[benefit.toLowerCase()] === true
      );
      if (!hasBenefits) return false;
    }

    // Filter by special features
    if (filters.features.length > 0) {
      if (filters.features.includes('Frequent Flyer Program') && card.frequent_flyer !== 'Yes') return false;
      if (filters.features.includes('Bonus Points') && !card.bonus_points) return false;
      if (filters.features.includes('Balance Transfer') && !card.balance_transfer_limit) return false;
      if (filters.features.includes('Foreign Currency') && !card.foreign_currency) return false;
      if (filters.features.includes('Additional Cardholders') && !card.number_of_additional_cardholders) return false;
    }

    // Filter by rating
    if (filters.rating) {
      const score = parseFloat(card.konta_nibo_score?.toString() || '0');
      if (score < parseFloat(filters.rating)) return false;
    }

    // Filter by lounge access
    if (filters.loungeAccess && card.lounge_access !== 'Yes') {
      return false;
    }

    return true;
  });

  const handleCompareToggle = (cardId: number) => {
    setSelectedForComparison(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      }
      if (prev.length < 2) {
        return [...prev, cardId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      setIsCompareModalOpen(true);
    }
  };

  const handleViewDetails = (card: CreditCard) => {
    setSelectedCardForDetails(card);
    setIsDetailsModalOpen(true);
  };

  const selectedCards = creditCards.filter(card => selectedForComparison.includes(card.id));

  // Helper function to format lounge access display
  const formatLoungeAccess = (loungeAccess?: string, loungeEntitlements?: number): string => {
    if (loungeAccess === 'Yes' && loungeEntitlements && loungeEntitlements > 0) {
      return `${loungeEntitlements} Visit${loungeEntitlements > 1 ? 's' : ''}`;
    }
    return 'No';
  };

  return (
    <>
      <SEO 
        title="Best Credit Cards Bangladesh | Compare Visa, Mastercard & Amex Cards"
        description="Compare best credit cards in Bangladesh 2025. Find Visa cards, Mastercard, American Express credit cards with lowest fees, cashback rewards & travel benefits. Expert reviews for student credit cards & premium cards."
        keywords="credit card, cards, credit card bangladesh, american express credit card, visa cards, mastercards, bd credit card, best travel credit card, student credit cards, visa credit card, amex platinum, amex credit card"
        pageType="credit-cards"
        canonical="https://kontanibo.com/credit-cards"
        ogUrl="https://kontanibo.com/credit-cards"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white"
      >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1A1F36] via-[#2d325f] to-[#1A1F36] text-white py-8 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Mobile Layout - Centered */}
          <div className="md:hidden">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-6"
            >
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
                Discover the Best Credit Cards in Bangladesh: Compare and Apply Effortlessly
              </h1>
              {/* Mobile-optimized shorter description */}
              <p className="text-sm font-light text-blue-100 mx-auto leading-relaxed mb-3">
                Compare Visa cards, Mastercard & American Express credit cards. Find best travel credit cards, student credit cards & cashback rewards in BD.
              </p>
              <p className="text-base font-light text-blue-100 leading-relaxed">
                Compare {creditCards.length}+ cards including Amex Platinum, Visa credit cards & Mastercards with lowest fees
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <Card />
              </div>
            </motion.div>
          </div>

          {/* Desktop Layout - Left Text, Right Card */}
          <div className="hidden md:flex items-center gap-12 lg:gap-16">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-left"
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
                Discover the Best Credit Cards in Bangladesh: Compare and Apply Effortlessly
              </h1>
              <p className="text-lg lg:text-xl font-light text-blue-100 leading-relaxed mb-6">
                Discover the best credit cards in Bangladesh for 2025 – compare Visa cards, Mastercard & American Express credit cards with lowest annual fees, cashback rewards, travel benefits and lounge access. Whether you're looking for Amex Platinum, student credit cards, best travel credit card, or BD credit card options, our expert reviews help you find the perfect match. Start saving on fees and maximizing rewards with our comprehensive credit card comparison.
              </p>
              <p className="text-xl lg:text-2xl font-light text-blue-100 leading-relaxed">
                Compare {creditCards.length}+ cards including Visa credit cards, Mastercards & Amex credit cards with real-time rates
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <Card />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <BankLogos />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats and Controls Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                         <div className="flex items-center gap-6">
               <div className="text-center">
                 <div className="text-3xl font-bold text-[#1B1F3B]">{filteredCards.length}</div>
                 <div className="text-sm text-gray-600">Cards Found</div>
               </div>
               <div className="h-8 w-px bg-gray-300"></div>
               <div className="text-center">
                 <div className="text-3xl font-bold text-purple-600">{creditCards.filter(c => c.lounge_access === 'Yes').length}</div>
                 <div className="text-sm text-gray-600">Lounge Access Cards</div>
               </div>
               <div className="h-8 w-px bg-gray-300"></div>
               <div className="text-center">
                 <div className="text-3xl font-bold text-blue-600">{creditCards.filter(c => c.rewards === 'Yes').length}</div>
                 <div className="text-sm text-gray-600">With Rewards</div>
               </div>
             </div>
            
            <div className="flex items-center gap-4">
          {/* Mobile Filter Button */}
              <div className="md:hidden">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
                  className="flex items-center gap-2 bg-[#1B1F3B] text-white px-6 py-3 rounded-xl shadow-md hover:bg-[#2d325f] transition-all duration-200"
            >
              <SlidersHorizontal size={20} />
              <span>Filters</span>
            </button>
          </div>

          {/* Mobile Sort Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsSortDrawerOpen(true)}
                  className="flex items-center gap-2 bg-white border-2 border-[#1B1F3B] text-[#1B1F3B] px-6 py-3 rounded-xl shadow-md hover:bg-[#1B1F3B] hover:text-white transition-all duration-200"
                >
                  <ArrowUpDown size={20} />
                  <span>Sort</span>
                </button>
              </div>
              
              {/* View Mode Toggle */}
              <div className="hidden md:flex bg-white border border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-[#1B1F3B]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-[#1B1F3B]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  List View
                </button>
              </div>
              
              {/* Compare Button */}
              {selectedForComparison.length > 0 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={handleCompare}
                  disabled={selectedForComparison.length < 2}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedForComparison.length === 2
                      ? 'bg-green-600 text-white shadow-lg hover:bg-green-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Compare ({selectedForComparison.length}/2)
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Mobile Filter Drawer */}
          <MobileFilterDrawer
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            filters={filters}
            setFilters={setFilters}
            expandedFilter={expandedFilter}
            toggleFilter={toggleFilter}
            cardTypes={cardTypes}
            bankBrands={bankBrands}
            cardBenefits={cardBenefits}
            specialFeatures={specialFeatures}
            purchaseRateRanges={purchaseRateRanges}
            ratingRanges={ratingRanges}
          />

          {/* Mobile Sort Drawer */}
          <MobileSortDrawer
            isOpen={isSortDrawerOpen}
            onClose={() => setIsSortDrawerOpen(false)}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          {/* Desktop Filter Sidebar - hidden on mobile */}
          <div className="hidden lg:block lg:w-80">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal size={22} />
                  Refine Results
                </h2>
              </div>
              
              <div className="p-6 space-y-5">
              {/* Brand Filter */}
                <div className="border-b border-gray-200 pb-5">
                <button 
                    className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFilter('brands')}
                >
                    <span className="font-semibold text-gray-800">Bank</span>
                    <ChevronDown size={18} className={`transition-transform text-gray-500 ${expandedFilter === 'brands' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'brands' && (
                    <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                    {bankBrands.map(brand => (
                        <label key={brand} className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                            className="mr-3 rounded border-gray-300 text-[#1B1F3B] focus:ring-[#1B1F3B]" 
                          checked={filters.brands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, brands: [...filters.brands, brand]});
                            } else {
                              setFilters({...filters, brands: filters.brands.filter((b: string) => b !== brand)});
                            }
                          }}
                        />
                          <span className="text-gray-700 font-medium">{brand}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Card Type Filter */}
                <div className="border-b border-gray-200 pb-5">
                <button 
                    className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFilter('cardType')}
                >
                    <span className="font-semibold text-gray-800">Card Type</span>
                    <ChevronDown size={18} className={`transition-transform text-gray-500 ${expandedFilter === 'cardType' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'cardType' && (
                    <div className="mt-4 space-y-3">
                    {cardTypes.map(type => (
                        <label key={type} className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                            className="mr-3 rounded border-gray-300 text-[#1B1F3B] focus:ring-[#1B1F3B]" 
                          checked={filters.cardType.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, cardType: [...filters.cardType, type]});
                            } else {
                              setFilters({...filters, cardType: filters.cardType.filter((t: string) => t !== type)});
                            }
                          }}
                        />
                          <span className="text-gray-700 font-medium">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Purchase Rate Filter */}
                <div className="border-b border-gray-200 pb-5">
                <button 
                    className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFilter('purchaseRate')}
                >
                    <span className="font-semibold text-gray-800">Purchase Rate</span>
                    <ChevronDown size={18} className={`transition-transform text-gray-500 ${expandedFilter === 'purchaseRate' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'purchaseRate' && (
                    <div className="mt-4">
                    <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-700 focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                      value={filters.purchaseRate}
                      onChange={(e) => setFilters({...filters, purchaseRate: e.target.value})}
                    >
                      {purchaseRateRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Card Benefits Filter */}
                <div className="border-b border-gray-200 pb-5">
                <button 
                    className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFilter('benefits')}
                >
                    <span className="font-semibold text-gray-800">Card Benefits</span>
                    <ChevronDown size={18} className={`transition-transform text-gray-500 ${expandedFilter === 'benefits' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'benefits' && (
                    <div className="mt-4 space-y-3">
                    {cardBenefits.map(benefit => (
                        <label key={benefit} className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                            className="mr-3 rounded border-gray-300 text-[#1B1F3B] focus:ring-[#1B1F3B]" 
                          checked={filters.benefits.includes(benefit)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, benefits: [...filters.benefits, benefit]});
                            } else {
                              setFilters({...filters, benefits: filters.benefits.filter((b: string) => b !== benefit)});
                            }
                          }}
                        />
                          <span className="text-gray-700 font-medium">{benefit}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Features Filter */}
                <div className="border-b border-gray-200 pb-5">
                <button 
                    className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFilter('features')}
                >
                    <span className="font-semibold text-gray-800">Special Features</span>
                    <ChevronDown size={18} className={`transition-transform text-gray-500 ${expandedFilter === 'features' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'features' && (
                    <div className="mt-4 space-y-3">
                    {specialFeatures.map(feature => (
                        <label key={feature} className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                            className="mr-3 rounded border-gray-300 text-[#1B1F3B] focus:ring-[#1B1F3B]" 
                          checked={filters.features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({...filters, features: [...filters.features, feature]});
                            } else {
                              setFilters({...filters, features: filters.features.filter((f: string) => f !== feature)});
                            }
                          }}
                        />
                          <span className="text-gray-700 font-medium">{feature}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating Filter */}
                <div className="border-b border-gray-200 pb-5">
                <button 
                    className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFilter('rating')}
                >
                    <span className="font-semibold text-gray-800">Konta Nibo Rating</span>
                    <ChevronDown size={18} className={`transition-transform text-gray-500 ${expandedFilter === 'rating' ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFilter === 'rating' && (
                    <div className="mt-4">
                    <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-700 focus:ring-2 focus:ring-[#1B1F3B] focus:border-transparent"
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: e.target.value})}
                    >
                      {ratingRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

                {/* Lounge Access Filter */}
                <div className="pb-5">
                  <button 
                    className="w-full flex justify-between items-center py-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFilter('loungeAccess')}
                  >
                    <span className="font-semibold text-gray-800">Lounge Access</span>
                    <ChevronDown size={18} className={`transition-transform text-gray-500 ${expandedFilter === 'loungeAccess' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedFilter === 'loungeAccess' && (
                    <div className="mt-4">
                      <label className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          className="mr-3 rounded border-gray-300 text-[#1B1F3B] focus:ring-[#1B1F3B]" 
                          checked={filters.loungeAccess}
                          onChange={(e) => setFilters({...filters, loungeAccess: e.target.checked})}
                        />
                        <span className="text-gray-700 font-medium">Only cards with lounge access</span>
                      </label>
            </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Results Column */}
          <div className="lg:flex-1">
            {/* SEO Content Sections */}
            {!loading && filteredCards.length > 0 && (
              <div className="mb-8 space-y-8">
{/* Low Annual Fee Cards Section */}
                {getLowFeeCards(filteredCards).length > 0 && (
                  <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1B1F3B] mb-4">
                      Low Annual Fee Cards
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Find credit cards with minimal annual fees perfect for budget-conscious users in Bangladesh.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getLowFeeCards(filteredCards).slice(0, 6).map((card) => (
                        <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            {card.image_link ? (
                              <img 
                                src={card.image_link} 
                                alt={`${card.brand} ${card.card_name} Bangladesh low fee credit card`}
                                className="w-12 h-8 object-contain"
                              />
                            ) : (
                              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-400">Card</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-[#1B1F3B] text-sm leading-tight">
                                {card.brand} {card.card_name}
                              </h3>
                              <p className="text-xs text-gray-500">{card.card_type}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Annual Fee:</span>
                              <span className="font-medium text-green-600">{card.annual_fee || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Purchase Rate:</span>
                              <span className="font-medium text-[#1B1F3B]">{card.purchase_rate || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Interest-Free Days:</span>
                              <span className="font-medium text-[#1B1F3B]">
                                {card.interest_free_days ? `${card.interest_free_days} days` : 'N/A'}
                              </span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleViewDetails(card)}
                            className="w-full mt-3 bg-[#1B1F3B] text-white py-2 rounded-lg text-xs font-medium hover:bg-[#2d325f] transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Student & Secured Options Section */}
                {getStudentAndSecuredCards(filteredCards).length > 0 && (
                  <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1B1F3B] mb-4">
                      Student & Secured Options
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Credit cards designed for students and those building credit history in Bangladesh.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getStudentAndSecuredCards(filteredCards).slice(0, 3).map((card) => (
                        <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-[#1B1F3B] mb-2">
                            Fees & Rates
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Annual Fee: {card.annual_fee} | Purchase Rate: {card.purchase_rate}
                          </p>
                          <h3 className="font-semibold text-[#1B1F3B] mb-2">
                            Pros & Cons
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            ✓ Easy Approval | 
                            {card.eligibility?.income ? ` ✓ Low Income Requirement` : ' ✗ Standard Income Requirements'}
                          </p>
                          <h3 className="font-semibold text-[#1B1F3B] mb-2">
                            User Reviews
                          </h3>
                          <p className="text-sm text-gray-600">
                            Rating: {card.reviews?.average_rating || 'N/A'} | 
                            Reviews: {card.reviews?.total_reviews || 'N/A'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Credit Card Types Information Section */}
                <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1B1F3B] mb-6">
                    Credit Card Types in Bangladesh
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1B1F3B] mb-3">Visa Cards</h3>
                      <p className="text-gray-600 mb-4">
                        Visa credit cards are widely accepted in Bangladesh. Get Visa cards with cashback rewards, travel benefits, and low annual fees from top banks.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Visa Classic Cards</li>
                        <li>• Visa Gold Cards</li>
                        <li>• Visa Platinum Cards</li>
                        <li>• Visa Signature Cards</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="w-6 h-6 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1B1F3B] mb-3">Mastercards</h3>
                      <p className="text-gray-600 mb-4">
                        Mastercard credit cards offer excellent rewards and benefits. Compare Mastercard options with competitive rates and premium features.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Mastercard Standard</li>
                        <li>• Mastercard Gold</li>
                        <li>• Mastercard Platinum</li>
                        <li>• Mastercard World</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1B1F3B] mb-3">American Express</h3>
                      <p className="text-gray-600 mb-4">
                        American Express credit cards including Amex Platinum offer premium benefits, travel rewards, and exclusive lounge access in Bangladesh.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Amex Green Card</li>
                        <li>• Amex Gold Card</li>
                        <li>• Amex Platinum Card</li>
                        <li>• Amex Centurion Card</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Best Credit Cards by Category Section */}
                <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1B1F3B] mb-6">
                    Best Credit Cards by Category
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-[#1B1F3B] mb-2 flex items-center gap-2">
                          <Plane className="w-5 h-5 text-blue-600" />
                          Best Travel Credit Cards
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Premium travel credit cards with airline miles, hotel points, travel insurance, and airport lounge access benefits.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Travel Insurance</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Lounge Access</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Airline Miles</span>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-[#1B1F3B] mb-2 flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-600" />
                          Student Credit Cards
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Credit cards designed for students with low income requirements, no annual fees, and cashback rewards for education expenses.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">No Annual Fee</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Low Income Req</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Student Benefits</span>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-[#1B1F3B] mb-2 flex items-center gap-2">
                          <Gift className="w-5 h-5 text-purple-600" />
                          Cashback Credit Cards
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          High cashback credit cards offering rewards on everyday purchases, groceries, fuel, and online shopping in Bangladesh.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">High Cashback</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Rewards Points</span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Bonus Categories</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-[#1B1F3B] mb-2 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-600" />
                          Premium Credit Cards
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Premium cards like Amex Platinum with exclusive benefits, concierge services, and luxury travel perks for high-income users.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Concierge Service</span>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Premium Benefits</span>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">High Limits</span>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-[#1B1F3B] mb-2 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                          Business Credit Cards
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Business credit cards with expense management tools, higher credit limits, and rewards on business spending categories.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Business Rewards</span>
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">Expense Tools</span>
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">High Limits</span>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-[#1B1F3B] mb-2 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-red-600" />
                          Secured Credit Cards
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Secured credit cards for building credit history with security deposit requirements and gradual credit limit increases.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Build Credit</span>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Security Deposit</span>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Easy Approval</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-12 rounded-2xl shadow-lg flex justify-center border border-gray-100"
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#1B1F3B] border-t-transparent absolute top-0 left-0"></div>
                </div>
                  <p className="text-gray-600 mt-6 text-lg">Loading credit cards...</p>
              </div>
              </motion.div>
            ) : (
              <div>
                {viewMode === 'grid' && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredCards.length > 0 ? (
                      filteredCards.map((card, index) => (
                        <motion.div
                          key={card.id}
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          onHoverStart={() => setHoveredCard(card.id)}
                          onHoverEnd={() => setHoveredCard(null)}
                          className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer transition-all duration-300 ${
                            hoveredCard === card.id ? 'shadow-2xl border-blue-200' : ''
                          }`}
                        >
                          {card.recommended === 'Yes' && (
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 text-xs font-bold">
                              ⭐ RECOMMENDED
                  </div>
                          )}
                          {card.promoted === 'Yes' && (
                            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 text-xs font-bold">
                              🔥 PROMOTED
                </div>
                          )}
                          
                          <div className="p-4 md:p-6">
                             {/* Card Image */}
                             <div className="w-full h-20 md:h-32 mb-3 md:mb-4 flex justify-center items-center">
                               {card.image_link ? (
                                 <img 
                                   src={card.image_link} 
                                   alt={`${card.brand} ${card.card_name} Bangladesh credit card with ${card.rewards === 'Yes' ? 'cashback rewards' : 'benefits'}`}
                                   className="h-full object-contain"
                                 />
                               ) : (
                                 <div className="text-gray-400 text-xs md:text-sm">Card Image</div>
                               )}
                             </div>
                            
                            {/* Card Info */}
                            <div className="text-center mb-3 md:mb-4">
                              <h3 className="text-base md:text-lg font-bold text-[#1B1F3B] mb-1 md:mb-2 leading-tight">
                                {card.brand} {card.card_name}
                              </h3>
                              <div className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">{card.card_type}</div>
                              
                              {/* Score */}
                              <div className="flex justify-center mb-3 md:mb-4">
                                {typeof card.konta_nibo_score === 'number' ? (
                                  <div className="md:hidden">
                                    <Speedometer value={card.konta_nibo_score} maxValue={10} size={60} label="Score" />
                                  </div>
                                ) : null}
                                {typeof card.konta_nibo_score === 'number' ? (
                                  <div className="hidden md:block">
                                    <Speedometer value={card.konta_nibo_score} maxValue={10} size={80} label="Score" />
                                  </div>
                                ) : (
                                  <div className="text-gray-400 text-xs md:text-sm">No score available</div>
                                )}
                              </div>
                            </div>
                            
                            {/* Key Features */}
                            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                              <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-gray-100">
                                <span className="text-xs md:text-sm text-gray-600">Purchase Rate</span>
                                <span className="font-semibold text-xs md:text-sm text-[#1B1F3B]">{card.purchase_rate || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-gray-100">
                                <span className="text-xs md:text-sm text-gray-600">Annual Fee</span>
                                <span className="font-semibold text-xs md:text-sm text-[#1B1F3B]">{card.annual_fee || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-gray-100">
                                <span className="text-xs md:text-sm text-gray-600">Interest-Free Days</span>
                                <span className="font-semibold text-xs md:text-sm text-[#1B1F3B]">
                                  {card.interest_free_days ? `${card.interest_free_days} days` : 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-gray-100">
                                <span className="text-xs md:text-sm text-gray-600">Rewards</span>
                                <span className={`font-semibold text-xs md:text-sm ${card.rewards === 'Yes' ? 'text-green-600' : 'text-gray-500'}`}>
                                  {card.rewards || 'N/A'}
                                </span>
                              </div>
                              <div className="flex justify-between items-center py-1.5 md:py-2">
                                <span className="text-xs md:text-sm text-gray-600">Lounge Access</span>
                                <span className={`font-semibold text-xs md:text-sm ${card.lounge_access === 'Yes' ? 'text-blue-600' : 'text-gray-500'}`}>
                                  {formatLoungeAccess(card.lounge_access, card.number_of_lounge_entitlements)}
                                </span>
                              </div>
                            </div>
                            
                            {/* Bonus Points */}
                            {card.bonus_points && (
                              <div className="bg-blue-50 rounded-lg md:rounded-xl p-2 md:p-3 mb-3 md:mb-4">
                                <div className="text-center">
                                  <span className="text-xs md:text-sm text-blue-600 font-medium">🎁 {card.bonus_points} bonus points</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="p-4 md:p-6 pt-0">
                            <div className="flex items-center justify-between mb-3 md:mb-4">
                              <div className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  id={`grid-compare-${card.id}`} 
                                  className="mr-1.5 md:mr-2 w-3 h-3 md:w-4 md:h-4"
                                  checked={selectedForComparison.includes(card.id)}
                                  onChange={() => handleCompareToggle(card.id)}
                                  disabled={selectedForComparison.length >= 2 && !selectedForComparison.includes(card.id)}
                                />
                                <label htmlFor={`grid-compare-${card.id}`} className="text-xs md:text-sm text-gray-600">Compare</label>
                              </div>
                              <button 
                                onClick={() => handleViewDetails(card)}
                                className="text-[#1B1F3B] hover:text-[#2d325f] text-xs md:text-sm flex items-center gap-1"
                              >
                                <Info size={14} className="md:hidden" />
                                <Info size={16} className="hidden md:block" />
                                Details
                              </button>
                            </div>
                            
                            <a 
                              href={card.link_to_site || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-medium hover:from-[#2d325f] hover:to-[#1B1F3B] transition-all duration-200 flex items-center justify-center shadow-lg text-sm md:text-base"
                            >
                              Apply Now
                            </a>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-100">
                        <div className="text-gray-400 text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No cards found</h3>
                        <p className="text-gray-600">No credit cards match your current filters. Try adjusting your criteria.</p>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {viewMode === 'list' && (
                  <>
                {/* Sort bar */}
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="bg-white rounded-2xl shadow-lg grid grid-cols-7 border border-gray-100 text-sm text-gray-600 mb-6 overflow-hidden"
                    >
                      <div className="p-4 col-span-2 font-medium">Card details</div>
                  <button 
                        className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => handleSort('purchase_rate')}
                  >
                    Purchase rate p.a.
                        <ChevronDown size={16} className={`ml-1 transition-transform ${sortField === 'purchase_rate' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                        className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => handleSort('interest_free_days')}
                  >
                    Interest-free period
                        <ChevronDown size={16} className={`ml-1 transition-transform ${sortField === 'interest_free_days' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                        className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors font-medium" 
                    onClick={() => handleSort('rewards')}
                  >
                    Rewards
                        <ChevronDown size={16} className={`ml-1 transition-transform ${sortField === 'rewards' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                        className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors font-medium"
                    onClick={() => handleSort('annual_fee')}
                  >
                    Annual fee
                        <ChevronDown size={16} className={`ml-1 transition-transform ${sortField === 'annual_fee' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                      <button 
                        className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors font-medium"
                        onClick={() => handleSort('lounge_access')}
                      >
                        Lounge Access
                        <ChevronDown size={16} className={`ml-1 transition-transform ${sortField === 'lounge_access' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                      </button>
                    </motion.div>
                
                    {/* List View Card listings */}
                    <div className="space-y-4 mb-8">
                  {filteredCards.length > 0 ? (
                    filteredCards.map((card, index) => (
                      <motion.div 
                        key={card.id} 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                        onHoverStart={() => setHoveredCard(card.id)}
                        onHoverEnd={() => setHoveredCard(null)}
                        className={`bg-white rounded-2xl overflow-hidden relative border border-gray-100 transition-all duration-300 ${
                          hoveredCard === card.id ? 'shadow-2xl border-blue-200' : 'shadow-lg'
                        }`}
                      >
                        {card.recommended === 'Yes' && (
                          <div className="absolute -left-8 top-4 z-10">
                            <div className="bg-[#0072bc] text-white px-8 py-1 text-[7.5px] font-bold transform -rotate-45 shadow-md tracking-wider" style={{ width: '120px', paddingLeft: 'calc(2rem - 3px)' }}>
                              RECOMMENDED
                            </div>
                          </div>
                        )}
                        {card.promoted === 'Yes' && (
                          <div className="bg-yellow-100 text-yellow-800 px-4 py-1 text-xs font-medium">
                            PROMOTED
                          </div>
                        )}
                        <div className="grid grid-cols-7 p-4 md:p-4 md:grid-cols-7">
                          {/* Mobile Layout */}
                          <div className="col-span-7 md:col-span-2 flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-32 h-32 md:h-20 flex justify-center items-center">
                              {card.image_link ? (
                                <img 
                                  src={card.image_link} 
                                  alt={`${card.brand} ${card.card_name} Bangladesh credit card with ${card.rewards === 'Yes' ? 'cashback rewards' : 'benefits'} and ${card.annual_fee} annual fee`}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="text-gray-500 text-xs text-center">Card Image</div>
                              )}
                            </div>
                            <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                              <h3 className="text-lg font-bold tracking-tight text-[#1B1F3B]">{card.brand} {card.card_name}</h3>
                              <div className="text-base text-gray-600 mt-1 font-medium">
                                {card.card_type}
                              </div>
                              {card.bonus_points && (
                                <div className="text-base mt-1 text-gray-600 font-medium">
                                  {card.bonus_points} bonus points
                                </div>
                              )}
                              {/* Score Meter */}
                              <div className="mt-2">
                                {typeof card.konta_nibo_score === 'number' ? (
                                  <Speedometer value={card.konta_nibo_score} maxValue={10} size={60} label="Score" />
                                ) : (
                                  <div className="text-gray-400 text-xs">No score</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Mobile Stats Grid */}
                          <div className="col-span-7 md:hidden grid grid-cols-2 gap-4 mt-4 px-4">
                            <div className="flex flex-col items-center p-2 bg-white border border-gray-100 rounded">
                              <span className="text-sm text-gray-600">Purchase rate p.a.</span>
                              <span className="font-medium mt-1">{card.purchase_rate || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white border border-gray-100 rounded">
                              <span className="text-sm text-gray-600">Interest-free period</span>
                              <span className="font-medium mt-1">{card.interest_free_days ? `Up to ${card.interest_free_days} days` : 'N/A'}</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white border border-gray-100 rounded">
                              <span className="text-sm text-gray-600">Rewards</span>
                              <span className="font-medium mt-1">{card.rewards || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white border border-gray-100 rounded">
                              <span className="text-sm text-gray-600">Annual fee</span>
                              <span className="font-medium mt-1">{card.annual_fee || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col items-center p-2 bg-white border border-gray-100 rounded col-span-2">
                              <span className="text-sm text-gray-600">Lounge Access</span>
                              <span className="font-medium mt-1">{formatLoungeAccess(card.lounge_access, card.number_of_lounge_entitlements)}</span>
                            </div>
                          </div>

                          {/* Desktop Stats (hidden on mobile) */}
                          <div className="hidden md:flex items-center justify-center">
                            <span className="font-medium">{card.purchase_rate || 'N/A'}</span>
                          </div>
                          <div className="hidden md:flex items-center justify-center">
                            <span className="font-medium">{card.interest_free_days ? `Up to ${card.interest_free_days} days` : 'N/A'}</span>
                          </div>
                          <div className="hidden md:flex items-center justify-center">
                            <span className="font-medium">{card.rewards || 'N/A'}</span>
                          </div>
                          <div className="hidden md:flex items-center justify-center">
                            <span className="font-medium">{card.annual_fee || 'N/A'}</span>
                          </div>
                          <div className="hidden md:flex items-center justify-center">
                            <span className="font-medium">{formatLoungeAccess(card.lounge_access, card.number_of_lounge_entitlements)}</span>
                        </div>
                        </div>
                        <div className="border-t border-gray-100 px-6 py-4 bg-white flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
                          <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id={`compare-${card.id}`} 
                                className="mr-2"
                                checked={selectedForComparison.includes(card.id)}
                                onChange={() => handleCompareToggle(card.id)}
                                disabled={selectedForComparison.length >= 2 && !selectedForComparison.includes(card.id)}
                              />
                              <label htmlFor={`compare-${card.id}`} className="text-sm">Compare</label>
                            </div>
                            <button 
                              onClick={() => handleViewDetails(card)}
                              className="text-[#1B1F3B] hover:text-[#2d325f] flex items-center gap-1 text-sm"
                            >
                              <Info size={16} />
                              More Info
                            </button>
                          </div>
                          <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
                            {selectedForComparison.length === 2 && selectedForComparison.includes(card.id) && (
                              <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                onClick={handleCompare}
                                className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-all duration-200 shadow-md"
                              >
                                Compare Now
                              </motion.button>
                            )}
                            <a 
                              href={card.link_to_site || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-[#2d325f] hover:to-[#1B1F3B] transition-all duration-200 flex items-center w-full md:w-auto justify-center shadow-lg"
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-100"
                    >
                      <div className="text-gray-400 text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No cards found</h3>
                      <p className="text-gray-600">No credit cards match your current filters. Try adjusting your criteria.</p>
                    </motion.div>
                  )}
                    </div>
                  </>
                  )}
              </div>
            )}
          </div>
        </div>
        
        {/* SEO Footer */}
        <div className="bg-gray-50 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Credit Card Types</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Visa Credit Cards</li>
                  <li>Mastercards</li>
                  <li>American Express Cards</li>
                  <li>Student Credit Cards</li>
                  <li>Travel Credit Cards</li>
                  <li>Cashback Credit Cards</li>
                  <li>Business Credit Cards</li>
                  <li>Secured Credit Cards</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Premium Cards</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Amex Platinum</li>
                  <li>Amex Gold Card</li>
                  <li>Visa Signature</li>
                  <li>Mastercard World</li>
                  <li>Premium Travel Cards</li>
                  <li>Luxury Credit Cards</li>
                  <li>High Limit Cards</li>
                  <li>Concierge Service Cards</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Top Banks Bangladesh</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>BRAC Bank Credit Cards</li>
                  <li>City Bank Credit Cards</li>
                  <li>Dutch Bangla Bank Cards</li>
                  <li>Eastern Bank Cards</li>
                  <li>Prime Bank Credit Cards</li>
                  <li>Standard Bank Cards</li>
                  <li>AB Bank Credit Cards</li>
                  <li>Bank Asia Credit Cards</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">Card Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Lowest Annual Fees</li>
                  <li>Cashback Rewards</li>
                  <li>Travel Benefits</li>
                  <li>Lounge Access</li>
                  <li>Interest Free Days</li>
                  <li>Online Application</li>
                  <li>Instant Approval</li>
                  <li>Credit Building</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Popular Credit Card Searches Bangladesh</h4>
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Credit Card</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">Visa Cards</span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Mastercards</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Amex Credit Card</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">Student Credit Cards</span>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">Travel Credit Card</span>
                  <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full">BD Credit Card</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">Amex Platinum</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CompareModal
        cards={selectedCards}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
      {selectedCardForDetails && (
        <CardDetailsModal
          card={selectedCardForDetails}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedCardForDetails(null);
          }}
        />
      )}
    </motion.div>
    </>
  );
};

export default CardsPage;