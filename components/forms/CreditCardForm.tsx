import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { emailService } from '../../src/services/emailService';

type CreditCardFormData = {
  brand: string;
  product_name: string;
  annual_fee: string;
  interest_rate: string;
  interest_free_days: string;
  min_credit_limit: string;
  max_credit_limit: string;
  min_income: string;
  balance_transfer_rate: string;
  balance_transfer_period: string;
  purchase_rate: string;
  cash_advance_rate: string;
  late_payment_fee: string;
  overseas_transaction_fee: string;
  rewards_program: string;
  complimentary_insurance: string;
  features: string;
  eligibility: string;
  required_documents: string;
  logo_url: string;
  visit_site_url: string;
  score: number;
  recommended: boolean;
  contactless_payments: boolean;
  digital_wallet: boolean;
  virtual_card: boolean;
};

const exampleData = {
  brand: "Dhaka Bank",
  product_name: "Visa Platinum Card",
  annual_fee: "199.00",
  interest_rate: "20.99",
  interest_free_days: "55",
  min_credit_limit: "1000.00",
  max_credit_limit: "50000.00",
  min_income: "30000.00",
  balance_transfer_rate: "0.00",
  balance_transfer_period: "18",
  purchase_rate: "20.99",
  cash_advance_rate: "21.99",
  late_payment_fee: "0.00",
  overseas_transaction_fee: "0.00",
  rewards_program: "1 point per $1 spent, Points never expire, Redeem for travel, gift cards, or cashback",
  complimentary_insurance: "Travel insurance, Purchase protection, Extended warranty",
  features: "Contactless payments, Digital wallet compatibility, SMS alerts, Online banking access",
  eligibility: "Must be 18 years or older",
  required_documents: "Valid ID, Income proof, Credit history",
  logo_url: "https://dhakabankltd.com/wp-content/themes/dhakabankupdate/images/logo-plc-new.png",
  visit_site_url: "https://dhakabankltd.com/credit-cards",
  score: 4.5,
  recommended: true,
  contactless_payments: true,
  digital_wallet: true,
  virtual_card: true
};

export default function CreditCardForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreditCardFormData>();

  const onSubmit = async (data: CreditCardFormData) => {
    setIsSubmitting(true);
    setEmailError(null);
    try {
      // Send email with form data
      await emailService.sendEmail({
        to: 'kontanibo@outlook.com',
        subject: `New Credit Card Submission: ${data.brand} - ${data.product_name}`,
        html: `
          <h2>New Credit Card Submission</h2>
          <h3>Basic Information</h3>
          <p><strong>Brand:</strong> ${data.brand}</p>
          <p><strong>Product Name:</strong> ${data.product_name}</p>
          
          <h3>Fees & Rates</h3>
          <p><strong>Annual Fee:</strong> $${data.annual_fee}</p>
          <p><strong>Interest Rate:</strong> ${data.interest_rate}%</p>
          <p><strong>Interest Free Days:</strong> ${data.interest_free_days}</p>
          <p><strong>Purchase Rate:</strong> ${data.purchase_rate}%</p>
          <p><strong>Cash Advance Rate:</strong> ${data.cash_advance_rate}%</p>
          <p><strong>Late Payment Fee:</strong> $${data.late_payment_fee}</p>
          <p><strong>Overseas Transaction Fee:</strong> ${data.overseas_transaction_fee}%</p>
          
          <h3>Credit Limits</h3>
          <p><strong>Minimum Credit Limit:</strong> $${data.min_credit_limit}</p>
          <p><strong>Maximum Credit Limit:</strong> $${data.max_credit_limit}</p>
          <p><strong>Minimum Income Required:</strong> $${data.min_income}</p>
          
          <h3>Balance Transfer</h3>
          <p><strong>Balance Transfer Rate:</strong> ${data.balance_transfer_rate}%</p>
          <p><strong>Balance Transfer Period:</strong> ${data.balance_transfer_period} months</p>
          
          <h3>Benefits & Features</h3>
          <p><strong>Rewards Program:</strong> ${data.rewards_program}</p>
          <p><strong>Complimentary Insurance:</strong> ${data.complimentary_insurance}</p>
          <p><strong>Features:</strong> ${data.features}</p>
          
          <h3>Digital Features</h3>
          <p><strong>Contactless Payments:</strong> ${data.contactless_payments ? 'Yes' : 'No'}</p>
          <p><strong>Digital Wallet Support:</strong> ${data.digital_wallet ? 'Yes' : 'No'}</p>
          <p><strong>Virtual Card Available:</strong> ${data.virtual_card ? 'Yes' : 'No'}</p>
          
          <h3>Requirements</h3>
          <p><strong>Eligibility:</strong> ${data.eligibility}</p>
          <p><strong>Required Documents:</strong> ${data.required_documents}</p>
          
          <h3>Additional Information</h3>
          <p><strong>Score:</strong> ${data.score}/10</p>
          <p><strong>Recommended:</strong> ${data.recommended ? 'Yes' : 'No'}</p>
          <p><strong>Logo URL:</strong> <a href="${data.logo_url}">${data.logo_url}</a></p>
          <p><strong>Visit Site URL:</strong> <a href="${data.visit_site_url}">${data.visit_site_url}</a></p>
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
            <label className="block text-sm font-medium text-gray-700">Annual Fee</label>
            <input
              type="number"
              step="0.01"
              {...register('annual_fee')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              {...register('interest_rate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Free Days</label>
            <input
              type="number"
              {...register('interest_free_days')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Credit Limit</label>
            <input
              type="number"
              step="0.01"
              {...register('min_credit_limit')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Credit Limit</label>
            <input
              type="number"
              step="0.01"
              {...register('max_credit_limit')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Income Required</label>
            <input
              type="number"
              step="0.01"
              {...register('min_income')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Balance Transfer Rate (%)</label>
            <input
              type="number"
              step="0.01"
              {...register('balance_transfer_rate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Balance Transfer Period (months)</label>
            <input
              type="number"
              {...register('balance_transfer_period')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Rate (%)</label>
            <input
              type="number"
              step="0.01"
              {...register('purchase_rate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cash Advance Rate (%)</label>
            <input
              type="number"
              step="0.01"
              {...register('cash_advance_rate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Late Payment Fee</label>
            <input
              type="number"
              step="0.01"
              {...register('late_payment_fee')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Overseas Transaction Fee (%)</label>
            <input
              type="number"
              step="0.01"
              {...register('overseas_transaction_fee')}
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
              {...register('visit_site_url')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rewards Program</label>
          <textarea
            {...register('rewards_program')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Complimentary Insurance</label>
          <textarea
            {...register('complimentary_insurance')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Features</label>
          <textarea
            {...register('features')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
          <label className="block text-sm font-medium text-gray-700">Required Documents</label>
          <textarea
            {...register('required_documents')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              {...register('contactless_payments')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Contactless Payments</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('digital_wallet')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Digital Wallet Support</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('virtual_card')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Virtual Card Available</label>
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