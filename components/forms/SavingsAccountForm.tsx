import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { emailService } from '../../src/services/emailService';

type SavingsAccountFormData = {
  brand: string;
  product_name: string;
  max_variable_rate_pa: string;
  interest_rate: string;
  monthly_maximum_rate_conditions: string;
  minimum_deposit: string;
  cheque_book_fee: string;
  account_fee: string;
  tagline: string;
  recommended: boolean;
  score: string;
  logo_url: string;
  visit_site_link: string;
  features: string;
  pros: string;
  cons: string;
  eligibility: string;
  required_documents: string;
  ekyc_enabled: boolean;
  internet_banking: boolean;
  debit_card_facility: boolean;
};

const exampleData = {
  brand: "Rabobank",
  product_name: "High Interest Savings Account",
  max_variable_rate_pa: "5.45",
  interest_rate: "4.00",
  monthly_maximum_rate_conditions: "Bonus rate of 5.45% p.a. for first 4 months, then reverts to 4.00% p.a. Rate applies up to $250,000 balance.",
  minimum_deposit: "0.00",
  account_fee: "0.00",
  tagline: "Earn a bonus variable rate for the first 4 months on balances up to $250,000",
  recommended: true,
  score: "4.8",
  features: "No account keeping fees, No minimum balance requirement, Interest paid monthly, Online banking access, Mobile banking app",
  pros: "High introductory rate of 5.45% p.a., Competitive ongoing rate of 4.00% p.a., No monthly fees, No minimum deposit required",
  cons: "Bonus rate only for first 4 months, New customers only, Maximum balance cap of $250,000 for highest rate",
  eligibility: "Must be 18 years or older, Must be an Australian resident, Must be a new Rabobank customer",
  required_documents: "Valid ID (Driver's license or passport), Proof of address, Tax File Number",
  ekyc_enabled: false,
  internet_banking: true,
  debit_card_facility: false
};

export default function SavingsAccountForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SavingsAccountFormData>();

  const onSubmit = async (data: SavingsAccountFormData) => {
    setIsSubmitting(true);
    setEmailError(null);
    try {
      // Send email with form data
      await emailService.sendEmail({
        to: 'kontanibo@outlook.com',
        subject: `New Savings Account Submission: ${data.brand} - ${data.product_name}`,
        html: `
          <h2>New Savings Account Submission</h2>
          <h3>Basic Information</h3>
          <p><strong>Brand:</strong> ${data.brand}</p>
          <p><strong>Product Name:</strong> ${data.product_name}</p>
          
          <h3>Interest Rates</h3>
          <p><strong>Maximum Variable Rate (p.a.):</strong> ${data.max_variable_rate_pa}%</p>
          <p><strong>Interest Rate:</strong> ${data.interest_rate}%</p>
          <p><strong>Rate Conditions:</strong> ${data.monthly_maximum_rate_conditions}</p>
          
          <h3>Fees & Requirements</h3>
          <p><strong>Minimum Deposit:</strong> ${data.minimum_deposit}</p>
          <p><strong>Account Fee:</strong> ${data.account_fee}</p>
          <p><strong>Cheque Book Fee:</strong> ${data.cheque_book_fee}</p>
          
          <h3>Features & Benefits</h3>
          <p><strong>Tagline:</strong> ${data.tagline}</p>
          <p><strong>Features:</strong> ${data.features}</p>
          <p><strong>Pros:</strong> ${data.pros}</p>
          <p><strong>Cons:</strong> ${data.cons}</p>
          
          <h3>Digital Banking</h3>
          <p><strong>Internet Banking:</strong> ${data.internet_banking ? 'Yes' : 'No'}</p>
          <p><strong>eKYC Enabled:</strong> ${data.ekyc_enabled ? 'Yes' : 'No'}</p>
          <p><strong>Debit Card Facility:</strong> ${data.debit_card_facility ? 'Yes' : 'No'}</p>
          
          <h3>Additional Information</h3>
          <p><strong>Score:</strong> ${data.score}/10</p>
          <p><strong>Recommended:</strong> ${data.recommended ? 'Yes' : 'No'}</p>
          <p><strong>Eligibility:</strong> ${data.eligibility}</p>
          <p><strong>Required Documents:</strong> ${data.required_documents}</p>
          <p><strong>Logo URL:</strong> <a href="${data.logo_url}">${data.logo_url}</a></p>
          <p><strong>Visit Site URL:</strong> <a href="${data.visit_site_link}">${data.visit_site_link}</a></p>
        `
      });

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        setEmailError(error.message);
      } else {
        setEmailError('An error occurred while sending the email');
      }
    } finally {
      setIsSubmitting(false);
    }
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
            <label className="block text-sm font-medium text-gray-700">Maximum Variable Rate (p.a.)</label>
            <input
              type="number"
              step="0.01"
              {...register('max_variable_rate_pa')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Rate</label>
            <input
              type="number"
              step="0.01"
              {...register('interest_rate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Deposit</label>
            <input
              type="number"
              step="0.01"
              {...register('minimum_deposit')}
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
              {...register('visit_site_link')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tagline</label>
          <input
            type="text"
            {...register('tagline')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Maximum Rate Conditions</label>
          <textarea
            {...register('monthly_maximum_rate_conditions')}
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Pros (comma-separated)</label>
          <textarea
            {...register('pros')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cons (comma-separated)</label>
          <textarea
            {...register('cons')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Eligibility (comma-separated)</label>
          <textarea
            {...register('eligibility')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Required Documents (comma-separated)</label>
          <textarea
            {...register('required_documents')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('recommended')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Recommended</label>
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
              {...register('internet_banking')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Internet Banking</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('debit_card_facility')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Debit Card Facility</label>
          </div>
        </div>

        {emailError && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{emailError}</p>
          </div>
        )}

        {submitSuccess && (
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p>Form submitted successfully! An email has been sent with the details.</p>
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
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
} 