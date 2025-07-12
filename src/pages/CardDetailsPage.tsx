import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronLeft, Star } from 'lucide-react';

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
  card_benefits: CardBenefits | any;
  rates_and_fees: RatesAndFees;
  pros: Record<string, string>;
  cons: Record<string, string>;
  description: Record<string, string>;
  reviews: Reviews;
  link_to_site: string;
  image_link: string;
  lounge_access?: string;
  number_of_lounge_entitlements?: number;
  rewards?: string;
  konta_nibo_score?: number;
}

const CardDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<CreditCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCardDetails();
  }, [id]);

  const fetchCardDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setCard(data);
      }
    } catch (error) {
      console.error('Error fetching card details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {content}
    </div>
  );

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



  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1F3B]"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-gray-600">Card not found</div>
      </div>
    );
  }

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
          <div className="flex items-center gap-2 mb-4">
            <a href="/credit-cards" className="flex items-center text-white/80 hover:text-white font-medium">
              <ChevronLeft size={20} />
              <span>Back to all cards</span>
            </a>
          </div>
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">{card.brand} {card.card_name}</h1>
          <div className="flex items-center gap-4">
            <span className="text-xl font-medium">{card.card_type}</span>
            {card.recommended === 'Yes' && (
              <span className="inline-flex items-center text-yellow-300 font-bold">
                <Star size={20} className="mr-1 fill-yellow-300" />
                Recommended
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Card Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {hasValue(card.purchase_rate) && (
                <div>
                  <div className="text-sm font-medium text-gray-600">Purchase rate p.a.</div>
                    <div className="text-xl font-extrabold">{card.purchase_rate}</div>
                </div>
                )}
                {hasValue(card.annual_fee) && (
                <div>
                  <div className="text-sm font-medium text-gray-600">Annual fee</div>
                    <div className="text-xl font-extrabold">{card.annual_fee}</div>
                </div>
                )}
                {hasValue(card.interest_free_days) && (
                <div>
                  <div className="text-sm font-medium text-gray-600">Interest-free days</div>
                    <div className="text-xl font-extrabold">{card.interest_free_days}</div>
                  </div>
                )}
                {hasValue(card.min_credit_limit) && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Min credit limit</div>
                    <div className="text-xl font-extrabold">{card.min_credit_limit}</div>
                  </div>
                )}
                {hasValue(card.max_credit_limit) && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Max credit limit</div>
                    <div className="text-xl font-extrabold">{card.max_credit_limit}</div>
                  </div>
                )}
                {card.lounge_access && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Lounge access</div>
                    <div className="text-xl font-extrabold">{formatLoungeAccess(card.lounge_access, card.number_of_lounge_entitlements)}</div>
                  </div>
                )}
                {hasValue(card.rewards) && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Rewards program</div>
                    <div className="text-xl font-extrabold">{card.rewards}</div>
                  </div>
                )}
                {hasValue(card.balance_transfer_limit) && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Balance transfer limit</div>
                    <div className="text-xl font-extrabold">{card.balance_transfer_limit}</div>
                </div>
                )}
                {hasValue(card.reward_points_per_dollar) && (
                <div>
                    <div className="text-sm font-medium text-gray-600">Points per dollar</div>
                    <div className="text-xl font-extrabold">{card.reward_points_per_dollar}</div>
                </div>
                )}
              </div>
            </div>

            {/* Description */}
            {Object.keys(card.description).length > 0 && renderSection(
              "About this card",
              <div className="bg-white rounded-lg shadow-sm p-6">
                {Object.entries(card.description).map(([key, value]) => (
                  <p key={key} className="text-gray-600 mb-4 last:mb-0 font-medium">{value}</p>
                ))}
              </div>
            )}

            {/* Pros & Cons */}
            {(Object.keys(card.pros).length > 0 || Object.keys(card.cons).length > 0) && renderSection(
              "Pros and cons",
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(card.pros).length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-600">Pros</h3>
                    <ul className="space-y-2">
                      {Object.entries(card.pros).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {Object.keys(card.cons).length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-600">Cons</h3>
                    <ul className="space-y-2">
                      {Object.entries(card.cons).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">✗</span>
                          <span>{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Rates and Fees */}
            {Object.keys(card.rates_and_fees).length > 0 && renderSection(
              "Rates and fees",
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="divide-y">
                  {Object.entries(card.rates_and_fees).map(([key, value]) => (
                    <div key={key} className="py-4 first:pt-0 last:pb-0 grid grid-cols-2">
                      <div className="text-gray-600">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                      <div className="font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Card Benefits */}
            {hasValue(card.card_benefits) && renderSection(
              "Card Benefits & Features",
              <div className="bg-white rounded-lg shadow-sm p-6">
                {typeof card.card_benefits === 'object' && Object.entries(card.card_benefits).map(([key, value]) => {
                  if (Array.isArray(value) && value.length > 0) {
                    return (
                      <div key={key} className="mb-6 last:mb-0">
                        <h4 className="font-semibold text-gray-800 mb-3 capitalize text-lg">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <ul className="space-y-2">
                          {value.map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="text-blue-500 mt-1.5 text-sm">•</span>
                              <span className="text-gray-600 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  } else if (typeof value === 'string' && value.trim()) {
                    return (
                      <div key={key} className="mb-6 last:mb-0">
                        <h4 className="font-semibold text-gray-800 mb-2 capitalize text-lg">
                          {key.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">{value}</p>
                      </div>
                    );
                  } else if (typeof value === 'boolean' && value) {
                    return (
                      <div key={key} className="flex items-center gap-3 mb-3">
                        <span className="text-green-500 text-lg">✓</span>
                        <span className="capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* Additional Financial Details */}
            {(hasValue(card.foreign_currency_conversion_fee) || hasValue(card.late_payment_fee) || hasValue(card.minimum_monthly_repayment) || hasValue(card.additional_card_holder_fee)) && renderSection(
              "Additional Fees & Terms",
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="divide-y">
                  {hasValue(card.foreign_currency_conversion_fee) && (
                    <div className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-gray-600 font-medium">Foreign currency conversion fee</div>
                      <div className="font-semibold">{card.foreign_currency_conversion_fee}</div>
                    </div>
                  )}
                  {hasValue(card.late_payment_fee) && (
                    <div className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-gray-600 font-medium">Late payment fee</div>
                      <div className="font-semibold">{card.late_payment_fee}</div>
                    </div>
                  )}
                  {hasValue(card.minimum_monthly_repayment) && (
                    <div className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-gray-600 font-medium">Minimum monthly repayment</div>
                      <div className="font-semibold">{card.minimum_monthly_repayment}</div>
                    </div>
                  )}
                  {hasValue(card.additional_card_holder_fee) && (
                    <div className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="text-gray-600 font-medium">Additional cardholder fee</div>
                      <div className="font-semibold">{card.additional_card_holder_fee}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Eligibility */}
            {hasValue(card.eligibility) && renderSection(
              "Eligibility Requirements",
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="divide-y">
                  {Object.entries(card.eligibility).map(([key, value]) => {
                    if (hasValue(value)) {
                      return (
                        <div key={key} className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="text-gray-600 font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                          <div className="font-semibold">{value}</div>
                    </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              {/* Card Image */}
              <div className="mb-6">
                <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden mb-4">
                  {card.image_link ? (
                    <img 
                      src={card.image_link} 
                      alt={`${card.brand} ${card.card_name}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm text-center">No card image available</div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mb-6">
                {hasValue(card.bonus_points) && (
                  <div>
                  <div className="text-sm text-gray-600">Bonus points offer</div>
                  <div className="text-xl font-semibold">{card.bonus_points}</div>
                </div>
              )}
                {hasValue(card.frequent_flyer) && (
                  <div>
                    <div className="text-sm text-gray-600">Frequent flyer program</div>
                    <div className="text-lg font-semibold">{card.frequent_flyer}</div>
                  </div>
                )}
                {card.konta_nibo_score && (
                  <div>
                    <div className="text-sm text-gray-600">Konta Nibo Score</div>
                    <div className="text-2xl font-bold text-blue-600">{card.konta_nibo_score}/10</div>
                  </div>
                )}
              </div>
              
              <a 
                href={card.link_to_site || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#1B1F3B] text-white px-6 py-3 rounded font-medium hover:bg-[#2d325f] transition flex items-center justify-center mb-6"
              >
                GO TO BANK
              </a>

              {/* Quick Benefits Overview */}
              {hasValue(card.card_benefits) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Benefits</h3>
                  <div className="space-y-2">
                    {typeof card.card_benefits === 'object' && Object.entries(card.card_benefits).map(([key, value]) => {
                      if (typeof value === 'boolean' && value) {
                        return (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span className="capitalize text-sm">{key.replace(/_/g, ' ')}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardDetailsPage; 