import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { emailService } from '../../services/emailService';

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
  logo_url: "https://dhakabankltd.com/wp-content/themes/dhakabankupdate/images/logo-plc-new.png",
  eligibility: "Proprietorships, Partnerships, (Private/Public) Limited Companies, Institutions",
  visit_site_url: "https://dhakabankltd.com",
  features: "Free debit card, online and SMS banking, low opening balance"
};

const BankAccountForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BankAccountFormData>();

  const onSubmit = async (data: BankAccountFormData) => {
    setIsSubmitting(true);
    setEmailError(null);
    try {
      // Send email with form data
      await emailService.sendEmail({
        to: 'kontanibo@outlook.com',
        subject: `New Bank Account Submission: ${data.brand} - ${data.product_name}`,
        html: `
          <div>
            <h1>${data.brand} - ${data.product_name}</h1>
            <p><strong>Monthly Fee:</strong> ${data.monthly_fee}</p>
            <p><strong>Non-Bank ATM Fee:</strong> ${data.non_bank_atm_fee}</p>
            <p><strong>Debit Card Options:</strong> ${data.debit_card_options}</p>
            <p><strong>Minimum Deposit Required:</strong> ${data.minimum_deposit_required}</p>
            <p><strong>Account Fee:</strong> ${data.account_fee}</p>
            <p><strong>Max Withdrawal:</strong> ${data.max_withdrawal}</p>
            <p><strong>Cheque Book Fee:</strong> ${data.cheque_book_fee}</p>
            <p><strong>Logo URL:</strong> ${data.logo_url}</p>
            <p><strong>Eligibility:</strong> ${data.eligibility}</p>
            <p><strong>Visit Site URL:</strong> ${data.visit_site_url}</p>
            <p><strong>Features:</strong> ${data.features}</p>
          </div>
        `
      });
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError('An error occurred while sending the email. Please try again later.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-6 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Example Bank Account
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Basic Information</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm mb-1"><span className="font-medium">Bank:</span> Dhaka Bank Limited</p>
                <p className="text-sm mb-1"><span className="font-medium">Product:</span> Dhaka Bank Current Account</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Fees & Charges</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm mb-1"><span className="font-medium">Monthly Fee:</span> ৳0.00</p>
                <p className="text-sm mb-1"><span className="font-medium">Account Fee:</span> ৳300.00</p>
                <p className="text-sm mb-1"><span className="font-medium">Non-bank ATM Fee:</span> ৳15.00</p>
                <p className="text-sm"><span className="font-medium">Cheque Book Fee:</span> ৳12.00</p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Features & Benefits</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <ul className="text-sm space-y-1">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free debit card
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Online banking available
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    SMS banking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Low opening balance (৳1,000)
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">Eligibility</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm">Available for:</p>
                <ul className="text-sm list-disc list-inside ml-2">
                  <li>Proprietorships</li>
                  <li>Partnerships</li>
                  <li>(Private/Public) Limited Companies</li>
                  <li>Institutions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
          <label className="block text-sm font-medium text-gray-700">Features</label>
          <textarea
            {...register('features')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

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

      {submitSuccess && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <p className="text-green-800">
            Request submitted successfully!
          </p>
        </div>
      )}

      {emailError && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-800">
            {emailError}
          </p>
        </div>
      )}
    </div>
  );
};

export default BankAccountForm; 