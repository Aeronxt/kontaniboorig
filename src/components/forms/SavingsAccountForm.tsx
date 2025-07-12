import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { emailService } from '../../services/emailService';

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
  tagline: "Earn a bonus variable rate for the first 4 months",
  features: "No account keeping fees, No minimum balance requirement, Interest paid monthly, Online banking access, Mobile banking app",
  eligibility: "Must be 18 years or older, Must be an Australian resident, Must be a new Rabobank customer",
  required_documents: "Valid ID (Driver's license or passport), Proof of address, Tax File Number",
  logo_url: "https://example.com/logo.png",
  visit_site_link: "https://example.com"
};

const SavingsAccountForm = () => {
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
      console.error('Error sending email:', error);
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
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-6 shadow-sm">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Example Savings Account
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Basic Information</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm mb-1"><span className="font-medium">Bank:</span> Rabobank</p>
                <p className="text-sm mb-1"><span className="font-medium">Product:</span> High Interest Savings Account</p>
                <p className="text-sm"><span className="font-medium">Tagline:</span> Earn a bonus variable rate for the first 4 months</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Interest Rates</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <p className="text-xs text-blue-600 font-medium mb-1">BONUS RATE</p>
                  <p className="text-2xl font-bold text-blue-900">5.45% p.a.</p>
                  <p className="text-xs text-gray-600">First 4 months</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">ONGOING RATE</p>
                  <p className="text-2xl font-bold text-blue-900">4.00% p.a.</p>
                  <p className="text-xs text-gray-600">After bonus period</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Key Features</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No account keeping fees</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>No minimum balance requirement</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Interest paid monthly</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Online and mobile banking access</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">Requirements</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">ELIGIBILITY</p>
                  <ul className="text-sm space-y-1">
                    <li>Must be 18 years or older</li>
                    <li>Must be an Australian resident</li>
                    <li>Must be a new Rabobank customer</li>
                  </ul>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 mb-2">REQUIRED DOCUMENTS</p>
                  <ul className="text-sm list-disc list-inside">
                    <li>Valid ID (Driver's license or passport)</li>
                    <li>Proof of address</li>
                    <li>Tax File Number</li>
                  </ul>
                </div>
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
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending Email...' : 'Send Email'}
          </button>
        </div>
      </form>

      {submitSuccess && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <p className="text-green-800">
            Email has been sent successfully!
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

export default SavingsAccountForm; 