import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { emailService } from '../../services/emailService';

type PersonalLoanFormData = {
  brand: string;
  product_name: string;
  interest_rate_pa: string;
  comparison_rate_pa: string;
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
  loan_term_max: 7,
  eligibility: "Must be 18 years or older, Minimum annual income of $15,000, Australian citizen, permanent resident or valid visa holder, Good credit history",
  required_documents: "Proof of identity (driver's license, passport or Medicare card), Recent payslips covering 3 months income, Bank statements showing income deposits, Details of assets, liabilities and expenses",
  logo_url: "https://www.anz.com.au/content/dam/anzcomau/logos/anz-logo-small.png",
  site_visit_url: "https://www.anz.com.au/personal/personal-loans/fixed-rate/"
};

const PersonalLoanForm = () => {
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
          <p><strong>Interest Rate (p.a.):</strong> ${data.interest_rate_pa}%</p>
          <p><strong>Comparison Rate (p.a.):</strong> ${data.comparison_rate_pa}%</p>
          
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Example Personal Loan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Basic Information</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm mb-1"><span className="font-medium">Bank:</span> ANZ</p>
                <p className="text-sm mb-1"><span className="font-medium">Product:</span> Fixed Rate Personal Loan</p>
                <p className="text-sm"><span className="font-medium">Maximum Term:</span> 7 years</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Rates & Fees</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">INTEREST RATE</p>
                    <p className="text-xl font-bold text-blue-900">12.99% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">COMPARISON RATE</p>
                    <p className="text-xl font-bold text-blue-900">13.99% p.a.</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm mb-1"><span className="font-medium">Application Fee:</span> $150.00</p>
                  <p className="text-sm"><span className="font-medium">Monthly Fee:</span> $10.00</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Key Features</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Fixed interest rate for loan term</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Borrow $5,000 to $75,000</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Same-day cash when approved by midday</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Description</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm text-gray-700">
                  An ANZ Fixed Rate Personal Loan gives you the certainty of fixed repayments for the term of your loan. 
                  This means if interest rates increase your repayments stay the same.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">Eligibility & Documents</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">ELIGIBILITY CRITERIA</p>
                  <ul className="text-sm space-y-1">
                    <li>18 years or older</li>
                    <li>Minimum annual income of $15,000</li>
                    <li>Australian citizen or permanent resident</li>
                    <li>Good credit history</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 mb-2">REQUIRED DOCUMENTS</p>
                  <ul className="text-sm space-y-1">
                    <li>Valid ID (driver's license/passport)</li>
                    <li>3 months of payslips</li>
                    <li>Bank statements</li>
                    <li>Asset & liability details</li>
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
            <label className="block text-sm font-medium text-gray-700">Interest Rate (p.a.)</label>
            <input
              type="number"
              step="0.01"
              {...register('interest_rate_pa')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comparison Rate (p.a.)</label>
            <input
              type="number"
              step="0.01"
              {...register('comparison_rate_pa')}
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
            <label className="block text-sm font-medium text-gray-700">Monthly Fee</label>
            <input
              type="number"
              step="0.01"
              {...register('monthly_fee')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Loan Term (years)</label>
            <input
              type="number"
              {...register('loan_term_max')}
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
              {...register('site_visit_url')}
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
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
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
    </div>
  );
};

export default PersonalLoanForm; 