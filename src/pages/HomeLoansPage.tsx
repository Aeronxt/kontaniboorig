import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronDown, Filter, X, Home, ArrowRight, ArrowUpRight, Check, Calculator, Star, TrendingUp, Shield, Award, Clock, DollarSign, Calendar, Grid, Info, Eye } from 'lucide-react';
import Speedometer from '../components/Speedometer';
import { Link } from 'react-router-dom';
import AnimatedHouseBg from '../components/AnimatedHouseBg';
import SEO from '../components/SEO';

interface HomeLoan {
  id: string;
  brand: string;
  name: string;
  interest_rate_type: string;
  interest_rate_pa: number;
  comparison_rate_pa: number;
  fees: string;
  recommended: boolean;
  promoted: boolean;
  minimum_deposit: number;
  extras: string;
  offers: string;
  tagline: string;
  min_loan_amount: number;
  max_loan_amount: number;
  max_loan_term: number;
  max_lvr: number;
  loan_redraw_facility: boolean;
  processing_fee: number;
  offset_account: boolean;
  eligibility: string;
  split_loan_facility: boolean;
  fixed_interest_option: boolean;
  extra_repayments: boolean;
  features: string;
  early_partial_settlement_fee: number;
  application_fee: number;
  lenders_legal_fee: number;
  valuation_fee: number;
  ongoing_fees: number;
  settlement_fee: number;
  discharge_fee: number;
  pros: string;
  cons: string;
  who_can_apply: string;
  score: number;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  };
  logo_image_link: string;
  visit_site_link: string;
}

type SortField = 'interest_rate_pa' | 'comparison_rate_pa' | 'max_loan_term' | 'minimum_deposit' | 'monthly_repayment';

interface CompareModalProps {
  loans: HomeLoan[];
  isOpen: boolean;
  onClose: () => void;
}

const CompareModal: React.FC<CompareModalProps> = ({ loans, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value == null || value === 0) return 'Not Provided by Bank';
    return `${value.toFixed(2)}%`;
  };

  // Calculate winner for each metric
  const getWinner = (field: keyof HomeLoan, isLowerBetter: boolean = true) => {
    const validValues = loans.filter(loan => loan[field] != null && loan[field] !== 0);
    if (validValues.length === 0) return null;
    
    const sortedLoans = validValues.sort((a, b) => {
      const aValue = a[field] as number;
      const bValue = b[field] as number;
      return isLowerBetter ? aValue - bValue : bValue - aValue;
    });
    
    return sortedLoans[0].id;
  };

  const getBestRateWinner = () => getWinner('interest_rate_pa', true);
  const getBestComparisonRateWinner = () => getWinner('comparison_rate_pa', true);
  const getLowestAppFeeWinner = () => getWinner('application_fee', true);
  const getLowestOngoingFeeWinner = () => getWinner('ongoing_fees', true);
  const getHighestLVRWinner = () => getWinner('max_lvr', false);
  const getLongestTermWinner = () => getWinner('max_loan_term', false);
  const getHighestScoreWinner = () => getWinner('score', false);

  const renderWinnerBadge = (loanId: string, winnerId: string | null, label: string) => {
    if (winnerId === loanId) {
      return (
        <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
          <Award size={12} />
          Best {label}
        </div>
      );
    }
    return null;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const calculateTotalCost = (loan: HomeLoan, loanAmount: number, years: number) => {
    const effectiveRate = loan.interest_rate_pa == null || loan.interest_rate_pa === 0 ? 12 : loan.interest_rate_pa;
    const monthlyRate = effectiveRate / 100 / 12;
    const totalPayments = years * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const totalInterest = (monthlyPayment * totalPayments) - loanAmount;
    const totalFees = (loan.application_fee || 0) + (loan.ongoing_fees || 0) * years + (loan.settlement_fee || 0);
    return totalInterest + totalFees;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-2xl w-full md:w-11/12 max-w-7xl max-h-[95vh] md:max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white p-3 md:p-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg md:text-3xl font-bold mb-1 md:mb-2">Loan Comparison</h2>
            <p className="text-blue-100 text-xs md:text-base">Side-by-side comparison</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-blue-200 p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation">
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>
        
        <div className="p-3 md:p-6 overflow-y-auto max-h-[calc(95vh-100px)] md:max-h-[calc(95vh-120px)]">
          {/* Mobile: Quick Summary Cards - Horizontal scroll */}
          <div className="md:hidden">
            <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200 min-w-[200px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="text-green-600" size={16} />
                  <h3 className="font-semibold text-green-900 text-sm">Best Rate</h3>
                </div>
                {(() => {
                  const winner = loans.find(loan => loan.id === getBestRateWinner());
                  return winner ? (
                    <div>
                      <div className="text-base font-bold text-green-900">{formatPercentage(winner.interest_rate_pa)}</div>
                      <div className="text-xs text-green-700">{winner.brand}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-green-700">No rates available</div>
                  );
                })()}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200 min-w-[200px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-blue-600" size={16} />
                  <h3 className="font-semibold text-blue-900 text-sm">Lowest Cost</h3>
                </div>
                {(() => {
                  const loanAmount = 500000;
                  const years = 25;
                  const costsWithIds = loans.map(loan => ({
                    id: loan.id,
                    brand: loan.brand,
                    cost: calculateTotalCost(loan, loanAmount, years)
                  })).sort((a, b) => a.cost - b.cost);
                  
                  const lowest = costsWithIds[0];
                  return (
                    <div>
                      <div className="text-base font-bold text-blue-900">{formatCurrency(lowest.cost)}</div>
                      <div className="text-xs text-blue-700">{lowest.brand}</div>
                    </div>
                  );
                })()}
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200 min-w-[200px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-purple-600" size={16} />
                  <h3 className="font-semibold text-purple-900 text-sm">Best Score</h3>
                </div>
                {(() => {
                  const winner = loans.find(loan => loan.id === getHighestScoreWinner());
                  return winner && winner.score ? (
                    <div>
                      <div className="text-base font-bold text-purple-900">{winner.score}/10</div>
                      <div className="text-xs text-purple-700">{winner.brand}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-purple-700">No scores</div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Desktop: Quick Summary Cards - Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-600" size={20} />
                <h3 className="font-semibold text-green-900">Best Interest Rate</h3>
              </div>
              {(() => {
                const winner = loans.find(loan => loan.id === getBestRateWinner());
                return winner ? (
                  <div>
                    <div className="text-lg font-bold text-green-900">{formatPercentage(winner.interest_rate_pa)}</div>
                    <div className="text-sm text-green-700">{winner.brand} {winner.name}</div>
                  </div>
                ) : (
                  <div className="text-sm text-green-700">No rates available</div>
                );
              })()}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-blue-600" size={20} />
                <h3 className="font-semibold text-blue-900">Lowest Total Cost</h3>
              </div>
              {(() => {
                const loanAmount = 500000;
                const years = 25;
                const costsWithIds = loans.map(loan => ({
                  id: loan.id,
                  brand: loan.brand,
                  name: loan.name,
                  cost: calculateTotalCost(loan, loanAmount, years)
                })).sort((a, b) => a.cost - b.cost);
                
                const lowest = costsWithIds[0];
                return (
                  <div>
                    <div className="text-lg font-bold text-blue-900">{formatCurrency(lowest.cost)}</div>
                    <div className="text-sm text-blue-700">{lowest.brand} {lowest.name}</div>
                    <div className="text-xs text-blue-600 mt-1">Over {years} years</div>
                  </div>
                );
              })()}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-purple-600" size={20} />
                <h3 className="font-semibold text-purple-900">Highest Score</h3>
              </div>
              {(() => {
                const winner = loans.find(loan => loan.id === getHighestScoreWinner());
                return winner && winner.score ? (
                  <div>
                    <div className="text-lg font-bold text-purple-900">{winner.score}/10</div>
                    <div className="text-sm text-purple-700">{winner.brand} {winner.name}</div>
                  </div>
                ) : (
                  <div className="text-sm text-purple-700">No scores available</div>
                );
              })()}
            </div>
          </div>

          {/* Mobile: Stacked Loan Cards */}
          <div className="md:hidden space-y-4">
              {loans.map((loan, index) => (
              <div key={loan.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                {/* Loan Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                    <div className="w-12 h-8 flex items-center justify-center flex-shrink-0">
                        {loan.logo_image_link ? (
                          <img 
                            src={loan.logo_image_link} 
                            alt={`${loan.brand} ${loan.name}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                          <Home size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                      <h3 className="font-bold text-sm text-[#1B1F3B]">{loan.brand}</h3>
                        <p className="text-xs text-gray-600">{loan.name}</p>
                      </div>
                    </div>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Loan {index + 1}</span>
                  </div>
                  
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-600 mb-1">Interest Rate</div>
                    <div className="font-bold text-sm text-[#1B1F3B]">{formatPercentage(loan.interest_rate_pa)}</div>
                    {renderWinnerBadge(loan.id, getBestRateWinner(), 'Rate')}
                      </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-600 mb-1">Comparison Rate</div>
                    <div className="font-bold text-sm text-[#1B1F3B]">{formatPercentage(loan.comparison_rate_pa)}</div>
                    {renderWinnerBadge(loan.id, getBestComparisonRateWinner(), 'Comp')}
                  </div>
                  </div>
                  
                {/* Score and Fees */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-600 mb-1">Score</div>
                    {loan.score ? (
                      <div className={`font-bold text-sm px-2 py-1 rounded ${getScoreColor(loan.score)}`}>
                        {loan.score}/10
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">No score</div>
                    )}
                    {renderWinnerBadge(loan.id, getHighestScoreWinner(), 'Score')}
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-600 mb-1">App Fee</div>
                    <div className="font-bold text-sm text-[#1B1F3B]">{formatCurrency(loan.application_fee || 0)}</div>
                    {renderWinnerBadge(loan.id, getLowestAppFeeWinner(), 'Fee')}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="bg-white rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max LVR:</span>
                      <span className="font-semibold">{loan.max_lvr}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ongoing Fee:</span>
                      <span className="font-semibold">{formatCurrency(loan.ongoing_fees || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Features</div>
                  <div className="flex flex-wrap gap-1">
                    {loan.offset_account && (
                      <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">✓ Offset</div>
                    )}
                    {loan.loan_redraw_facility && (
                      <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">✓ Redraw</div>
                    )}
                    {loan.extra_repayments && (
                      <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">✓ Extra Payments</div>
                    )}
                    {loan.split_loan_facility && (
                      <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">✓ Split Loan</div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                    <a 
                      href={loan.visit_site_link || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group touch-manipulation"
                    >
                  Get Home Loan
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                </div>
              ))}
            </div>

          {/* Desktop: Detailed Comparison Table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-900 min-w-[200px]">Comparison Metrics</th>
            {loans.map(loan => (
                      <th key={loan.id} className="text-center p-4 font-semibold text-gray-900 min-w-[250px]">
                        <div className="flex flex-col items-center gap-2">
                    {loan.logo_image_link ? (
                      <img 
                        src={loan.logo_image_link} 
                        alt={`${loan.brand} ${loan.name}`}
                              className="w-16 h-10 object-contain"
                      />
                    ) : (
                            <div className="w-16 h-10 bg-gray-100 flex items-center justify-center rounded">
                              <Home size={20} className="text-gray-400" />
                      </div>
                    )}
                          <div>
                            <div className="font-bold text-sm">{loan.brand}</div>
                            <div className="text-xs text-gray-600">{loan.name}</div>
                  </div>
                </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Interest Rate Row */}
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-500" />
                        Interest Rate (p.a.)
                      </div>
                    </td>
                    {loans.map(loan => (
                      <td key={loan.id} className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-gray-900">{formatPercentage(loan.interest_rate_pa)}</div>
                          {renderWinnerBadge(loan.id, getBestRateWinner(), 'Rate')}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Comparison Rate Row */}
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Calculator size={16} className="text-green-500" />
                        Comparison Rate (p.a.)
                  </div>
                    </td>
                    {loans.map(loan => (
                      <td key={loan.id} className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-gray-900">{formatPercentage(loan.comparison_rate_pa)}</div>
                          {renderWinnerBadge(loan.id, getBestComparisonRateWinner(), 'Comparison Rate')}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Score Row */}
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" />
                        Overall Score
                      </div>
                    </td>
                    {loans.map(loan => (
                      <td key={loan.id} className="p-4 text-center">
                        <div className="space-y-2">
                          {loan.score ? (
                            <>
                              <div className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(loan.score)}`}>
                                {loan.score}/10
                              </div>
                              {renderWinnerBadge(loan.id, getHighestScoreWinner(), 'Score')}
                            </>
                          ) : (
                            <div className="text-gray-500">No score</div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Fees Row */}
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-red-500" />
                        Application Fee
                      </div>
                    </td>
                    {loans.map(loan => (
                      <td key={loan.id} className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(loan.application_fee || 0)}</div>
                          {renderWinnerBadge(loan.id, getLowestAppFeeWinner(), 'App Fee')}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Ongoing Fees Row */}
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        Ongoing Fees (Annual)
                      </div>
                    </td>
                    {loans.map(loan => (
                      <td key={loan.id} className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(loan.ongoing_fees || 0)}</div>
                          {renderWinnerBadge(loan.id, getLowestOngoingFeeWinner(), 'Ongoing Fee')}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* LVR Row */}
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-purple-500" />
                        Maximum LVR
                      </div>
                    </td>
                    {loans.map(loan => (
                      <td key={loan.id} className="p-4 text-center">
                        <div className="space-y-2">
                          <div className="text-lg font-bold text-gray-900">{loan.max_lvr}%</div>
                          {renderWinnerBadge(loan.id, getHighestLVRWinner(), 'LVR')}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Features Row */}
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Check size={16} className="text-green-500" />
                        Key Features
                      </div>
                    </td>
                    {loans.map(loan => (
                      <td key={loan.id} className="p-4">
                        <div className="space-y-1">
                          {loan.offset_account && (
                            <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">✓ Offset Account</div>
                          )}
                          {loan.loan_redraw_facility && (
                            <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">✓ Redraw Facility</div>
                          )}
                          {loan.extra_repayments && (
                            <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">✓ Extra Repayments</div>
                          )}
                          {loan.split_loan_facility && (
                            <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">✓ Split Loan</div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Desktop: Action Buttons */}
          <div className="hidden md:flex md:flex-col md:flex-row gap-3 mt-6">
            {loans.map(loan => (
              <a 
                key={loan.id}
                    href={loan.visit_site_link || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                Get Home Loan
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoDrawerProps {
  loan: HomeLoan | null;
  isOpen: boolean;
  onClose: () => void;
}

const InfoDrawer: React.FC<InfoDrawerProps> = ({ loan, isOpen, onClose }) => {
  if (!loan) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'BDT',
      currencyDisplay: 'narrowSymbol'
    }).format(value).replace('BDT', '৳');
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value == null || value === 0) return 'Not Provided by Bank';
    return `${value.toFixed(2)}%`;
  };

  const sections = [
    {
      title: 'Key Features',
      icon: <Star className="text-yellow-500" size={20} />,
      color: 'from-yellow-50 to-orange-50 border-yellow-200',
      items: [
        { label: 'Interest Rate Type', value: loan.interest_rate_type, icon: <TrendingUp size={16} className="text-blue-500" /> },
        { label: 'Interest Rate (p.a.)', value: formatPercentage(loan.interest_rate_pa), icon: <DollarSign size={16} className="text-green-500" /> },
        { label: 'Comparison Rate (p.a.)', value: formatPercentage(loan.comparison_rate_pa), icon: <Calculator size={16} className="text-purple-500" /> },
        { label: 'Minimum Deposit', value: formatCurrency(loan.minimum_deposit), icon: <Shield size={16} className="text-indigo-500" /> },
        { label: 'Maximum LVR', value: `${loan.max_lvr}%`, icon: <Award size={16} className="text-red-500" /> },
        { label: 'Loan Amount Range', value: `${formatCurrency(loan.min_loan_amount)} - ${formatCurrency(loan.max_loan_amount)}`, icon: <Grid size={16} className="text-cyan-500" /> },
        { label: 'Maximum Loan Term', value: `${loan.max_loan_term} years`, icon: <Calendar size={16} className="text-orange-500" /> },
      ]
    },
    {
      title: 'Loan Features',
      icon: <Shield className="text-green-500" size={20} />,
      color: 'from-green-50 to-emerald-50 border-green-200',
      items: [
        { label: 'Offset Account', value: loan.offset_account ? 'Available' : 'Not Available', icon: <Check size={16} className={loan.offset_account ? "text-green-500" : "text-red-500"} /> },
        { label: 'Redraw Facility', value: loan.loan_redraw_facility ? 'Available' : 'Not Available', icon: <Check size={16} className={loan.loan_redraw_facility ? "text-green-500" : "text-red-500"} /> },
        { label: 'Extra Repayments', value: loan.extra_repayments ? 'Allowed' : 'Not Allowed', icon: <Check size={16} className={loan.extra_repayments ? "text-green-500" : "text-red-500"} /> },
        { label: 'Split Loan Facility', value: loan.split_loan_facility ? 'Available' : 'Not Available', icon: <Check size={16} className={loan.split_loan_facility ? "text-green-500" : "text-red-500"} /> },
        { label: 'Fixed Interest Option', value: loan.fixed_interest_option ? 'Available' : 'Not Available', icon: <Check size={16} className={loan.fixed_interest_option ? "text-green-500" : "text-red-500"} /> },
      ]
    },
    {
      title: 'Fees Structure',
      icon: <DollarSign className="text-blue-500" size={20} />,
      color: 'from-blue-50 to-cyan-50 border-blue-200',
      items: [
        { label: 'Application Fee', value: formatCurrency(loan.application_fee), icon: <DollarSign size={16} className="text-blue-500" /> },
        { label: 'Processing Fee', value: formatCurrency(loan.processing_fee), icon: <Clock size={16} className="text-purple-500" /> },
        { label: 'Ongoing Fees', value: formatCurrency(loan.ongoing_fees), icon: <Calendar size={16} className="text-orange-500" /> },
        { label: 'Settlement Fee', value: formatCurrency(loan.settlement_fee), icon: <Home size={16} className="text-green-500" /> },
        { label: 'Discharge Fee', value: formatCurrency(loan.discharge_fee), icon: <X size={16} className="text-red-500" /> },
        { label: 'Early Settlement Fee', value: formatCurrency(loan.early_partial_settlement_fee), icon: <ArrowRight size={16} className="text-yellow-500" /> },
        { label: 'Lender\'s Legal Fee', value: formatCurrency(loan.lenders_legal_fee), icon: <Shield size={16} className="text-indigo-500" /> },
        { label: 'Valuation Fee', value: formatCurrency(loan.valuation_fee), icon: <Eye size={16} className="text-cyan-500" /> },
      ]
    },
    {
      title: 'Additional Information',
      icon: <Info className="text-purple-500" size={20} />,
      color: 'from-purple-50 to-pink-50 border-purple-200',
      items: [
        { label: 'Eligibility', value: loan.eligibility, icon: <Check size={16} className="text-green-500" /> },
        { label: 'Who Can Apply', value: loan.who_can_apply, icon: <Grid size={16} className="text-blue-500" /> },
        { label: 'Pros', value: loan.pros, icon: <TrendingUp size={16} className="text-green-500" /> },
        { label: 'Cons', value: loan.cons, icon: <ArrowRight size={16} className="text-red-500" /> },
        { label: 'Features', value: loan.features, icon: <Star size={16} className="text-yellow-500" /> },
        { label: 'Extras', value: loan.extras, icon: <Award size={16} className="text-purple-500" /> },
        { label: 'Offers', value: loan.offers, icon: <DollarSign size={16} className="text-green-500" /> },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full md:max-w-3xl bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white z-10">
              <div className="flex justify-between items-center p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    {loan.logo_image_link ? (
                      <img 
                        src={loan.logo_image_link} 
                        alt={`${loan.brand} ${loan.name}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Home size={24} className="md:w-8 md:h-8 text-gray-400 w-full h-full" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold">{loan.brand}</h2>
                    <p className="text-blue-200 text-sm md:text-base">{loan.name}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/10 touch-manipulation"
                >
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
              </div>
              
              {/* Quick Stats */}
              <div className="px-4 md:px-6 pb-4 md:pb-6">
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="bg-white/10 rounded-lg p-2 md:p-3 text-center">
                    <div className="text-xs md:text-sm text-blue-200">Interest Rate</div>
                    <div className="text-base md:text-xl font-bold">{formatPercentage(loan.interest_rate_pa)}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 md:p-3 text-center">
                    <div className="text-xs md:text-sm text-blue-200">Comparison Rate</div>
                    <div className="text-base md:text-xl font-bold">{formatPercentage(loan.comparison_rate_pa)}</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 md:p-3 text-center">
                    <div className="text-xs md:text-sm text-blue-200">Max LVR</div>
                    <div className="text-base md:text-xl font-bold">{loan.max_lvr}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {sections.map((section, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-gradient-to-r ${section.color} rounded-xl p-4 md:p-6 border`}
                >
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    {section.icon}
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {section.items.map((item, itemIdx) => (
                      item.value && item.value !== 'N/A' && item.value !== '' && (
                        <motion.div 
                          key={itemIdx} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (idx * 0.1) + (itemIdx * 0.05) }}
                          className="bg-white/70 rounded-lg p-3 md:p-4 border border-white/50"
                        >
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            {item.icon}
                            <span className="text-xs md:text-sm font-medium text-gray-600">{item.label}</span>
                          </div>
                          <div className="text-sm md:text-base font-semibold text-gray-900 leading-relaxed">
                            {item.value}
                          </div>
                        </motion.div>
                      )
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Action Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="sticky bottom-0 bg-white pt-4 md:pt-6 border-t"
              >
                <a 
                  href={loan.visit_site_link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-4 md:px-6 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 group touch-manipulation"
                >
                  Get Home Loan
                  <ArrowUpRight size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface CalculatorInputs {
  housePrice: number;
  loanTerm: number;
  downPaymentPercent: number;
}

const HomeLoansPage: React.FC = () => {
  const [homeLoans, setHomeLoans] = useState<HomeLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('interest_rate_pa');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    rateType: [] as string[],
    features: [] as string[],
    maxLVR: [] as string[],
    banks: [] as string[],
    loanAmountRange: [] as string[],
    loanTermRange: [] as string[],
    interestRateRange: [] as string[],
    feePreference: [] as string[],
    recommended: false,
    promoted: false,
  });
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<HomeLoan | null>(null);
  const [calculatorInputs, setCalculatorInputs] = useState<CalculatorInputs>({
    housePrice: 500000,
    loanTerm: 30,
    downPaymentPercent: 20,
  });

  useEffect(() => {
    fetchHomeLoans();
  }, []);

  const fetchHomeLoans = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homeloans')
        .select('*')
        .order('interest_rate_pa', { ascending: true });

      if (error) throw error;
      if (data) {
        setHomeLoans(data);
      }
    } catch (error) {
      console.error('Error fetching home loans:', error);
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

  const formatPercentage = (value: number | null | undefined) => {
    if (value == null || value === 0) return 'Not Provided by Bank';
    return `${value.toFixed(2)}%`;
  };

  const calculateMonthlyRepayment = (loanAmount: number, annualInterestRate: number, years: number): number => {
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = years * 12;
    
    const monthlyPayment = 
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return Math.round(monthlyPayment * 100) / 100;
  };

  const handleCalculatorInputChange = (field: keyof CalculatorInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (field === 'loanTerm' && numValue > 35) return; // Max 35 years
    setCalculatorInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const sortedLoans = [...homeLoans].sort((a, b) => {
    if (sortField === 'monthly_repayment') {
      const repaymentA = calculateMonthlyRepayment(
        calculatorInputs.housePrice,
        a.interest_rate_pa,
        calculatorInputs.loanTerm
      );
      const repaymentB = calculateMonthlyRepayment(
        calculatorInputs.housePrice,
        b.interest_rate_pa,
        calculatorInputs.loanTerm
      );
      return sortDirection === 'asc' ? repaymentA - repaymentB : repaymentB - repaymentA;
    }

    const valA = a[sortField];
    const valB = b[sortField];

    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  const filteredLoans = sortedLoans.filter(loan => {
    // Rate Type Filter
    if (filters.rateType.length > 0) {
      const matchesRateType = filters.rateType.some(type => {
        if (type === 'Variable') return loan.interest_rate_type === 'Variable';
        if (type === 'Fixed') return loan.interest_rate_type === 'Fixed';
        if (type === 'Split') return loan.split_loan_facility;
        if (type === 'Islamic') return loan.interest_rate_type === 'Islamic/Shariah-Compliant';
      return false;
      });
      if (!matchesRateType) return false;
    }

    // Bank Filter
    if (filters.banks.length > 0) {
      if (!filters.banks.includes(loan.brand)) return false;
    }
    
    // Features Filter
    if (filters.features.length > 0) {
      const hasFeatures = filters.features.every(feature => {
        if (feature === 'offset') return loan.offset_account;
        if (feature === 'redraw') return loan.loan_redraw_facility;
        if (feature === 'extra') return loan.extra_repayments;
        if (feature === 'split') return loan.split_loan_facility;
        if (feature === 'fixed') return loan.fixed_interest_option;
        return false;
      });
      if (!hasFeatures) return false;
    }

    // LVR Filter
    if (filters.maxLVR.length > 0) {
      const matchesLVR = filters.maxLVR.some(range => {
        const lvr = loan.max_lvr;
        if (!lvr) return false;
        if (range === '60-70') return lvr >= 60 && lvr <= 70;
        if (range === '70-80') return lvr >= 70 && lvr <= 80;
        if (range === '80-90') return lvr >= 80 && lvr <= 90;
        if (range === '90-95') return lvr >= 90 && lvr <= 95;
        return false;
      });
      if (!matchesLVR) return false;
    }

    // Loan Amount Range Filter
    if (filters.loanAmountRange.length > 0) {
      const matchesAmount = filters.loanAmountRange.some(range => {
        const maxAmount = loan.max_loan_amount;
        if (!maxAmount) return false;
        if (range === '0-500k') return maxAmount >= 500000;
        if (range === '500k-1m') return maxAmount >= 1000000;
        if (range === '1m-2m') return maxAmount >= 2000000;
        if (range === '2m+') return maxAmount >= 2000000;
        return false;
      });
      if (!matchesAmount) return false;
    }

    // Loan Term Range Filter
    if (filters.loanTermRange.length > 0) {
      const matchesTerm = filters.loanTermRange.some(range => {
        const maxTerm = loan.max_loan_term;
        if (!maxTerm) return false;
        if (range === '0-15') return maxTerm >= 15;
        if (range === '15-25') return maxTerm >= 25;
        if (range === '25-30') return maxTerm >= 30;
        if (range === '30+') return maxTerm > 30;
        return false;
      });
      if (!matchesTerm) return false;
    }

    // Interest Rate Range Filter
    if (filters.interestRateRange.length > 0) {
      const matchesRate = filters.interestRateRange.some(range => {
        const rate = loan.interest_rate_pa;
        if (!rate || rate === 0) return false;
        if (range === '0-8') return rate <= 8;
        if (range === '8-12') return rate > 8 && rate <= 12;
        if (range === '12-16') return rate > 12 && rate <= 16;
        if (range === '16+') return rate > 16;
        return false;
      });
      if (!matchesRate) return false;
    }

    // Fee Preference Filter
    if (filters.feePreference.length > 0) {
      const matchesFees = filters.feePreference.some(pref => {
        if (pref === 'no-application-fee') return !loan.application_fee || loan.application_fee === 0;
        if (pref === 'no-ongoing-fees') return !loan.ongoing_fees || loan.ongoing_fees === 0;
        if (pref === 'low-total-fees') {
          const totalFees = (loan.application_fee || 0) + (loan.ongoing_fees || 0) + (loan.settlement_fee || 0);
          return totalFees <= 1000;
        }
        return false;
      });
      if (!matchesFees) return false;
    }

    // Recommended Filter
    if (filters.recommended && !loan.recommended) return false;

    // Promoted Filter
    if (filters.promoted && !loan.promoted) return false;
    
    return true;
  });

  const handleCompareToggle = (loanId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(loanId)) {
        return prev.filter(id => id !== loanId);
      }
      if (prev.length < 2) {
        return [...prev, loanId];
      }
      return prev;
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      setIsCompareModalOpen(true);
    }
  };

  const selectedLoans = homeLoans.filter(loan => selectedForComparison.includes(loan.id));

  const getActiveFilterCount = () => {
    return filters.rateType.length + 
           filters.features.length + 
           filters.maxLVR.length + 
           filters.banks.length + 
           filters.loanAmountRange.length + 
           filters.loanTermRange.length + 
           filters.interestRateRange.length + 
           filters.feePreference.length + 
           (filters.recommended ? 1 : 0) + 
           (filters.promoted ? 1 : 0);
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <SEO 
        title="Best Home Loans Bangladesh 2025 | Compare Mortgage Rates & EMI Calculator"
        description="Compare home loan interest rates, mortgage rates from top banks in Bangladesh. Use EMI calculator to buy house with easy loans, online loan application & quick approval. Best 30 year mortgage rates from BRAC Bank & more."
        keywords="emi calculation, home loan, loan, buy house, bank loan, mortgage, loan application, easy loans, online loans, online lenders, brac bank loan, mortgage rates, quick loans, houses for sale, 30 year mortgage rates"
        pageType="home-loans"
        canonical="https://kontanibo.com/home-loans"
      />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1B1F3B] via-[#2d325f] to-[#1B1F3B] text-white py-8 md:py-20 px-4 overflow-hidden">
        <AnimatedHouseBg />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4 md:mb-8"
          >
            <h1 className="text-3xl md:text-6xl font-extrabold mb-2 md:mb-3 tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Best Home Loans Bangladesh 2025: Compare Mortgage Rates & Apply Online
            </h1>
            <p className="text-sm md:text-lg lg:text-2xl font-medium text-blue-100 max-w-3xl mx-auto px-4">
              Compare {homeLoans.length}+ home loan interest rates & mortgage rates. Use EMI calculator to buy house with easy loans, online application & quick approval from BRAC Bank & top lenders.
            </p>
          </motion.div>
          
          {/* Calculator Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-3 md:mt-4 lg:mt-6 bg-white rounded-xl p-3 md:p-4 lg:p-6 border border-gray-200 shadow-lg mx-4 md:mx-0"
          >
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="p-1.5 md:p-2 bg-[#1B1F3B] rounded-lg">
                <span className="text-white font-bold text-lg md:hidden">৳</span>
                <Calculator size={18} className="text-white hidden md:block" />
              </div>
              <div>
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">EMI Calculator & Home Loan Calculator</h2>
                <p className="text-gray-600 text-xs mt-0.5 hidden md:block">Calculate monthly EMI & mortgage payments instantly</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                              <div className="space-y-2">
                <label className="block text-xs font-semibold mb-2 text-gray-700">Property Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">৳</span>
                  <input
                    type="number"
                    value={calculatorInputs.housePrice}
                    onChange={(e) => handleCalculatorInputChange('housePrice', e.target.value)}
                    className="w-full pl-8 pr-3 py-2 md:py-2.5 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 font-medium text-sm"
                    placeholder="Enter property value"
                    min="0"
                  />
                </div>
                <div className="grid grid-cols-2 md:flex gap-1 mt-2">
                  {[1000000, 5000000, 10000000, 20000000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setCalculatorInputs(prev => ({ ...prev, housePrice: amount }))}
                      className="px-2 py-1.5 md:py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-center"
                    >
                      ৳{(amount / 100000).toFixed(0)}L
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold mb-2 text-gray-700">Down Payment (%)</label>
                <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
                  <input
                    type="range"
                    value={calculatorInputs.downPaymentPercent}
                    onChange={(e) => handleCalculatorInputChange('downPaymentPercent', e.target.value)}
                    className="w-full accent-blue-500"
                    min="5"
                    max="40"
                    step="1"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5%</span>
                    <span>40%</span>
                  </div>
                  <div className="text-center text-gray-900 font-bold text-base md:text-lg mt-2">{calculatorInputs.downPaymentPercent}%</div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Down Payment:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(calculatorInputs.housePrice * (calculatorInputs.downPaymentPercent / 100))}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>LVR:</span>
                    <span className="font-semibold text-gray-900">{100 - calculatorInputs.downPaymentPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold mb-2 text-gray-700">Loan Term (Years)</label>
                <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
                  <input
                    type="range"
                    value={calculatorInputs.loanTerm}
                    onChange={(e) => handleCalculatorInputChange('loanTerm', e.target.value)}
                    className="w-full accent-blue-500"
                    min="5"
                    max="30"
                    step="1"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5yrs</span>
                    <span>30yrs</span>
                  </div>
                  <div className="text-center text-gray-900 font-bold text-base md:text-lg mt-2">{calculatorInputs.loanTerm} years</div>
                </div>
              </div>
            </div>

            <div className="mt-3 md:mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <span className="text-blue-500 font-bold text-base md:hidden">৳</span>
                  <DollarSign size={16} className="text-blue-500 hidden md:block" />
                  <div className="text-xs text-gray-600 font-medium">Loan Amount</div>
                </div>
                <div className="text-base md:text-xl font-bold text-gray-900">
                  {formatCurrency(calculatorInputs.housePrice * (1 - calculatorInputs.downPaymentPercent / 100))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 md:p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <span className="text-green-500 font-bold text-base md:hidden">৳</span>
                  <Home size={16} className="text-green-500 hidden md:block" />
                  <div className="text-xs text-gray-600 font-medium">Down Payment</div>
                </div>
                <div className="text-base md:text-xl font-bold text-gray-900">
                  {formatCurrency(calculatorInputs.housePrice * (calculatorInputs.downPaymentPercent / 100))}
                </div>
              </div>

              {homeLoans.length > 0 && (() => {
                const validLoans = homeLoans.filter(loan => loan.interest_rate_pa != null && loan.interest_rate_pa > 0);
                if (validLoans.length === 0) return null;
                
                const bestLoan = validLoans.reduce((best, current) => 
                  current.interest_rate_pa < best.interest_rate_pa ? current : best
                );
                const loanAmount = calculatorInputs.housePrice * (1 - calculatorInputs.downPaymentPercent / 100);
                const monthlyPayment = calculateMonthlyRepayment(loanAmount, bestLoan.interest_rate_pa, calculatorInputs.loanTerm);
                
                return (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg p-3 md:p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                      <span className="text-yellow-500 font-bold text-base md:hidden">৳</span>
                      <Star size={16} className="text-yellow-500 hidden md:block" />
                      <div className="text-xs text-gray-600 font-medium">Best Rate</div>
                    </div>
                    <div className="text-base md:text-lg font-bold text-gray-900 mb-1">
                      {formatCurrency(monthlyPayment)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {bestLoan.brand} at {formatPercentage(bestLoan.interest_rate_pa)}
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 lg:py-12" data-loan-cards>
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4 lg:gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between touch-manipulation relative"
            >
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-[#1B1F3B]" />
                <span className="font-semibold text-gray-900">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 font-medium">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <ChevronDown size={20} className={`text-gray-400 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Column */}
          <div className="lg:w-1/4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}
            >
              <div className="bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white p-4 md:p-6">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Filter size={20} className="md:w-6 md:h-6" />
                  <h2 className="text-lg md:text-xl font-bold">Refine Results</h2>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => setFilters({ rateType: [], features: [], maxLVR: [], banks: [], loanAmountRange: [], loanTermRange: [], interestRateRange: [], feePreference: [], recommended: false, promoted: false })}
                      className="text-xs text-blue-200 hover:text-white underline"
                    >
                      Clear All ({activeFilterCount})
                    </button>
                  )}
                </div>
                <p className="text-blue-100 text-sm mt-1 hidden md:block">Filter loans by your preferences</p>
              </div>
              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              
                {/* Rate Type Filter */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('rateType')}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Rate Type</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'rateType' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'rateType' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                      >
                        {['Variable', 'Fixed', 'Split', 'Islamic'].map(type => (
                          <label key={type} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-blue-500 focus:ring-blue-500 w-4 h-4" 
                              checked={filters.rateType.includes(type)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, rateType: [...filters.rateType, type]});
                                } else {
                                  setFilters({...filters, rateType: filters.rateType.filter(t => t !== type)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{type}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bank Filter */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('banks')}
                  >
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-indigo-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Banks</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'banks' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'banks' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2 max-h-60 overflow-y-auto"
                      >
                        {Array.from(new Set(homeLoans.map(loan => loan.brand))).sort().map(bank => (
                          <label key={bank} className="flex items-center p-2 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-indigo-500 focus:ring-indigo-500 w-4 h-4" 
                              checked={filters.banks.includes(bank)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, banks: [...filters.banks, bank]});
                                } else {
                                  setFilters({...filters, banks: filters.banks.filter(b => b !== bank)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm">{bank}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Loan Amount Range Filter */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('loanAmount')}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Loan Amount</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'loanAmount' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'loanAmount' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                      >
                        {[
                          { id: '0-500k', label: 'Up to ৳5L' },
                          { id: '500k-1m', label: '৳5L - ৳10L' },
                          { id: '1m-2m', label: '৳10L - ৳20L' },
                          { id: '2m+', label: '৳20L+' }
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-green-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-green-500 focus:ring-green-500 w-4 h-4" 
                              checked={filters.loanAmountRange.includes(id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, loanAmountRange: [...filters.loanAmountRange, id]});
                                } else {
                                  setFilters({...filters, loanAmountRange: filters.loanAmountRange.filter(a => a !== id)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Loan Term Filter */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('loanTerm')}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-orange-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Loan Term</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'loanTerm' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'loanTerm' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                      >
                        {[
                          { id: '0-15', label: 'Up to 15 years' },
                          { id: '15-25', label: '15-25 years' },
                          { id: '25-30', label: '25-30 years' },
                          { id: '30+', label: '30+ years' }
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-orange-500 focus:ring-orange-500 w-4 h-4" 
                              checked={filters.loanTermRange.includes(id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, loanTermRange: [...filters.loanTermRange, id]});
                                } else {
                                  setFilters({...filters, loanTermRange: filters.loanTermRange.filter(t => t !== id)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Interest Rate Range Filter */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('interestRate')}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-red-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Interest Rate</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'interestRate' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'interestRate' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                      >
                        {[
                          { id: '0-8', label: 'Up to 8%' },
                          { id: '8-12', label: '8% - 12%' },
                          { id: '12-16', label: '12% - 16%' },
                          { id: '16+', label: '16%+' }
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-red-500 focus:ring-red-500 w-4 h-4" 
                              checked={filters.interestRateRange.includes(id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, interestRateRange: [...filters.interestRateRange, id]});
                                } else {
                                  setFilters({...filters, interestRateRange: filters.interestRateRange.filter(r => r !== id)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fee Preferences Filter */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('feePrefs')}
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-yellow-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Fee Preferences</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'feePrefs' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'feePrefs' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                      >
                        {[
                          { id: 'no-application-fee', label: 'No Application Fee' },
                          { id: 'no-ongoing-fees', label: 'No Ongoing Fees' },
                          { id: 'low-total-fees', label: 'Low Total Fees' }
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-yellow-500 focus:ring-yellow-500 w-4 h-4" 
                              checked={filters.feePreference.includes(id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, feePreference: [...filters.feePreference, id]});
                                } else {
                                  setFilters({...filters, feePreference: filters.feePreference.filter(f => f !== id)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Special Options */}
                <div>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors touch-manipulation">
                      <input 
                        type="checkbox" 
                        className="mr-3 rounded text-blue-500 focus:ring-blue-500 w-4 h-4" 
                        checked={filters.recommended}
                        onChange={(e) => {
                          setFilters({...filters, recommended: e.target.checked});
                        }}
                      />
                      <Star size={16} className="text-blue-500 mr-2" />
                      <span className="text-gray-700 font-medium text-sm md:text-base">Recommended Only</span>
                    </label>
                    <label className="flex items-center p-3 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors touch-manipulation">
                      <input 
                        type="checkbox" 
                        className="mr-3 rounded text-yellow-500 focus:ring-yellow-500 w-4 h-4" 
                        checked={filters.promoted}
                        onChange={(e) => {
                          setFilters({...filters, promoted: e.target.checked});
                        }}
                      />
                      <Award size={16} className="text-yellow-500 mr-2" />
                      <span className="text-gray-700 font-medium text-sm md:text-base">Promoted Offers</span>
                    </label>
                  </div>
                </div>
              
                {/* Features Filter */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('features')}
                  >
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-green-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Features</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'features' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'features' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                      >
                        {[
                          { id: 'offset', label: 'Offset Account' },
                          { id: 'redraw', label: 'Redraw Facility' },
                          { id: 'extra', label: 'Extra Repayments' },
                          { id: 'split', label: 'Split Loan Facility' },
                          { id: 'fixed', label: 'Fixed Interest Option' },
                        ].map(({ id, label }) => (
                          <label key={id} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-green-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-green-500 focus:ring-green-500 w-4 h-4" 
                              checked={filters.features.includes(id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, features: [...filters.features, id]});
                                } else {
                                  setFilters({...filters, features: filters.features.filter(f => f !== id)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{label}</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Max LVR Filter */}
                <div>
                  <button 
                    className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation"
                    onClick={() => toggleFilter('maxLVR')}
                  >
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-purple-500 md:w-[18px] md:h-[18px]" />
                      <span className="font-semibold text-gray-900 text-sm md:text-base">Maximum LVR</span>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform md:w-[18px] md:h-[18px] ${expandedFilter === 'maxLVR' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFilter === 'maxLVR' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-3"
                      >
                        {['60-70', '70-80', '80-90', '90-95'].map(range => (
                          <label key={range} className="flex items-center p-3 md:p-2 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors touch-manipulation">
                            <input 
                              type="checkbox" 
                              className="mr-3 rounded text-purple-500 focus:ring-purple-500 w-4 h-4" 
                              checked={filters.maxLVR.includes(range)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters({...filters, maxLVR: [...filters.maxLVR, range]});
                                } else {
                                  setFilters({...filters, maxLVR: filters.maxLVR.filter(r => r !== range)});
                                }
                              }}
                            />
                            <span className="text-gray-700 font-medium text-sm md:text-base">{range}% LVR</span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Results Column */}
          <div className="lg:w-3/4">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-12 rounded-2xl shadow-lg flex justify-center"
              >
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-6"></div>
                  <p className="text-gray-600 text-lg font-medium">Loading home loans...</p>
                  <p className="text-gray-400 text-sm mt-2">Finding the best rates for you</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
                >
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                      {filteredLoans.length} Home Loans Available
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Showing {filteredLoans.length} of {homeLoans.length} loans matching your criteria
                    </p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="md:w-4 md:h-4" />
                      <span>Updated daily</span>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live rates</span>
                  </div>
                </motion.div>
                
                {/* Sort bar - Hidden on mobile, shown on desktop */}
                <div className="hidden md:block bg-white rounded-t-lg shadow-sm">
                  <div className="grid grid-cols-7 border-b text-sm text-gray-600">
                    <div className="p-3 col-span-2">Loan details</div>
                    <button 
                      className="p-3 flex items-center justify-between hover:bg-gray-50 touch-manipulation"
                      onClick={() => handleSort('interest_rate_pa')}
                    >
                      Interest rate p.a.
                      <ChevronDown size={16} className={`ml-1 ${sortField === 'interest_rate_pa' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      className="p-3 flex items-center justify-between hover:bg-gray-50 touch-manipulation"
                      onClick={() => handleSort('comparison_rate_pa')}
                    >
                      Comparison rate
                      <ChevronDown size={16} className={`ml-1 ${sortField === 'comparison_rate_pa' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      className="p-3 flex items-center justify-between hover:bg-gray-50 touch-manipulation"
                      onClick={() => handleSort('max_loan_term')}
                    >
                      Max term
                      <ChevronDown size={16} className={`ml-1 ${sortField === 'max_loan_term' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      className="p-3 flex items-center justify-between hover:bg-gray-50 touch-manipulation"
                      onClick={() => handleSort('minimum_deposit')}
                    >
                      Min deposit
                      <ChevronDown size={16} className={`ml-1 ${sortField === 'minimum_deposit' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                    <button 
                      className="p-3 flex items-center justify-between hover:bg-gray-50 touch-manipulation"
                      onClick={() => handleSort('monthly_repayment')}
                    >
                      Monthly repayment
                      <ChevronDown size={16} className={`ml-1 ${sortField === 'monthly_repayment' && sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Mobile Sort Dropdown */}
                <div className="md:hidden bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
                  <div className="p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort by:</label>
                    <select
                      value={`${sortField}-${sortDirection}`}
                      onChange={(e) => {
                        const [field, direction] = e.target.value.split('-');
                        setSortField(field as SortField);
                        setSortDirection(direction as 'asc' | 'desc');
                      }}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                    >
                      <option value="interest_rate_pa-asc">Interest Rate (Low to High)</option>
                      <option value="interest_rate_pa-desc">Interest Rate (High to Low)</option>
                      <option value="comparison_rate_pa-asc">Comparison Rate (Low to High)</option>
                      <option value="comparison_rate_pa-desc">Comparison Rate (High to Low)</option>
                      <option value="monthly_repayment-asc">Monthly Payment (Low to High)</option>
                      <option value="monthly_repayment-desc">Monthly Payment (High to Low)</option>
                      <option value="minimum_deposit-asc">Min Deposit (Low to High)</option>
                      <option value="minimum_deposit-desc">Min Deposit (High to Low)</option>
                      <option value="max_loan_term-asc">Max Term (Short to Long)</option>
                      <option value="max_loan_term-desc">Max Term (Long to Short)</option>
                    </select>
                  </div>
                </div>
                
                {/* Loan listings */}
                <div className="space-y-6">
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan, index) => (
                      <motion.div 
                        key={loan.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white shadow-lg rounded-xl overflow-hidden relative border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                      >
                        {loan.recommended && (
                          <div className="absolute -left-8 top-4 z-10">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-1 text-xs font-bold transform -rotate-45 shadow-lg tracking-wider" style={{ width: '140px', paddingLeft: 'calc(2.5rem - 3px)' }}>
                              RECOMMENDED
                            </div>
                          </div>
                        )}
                        {loan.promoted && (
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1.5 text-xs font-semibold">
                            ⭐ PROMOTED OFFER
                          </div>
                        )}
                        <div className="p-3 md:p-4">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
                            {/* Logo and Basic Info */}
                            <div className="md:col-span-3">
                              <div className="flex md:flex-col items-center md:items-start gap-2">
                                <div className="w-16 h-10 md:w-24 md:h-14 mb-0 md:mb-2 flex items-center justify-center flex-shrink-0">
                                  {loan.logo_image_link ? (
                                    <img 
                                      src={loan.logo_image_link} 
                                      alt={`${loan.brand} ${loan.name}`}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                                      <Home size={16} className="md:w-5 md:h-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 md:flex-none">
                                  <h3 className="text-sm font-bold tracking-tight text-[#1B1F3B] mb-0.5 group-hover:text-blue-600 transition-colors">{loan.brand}</h3>
                                  <p className="text-xs text-gray-600">{loan.name}</p>
                                </div>
                              </div>
                              {/* Score Meter */}
                              <div className="mt-2 flex justify-center md:justify-start">
                                {typeof loan.score === 'number' ? (
                                  <Speedometer value={loan.score} maxValue={10} size={40} label="Score" />
                                ) : (
                                  <div className="text-gray-400 text-xs">No score available</div>
                                )}
                              </div>
                            </div>

                            {/* Key Features */}
                            <div className="md:col-span-5 space-y-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Star className="text-yellow-500" size={12} />
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Key Features</h4>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-1.5 rounded">
                                  <div className="text-xs text-gray-600">Interest Rate (p.a.)</div>
                                  <div className="text-sm font-bold text-[#1B1F3B]">{formatPercentage(loan.interest_rate_pa)}</div>
                                </div>
                                <div className="bg-gray-50 p-1.5 rounded">
                                  <div className="text-xs text-gray-600">Comparison Rate</div>
                                  <div className="text-sm font-bold text-[#1B1F3B]">{formatPercentage(loan.comparison_rate_pa)}</div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 p-1.5 rounded">
                                  <div className="text-xs text-gray-600">Required Deposit</div>
                                  <div className="text-sm font-semibold text-[#1B1F3B]">
                                    {(() => {
                                      const requiredDeposit = calculatorInputs.housePrice * ((100 - loan.max_lvr) / 100);
                                      return formatCurrency(requiredDeposit);
                                    })()}
                                </div>
                                  <div className="text-[10px] text-gray-500">
                                    {loan.minimum_deposit > 0 ? (
                                      <>Min deposit: {formatCurrency(loan.minimum_deposit)}</>
                                    ) : (
                                      <>Based on {100 - loan.max_lvr}% of property value</>
                                    )}
                                  </div>
                                </div>
                                <div className="bg-gray-50 p-1.5 rounded">
                                  <div className="text-xs text-gray-600">Max LVR</div>
                                  <div className="text-sm font-semibold text-[#1B1F3B]">{loan.max_lvr}%</div>
                                  <div className="text-[10px] text-gray-500">Max loan: {formatCurrency(calculatorInputs.housePrice * (loan.max_lvr / 100))}</div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                  {loan.offset_account && (
                                  <div className="flex items-center text-[10px] text-gray-600 bg-green-50 px-1.5 py-0.5 rounded">
                                    <Check size={10} className="text-green-500 mr-0.5" />
                                      Offset Account
                                    </div>
                                  )}
                                  {loan.loan_redraw_facility && (
                                  <div className="flex items-center text-[10px] text-gray-600 bg-green-50 px-1.5 py-0.5 rounded">
                                    <Check size={10} className="text-green-500 mr-0.5" />
                                      Redraw Facility
                                    </div>
                                  )}
                                  {loan.extra_repayments && (
                                  <div className="flex items-center text-[10px] text-gray-600 bg-green-50 px-1.5 py-0.5 rounded">
                                    <Check size={10} className="text-green-500 mr-0.5" />
                                      Extra Repayments
                                    </div>
                                  )}
                                  {loan.split_loan_facility && (
                                  <div className="flex items-center text-[10px] text-gray-600 bg-green-50 px-1.5 py-0.5 rounded">
                                    <Check size={10} className="text-green-500 mr-0.5" />
                                      Split Loan
                                    </div>
                                  )}
                              </div>

                              {/* Loan Term and Eligibility */}
                              <div className="bg-blue-50 p-1.5 rounded text-[10px]">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Info size={10} className="text-blue-500" />
                                  <span className="font-semibold text-gray-700">Loan Details</span>
                                </div>
                                <div className="grid grid-cols-1 gap-0.5">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Max Term:</span>
                                    <span className="text-gray-900">{loan.max_loan_term} years</span>
                                </div>
                                  {loan.who_can_apply && (
                                    <div className="text-gray-600">
                                      <span className="font-medium">Eligibility:</span> {loan.who_can_apply}
                                </div>
                                  )}
                              </div>
                            </div>

                              {loan.pros && (
                                <div className="text-[10px] text-gray-600">
                                  <span className="font-medium text-green-600">Pros:</span> {loan.pros}
                                </div>
                              )}
                              </div>
                              
                            {/* Monthly Repayment Calculation */}
                            <div className="md:col-span-4">
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-2 border border-blue-100 mb-2">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Calculator size={12} className="text-blue-500" />
                                  <div className="text-xs text-gray-600 font-medium">Monthly Repayment</div>
                                </div>
                                {((): React.ReactNode => {
                                  const effectiveRate = loan.interest_rate_pa == null || loan.interest_rate_pa === 0 ? 12 : loan.interest_rate_pa;
                                  const monthlyPayment = calculateMonthlyRepayment(
                                    calculatorInputs.housePrice * (1 - calculatorInputs.downPaymentPercent / 100),
                                    effectiveRate,
                                    calculatorInputs.loanTerm
                                  );
                                  return (
                                    <>
                                      <div className="text-base font-bold text-[#1B1F3B]">
                                        {formatCurrency(monthlyPayment)}
                                </div>
                                      <div className="text-[10px] text-blue-600">
                                        {loan.interest_rate_pa == null || loan.interest_rate_pa === 0 ? (
                                          <span className="text-amber-600">*Based on average rate of 12% p.a.</span>
                                        ) : (
                                          <>{formatPercentage(loan.interest_rate_pa)} over {calculatorInputs.loanTerm} years</>
                                        )}
                                </div>
                                    </>
                                  );
                                })()}
                              </div>

                              <div className="grid grid-cols-1 gap-1.5">
                                <a 
                                  href={loan.visit_site_link || '#'} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-full bg-gradient-to-r from-[#1B1F3B] to-[#2d325f] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group touch-manipulation"
                                >
                                  Get Home Loan
                                  <ArrowUpRight size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </a>
                                <button
                                  onClick={() => setSelectedLoan(loan)}
                                  className="w-full border border-[#1B1F3B] text-[#1B1F3B] px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#1B1F3B] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group touch-manipulation"
                                >
                                  View Details
                                  <Eye size={12} className="group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 px-3 md:px-4 lg:px-5 py-2 md:py-3 bg-gradient-to-r from-gray-50 to-white flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="flex items-center">
                              <input 
                                type="checkbox" 
                                id={`compare-${loan.id}`} 
                                className="mr-2 md:mr-3 rounded text-blue-500 focus:ring-blue-500 w-4 h-4"
                                checked={selectedForComparison.includes(loan.id)}
                                onChange={() => handleCompareToggle(loan.id)}
                                disabled={selectedForComparison.length >= 2 && !selectedForComparison.includes(loan.id)}
                              />
                              <label htmlFor={`compare-${loan.id}`} className="text-xs md:text-sm font-medium text-gray-700 cursor-pointer touch-manipulation">
                                Add to Compare
                              </label>
                            </div>
                            {selectedForComparison.includes(loan.id) && (
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                Selected
                              </div>
                            )}
                          </div>
                          {selectedForComparison.length === 2 && selectedForComparison.includes(loan.id) && (
                            <button
                              onClick={handleCompare}
                              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
                            >
                              <Grid size={14} />
                              Compare Now
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-100"
                    >
                      <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Home size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No loans match your criteria</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your filters to see more loan options</p>
                        <button
                          onClick={() => setFilters({ rateType: [], features: [], maxLVR: [], banks: [], loanAmountRange: [], loanTermRange: [], interestRateRange: [], feePreference: [], recommended: false, promoted: false })}
                          className="bg-[#1B1F3B] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d325f] transition-colors"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-8 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Home Loan Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <Home className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Home Loan Interest Rates Bangladesh</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Compare the best home loan interest rates and mortgage rates from top banks in Bangladesh. Get competitive housing loan rates starting from 8% to 14% per annum for 30 year mortgages.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Home Loan Rates: 8% - 14%</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>30 Year Mortgage Rates</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>EMI Calculation & Mortgage Calculator</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <TrendingUp className="text-green-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Buy House & Houses for Sale</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Find houses for sale and buy house with easy home loans. Get online loan application, quick loan approval, and easy loans from top banks and online lenders in Bangladesh.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Houses for Sale Financing</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Quick Loan Approval Process</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Online Loan Application</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <Calculator className="text-purple-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Easy Loans & Online Lenders</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Get easy loans and bank loans from online lenders. Use our EMI calculator for instant mortgage calculation, loan application processing, and quick loans approval.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Online Loan Application</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>EMI Calculator & Tools</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>Easy Loan Approval Process</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Banks for Home Loans */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="text-yellow-500 mr-3" size={28} />
              Top Banks for Home Loans in Bangladesh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['BRAC Bank', 'Dutch Bangla Bank', 'City Bank', 'Eastern Bank Limited', 'Prime Bank', 'Standard Bank'].map((bank) => (
                <div key={bank} className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{bank} Home Loan</h3>
                  <div className="text-sm text-gray-600">
                    <p>✓ Competitive mortgage rates</p>
                    <p>✓ Quick loan processing</p>
                    <p>✓ Flexible EMI options</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Home Loan Types */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Grid className="text-blue-600 mr-3" size={28} />
              Types of Home Loans Available
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Home Purchase Loan</h3>
                  <p className="text-gray-600 text-sm">Finance your dream home with attractive mortgage rates and flexible EMI options up to 30 years.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Home Construction Loan</h3>
                  <p className="text-gray-600 text-sm">Build your house with construction loans offering staged disbursement and competitive interest rates.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Home Improvement Loan</h3>
                  <p className="text-gray-600 text-sm">Renovate and improve your existing property with quick loan approval and easy EMI options.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Plot Purchase Loan</h3>
                  <p className="text-gray-600 text-sm">Buy land and plots with specialized financing options and flexible repayment terms.</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Home Extension Loan</h3>
                  <p className="text-gray-600 text-sm">Expand your existing home with extension loans offering competitive rates and quick processing.</p>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="font-bold text-gray-900 mb-2">Balance Transfer Loan</h3>
                  <p className="text-gray-600 text-sm">Transfer your existing home loan to get better interest rates and save on EMI payments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Footer Section */}
      <div className="bg-gradient-to-br from-[#1B1F3B] to-[#2d325f] text-white py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Home Loan Rates */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Home Loan Interest Rates</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ Best home loan rates Bangladesh</p>
                <p className="text-gray-300">✓ Low mortgage rates 8% - 14%</p>
                <p className="text-gray-300">✓ 30 year mortgage rates</p>
                <p className="text-gray-300">✓ Home loan interest rates comparison</p>
                <p className="text-gray-300">✓ EMI calculation & mortgage calculator</p>
                <p className="text-gray-300">✓ Quick loan approval process</p>
              </div>
            </div>

            {/* Buy House & Properties */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Buy House & Properties</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ Houses for sale Bangladesh</p>
                <p className="text-gray-300">✓ Buy house with home loan</p>
                <p className="text-gray-300">✓ Apartments for sale Dhaka</p>
                <p className="text-gray-300">✓ Residential property financing</p>
                <p className="text-gray-300">✓ Plot purchase loans</p>
                <p className="text-gray-300">✓ Commercial property loans</p>
              </div>
            </div>

            {/* Loan Types */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Easy Loans & Applications</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ Easy loans Bangladesh</p>
                <p className="text-gray-300">✓ Online loan application</p>
                <p className="text-gray-300">✓ Quick loans approval</p>
                <p className="text-gray-300">✓ Online lenders Bangladesh</p>
                <p className="text-gray-300">✓ Bank loan application</p>
                <p className="text-gray-300">✓ Home loan eligibility check</p>
              </div>
            </div>

            {/* Banks & Process */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-200">Top Banks & Process</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">✓ BRAC Bank loan</p>
                <p className="text-gray-300">✓ Dutch Bangla Bank home loan</p>
                <p className="text-gray-300">✓ City Bank mortgage</p>
                <p className="text-gray-300">✓ Online loan application process</p>
                <p className="text-gray-300">✓ Home loan documentation</p>
                <p className="text-gray-300">✓ EMI calculation tools</p>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-8 pt-8 border-t border-blue-800">
            <h3 className="text-lg font-bold mb-4 text-blue-200">Popular Home Loan Searches</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'emi calculation', 'home loan', 'loan', 'buy house', 'bank loan', 'mortgage',
                'loan application', 'easy loans', 'online loans', 'online lenders', 'brac bank loan',
                'mortgage rates', 'quick loans', 'houses for sale', '30 year mortgage rates',
                'home loan calculator', 'home loan emi calculator', 'best home loan rates',
                'home loan eligibility', 'home loan process', 'home loan documents', 'mortgage calculator',
                'home financing', 'property loan', 'house loan', 'housing loan', 'home purchase loan'
              ].map((term, index) => (
                <span key={index} className="bg-blue-800 text-blue-200 px-3 py-1 rounded-full text-xs">
                  {term}
                </span>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 pt-6 border-t border-blue-800 text-center">
            <p className="text-gray-400 text-sm">
              Home loan interest rates and mortgage rates are subject to change. Please verify current rates with respective banks. 
              Konta Nibo helps you compare the best home loan deals in Bangladesh for informed financial decisions.
            </p>
          </div>
        </div>
      </div>

      <CompareModal
        loans={selectedLoans}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
      />
      <InfoDrawer
        loan={selectedLoan}
        isOpen={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
      />
    </motion.div>
  );
};

export default HomeLoansPage; 