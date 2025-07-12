import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { emailService } from '../../src/services/emailService';

type PersonalLoanFormData = {
  brand: string;
  product_name: string;
  interest_rate: string;
  comparison_rate: string;
  min_loan_amount: string;
  max_loan_amount: string;
  min_loan_term: string;
  max_loan_term: string;
  monthly_fee: string;
  annual_fee: string;
  application_fee: string;
  features: string;
  eligibility: string;
  required_documents: string;
  logo_url: string;
  visit_site_url: string;
  score: number;
  online_application: boolean;
  instant_approval: boolean;
  no_security_required: boolean;
};

const exampleData = {
  brand: "ANZ",
  product_name: "Fixed Rate Personal Loan",
  interest_rate_pa: "12.99",
  comparison_rate_pa: "13.99",
  application_fee: "150.00",
  monthly_fee: "10.00",
  tagline: "Get what you need – with the certainty of fixed repayments",
  features: "Fixed interest rate for loan term, Borrow between $5,000 and $75,000, Loan terms from 1 to 7 years, Choose weekly, fortnightly or monthly repayments, Same-day cash when approved in branch by midday Mon-Fri, Manage your loan online through ANZ Internet Banking or ANZ App",
  description: "An ANZ Fixed Rate Personal Loan gives you the certainty of fixed repayments for the term of your loan. This means if interest rates increase your repayments stay the same.",
  recommended: false,
  promoted: false,
  loan_term_max: 7,
  score: "3.0",
  pros: "Certainty your repayments won't change even if rates increase, Control over your budget with fixed repayments, Convenient online loan management, Same-day cash for in-branch approvals by midday",
  cons: "Early repayment charges may apply for additional payments, No access to redraw facility, Cannot make extra repayments without charges",
  eligibility: "Must be 18 years or older, Minimum annual income of $15,000, Australian citizen, permanent resident or valid visa holder, Good credit history",
  required_documents: "Proof of identity (driver's license, passport or Medicare card), Recent payslips covering 3 months income, Bank statements showing income deposits, Details of assets, liabilities and expenses",
  logo_url: "https://www.anz.com.au/content/dam/anzcomau/logos/anz-logo-small.png",
  site_visit_url: "https://www.anz.com.au/personal/personal-loans/fixed-rate/"
};

export default function PersonalLoanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PersonalLoanFormData>();

  const onSubmit = async (data: PersonalLoanFormData) => {
    setIsSubmitting(true);
    setEmailError(null);
    try {
      // Send email with form data
      await emailService.sendEmail({
        to: 'kontanibo@outlook.com',
        subject: `New Personal Loan Submission: ${data.brand} - ${data.product_name}`,
        html: `
          <h2>New Personal Loan Submission</h2>
          <h3>Basic Information</h3>
          <p><strong>Brand:</strong> ${data.brand}</p>
          <p><strong>Product Name:</strong> ${data.product_name}</p>
          
          <h3>Interest Rates</h3>
          <p><strong>Interest Rate:</strong> ${data.interest_rate}%</p>
          <p><strong>Comparison Rate:</strong> ${data.comparison_rate}%</p>
          
          <h3>Loan Terms</h3>
          <p><strong>Minimum Loan Amount:</strong> $${data.min_loan_amount}</p>
          <p><strong>Maximum Loan Amount:</strong> $${data.max_loan_amount}</p>
          <p><strong>Minimum Loan Term:</strong> ${data.min_loan_term} months</p>
          <p><strong>Maximum Loan Term:</strong> ${data.max_loan_term} months</p>
          
          <h3>Fees</h3>
          <p><strong>Monthly Fee:</strong> $${data.monthly_fee}</p>
          <p><strong>Annual Fee:</strong> $${data.annual_fee}</p>
          <p><strong>Application Fee:</strong> $${data.application_fee}</p>
          
          <h3>Features & Requirements</h3>
          <p><strong>Features:</strong> ${data.features}</p>
          <p><strong>Eligibility:</strong> ${data.eligibility}</p>
          <p><strong>Required Documents:</strong> ${data.required_documents}</p>
          
          <h3>Additional Information</h3>
          <p><strong>Score:</strong> ${data.score}/10</p>
          <p><strong>Online Application:</strong> ${data.online_application ? 'Yes' : 'No'}</p>
          <p><strong>Instant Approval:</strong> ${data.instant_approval ? 'Yes' : 'No'}</p>
          <p><strong>No Security Required:</strong> ${data.no_security_required ? 'Yes' : 'No'}</p>
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
            <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              {...register('interest_rate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comparison Rate (%)</label>
            <input
              type="number"
              step="0.01"
              {...register('comparison_rate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Loan Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('min_loan_amount')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Loan Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('max_loan_amount')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Loan Term (months)</label>
            <input
              type="number"
              {...register('min_loan_term')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Loan Term (months)</label>
            <input
              type="number"
              {...register('max_loan_term')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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
            <label className="block text-sm font-medium text-gray-700">Annual Fee</label>
            <input
              type="number"
              step="0.01"
              {...register('annual_fee')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Application Fee</label>
            <input
              type="number"
              step="0.01"
              {...register('application_fee')}
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
              {...register('online_application')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Online Application</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('instant_approval')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Instant Approval</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('no_security_required')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">No Security Required</label>
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