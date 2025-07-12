import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { emailService } from '../../services/emailService';

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
  brand: "American Express",
  product_name: "Qantas Ultimate Card",
  annual_fee: "450.00",
  interest_rate: "20.74",
  interest_free_days: "55",
  min_credit_limit: "3000.00",
  max_credit_limit: "50000.00",
  min_income: "65000.00",
  balance_transfer_rate: "0.00",
  balance_transfer_period: "12",
  purchase_rate: "20.74",
  cash_advance_rate: "21.99",
  late_payment_fee: "$0",
  overseas_transaction_fee: "0%",
  rewards_program: "Qantas Frequent Flyer",
  complimentary_insurance: "Travel Insurance, Purchase Protection, Smartphone Screen Insurance",
  features: "Travel Insurance, Purchase Protection, Smartphone Screen Insurance",
  eligibility: "Must be 18 years or older, Minimum annual income of $65,000, Good credit history, Australian permanent resident",
  required_documents: "Proof of identity, Recent payslips, Tax returns for self-employed, Bank statements",
  logo_url: "https://www.americanexpress.com/content/dam/amex/au/benefits/AmexLogo_Blue_Box_RGB_REV_RGB.png",
  visit_site_url: "https://www.americanexpress.com/au/credit-cards/qantas-ultimate-card/",
  score: 8.5,
  recommended: true,
  contactless_payments: true,
  digital_wallet: true,
  virtual_card: true
};

const CreditCardForm = () => {
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Example Credit Card
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Basic Information</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm mb-1"><span className="font-medium">Bank:</span> American Express</p>
                    <p className="text-sm"><span className="font-medium">Product:</span> Qantas Ultimate Card</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm"><span className="font-medium">Card Type:</span> Rewards</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Rates & Fees</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-100">
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">PURCHASE RATE</p>
                    <p className="text-xl font-bold text-blue-900">20.74% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">ANNUAL FEE</p>
                    <p className="text-xl font-bold text-blue-900">$450</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Interest Free Days</p>
                    <p className="text-sm font-medium">55 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Min Income Required</p>
                    <p className="text-sm font-medium">$65,000 p.a.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Rewards Program</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <p className="text-xs text-blue-600 font-medium mb-1">SIGN-UP BONUS</p>
                  <p className="text-lg font-bold text-blue-900">100,000 Qantas Points</p>
                  <p className="text-xs text-gray-600">When you spend $3,000 in 3 months</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">EARN RATE</p>
                  <p className="text-sm font-medium">1.25 Qantas Points per $1 spent</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Card Benefits</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <p className="text-xs text-blue-600 font-medium mb-2">TRAVEL BENEFITS</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>2 Qantas Club lounge passes annually</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>$450 Travel Credit</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-2">INSURANCE COVERAGE</p>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Travel Insurance</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Purchase Protection</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Smartphone Screen Insurance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">Eligibility & Requirements</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">ELIGIBILITY CRITERIA</p>
                  <ul className="text-sm space-y-1">
                    <li>18 years or older</li>
                    <li>Minimum annual income of $65,000</li>
                    <li>Australian permanent resident</li>
                    <li>Good credit history</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 mb-2">REQUIRED DOCUMENTS</p>
                  <ul className="text-sm space-y-1">
                    <li>Proof of identity</li>
                    <li>Recent payslips</li>
                    <li>Bank statements</li>
                    <li>Tax returns (if self-employed)</li>
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
            <label className="block text-sm font-medium text-gray-700">Minimum Income</label>
            <input
              type="number"
              step="0.01"
              {...register('min_income')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Late Payment Fee</label>
            <input
              type="text"
              {...register('late_payment_fee')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Overseas Transaction Fee</label>
            <input
              type="text"
              {...register('overseas_transaction_fee')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rewards Program</label>
            <input
              type="text"
              {...register('rewards_program')}
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
          <label className="block text-sm font-medium text-gray-700">Score</label>
          <input
            type="number"
            step="0.01"
            {...register('score')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recommended</label>
          <input
            type="checkbox"
            {...register('recommended')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contactless Payments</label>
          <input
            type="checkbox"
            {...register('contactless_payments')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Digital Wallet</label>
          <input
            type="checkbox"
            {...register('digital_wallet')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Virtual Card</label>
          <input
            type="checkbox"
            {...register('virtual_card')}
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

export default CreditCardForm; 