import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MobilePlansTable from '../components/MobilePlansTable';

const TABS = [
  'Credit cards',
  'Mobile payments',
  'Home loans',
  'Health insurance',
  'Car insurance',
  'Broadband',
  'Energy',
  'Travel insurance',
  'Home insurance',
  'Superannuation',
  'Share trading',
  'Bank accounts',
  'Savings accounts',
  'Mobile plans',
  'Entertainment',
];

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
  card_benefits: CardBenefits;
  rates_and_fees: RatesAndFees;
  pros: Record<string, string>;
  cons: Record<string, string>;
  description: Record<string, string>;
  reviews: Reviews;
  link_to_site: string;
  image_link: string;
}

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
  konta_nibo_score: number | null;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  } | null;
}

interface MobilePayment {
  id: number;
  name: string;
  features: string[];
  cash_out_fee: string;
  utility_bills_fee: string;
  credit_card_payment_fees: string;
  digital_to_bank_fees: Record<string, unknown>;
  apps_available: string[];
  description: Record<string, string>;
  eligibility: Record<string, unknown>;
  transfer_fees: Record<string, unknown>;
  international_remittance: Record<string, unknown>;
  image_url: string | null;
  site_link: string | null;
  konta_nibo_score: number | null;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  } | null;
}

interface HomeLoan {
  id: string;
  brand: string;
  name: string;
  interest_rate_type: string;
  interest_rate_pa: number | null;
  comparison_rate_pa: number | null;
  fees: string | null;
  recommended: boolean;
  promoted: boolean;
  minimum_deposit: number | null;
  extras: string | null;
  offers: string | null;
  tagline: string | null;
  min_loan_amount: number | null;
  max_loan_amount: number | null;
  max_loan_term: number | null;
  max_lvr: number | null;
  loan_redraw_facility: boolean;
  processing_fee: number | null;
  offset_account: boolean;
  eligibility: string | null;
  split_loan_facility: boolean;
  fixed_interest_option: boolean;
  extra_repayments: boolean;
  features: string | null;
  early_partial_settlement_fee: number | null;
  application_fee: number | null;
  lenders_legal_fee: number | null;
  valuation_fee: number | null;
  ongoing_fees: number | null;
  settlement_fee: number | null;
  discharge_fee: number | null;
  pros: string | null;
  cons: string | null;
  who_can_apply: string | null;
  score: number | null;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  } | null;
  logo_image_link: string | null;
  visit_site_link: string | null;
  created_at?: string;
  updated_at?: string;
}

interface BankAccount {
  id: string;
  brand: string;
  product_name: string;
  monthly_fee: number | null;
  non_bank_atm_fee: number | null;
  debit_card_options: string | null;
  minimum_deposit_required: number | null;
  account_fee: number | null;
  max_withdrawal: number | null;
  cheque_book_fee: number | null;
  online_banking: boolean;
  discounts_on_retailers: boolean;
  entertainment: boolean;
  ekyc_enabled: boolean;
  score: number | null;
  internet_banking_score: number | null;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  } | null;
  logo_url: string | null;
  eligibility: string | null;
  visit_site_url: string | null;
  features: string[];
  savings_account: boolean;
  created_at: string;
  updated_at: string;
}

interface SavingsAccount {
  id: string;
  brand: string;
  product_name: string;
  max_variable_rate_pa?: number | null;
  interest_rate?: number | null;
  monthly_maximum_rate_conditions?: string | null;
  minimum_deposit?: number | null;
  cheque_book_fee?: number | null;
  account_fee?: number | null;
  tagline?: string | null;
  recommended?: boolean;
  score?: number | null;
  logo_url?: string | null;
  visit_site_link?: string | null;
  reviews?: {
    average_rating?: number;
    total_reviews?: number;
  };
  features?: string[];
  pros?: string[];
  cons?: string[];
  eligibility?: string[];
  required_documents?: string[];
  ekyc_enabled?: boolean;
  internet_banking?: boolean;
  debit_card_facility?: boolean;
  created_at?: string;
  updated_at?: string;
}

const defaultSavingsAccount: Partial<SavingsAccount> = {
  brand: '',
  product_name: '',
  interest_rate: null,
  logo_url: '',
  visit_site_link: '',
};

const creditCardsData: CreditCard[] = [
  {
    id: 1,
    brand: "Fictional Bank",
    card_type: "Visa",
    card_name: "Fictional Rewards Card",
    recommended: "Yes",
    promoted: "No",
    frequent_flyer: "FictionalFlyer",
    bonus_points: "50,000 points",
    purchase_rate: "19.99% p.a.",
    reward_points_per_dollar: "1.5",
    annual_fee: "$99",
    interest_free_days: "55",
    min_credit_limit: "$2,000",
    max_credit_limit: "$30,000",
    balance_transfer_limit: "$30,000",
    eligibility: {},
    minimum_monthly_repayment: "$200",
    late_payment_fee: "$30",
    foreign_currency: "USD",
    foreign_currency_conversion_fee: "$0.005",
    additional_card_holder_fee: "$0",
    number_of_additional_cardholders: "0",
    card_benefits: {},
    rates_and_fees: {},
    pros: {},
    cons: {},
    description: {},
    reviews: {},
    link_to_site: "https://www.fictionalbank.com",
    image_link: ""
  }
];

declare global {
  interface Window {
    mcp_supabase_mcp_server_execute_postgresql: (query: string) => Promise<{
      results: Array<{
        rows: CreditCard[];
      }>;
    }>;
  }
}

interface CardDetailsModalProps {
  card: CreditCard;
  isOpen: boolean;
  onClose: () => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, isOpen, onClose }) => {
  if (!isOpen) return null;

  const renderJsonValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) {
      return '-';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  const fields = [
    { label: 'Brand', value: card.brand },
    { label: 'Card Type', value: card.card_type },
    { label: 'Card Name', value: card.card_name },
    { label: 'Recommended', value: card.recommended },
    { label: 'Promoted', value: card.promoted },
    { label: 'Frequent Flyer', value: card.frequent_flyer },
    { label: 'Bonus Points', value: card.bonus_points },
    { label: 'Purchase Rate', value: card.purchase_rate },
    { label: 'Reward Points per Dollar', value: card.reward_points_per_dollar },
    { label: 'Annual Fee', value: card.annual_fee },
    { label: 'Interest Free Days', value: card.interest_free_days },
    { label: 'Balance Transfer Limit', value: card.balance_transfer_limit },
    { label: 'Min Credit Limit', value: card.min_credit_limit },
    { label: 'Max Credit Limit', value: card.max_credit_limit },
    { label: 'Eligibility', value: card.eligibility },
    { label: 'Minimum Monthly Repayment', value: card.minimum_monthly_repayment },
    { label: 'Late Payment Fee', value: card.late_payment_fee },
    { label: 'Foreign Currency', value: card.foreign_currency },
    { label: 'Foreign Currency Conversion Fee', value: card.foreign_currency_conversion_fee },
    { label: 'Additional Card Holder Fee', value: card.additional_card_holder_fee },
    { label: 'Number of Additional Cardholders', value: card.number_of_additional_cardholders },
    { label: 'Card Benefits', value: card.card_benefits },
    { label: 'Rates and Fees', value: card.rates_and_fees },
    { label: 'Pros', value: card.pros },
    { label: 'Cons', value: card.cons },
    { label: 'Description', value: card.description },
    { label: 'Reviews', value: card.reviews },
    { label: 'Link to Site', value: card.link_to_site },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">{card.card_name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(({ label, value }) => (
              <div key={label} className="border-b border-gray-100 pb-4">
                <div className="font-medium text-gray-700 mb-1">{label}</div>
                <div className="text-gray-900">{renderJsonValue(value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: Omit<CreditCard, 'id'>) => Promise<CreditCard | void>;
  error?: string | null;
}

const defaultCardData: Omit<CreditCard, 'id'> = {
  brand: '',
  card_type: '',
  card_name: '',
  recommended: 'No',
  promoted: 'No',
  frequent_flyer: '',
  bonus_points: '',
  purchase_rate: '',
  reward_points_per_dollar: '',
  annual_fee: '',
  interest_free_days: '',
  min_credit_limit: '',
  max_credit_limit: '',
  balance_transfer_limit: '',
  eligibility: {
    age: '',
    income: '',
    employment: '',
    residency: '',
    credit_score: ''
  },
  minimum_monthly_repayment: '',
  late_payment_fee: '',
  foreign_currency: '',
  foreign_currency_conversion_fee: '',
  additional_card_holder_fee: '',
  number_of_additional_cardholders: '',
  card_benefits: {
    travel: false,
    insurance: false,
    rewards: false
  },
  rates_and_fees: {
    annual_fee: '',
    purchase_rate: '',
    balance_transfer_rate: '',
    cash_advance_rate: ''
  },
  pros: {},
  cons: {},
  description: { summary: '' },
  reviews: {
    average_rating: 0,
    total_reviews: 0
  },
  link_to_site: '',
  image_link: ''
};

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAdd, error }) => {
  const [formData, setFormData] = useState<Omit<CreditCard, 'id'>>(defaultCardData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onAdd(formData);
      if (result) {
        onClose();
        setFormData(defaultCardData);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<CreditCard, 'id'>, value: string | boolean | Record<string, unknown>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">Add New Credit Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
              <input
                type="text"
                value={formData.card_type}
                onChange={(e) => handleInputChange('card_type', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
              <input
                type="text"
                value={formData.card_name}
                onChange={(e) => handleInputChange('card_name', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Link</label>
              <input
                type="text"
                value={formData.image_link}
                onChange={(e) => handleInputChange('image_link', e.target.value)}
                placeholder="https://example.com/card-image.jpg"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recommended</label>
              <select
                value={formData.recommended}
                onChange={(e) => handleInputChange('recommended', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promoted</label>
              <select
                value={formData.promoted}
                onChange={(e) => handleInputChange('promoted', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Fee</label>
              <input
                type="text"
                value={formData.annual_fee}
                onChange={(e) => handleInputChange('annual_fee', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Rate</label>
              <input
                type="text"
                value={formData.purchase_rate}
                onChange={(e) => handleInputChange('purchase_rate', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reward Points per Dollar</label>
              <input
                type="text"
                value={formData.reward_points_per_dollar}
                onChange={(e) => handleInputChange('reward_points_per_dollar', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Free Days</label>
              <input
                type="text"
                value={formData.interest_free_days}
                onChange={(e) => handleInputChange('interest_free_days', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Credit Limit</label>
              <input
                type="text"
                value={formData.min_credit_limit}
                onChange={(e) => handleInputChange('min_credit_limit', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Credit Limit</label>
              <input
                type="text"
                value={formData.max_credit_limit}
                onChange={(e) => handleInputChange('max_credit_limit', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link to Site</label>
              <input
                type="url"
                value={formData.link_to_site}
                onChange={(e) => handleInputChange('link_to_site', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Card Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.card_benefits.travel}
                  onChange={(e) => handleInputChange('card_benefits', { ...formData.card_benefits, travel: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Travel Benefits</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.card_benefits.insurance}
                  onChange={(e) => handleInputChange('card_benefits', { ...formData.card_benefits, insurance: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Insurance</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.card_benefits.rewards}
                  onChange={(e) => handleInputChange('card_benefits', { ...formData.card_benefits, rewards: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Rewards Program</span>
              </label>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Eligibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Age</label>
                <input
                  type="text"
                  value={formData.eligibility.age}
                  onChange={(e) => handleInputChange('eligibility', { ...formData.eligibility, age: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 18+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Income</label>
                <input
                  type="text"
                  value={formData.eligibility.income}
                  onChange={(e) => handleInputChange('eligibility', { ...formData.eligibility, income: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., $30,000+"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Credit Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditCardModalProps {
  card: CreditCard;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: number, card: Omit<CreditCard, 'id'>) => Promise<CreditCard | void>;
  error?: string | null;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ card, isOpen, onClose, onEdit, error }) => {
  const [formData, setFormData] = useState<Omit<CreditCard, 'id'>>(card);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onEdit(card.id, formData);
      if (result) {
        onClose();
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<CreditCard, 'id'>, value: string | boolean | Record<string, unknown>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">Edit Credit Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
              <input
                type="text"
                value={formData.card_type}
                onChange={(e) => handleInputChange('card_type', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
              <input
                type="text"
                value={formData.card_name}
                onChange={(e) => handleInputChange('card_name', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Link</label>
              <input
                type="text"
                value={formData.image_link}
                onChange={(e) => handleInputChange('image_link', e.target.value)}
                placeholder="https://example.com/card-image.jpg"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recommended</label>
              <select
                value={formData.recommended}
                onChange={(e) => handleInputChange('recommended', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promoted</label>
              <select
                value={formData.promoted}
                onChange={(e) => handleInputChange('promoted', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Fee</label>
              <input
                type="text"
                value={formData.annual_fee}
                onChange={(e) => handleInputChange('annual_fee', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Rate</label>
              <input
                type="text"
                value={formData.purchase_rate}
                onChange={(e) => handleInputChange('purchase_rate', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Card Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.card_benefits.travel}
                  onChange={(e) => handleInputChange('card_benefits', { ...formData.card_benefits, travel: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Travel Benefits</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.card_benefits.insurance}
                  onChange={(e) => handleInputChange('card_benefits', { ...formData.card_benefits, insurance: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Insurance</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.card_benefits.rewards}
                  onChange={(e) => handleInputChange('card_benefits', { ...formData.card_benefits, rewards: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Rewards Program</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreditCardsTable: React.FC = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>(creditCardsData);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const refreshData = async () => {
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
      console.error('Error refreshing credit cards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  React.useEffect(() => {
    refreshData();
  }, []);

  const handleAddCard = async (cardData: Omit<CreditCard, 'id'>) => {
    setAddError(null);
    try {
      // Validate required fields
      const requiredFields = ['brand', 'card_type', 'card_name', 'recommended', 'promoted'];
      const missingFields = requiredFields.filter(field => !cardData[field as keyof typeof cardData]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Ensure JSON fields are properly formatted
      const formattedData = {
        ...cardData,
        eligibility: cardData.eligibility || {
          age: '',
          income: '',
          employment: '',
          residency: '',
          credit_score: ''
        },
        card_benefits: cardData.card_benefits || {
          travel: false,
          insurance: false,
          rewards: false
        },
        rates_and_fees: cardData.rates_and_fees || {
          annual_fee: '',
          purchase_rate: '',
          balance_transfer_rate: '',
          cash_advance_rate: ''
        },
        pros: cardData.pros || {},
        cons: cardData.cons || {},
        description: cardData.description || { summary: '' },
        reviews: cardData.reviews || {
          average_rating: 0,
          total_reviews: 0
        }
      };

      // Filter out empty string values to convert them to NULL in the database
      const filteredData = Object.fromEntries(
        Object.entries(formattedData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      );

      const { data, error } = await supabase
        .from('credit_cards')
        .insert([filteredData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
      
      if (data) {
        await refreshData();
        setIsAddModalOpen(false);
        return data;
      } else {
        throw new Error('No result returned from insert query');
      }
    } catch (error) {
      console.error('Error adding credit card:', error);
      setAddError(error instanceof Error ? error.message : 'Failed to add credit card');
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this credit card?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      const { error } = await supabase
        .from('credit_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state to remove the deleted card
      setCreditCards(prev => prev.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting credit card:', error);
      alert('Failed to delete credit card. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = async (id: number, cardData: Omit<CreditCard, 'id'>) => {
    setEditError(null);
    try {
      // Validate required fields
      const requiredFields = ['brand', 'card_type', 'card_name', 'recommended', 'promoted'];
      const missingFields = requiredFields.filter(field => !cardData[field as keyof typeof cardData]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Ensure JSON fields are properly formatted
      const formattedData = {
        ...cardData,
        eligibility: cardData.eligibility || {
          age: '',
          income: '',
          employment: '',
          residency: '',
          credit_score: ''
        },
        card_benefits: cardData.card_benefits || {
          travel: false,
          insurance: false,
          rewards: false
        },
        rates_and_fees: cardData.rates_and_fees || {
          annual_fee: '',
          purchase_rate: '',
          balance_transfer_rate: '',
          cash_advance_rate: ''
        },
        pros: cardData.pros || {},
        cons: cardData.cons || {},
        description: cardData.description || { summary: '' },
        reviews: cardData.reviews || {
          average_rating: 0,
          total_reviews: 0
        }
      };

      // Filter out empty string values to convert them to NULL in the database
      const filteredData = Object.fromEntries(
        Object.entries(formattedData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      );

      const { data, error } = await supabase
        .from('credit_cards')
        .update(filteredData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
      
      if (data) {
        await refreshData();
        setIsEditModalOpen(false);
        return data;
      } else {
        throw new Error('No result returned from update query');
      }
    } catch (error) {
      console.error('Error updating credit card:', error);
      setEditError(error instanceof Error ? error.message : 'Failed to update credit card');
      throw error;
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Credit Cards</h2>
          <button 
            onClick={refreshData}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            disabled={loading}
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Card
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Brand</th>
            <th className="px-4 py-2 border-b text-left">Card Type</th>
            <th className="px-4 py-2 border-b text-left">Card Name</th>
            <th className="px-4 py-2 border-b text-left">Recommended</th>
            <th className="px-4 py-2 border-b text-left">Annual Fee</th>
            <th className="px-4 py-2 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {creditCards.map((card) => (
            <tr key={card.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{card.brand}</td>
              <td className="px-4 py-2 border-b">{card.card_type}</td>
              <td className="px-4 py-2 border-b">{card.card_name}</td>
              <td className="px-4 py-2 border-b">{card.recommended}</td>
              <td className="px-4 py-2 border-b">{card.annual_fee}</td>
              <td className="px-4 py-2 border-b">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingCard(card);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedCard(card)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    disabled={deleteLoading === card.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {deleteLoading === card.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCard}
        error={addError}
      />

      {editingCard && (
        <EditCardModal
          card={editingCard}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingCard(null);
            setEditError(null);
          }}
          onEdit={handleEdit}
          error={editError}
        />
      )}
    </div>
  );
};

interface BroadbandDetailsModalProps {
  plan: Broadband;
  isOpen: boolean;
  onClose: () => void;
}

const BroadbandDetailsModal: React.FC<BroadbandDetailsModalProps> = ({ plan, isOpen, onClose }) => {
  if (!isOpen) return null;

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) {
      return '-';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  const fields = [
    { label: 'Tagline', value: plan.tagline },
    { label: 'Description', value: plan.description },
    { label: 'Data Allowance', value: plan.data_allowance },
    { label: 'Download Speed', value: plan.average_download_speed },
    { label: 'Upload Speed', value: plan.average_upload_speed },
    { label: 'Monthly Price', value: plan.price_monthly },
    { label: 'Setup Fees', value: plan.setup_fees },
    { label: 'Plan Length', value: plan.plan_length },
    { label: 'Technology Type', value: plan.technology_type },
    { label: 'Home Phone', value: plan.home_phone_included ? 'Included' : 'Not included' },
    { label: 'Call Pack Info', value: plan.call_pack_info },
    { label: 'Entertainment', value: plan.entertainment_included ? 'Included' : 'Not included' },
    { label: 'Features', value: plan.features },
    { label: 'Payment Methods', value: plan.payment_methods },
    { label: 'Logo URL', value: plan.logo_url },
    { label: 'Site Link', value: plan.site_link },
    { label: 'Konta Nibo Score', value: plan.konta_nibo_score },
    { label: 'Reviews', value: plan.reviews },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">{plan.tagline}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(({ label, value }) => (
              <div key={label} className="border-b border-gray-100 pb-4">
                <div className="font-medium text-gray-700 mb-1">{label}</div>
                <div className="text-gray-900">{renderValue(value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface EditBroadbandModalProps {
  plan: Broadband;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: number, plan: Omit<Broadband, 'id'>) => Promise<Broadband | void>;
  error?: string | null;
}

const EditBroadbandModal: React.FC<EditBroadbandModalProps> = ({ plan, isOpen, onClose, onEdit, error }) => {
  const [formData, setFormData] = useState<Omit<Broadband, 'id'>>(plan);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(plan);
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onEdit(plan.id, formData);
      if (result) {
        onClose();
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<Broadband, 'id'>, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">Edit Broadband Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technology Type</label>
              <select
                value={formData.technology_type}
                onChange={(e) => handleInputChange('technology_type', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Fiber">Fiber</option>
                <option value="Cable">Cable</option>
                <option value="ADSL">ADSL</option>
                <option value="5G">5G</option>
                <option value="4G">4G</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Allowance</label>
              <input
                type="text"
                value={formData.data_allowance}
                onChange={(e) => handleInputChange('data_allowance', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Download Speed</label>
              <input
                type="text"
                value={formData.average_download_speed}
                onChange={(e) => handleInputChange('average_download_speed', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Speed</label>
              <input
                type="text"
                value={formData.average_upload_speed}
                onChange={(e) => handleInputChange('average_upload_speed', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price</label>
              <input
                type="text"
                value={formData.price_monthly}
                onChange={(e) => handleInputChange('price_monthly', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setup Fees</label>
              <input
                type="text"
                value={formData.setup_fees}
                onChange={(e) => handleInputChange('setup_fees', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Length</label>
              <input
                type="text"
                value={formData.plan_length}
                onChange={(e) => handleInputChange('plan_length', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                value={formData.logo_url || ''}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Link</label>
              <input
                type="url"
                value={formData.site_link || ''}
                onChange={(e) => handleInputChange('site_link', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
              <textarea
                value={formData.features.join(',')}
                onChange={(e) => handleInputChange('features', e.target.value.split(',').map(f => f.trim()))}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Methods (comma-separated)</label>
              <textarea
                value={formData.payment_methods.join(',')}
                onChange={(e) => handleInputChange('payment_methods', e.target.value.split(',').map(m => m.trim()))}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Call Pack Info</label>
              <input
                type="text"
                value={formData.call_pack_info}
                onChange={(e) => handleInputChange('call_pack_info', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-8">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.recommended}
                  onChange={(e) => handleInputChange('recommended', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Recommended</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.promoted}
                  onChange={(e) => handleInputChange('promoted', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Promoted</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.home_phone_included}
                  onChange={(e) => handleInputChange('home_phone_included', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Home Phone Included</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.entertainment_included}
                  onChange={(e) => handleInputChange('entertainment_included', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Entertainment Included</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddBroadbandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: Omit<Broadband, 'id'>) => Promise<Broadband | void>;
  error?: string | null;
}

const defaultBroadbandData: Omit<Broadband, 'id'> = {
  features: [],
  description: '',
  data_allowance: '',
  average_download_speed: '',
  average_upload_speed: '',
  price_monthly: '',
  setup_fees: '',
  recommended: false,
  promoted: false,
  tagline: '',
  plan_length: '',
  home_phone_included: false,
  call_pack_info: '',
  entertainment_included: false,
  technology_type: '',
  payment_methods: [],
  logo_url: '',
  site_link: '',
  konta_nibo_score: null,
  reviews: {
    average_rating: 0,
    total_reviews: 0
  }
};

const AddBroadbandModal: React.FC<AddBroadbandModalProps> = ({ isOpen, onClose, onAdd, error }) => {
  const [formData, setFormData] = useState<Omit<Broadband, 'id'>>(defaultBroadbandData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onAdd(formData);
      if (result) {
        onClose();
        setFormData(defaultBroadbandData);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<Broadband, 'id'>, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">Add New Broadband Plan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technology Type</label>
              <select
                value={formData.technology_type}
                onChange={(e) => handleInputChange('technology_type', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Fiber">Fiber</option>
                <option value="Cable">Cable</option>
                <option value="ADSL">ADSL</option>
                <option value="5G">5G</option>
                <option value="4G">4G</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Allowance</label>
              <input
                type="text"
                value={formData.data_allowance}
                onChange={(e) => handleInputChange('data_allowance', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Download Speed</label>
              <input
                type="text"
                value={formData.average_download_speed}
                onChange={(e) => handleInputChange('average_download_speed', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Speed</label>
              <input
                type="text"
                value={formData.average_upload_speed}
                onChange={(e) => handleInputChange('average_upload_speed', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price</label>
              <input
                type="text"
                value={formData.price_monthly}
                onChange={(e) => handleInputChange('price_monthly', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setup Fees</label>
              <input
                type="text"
                value={formData.setup_fees}
                onChange={(e) => handleInputChange('setup_fees', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Length</label>
              <input
                type="text"
                value={formData.plan_length}
                onChange={(e) => handleInputChange('plan_length', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                value={formData.logo_url || ''}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Link</label>
              <input
                type="url"
                value={formData.site_link || ''}
                onChange={(e) => handleInputChange('site_link', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
              <textarea
                value={formData.features.join(',')}
                onChange={(e) => handleInputChange('features', e.target.value.split(',').map(f => f.trim()))}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Methods (comma-separated)</label>
              <textarea
                value={formData.payment_methods.join(',')}
                onChange={(e) => handleInputChange('payment_methods', e.target.value.split(',').map(m => m.trim()))}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Call Pack Info</label>
              <input
                type="text"
                value={formData.call_pack_info}
                onChange={(e) => handleInputChange('call_pack_info', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-8">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.recommended}
                  onChange={(e) => handleInputChange('recommended', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Recommended</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.promoted}
                  onChange={(e) => handleInputChange('promoted', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Promoted</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.home_phone_included}
                  onChange={(e) => handleInputChange('home_phone_included', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Home Phone Included</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.entertainment_included}
                  onChange={(e) => handleInputChange('entertainment_included', e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Entertainment Included</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BroadbandTable: React.FC = () => {
  const [broadbandPlans, setBroadbandPlans] = useState<Broadband[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Broadband | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [editingPlan, setEditingPlan] = useState<Broadband | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('broadband')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) {
        setBroadbandPlans(data);
      }
    } catch (error) {
      console.error('Error refreshing broadband plans:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  const handleAddPlan = async (planData: Omit<Broadband, 'id'>) => {
    setAddError(null);
    try {
      const filteredData = Object.fromEntries(
        Object.entries(planData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      );

      const { data, error } = await supabase
        .from('broadband')
        .insert([filteredData])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        await refreshData();
        setIsAddModalOpen(false);
        return data;
      } else {
        throw new Error('No result returned from insert query');
      }
    } catch (error) {
      console.error('Error adding broadband plan:', error);
      setAddError(error instanceof Error ? error.message : 'Failed to add broadband plan');
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    
    setDeleteLoading(id);
    try {
      const { error } = await supabase
        .from('broadband')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error('Error deleting broadband plan:', error);
      alert('Failed to delete plan');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = async (id: number, planData: Omit<Broadband, 'id'>) => {
    setEditError(null);
    try {
      const filteredData = Object.fromEntries(
        Object.entries(planData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      );

      const { data, error } = await supabase
        .from('broadband')
        .update(filteredData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        await refreshData();
        setEditingPlan(null);
        return data;
      } else {
        throw new Error('No result returned from update query');
      }
    } catch (error) {
      console.error('Error updating broadband plan:', error);
      setEditError(error instanceof Error ? error.message : 'Failed to update broadband plan');
      throw error;
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Broadband Plans</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add New Plan
          </button>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technology</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {broadbandPlans.map((plan) => (
              <tr key={plan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-20">
                      {plan.logo_url ? (
                        <img 
                          src={plan.logo_url} 
                          alt={plan.tagline}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No Logo</span>
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-gray-900">{plan.tagline}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.technology_type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ↓{plan.average_download_speed}<br/>
                  ↑{plan.average_upload_speed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.data_allowance}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.price_monthly}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {plan.promoted && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Promoted
                      </span>
                    )}
                    {plan.recommended && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Recommended
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    View More
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => setEditingPlan(plan)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(plan.id)}
                    disabled={deleteLoading === plan.id}
                  >
                    {deleteLoading === plan.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <BroadbandDetailsModal
        plan={selectedPlan!}
        isOpen={selectedPlan !== null}
        onClose={() => setSelectedPlan(null)}
      />

      <AddBroadbandModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddError(null);
        }}
        onAdd={handleAddPlan}
        error={addError}
      />

      {editingPlan && (
        <EditBroadbandModal
          plan={editingPlan}
          isOpen={true}
          onClose={() => {
            setEditingPlan(null);
            setEditError(null);
          }}
          onEdit={handleEdit}
          error={editError}
        />
      )}
    </div>
  );
};

interface MobilePaymentDetailsModalProps {
  payment: MobilePayment;
  isOpen: boolean;
  onClose: () => void;
}

const MobilePaymentDetailsModal: React.FC<MobilePaymentDetailsModalProps> = ({ payment, isOpen, onClose }) => {
  if (!isOpen) return null;

  const renderJsonValue = (value: unknown) => {
    if (!value) return '-';
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return (
        <pre className="bg-gray-50 p-2 rounded text-sm">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch {
      return String(value);
    }
  };

  const fields = [
    { label: 'Name', value: payment.name },
    { label: 'Features', value: payment.features },
    { label: 'Cash Out Fee', value: payment.cash_out_fee },
    { label: 'Utility Bills Fee', value: payment.utility_bills_fee },
    { label: 'Credit Card Payment Fees', value: payment.credit_card_payment_fees },
    { label: 'Digital to Bank Fees', value: payment.digital_to_bank_fees },
    { label: 'Apps Available', value: payment.apps_available },
    { label: 'Description', value: payment.description },
    { label: 'Eligibility', value: payment.eligibility },
    { label: 'Transfer Fees', value: payment.transfer_fees },
    { label: 'International Remittance', value: payment.international_remittance },
    { label: 'Konta Nibo Score', value: payment.konta_nibo_score },
    { label: 'Reviews', value: payment.reviews },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">{payment.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 gap-6">
            {fields.map(({ label, value }) => (
              <div key={label} className="border-b border-gray-100 pb-4">
                <div className="font-medium text-gray-700 mb-1">{label}</div>
                <div className="text-gray-900">{renderJsonValue(value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddEditMobilePaymentModalProps {
  payment?: MobilePayment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payment: Omit<MobilePayment, 'id'>) => Promise<MobilePayment | void>;
  error?: string | null;
  mode: 'add' | 'edit';
}

const defaultMobilePaymentData: Omit<MobilePayment, 'id'> = {
  name: '',
  features: [],
  cash_out_fee: '',
  utility_bills_fee: '',
  credit_card_payment_fees: '',
  digital_to_bank_fees: {},
  apps_available: [],
  description: {},
  eligibility: {},
  transfer_fees: {},
  international_remittance: {},
  image_url: '',
  site_link: '',
  konta_nibo_score: null,
  reviews: {
    average_rating: 0,
    total_reviews: 0
  }
};

const AddEditMobilePaymentModal: React.FC<AddEditMobilePaymentModalProps> = ({ 
  payment, 
  isOpen, 
  onClose, 
  onSubmit, 
  error, 
  mode 
}) => {
  const [formData, setFormData] = useState<Omit<MobilePayment, 'id'>>(
    mode === 'edit' && payment ? payment : defaultMobilePaymentData
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await onSubmit(formData);
      if (result) {
        onClose();
        if (mode === 'add') {
          setFormData(defaultMobilePaymentData);
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<MobilePayment, 'id'>, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleJsonInputChange = (field: keyof Omit<MobilePayment, 'id'>, value: string) => {
    try {
      const parsedValue = JSON.parse(value);
      handleInputChange(field, parsedValue);
    } catch {
      // If JSON is invalid, store as string
      handleInputChange(field, value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">
            {mode === 'add' ? 'Add New Mobile Payment' : 'Edit Mobile Payment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (JSON array)</label>
              <textarea
                value={JSON.stringify(formData.features, null, 2)}
                onChange={(e) => handleJsonInputChange('features', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cash Out Fee</label>
              <input
                type="text"
                value={formData.cash_out_fee}
                onChange={(e) => handleInputChange('cash_out_fee', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Utility Bills Fee</label>
              <input
                type="text"
                value={formData.utility_bills_fee}
                onChange={(e) => handleInputChange('utility_bills_fee', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credit Card Payment Fees</label>
              <input
                type="text"
                value={formData.credit_card_payment_fees}
                onChange={(e) => handleInputChange('credit_card_payment_fees', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Digital to Bank Fees (JSON)</label>
              <textarea
                value={JSON.stringify(formData.digital_to_bank_fees, null, 2)}
                onChange={(e) => handleJsonInputChange('digital_to_bank_fees', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apps Available (JSON array)</label>
              <textarea
                value={JSON.stringify(formData.apps_available, null, 2)}
                onChange={(e) => handleJsonInputChange('apps_available', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (JSON)</label>
              <textarea
                value={JSON.stringify(formData.description, null, 2)}
                onChange={(e) => handleJsonInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility (JSON)</label>
              <textarea
                value={JSON.stringify(formData.eligibility, null, 2)}
                onChange={(e) => handleJsonInputChange('eligibility', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image_url || ''}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Link</label>
              <input
                type="url"
                value={formData.site_link || ''}
                onChange={(e) => handleInputChange('site_link', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konta Nibo Score (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.konta_nibo_score || ''}
                onChange={(e) => handleInputChange('konta_nibo_score', parseFloat(e.target.value) || null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (mode === 'add' ? 'Add Payment' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MobilePaymentTable: React.FC = () => {
  const [payments, setPayments] = useState<MobilePayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<MobilePayment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<MobilePayment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const refreshData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mobile_payment')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      if (data) {
        setPayments(data);
      }
    } catch (error) {
      console.error('Error refreshing mobile payments:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  const handleAdd = async (paymentData: Omit<MobilePayment, 'id'>) => {
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mobile_payment')
        .insert([paymentData])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        await refreshData();
        setIsAddModalOpen(false);
        return data;
      } else {
        throw new Error('No result returned from insert query');
      }
    } catch (error) {
      console.error('Error adding mobile payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to add mobile payment');
      throw error;
    }
  };

  const handleEdit = async (id: number, paymentData: Omit<MobilePayment, 'id'>) => {
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mobile_payment')
        .update(paymentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        await refreshData();
        setEditingPayment(null);
        return data;
      } else {
        throw new Error('No result returned from update query');
      }
    } catch (error) {
      console.error('Error updating mobile payment:', error);
      setError(error instanceof Error ? error.message : 'Failed to update mobile payment');
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) return;
    
    setDeleteLoading(id);
    try {
      const { error } = await supabase
        .from('mobile_payment')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error('Error deleting mobile payment:', error);
      alert('Failed to delete payment method');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Mobile Payment Methods</h2>
          <button 
            onClick={refreshData}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            disabled={loading}
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Payment Method
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash Out Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utility Bills Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16">
                      {payment.image_url ? (
                        <img 
                          src={payment.image_url} 
                          alt={payment.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No Logo</span>
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-gray-900">{payment.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    {payment.features && payment.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="text-sm text-gray-500 truncate">• {feature}</div>
                    ))}
                    {payment.features && payment.features.length > 2 && (
                      <div className="text-sm text-gray-400">+ {payment.features.length - 2} more</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.cash_out_fee}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.utility_bills_fee}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.konta_nibo_score !== null ? payment.konta_nibo_score.toFixed(1) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    View More
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => setEditingPayment(payment)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(payment.id)}
                    disabled={deleteLoading === payment.id}
                  >
                    {deleteLoading === payment.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <MobilePaymentDetailsModal
        payment={selectedPayment!}
        isOpen={selectedPayment !== null}
        onClose={() => setSelectedPayment(null)}
      />

      <AddEditMobilePaymentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setError(null);
        }}
        onSubmit={handleAdd}
        error={error}
        mode="add"
      />

      {editingPayment && (
        <AddEditMobilePaymentModal
          payment={editingPayment}
          isOpen={true}
          onClose={() => {
            setEditingPayment(null);
            setError(null);
          }}
          onSubmit={(data) => handleEdit(editingPayment.id, data)}
          error={error}
          mode="edit"
        />
      )}
    </div>
  );
};

const HomeLoanTable: React.FC = () => {
  const [homeLoans, setHomeLoans] = useState<HomeLoan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<HomeLoan | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editingLoan, setEditingLoan] = useState<HomeLoan | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homeloans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setHomeLoans(data);
      }
    } catch (error) {
      console.error('Error refreshing home loans:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  const handleAddLoan = async (loanData: Omit<HomeLoan, 'id'>) => {
    setAddError(null);
    try {
      const filteredData = Object.fromEntries(
        Object.entries(loanData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      );

      const { data, error } = await supabase
        .from('homeloans')
        .insert([filteredData])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        await refreshData();
        setIsAddModalOpen(false);
        return data;
      } else {
        throw new Error('No result returned from insert query');
      }
    } catch (error) {
      console.error('Error adding home loan:', error);
      setAddError(error instanceof Error ? error.message : 'Failed to add home loan');
      throw error;
    }
  };

  const handleEdit = async (id: string, loanData: Partial<HomeLoan>) => {
    setEditError(null);
    try {
      const filteredData = Object.fromEntries(
        Object.entries(loanData).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      );

      const { data, error } = await supabase
        .from('homeloans')
        .update(filteredData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        await refreshData();
        setEditingLoan(null);
        return data;
      } else {
        throw new Error('No result returned from update query');
      }
    } catch (error) {
      console.error('Error updating home loan:', error);
      setEditError(error instanceof Error ? error.message : 'Failed to update home loan');
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this home loan?')) return;
    
    setDeleteLoading(id);
    try {
      const { error } = await supabase
        .from('homeloans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error('Error deleting home loan:', error);
      alert('Failed to delete home loan');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Home Loans</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add New Loan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comparison Rate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {homeLoans.map((loan) => (
              <tr key={loan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-20">
                      {loan.logo_image_link ? (
                        <img 
                          src={loan.logo_image_link} 
                          alt={`${loan.brand} ${loan.name}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No Logo</span>
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-gray-900">{loan.brand}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {loan.interest_rate_pa ? `${loan.interest_rate_pa}%` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {loan.comparison_rate_pa ? `${loan.comparison_rate_pa}%` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    {loan.promoted && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Promoted
                      </span>
                    )}
                    {loan.recommended && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Recommended
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => setSelectedLoan(loan)}
                  >
                    View More
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => setEditingLoan(loan)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(loan.id)}
                    disabled={deleteLoading === loan.id}
                  >
                    {deleteLoading === loan.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedLoan && (
        <HomeLoanDetailsModal
          loan={selectedLoan}
          isOpen={true}
          onClose={() => setSelectedLoan(null)}
        />
      )}

      <AddHomeLoanModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setAddError(null);
        }}
        onAdd={handleAddLoan}
        error={addError}
      />

      {editingLoan && (
        <EditHomeLoanModal
          loan={editingLoan}
          isOpen={true}
          onClose={() => {
            setEditingLoan(null);
            setEditError(null);
          }}
          onEdit={handleEdit}
          error={editError}
        />
      )}
    </div>
  );
};

interface HomeLoanDetailsModalProps {
  loan: HomeLoan;
  isOpen: boolean;
  onClose: () => void;
}

const HomeLoanDetailsModal: React.FC<HomeLoanDetailsModalProps> = ({ loan, isOpen, onClose }) => {
  if (!isOpen) return null;

  const renderJsonValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) {
      return '-';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number' && (
      ['interest_rate_pa', 'comparison_rate_pa', 'max_lvr', 'score'].includes(field.key)
    )) {
      return `${value}%`;
    }
    if (typeof value === 'number' && [
      'min_loan_amount', 'max_loan_amount', 'minimum_deposit',
      'processing_fee', 'early_partial_settlement_fee', 'application_fee',
      'lenders_legal_fee', 'valuation_fee', 'ongoing_fees',
      'settlement_fee', 'discharge_fee'
    ].includes(field.key)) {
      return `$${value.toLocaleString()}`;
    }
    return String(value);
  };

  const fields = [
    { key: 'brand', label: 'Brand' },
    { key: 'name', label: 'Loan Name' },
    { key: 'interest_rate_type', label: 'Interest Rate Type' },
    { key: 'interest_rate_pa', label: 'Interest Rate (p.a.)' },
    { key: 'comparison_rate_pa', label: 'Comparison Rate (p.a.)' },
    { key: 'fees', label: 'Fees' },
    { key: 'recommended', label: 'Recommended' },
    { key: 'promoted', label: 'Promoted' },
    { key: 'minimum_deposit', label: 'Minimum Deposit' },
    { key: 'extras', label: 'Extras' },
    { key: 'offers', label: 'Offers' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'min_loan_amount', label: 'Minimum Loan Amount' },
    { key: 'max_loan_amount', label: 'Maximum Loan Amount' },
    { key: 'max_loan_term', label: 'Maximum Loan Term (years)' },
    { key: 'max_lvr', label: 'Maximum LVR' },
    { key: 'loan_redraw_facility', label: 'Loan Redraw Facility' },
    { key: 'processing_fee', label: 'Processing Fee' },
    { key: 'offset_account', label: 'Offset Account' },
    { key: 'eligibility', label: 'Eligibility' },
    { key: 'split_loan_facility', label: 'Split Loan Facility' },
    { key: 'fixed_interest_option', label: 'Fixed Interest Option' },
    { key: 'extra_repayments', label: 'Extra Repayments' },
    { key: 'features', label: 'Features' },
    { key: 'early_partial_settlement_fee', label: 'Early/Partial Settlement Fee' },
    { key: 'application_fee', label: 'Application Fee' },
    { key: 'lenders_legal_fee', label: 'Lender\'s Legal Fee' },
    { key: 'valuation_fee', label: 'Valuation Fee' },
    { key: 'ongoing_fees', label: 'Ongoing Fees' },
    { key: 'settlement_fee', label: 'Settlement Fee' },
    { key: 'discharge_fee', label: 'Discharge Fee' },
    { key: 'pros', label: 'Pros' },
    { key: 'cons', label: 'Cons' },
    { key: 'who_can_apply', label: 'Who Can Apply' },
    { key: 'score', label: 'Score' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'logo_image_link', label: 'Logo Image Link' },
    { key: 'visit_site_link', label: 'Visit Site Link' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">{loan.name} by {loan.brand}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(field => (
              <div key={field.key} className="border-b border-gray-100 pb-4">
                <div className="font-medium text-gray-700 mb-1">{field.label}</div>
                <div className="text-gray-900">
                  {renderJsonValue(loan[field.key as keyof HomeLoan])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddHomeLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (loan: Omit<HomeLoan, 'id'>) => Promise<HomeLoan | void>;
  error?: string | null;
}

const AddHomeLoanModal: React.FC<AddHomeLoanModalProps> = ({ isOpen, onClose, onAdd, error }) => {
  const [formData, setFormData] = useState<Omit<HomeLoan, 'id'>>({
    brand: '',
    name: '',
    interest_rate_type: '',
    interest_rate_pa: null,
    comparison_rate_pa: null,
    fees: null,
    recommended: false,
    promoted: false,
    minimum_deposit: null,
    extras: null,
    offers: null,
    tagline: null,
    min_loan_amount: null,
    max_loan_amount: null,
    max_loan_term: null,
    max_lvr: null,
    loan_redraw_facility: false,
    processing_fee: null,
    offset_account: false,
    eligibility: null,
    split_loan_facility: false,
    fixed_interest_option: false,
    extra_repayments: false,
    features: null,
    early_partial_settlement_fee: null,
    application_fee: null,
    lenders_legal_fee: null,
    valuation_fee: null,
    ongoing_fees: null,
    settlement_fee: null,
    discharge_fee: null,
    pros: null,
    cons: null,
    who_can_apply: null,
    score: null,
    reviews: null,
    logo_image_link: null,
    visit_site_link: null
  });

  const handleInputChange = (field: keyof HomeLoan, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(formData);
    } catch (error) {
      // Error is handled by parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">Add New Home Loan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate Type</label>
              <select
                value={formData.interest_rate_type}
                onChange={(e) => handleInputChange('interest_rate_type', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="Variable">Variable</option>
                <option value="Fixed">Fixed</option>
                <option value="Split">Split</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (p.a.)</label>
              <input
                type="number"
                step="0.01"
                value={formData.interest_rate_pa || ''}
                onChange={(e) => handleInputChange('interest_rate_pa', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comparison Rate (p.a.)</label>
              <input
                type="number"
                step="0.01"
                value={formData.comparison_rate_pa || ''}
                onChange={(e) => handleInputChange('comparison_rate_pa', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Deposit</label>
              <input
                type="number"
                value={formData.minimum_deposit || ''}
                onChange={(e) => handleInputChange('minimum_deposit', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              <textarea
                value={formData.features || ''}
                onChange={(e) => handleInputChange('features', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
              <textarea
                value={formData.eligibility || ''}
                onChange={(e) => handleInputChange('eligibility', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.recommended}
                    onChange={(e) => handleInputChange('recommended', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Recommended</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.promoted}
                    onChange={(e) => handleInputChange('promoted', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Promoted</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.loan_redraw_facility}
                    onChange={(e) => handleInputChange('loan_redraw_facility', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Loan Redraw Facility</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.offset_account}
                    onChange={(e) => handleInputChange('offset_account', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Offset Account</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.split_loan_facility}
                    onChange={(e) => handleInputChange('split_loan_facility', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Split Loan Facility</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.fixed_interest_option}
                    onChange={(e) => handleInputChange('fixed_interest_option', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Fixed Interest Option</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.extra_repayments}
                    onChange={(e) => handleInputChange('extra_repayments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Extra Repayments</label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Add Home Loan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditHomeLoanModalProps {
  loan: HomeLoan;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string, loan: Partial<HomeLoan>) => Promise<HomeLoan | void>;
  error?: string | null;
}

const EditHomeLoanModal: React.FC<EditHomeLoanModalProps> = ({ loan, isOpen, onClose, onEdit, error }) => {
  const [formData, setFormData] = useState<HomeLoan>({...loan});

  const handleInputChange = (field: keyof HomeLoan, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onEdit(loan.id, formData);
    } catch (error) {
      // Error is handled by parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold">Edit Home Loan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate Type</label>
              <select
                value={formData.interest_rate_type}
                onChange={(e) => handleInputChange('interest_rate_type', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="Variable">Variable</option>
                <option value="Fixed">Fixed</option>
                <option value="Split">Split</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (p.a.)</label>
              <input
                type="number"
                step="0.01"
                value={formData.interest_rate_pa || ''}
                onChange={(e) => handleInputChange('interest_rate_pa', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comparison Rate (p.a.)</label>
              <input
                type="number"
                step="0.01"
                value={formData.comparison_rate_pa || ''}
                onChange={(e) => handleInputChange('comparison_rate_pa', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Deposit</label>
              <input
                type="number"
                value={formData.minimum_deposit || ''}
                onChange={(e) => handleInputChange('minimum_deposit', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              <textarea
                value={formData.features || ''}
                onChange={(e) => handleInputChange('features', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
              <textarea
                value={formData.eligibility || ''}
                onChange={(e) => handleInputChange('eligibility', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.recommended}
                    onChange={(e) => handleInputChange('recommended', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Recommended</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.promoted}
                    onChange={(e) => handleInputChange('promoted', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Promoted</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.loan_redraw_facility}
                    onChange={(e) => handleInputChange('loan_redraw_facility', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Loan Redraw Facility</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.offset_account}
                    onChange={(e) => handleInputChange('offset_account', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Offset Account</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.split_loan_facility}
                    onChange={(e) => handleInputChange('split_loan_facility', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Split Loan Facility</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.fixed_interest_option}
                    onChange={(e) => handleInputChange('fixed_interest_option', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Fixed Interest Option</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.extra_repayments}
                    onChange={(e) => handleInputChange('extra_repayments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Extra Repayments</label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BankAccountTable: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const refreshData = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      if (data) {
        setBankAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch bank accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bank account?')) return;
    
    setDeleteLoading(id);
    try {
      const { error: deleteError } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await refreshData();
    } catch (error) {
      console.error('Error deleting bank account:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete bank account');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleAdd = async (accountData: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>) => {
    setError(null);
    try {
      const { data, error: addError } = await supabase
        .from('bank_accounts')
        .insert([accountData])
        .select()
        .single();

      if (addError) throw addError;
      await refreshData();
      setIsAddModalOpen(false);
      return data;
    } catch (error) {
      console.error('Error adding bank account:', error);
      setError(error instanceof Error ? error.message : 'Failed to add bank account');
      throw error;
    }
  };

  const handleEdit = async (id: string, accountData: Partial<BankAccount>) => {
    setError(null);
    try {
      const { data, error: editError } = await supabase
        .from('bank_accounts')
        .update(accountData)
        .eq('id', id)
        .select()
        .single();

      if (editError) throw editError;
      await refreshData();
      setIsEditModalOpen(false);
      setEditingAccount(null);
      return data;
    } catch (error) {
      console.error('Error updating bank account:', error);
      setError(error instanceof Error ? error.message : 'Failed to update bank account');
      throw error;
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Bank Accounts</h2>
          <button
            onClick={refreshData}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            disabled={loading}
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Account
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bankAccounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16">
                      {account.logo_url ? (
                        <img 
                          src={account.logo_url} 
                          alt={account.brand}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No Logo</span>
                        </div>
                      )}
                    </div>
                    <div className="font-medium text-gray-900">{account.brand}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.product_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.monthly_fee ? `$${account.monthly_fee}` : 'Free'}
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    {account.features && account.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="text-sm text-gray-500 truncate">• {feature}</div>
                    ))}
                    {account.features && account.features.length > 2 && (
                      <div className="text-sm text-gray-400">+ {account.features.length - 2} more</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {account.score !== null ? account.score : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => setSelectedAccount(account)}
                  >
                    View
                  </button>
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => {
                      setEditingAccount(account);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(account.id)}
                    disabled={deleteLoading === account.id}
                  >
                    {deleteLoading === account.id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedAccount && (
        <BankAccountDetailsModal
          account={selectedAccount}
          isOpen={true}
          onClose={() => setSelectedAccount(null)}
        />
      )}

      <AddBankAccountModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setError(null);
        }}
        onAdd={handleAdd}
        error={error}
      />

      {editingAccount && (
        <EditBankAccountModal
          account={editingAccount}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingAccount(null);
            setError(null);
          }}
          onEdit={(data) => handleEdit(editingAccount.id, data)}
          error={error}
        />
      )}
    </div>
  );
};

interface BankAccountDetailsModalProps {
  account: BankAccount;
  isOpen: boolean;
  onClose: () => void;
}

const BankAccountDetailsModal: React.FC<BankAccountDetailsModalProps> = ({ account, isOpen, onClose }) => {
  if (!isOpen) return null;

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) {
      return '-';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return String(value);
  };

  const fields = [
    { label: 'Brand', value: account.brand },
    { label: 'Product Name', value: account.product_name },
    { label: 'Monthly Fee', value: account.monthly_fee ? `$${account.monthly_fee}` : 'Free' },
    { label: 'Non-Bank ATM Fee', value: account.non_bank_atm_fee ? `$${account.non_bank_atm_fee}` : 'Free' },
    { label: 'Debit Card Options', value: account.debit_card_options },
    { label: 'Minimum Deposit Required', value: account.minimum_deposit_required ? `$${account.minimum_deposit_required}` : '-' },
    { label: 'Account Fee', value: account.account_fee ? `$${account.account_fee}` : 'Free' },
    { label: 'Maximum Withdrawal', value: account.max_withdrawal ? `$${account.max_withdrawal}` : '-' },
    { label: 'Cheque Book Fee', value: account.cheque_book_fee ? `$${account.cheque_book_fee}` : 'Free' },
    { label: 'Online Banking', value: account.online_banking },
    { label: 'Discounts on Retailers', value: account.discounts_on_retailers },
    { label: 'Entertainment', value: account.entertainment },
    { label: 'eKYC Enabled', value: account.ekyc_enabled },
    { label: 'Score', value: account.score },
    { label: 'Internet Banking Score', value: account.internet_banking_score },
    { label: 'Reviews', value: account.reviews },
    { label: 'Features', value: account.features },
    { label: 'Savings Account', value: account.savings_account },
    { label: 'Eligibility', value: account.eligibility },
    { label: 'Visit Site URL', value: account.visit_site_url },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{account.brand} - {account.product_name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(({ label, value }) => (
              <div key={label} className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="text-sm text-gray-900">{renderValue(value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (account: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  error?: string | null;
}

const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({ isOpen, onClose, onAdd, error }) => {
  const [formData, setFormData] = useState<Partial<BankAccount>>({
    brand: '',
    product_name: '',
    monthly_fee: null,
    non_bank_atm_fee: null,
    debit_card_options: null,
    minimum_deposit_required: null,
    account_fee: null,
    max_withdrawal: null,
    cheque_book_fee: null,
    online_banking: false,
    discounts_on_retailers: false,
    entertainment: false,
    ekyc_enabled: false,
    score: null,
    internet_banking_score: null,
    reviews: null,
    logo_url: null,
    eligibility: null,
    visit_site_url: null,
    features: [],
    savings_account: false,
  });

  const handleInputChange = (field: keyof BankAccount, value: string | boolean | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeaturesChange = (value: string) => {
    const features = value.split(',').map(f => f.trim()).filter(f => f);
    setFormData(prev => ({
      ...prev,
      features
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdd(formData as Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>);
    } catch (err: unknown) {
      // Error is handled by parent component
      console.error('Error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add New Bank Account</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={formData.product_name || ''}
                onChange={(e) => handleInputChange('product_name', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee</label>
              <input
                type="number"
                step="0.01"
                value={formData.monthly_fee || ''}
                onChange={(e) => handleInputChange('monthly_fee', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
              <input
                type="text"
                value={formData.features?.join(', ') || ''}
                onChange={(e) => handleFeaturesChange(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
              <input
                type="number"
                value={formData.score || ''}
                onChange={(e) => handleInputChange('score', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                value={formData.logo_url || ''}
                onChange={(e) => handleInputChange('logo_url', e.target.value || null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Site URL</label>
              <input
                type="url"
                value={formData.visit_site_url || ''}
                onChange={(e) => handleInputChange('visit_site_url', e.target.value || null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
              <textarea
                value={formData.eligibility || ''}
                onChange={(e) => handleInputChange('eligibility', e.target.value || null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.online_banking || false}
                  onChange={(e) => handleInputChange('online_banking', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Online Banking</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.savings_account || false}
                  onChange={(e) => handleInputChange('savings_account', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Savings Account</span>
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditBankAccountModalProps {
  account: BankAccount;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (data: Partial<BankAccount>) => Promise<void>;
  error?: string | null;
}

const EditBankAccountModal: React.FC<EditBankAccountModalProps> = ({ account, isOpen, onClose, onEdit, error }) => {
  const [formData, setFormData] = useState<Partial<BankAccount>>(account);

  useEffect(() => {
    setFormData(account);
  }, [account]);

  const handleInputChange = (field: keyof BankAccount, value: string | boolean | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeaturesChange = (value: string) => {
    const features = value.split(',').map(f => f.trim()).filter(f => f);
    setFormData(prev => ({
      ...prev,
      features
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onEdit(formData);
    } catch (error) {
      // Error is handled by parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Bank Account</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={formData.product_name || ''}
                onChange={(e) => handleInputChange('product_name', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee</label>
              <input
                type="number"
                step="0.01"
                value={formData.monthly_fee || ''}
                onChange={(e) => handleInputChange('monthly_fee', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
              <input
                type="text"
                value={formData.features?.join(', ') || ''}
                onChange={(e) => handleFeaturesChange(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
              <input
                type="number"
                value={formData.score || ''}
                onChange={(e) => handleInputChange('score', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                value={formData.logo_url || ''}
                onChange={(e) => handleInputChange('logo_url', e.target.value || null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Site URL</label>
              <input
                type="url"
                value={formData.visit_site_url || ''}
                onChange={(e) => handleInputChange('visit_site_url', e.target.value || null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
              <textarea
                value={formData.eligibility || ''}
                onChange={(e) => handleInputChange('eligibility', e.target.value || null)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.online_banking || false}
                  onChange={(e) => handleInputChange('online_banking', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Online Banking</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.savings_account || false}
                  onChange={(e) => handleInputChange('savings_account', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Savings Account</span>
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SavingsAccountModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SavingsAccount>) => Promise<void>;
  initialData?: Partial<SavingsAccount>;
  mode: 'add' | 'edit';
}> = ({ isOpen, onClose, onSubmit, initialData, mode }) => {
  const [formData, setFormData] = useState<Partial<SavingsAccount>>(initialData || defaultSavingsAccount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(initialData || defaultSavingsAccount);
  }, [initialData, isOpen]);

  const handleChange = (field: keyof SavingsAccount, value: string | number | boolean | null | string[] | { average_rating?: number; total_reviews?: number; } | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof Pick<SavingsAccount, 'features' | 'pros' | 'cons' | 'eligibility' | 'required_documents'>, value: string) => {
    try {
      const arrayValue = value.split(',').map(item => item.trim());
      handleChange(field, arrayValue);
    } catch (e) {
      console.error('Error parsing array input:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (e) {
      console.error('Error submitting form:', e);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6 my-8">
        <h2 className="text-xl font-bold mb-4">{mode === 'add' ? 'Add' : 'Edit'} Savings Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Brand</label>
              <input type="text" value={formData.brand || ''} onChange={e => handleChange('brand', e.target.value)} className="w-full border rounded px-2 py-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input type="text" value={formData.product_name || ''} onChange={e => handleChange('product_name', e.target.value)} className="w-full border rounded px-2 py-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Max Variable Rate (% p.a.)</label>
              <input type="number" step="0.01" value={formData.max_variable_rate_pa ?? ''} onChange={e => handleChange('max_variable_rate_pa', e.target.value ? parseFloat(e.target.value) : null)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Interest Rate (% p.a.)</label>
              <input type="number" step="0.01" value={formData.interest_rate ?? ''} onChange={e => handleChange('interest_rate', e.target.value ? parseFloat(e.target.value) : null)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Monthly Maximum Rate Conditions</label>
              <textarea value={formData.monthly_maximum_rate_conditions || ''} onChange={e => handleChange('monthly_maximum_rate_conditions', e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Minimum Deposit</label>
              <input type="number" step="0.01" value={formData.minimum_deposit ?? ''} onChange={e => handleChange('minimum_deposit', e.target.value ? parseFloat(e.target.value) : null)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Cheque Book Fee</label>
              <input type="number" step="0.01" value={formData.cheque_book_fee ?? ''} onChange={e => handleChange('cheque_book_fee', e.target.value ? parseFloat(e.target.value) : null)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Account Fee</label>
              <input type="number" step="0.01" value={formData.account_fee ?? ''} onChange={e => handleChange('account_fee', e.target.value ? parseFloat(e.target.value) : null)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Tagline</label>
              <input type="text" value={formData.tagline || ''} onChange={e => handleChange('tagline', e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Score</label>
              <input type="number" step="0.1" value={formData.score ?? ''} onChange={e => handleChange('score', e.target.value ? parseFloat(e.target.value) : null)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Logo URL</label>
              <input type="url" value={formData.logo_url || ''} onChange={e => handleChange('logo_url', e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Visit Site Link</label>
              <input type="url" value={formData.visit_site_link || ''} onChange={e => handleChange('visit_site_link', e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Features (comma-separated)</label>
              <textarea value={formData.features?.join(', ') || ''} onChange={e => handleArrayChange('features', e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Pros (comma-separated)</label>
              <textarea value={formData.pros?.join(', ') || ''} onChange={e => handleArrayChange('pros', e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Cons (comma-separated)</label>
              <textarea value={formData.cons?.join(', ') || ''} onChange={e => handleArrayChange('cons', e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Eligibility (comma-separated)</label>
              <textarea value={formData.eligibility?.join(', ') || ''} onChange={e => handleArrayChange('eligibility', e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Required Documents (comma-separated)</label>
              <textarea value={formData.required_documents?.join(', ') || ''} onChange={e => handleArrayChange('required_documents', e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.recommended || false} onChange={e => handleChange('recommended', e.target.checked)} className="form-checkbox" />
                  <span className="text-sm font-medium">Recommended</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.ekyc_enabled || false} onChange={e => handleChange('ekyc_enabled', e.target.checked)} className="form-checkbox" />
                  <span className="text-sm font-medium">eKYC Enabled</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.internet_banking || false} onChange={e => handleChange('internet_banking', e.target.checked)} className="form-checkbox" />
                  <span className="text-sm font-medium">Internet Banking</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.debit_card_facility || false} onChange={e => handleChange('debit_card_facility', e.target.checked)} className="form-checkbox" />
                  <span className="text-sm font-medium">Debit Card Facility</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? 'Saving...' : (mode === 'add' ? 'Add' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SavingsAccountTable: React.FC = () => {
  const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<SavingsAccount | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('savings_accounts').select('*').order('created_at', { ascending: false });
    if (!error && data) setAccounts(data);
    setLoading(false);
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleAdd = async (data: Partial<SavingsAccount>) => {
    const { error } = await supabase.from('savings_accounts').insert([data]);
    if (!error) {
      setModalOpen(false);
      fetchAccounts();
    } else {
      console.error('Error adding savings account:', error);
    }
  };

  const handleEdit = async (data: Partial<SavingsAccount>) => {
    if (!editAccount?.id) return;
    const { error } = await supabase.from('savings_accounts').update(data).eq('id', editAccount.id);
    if (!error) {
      setEditAccount(null);
      fetchAccounts();
    } else {
      console.error('Error updating savings account:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this savings account?')) {
      const { error } = await supabase.from('savings_accounts').delete().eq('id', id);
      if (!error) {
        fetchAccounts();
      } else {
        console.error('Error deleting savings account:', error);
      }
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return '-';
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value == null) return '-';
    return `${value}%`;
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Savings Accounts</h2>
        <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New</button>
      </div>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Brand</th>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Interest Rate</th>
                <th className="px-4 py-2 text-left">Max Variable Rate</th>
                <th className="px-4 py-2 text-left">Min. Deposit</th>
                <th className="px-4 py-2 text-left">Account Fee</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Features</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{acc.brand}</td>
                  <td className="px-4 py-2">{acc.product_name}</td>
                  <td className="px-4 py-2">{formatPercentage(acc.interest_rate)}</td>
                  <td className="px-4 py-2">{formatPercentage(acc.max_variable_rate_pa)}</td>
                  <td className="px-4 py-2">{formatCurrency(acc.minimum_deposit)}</td>
                  <td className="px-4 py-2">{formatCurrency(acc.account_fee)}</td>
                  <td className="px-4 py-2">{acc.score ?? '-'}</td>
                  <td className="px-4 py-2">
                    {acc.features?.length ? (
                      <span className="text-sm text-gray-600">{acc.features.length} features</span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button 
                      onClick={() => { setSelectedAccount(acc); setShowDetailsModal(true); }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => setEditAccount(acc)}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(acc.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <SavingsAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdd}
        mode="add"
      />
      
      {editAccount && (
        <SavingsAccountModal
          isOpen={!!editAccount}
          onClose={() => setEditAccount(null)}
          onSubmit={handleEdit}
          initialData={editAccount}
          mode="edit"
        />
      )}

      {selectedAccount && showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-11/12 max-w-4xl p-6 my-8">
            <h2 className="text-xl font-bold mb-4">Savings Account Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Basic Information</h3>
                <div className="space-y-2 mt-2">
                  <p><span className="font-medium">Brand:</span> {selectedAccount.brand}</p>
                  <p><span className="font-medium">Product Name:</span> {selectedAccount.product_name}</p>
                  <p><span className="font-medium">Interest Rate:</span> {formatPercentage(selectedAccount.interest_rate)}</p>
                  <p><span className="font-medium">Max Variable Rate:</span> {formatPercentage(selectedAccount.max_variable_rate_pa)}</p>
                  <p><span className="font-medium">Monthly Rate Conditions:</span> {selectedAccount.monthly_maximum_rate_conditions || '-'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Fees & Requirements</h3>
                <div className="space-y-2 mt-2">
                  <p><span className="font-medium">Minimum Deposit:</span> {formatCurrency(selectedAccount.minimum_deposit)}</p>
                  <p><span className="font-medium">Account Fee:</span> {formatCurrency(selectedAccount.account_fee)}</p>
                  <p><span className="font-medium">Cheque Book Fee:</span> {formatCurrency(selectedAccount.cheque_book_fee)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Features & Benefits</h3>
                <div className="space-y-2 mt-2">
                  <p><span className="font-medium">Features:</span></p>
                  <ul className="list-disc pl-5">
                    {selectedAccount.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Pros & Cons</h3>
                <div className="space-y-2 mt-2">
                  <p><span className="font-medium">Pros:</span></p>
                  <ul className="list-disc pl-5 text-green-600">
                    {selectedAccount.pros?.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                  <p><span className="font-medium">Cons:</span></p>
                  <ul className="list-disc pl-5 text-red-600">
                    {selectedAccount.cons?.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Additional Information</h3>
                <div className="space-y-2 mt-2">
                  <p><span className="font-medium">Score:</span> {selectedAccount.score ?? '-'}</p>
                  <p><span className="font-medium">Recommended:</span> {selectedAccount.recommended ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Internet Banking:</span> {selectedAccount.internet_banking ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Debit Card Facility:</span> {selectedAccount.debit_card_facility ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">eKYC Enabled:</span> {selectedAccount.ekyc_enabled ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPortalPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(TABS[0]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 pt-12">
      <h1 className="text-3xl font-bold mb-8">Admin Portal</h1>
      <div className="w-full max-w-7xl px-4">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-300">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium rounded-t transition-colors focus:outline-none ${
                selectedTab === tab 
                  ? 'bg-white border-x border-t border-gray-300 text-blue-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-white p-8 rounded shadow">
          {selectedTab === 'Credit cards' ? (
            <CreditCardsTable />
          ) : selectedTab === 'Mobile payments' ? (
            <MobilePaymentTable />
          ) : selectedTab === 'Broadband' ? (
            <BroadbandTable />
          ) : selectedTab === 'Home loans' ? (
            <HomeLoanTable />
          ) : selectedTab === 'Bank accounts' ? (
            <BankAccountTable />
          ) : selectedTab === 'Savings accounts' ? (
            <SavingsAccountTable />
          ) : selectedTab === 'Mobile plans' ? (
            <MobilePlansTable />
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">{selectedTab}</h2>
              <p>Content for <span className="font-bold">{selectedTab}</span> will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPortalPage; 