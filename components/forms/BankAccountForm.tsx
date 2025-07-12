import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../src/lib/supabase';

type BankAccountFormData = {
  brand: string;
  product_name: string;
  monthly_fee: string;
  non_bank_atm_fee: string;
  debit_card_options: string;
  minimum_deposit_required: string;
  account_fee: string;
  max_withdrawal: string;
  cheque_book_fee: string;
  logo_url: string;
  eligibility: string;
  visit_site_url: string;
  features: string;
  online_banking: boolean;
  ekyc_enabled: boolean;
  internet_banking_score: number;
  score: number;
  savings_account: boolean;
};

const exampleData = {
  brand: "Dhaka Bank Limited",
  product_name: "Dhaka Bank Current Account",
  monthly_fee: "0.00",
  non_bank_atm_fee: "15.00",
  debit_card_options: "Yes – free debit/ATM card included",
  minimum_deposit_required: "1000.00",
  account_fee: "300.00",
  cheque_book_fee: "12.00",
  online_banking: true,
  discounts_on_retailers: false,
  entertainment: false,
  ekyc_enabled: true,
  score: 7,
  internet_banking_score: 4,
  logo_url: "https://dhakabankltd.com/wp-content/themes/dhakabankupdate/images/logo-plc-new.png",
  eligibility: "Proprietorships, Partnerships, (Private/Public) Limited Companies, Institutions",
  visit_site_url: "https://dhakabankltd.com",
  features: "Free debit card, online and SMS banking, low opening balance",
  savings_account: false
};

export default function BankAccountForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BankAccountFormData>();

  const onSubmit = async (data: BankAccountFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const { error: submissionError } = await supabase
        .from('form_submissions')
        .insert([
          {
            form_type: 'bank_account',
            email: 'kontanibo@outlook.com', // You might want to make this configurable
            data: data,
            status: 'pending'
          }
        ]);

      if (submissionError) throw submissionError;

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('An error occurred while submitting the form. Please try again later.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Example Data</h3>
        <pre className="text-sm text-blue-800 overflow-auto">
          {JSON.stringify(exampleData, null, 2)}
        </pre>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand Name</label>
            <input
              type="text"
              {...register('brand', { required: 'Brand is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              {...register('product_name', { required: 'Product name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.product_name && <p className="text-red-500 text-sm">{errors.product_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Monthly Fee</label>
            <input
              type="number"
              step="0.01"
              {...register('monthly_fee')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Non-Bank ATM Fee</label>
            <input
              type="number"
              step="0.01"
              {...register('non_bank_atm_fee')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Debit Card Options</label>
            <input
              type="text"
              {...register('debit_card_options')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Deposit Required</label>
            <input
              type="number"
              step="0.01"
              {...register('minimum_deposit_required')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account Fee</label>
            <input
              type="number"
              step="0.01"
              {...register('account_fee')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cheque Book Fee</label>
            <input
              type="number"
              step="0.01"
              {...register('cheque_book_fee')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Score (0-10)</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              {...register('score')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Internet Banking Score (0-10)</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              {...register('internet_banking_score')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Logo URL</label>
            <input
              type="url"
              {...register('logo_url')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Visit Site URL</label>
            <input
              type="url"
              {...register('visit_site_url')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Eligibility</label>
          <textarea
            {...register('eligibility')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Features (comma-separated)</label>
          <textarea
            {...register('features')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('online_banking')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Online Banking</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('ekyc_enabled')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">eKYC Enabled</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('savings_account')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Savings Account</label>
          </div>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{submitError}</p>
          </div>
        )}

        {submitSuccess && (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>Form submitted successfully!</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              px-6 py-2 rounded-md text-white font-medium
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
} 