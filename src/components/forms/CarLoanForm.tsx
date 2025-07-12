import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { emailService } from '../../services/emailService';

type CarLoanFormData = {
  brand: string;
  product_name: string;
  interest_rate_min: string;
  interest_rate_max: string;
  minimum_income: string;
  max_loan_amount: string;
  processing_fee_percentage: string;
  processing_fee_max: string;
  processing_fee_description: string;
  early_settlement_fee: string;
  early_settlement_conditions: string;
  loan_tenure_new_vehicle: string;
  loan_tenure_recondition_vehicle: string;
  loan_to_value_hybrid_electric: string;
  loan_to_value_non_hybrid: string;
  minimum_age: string;
  maximum_age: string;
  features: string;
  eligibility: string;
  required_documents: string;
  logo_url: string;
  site_visit_url: string;
  score: number;
  recommended: boolean;
  promoted: boolean;
};

const exampleData = {
  brand: "Standard Chartered Bank",
  product_name: "Car Loan",
  interest_rate_min: "11.50",
  interest_rate_max: "12.00",
  minimum_income: "50000.00",
  max_loan_amount: "6000000.00",
  processing_fee_percentage: "0.50",
  processing_fee_max: "15000.00",
  processing_fee_description: "0.50% but not more than 15,000.00 – for loan amount up to Tk. 50 lac; 0.30% but not more than 20,000.00 – for loan amount above Tk. 50 lac",
  early_settlement_fee: "0.50",
  early_settlement_conditions: "Allowed after successfully payment of first 06 (six) installments",
  loan_tenure_new_vehicle: "6",
  loan_tenure_recondition_vehicle: "5",
  loan_to_value_hybrid_electric: "70 (Bank) : 30 (customer)",
  loan_to_value_non_hybrid: "60 (Bank) : 40 (customer)",
  minimum_age: "21",
  maximum_age: "65",
  features: "Age of the applicant: Minimum 21 years and Maximum 65 years at the time of expiry, Interest Rate (per annum): 11.50%-12.00%, Minimum Income: Tk. 50,000.00, Loan Amount: Maximum Tk. 60 lac, Processing Fee: 0.50% but not more than 15,000.00 – for loan amount up to Tk. 50 lac",
  eligibility: "Minimum age: 21 years, Maximum age: 65 years at the time of expiry, Minimum income: Tk. 50,000.00",
  required_documents: "National ID Card, Income certificate, Bank statements, Vehicle registration documents, Insurance papers, Salary certificate",
  logo_url: "https://example.com/scb-logo.png",
  site_visit_url: "https://www.sc.com/bd/car-loans/"
};

const CarLoanForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CarLoanFormData>();

  const onSubmit = async (data: CarLoanFormData) => {
    setIsSubmitting(true);
    setEmailError(null);
    try {
      // Send email with form data
      await emailService.sendEmail({
        to: 'kontanibo@outlook.com',
        subject: `New Car Loan Submission: ${data.brand} - ${data.product_name}`,
        html: `
          <h2>New Car Loan Submission</h2>
          <h3>Basic Information</h3>
          <p><strong>Brand:</strong> ${data.brand}</p>
          <p><strong>Product Name:</strong> ${data.product_name}</p>
          
          <h3>Interest Rates</h3>
          <p><strong>Interest Rate Min (p.a.):</strong> ${data.interest_rate_min}%</p>
          <p><strong>Interest Rate Max (p.a.):</strong> ${data.interest_rate_max}%</p>
          
          <h3>Loan Terms</h3>
          <p><strong>Minimum Income:</strong> ৳${data.minimum_income}</p>
          <p><strong>Maximum Loan Amount:</strong> ৳${data.max_loan_amount}</p>
          <p><strong>New Vehicle Term:</strong> ${data.loan_tenure_new_vehicle} years</p>
          <p><strong>Reconditioned Vehicle Term:</strong> ${data.loan_tenure_recondition_vehicle} years</p>
          
          <h3>Fees</h3>
          <p><strong>Processing Fee Percentage:</strong> ${data.processing_fee_percentage}%</p>
          <p><strong>Processing Fee Max:</strong> ৳${data.processing_fee_max}</p>
          <p><strong>Processing Fee Description:</strong> ${data.processing_fee_description}</p>
          <p><strong>Early Settlement Fee:</strong> ${data.early_settlement_fee}%</p>
          <p><strong>Early Settlement Conditions:</strong> ${data.early_settlement_conditions}</p>
          
          <h3>Age Requirements</h3>
          <p><strong>Minimum Age:</strong> ${data.minimum_age} years</p>
          <p><strong>Maximum Age:</strong> ${data.maximum_age} years</p>
          
          <h3>Loan to Value Ratios</h3>
          <p><strong>Hybrid/Electric Vehicle:</strong> ${data.loan_to_value_hybrid_electric}</p>
          <p><strong>Non-Hybrid Vehicle:</strong> ${data.loan_to_value_non_hybrid}</p>
          
          <h3>Features & Requirements</h3>
          <p><strong>Features:</strong> ${data.features}</p>
          <p><strong>Eligibility:</strong> ${data.eligibility}</p>
          <p><strong>Required Documents:</strong> ${data.required_documents}</p>
          
          <h3>Additional Information</h3>
          <p><strong>Score:</strong> ${data.score}/10</p>
          <p><strong>Recommended:</strong> ${data.recommended ? 'Yes' : 'No'}</p>
          <p><strong>Promoted:</strong> ${data.promoted ? 'Yes' : 'No'}</p>
          <p><strong>Logo URL:</strong> <a href="${data.logo_url}">${data.logo_url}</a></p>
          <p><strong>Site Visit URL:</strong> <a href="${data.site_visit_url}">${data.site_visit_url}</a></p>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Example Car Loan
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Basic Information</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm mb-1"><span className="font-medium">Bank:</span> Standard Chartered Bank</p>
                <p className="text-sm mb-1"><span className="font-medium">Product:</span> Car Loan</p>
                <p className="text-sm"><span className="font-medium">Max Amount:</span> ৳60 lac</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Interest Rates & Terms</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">INTEREST RATE</p>
                    <p className="text-xl font-bold text-blue-900">11.50% - 12.00%</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium mb-1">LOAN TERM</p>
                    <p className="text-xl font-bold text-blue-900">Up to 6 years</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm mb-1"><span className="font-medium">Processing Fee:</span> 0.50%</p>
                  <p className="text-sm"><span className="font-medium">Min Income:</span> ৳50,000</p>
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
                    <span>Competitive interest rates</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Support for new & reconditioned vehicles</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Flexible loan-to-value ratios</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Loan Terms</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">New Vehicle:</span>
                    <span className="text-sm font-semibold">6 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reconditioned:</span>
                    <span className="text-sm font-semibold">5 years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hybrid/Electric LTV:</span>
                    <span className="text-sm font-semibold">70:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Non-Hybrid LTV:</span>
                    <span className="text-sm font-semibold">60:40</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">Eligibility & Documents</h4>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-2">ELIGIBILITY CRITERIA</p>
                  <ul className="text-sm space-y-1">
                    <li>Age: 21-65 years</li>
                    <li>Minimum income: ৳50,000</li>
                    <li>Valid documentation required</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 mb-2">REQUIRED DOCUMENTS</p>
                  <ul className="text-sm space-y-1">
                    <li>National ID Card</li>
                    <li>Income certificate</li>
                    <li>Bank statements</li>
                    <li>Vehicle documents</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Car loan submitted successfully! We'll review and add it to our database.
              </p>
            </div>
          </div>
        </div>
      )}

      {emailError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                Error: {emailError}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                Bank/Brand *
              </label>
              <input
                type="text"
                {...register('brand', { required: 'Bank/Brand is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Standard Chartered Bank"
              />
              {errors.brand && (
                <p className="mt-2 text-sm text-red-600">{errors.brand.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                {...register('product_name', { required: 'Product name is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Car Loan"
              />
              {errors.product_name && (
                <p className="mt-2 text-sm text-red-600">{errors.product_name.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Interest Rates */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Interest Rates</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="interest_rate_min" className="block text-sm font-medium text-gray-700">
                Minimum Interest Rate (%) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('interest_rate_min', { required: 'Minimum interest rate is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 11.50"
              />
              {errors.interest_rate_min && (
                <p className="mt-2 text-sm text-red-600">{errors.interest_rate_min.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="interest_rate_max" className="block text-sm font-medium text-gray-700">
                Maximum Interest Rate (%) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('interest_rate_max', { required: 'Maximum interest rate is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 12.00"
              />
              {errors.interest_rate_max && (
                <p className="mt-2 text-sm text-red-600">{errors.interest_rate_max.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Loan Terms */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Loan Terms</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="minimum_income" className="block text-sm font-medium text-gray-700">
                Minimum Income (৳) *
              </label>
              <input
                type="number"
                {...register('minimum_income', { required: 'Minimum income is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 50000"
              />
              {errors.minimum_income && (
                <p className="mt-2 text-sm text-red-600">{errors.minimum_income.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="max_loan_amount" className="block text-sm font-medium text-gray-700">
                Maximum Loan Amount (৳) *
              </label>
              <input
                type="number"
                {...register('max_loan_amount', { required: 'Maximum loan amount is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 6000000"
              />
              {errors.max_loan_amount && (
                <p className="mt-2 text-sm text-red-600">{errors.max_loan_amount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="loan_tenure_new_vehicle" className="block text-sm font-medium text-gray-700">
                New Vehicle Tenure (Years) *
              </label>
              <input
                type="number"
                {...register('loan_tenure_new_vehicle', { required: 'New vehicle tenure is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 6"
              />
              {errors.loan_tenure_new_vehicle && (
                <p className="mt-2 text-sm text-red-600">{errors.loan_tenure_new_vehicle.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="loan_tenure_recondition_vehicle" className="block text-sm font-medium text-gray-700">
                Reconditioned Vehicle Tenure (Years) *
              </label>
              <input
                type="number"
                {...register('loan_tenure_recondition_vehicle', { required: 'Reconditioned vehicle tenure is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 5"
              />
              {errors.loan_tenure_recondition_vehicle && (
                <p className="mt-2 text-sm text-red-600">{errors.loan_tenure_recondition_vehicle.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Fees</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="processing_fee_percentage" className="block text-sm font-medium text-gray-700">
                Processing Fee (%) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('processing_fee_percentage', { required: 'Processing fee percentage is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 0.50"
              />
              {errors.processing_fee_percentage && (
                <p className="mt-2 text-sm text-red-600">{errors.processing_fee_percentage.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="processing_fee_max" className="block text-sm font-medium text-gray-700">
                Processing Fee Max (৳) *
              </label>
              <input
                type="number"
                {...register('processing_fee_max', { required: 'Processing fee max is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 15000"
              />
              {errors.processing_fee_max && (
                <p className="mt-2 text-sm text-red-600">{errors.processing_fee_max.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="processing_fee_description" className="block text-sm font-medium text-gray-700">
                Processing Fee Description
              </label>
              <textarea
                {...register('processing_fee_description')}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Detailed description of processing fee structure"
              />
            </div>

            <div>
              <label htmlFor="early_settlement_fee" className="block text-sm font-medium text-gray-700">
                Early Settlement Fee (%) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('early_settlement_fee', { required: 'Early settlement fee is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 0.50"
              />
              {errors.early_settlement_fee && (
                <p className="mt-2 text-sm text-red-600">{errors.early_settlement_fee.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="early_settlement_conditions" className="block text-sm font-medium text-gray-700">
                Early Settlement Conditions
              </label>
              <input
                type="text"
                {...register('early_settlement_conditions')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Allowed after 6 installments"
              />
            </div>
          </div>
        </div>

        {/* Age Requirements */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Age Requirements</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="minimum_age" className="block text-sm font-medium text-gray-700">
                Minimum Age *
              </label>
              <input
                type="number"
                {...register('minimum_age', { required: 'Minimum age is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 21"
              />
              {errors.minimum_age && (
                <p className="mt-2 text-sm text-red-600">{errors.minimum_age.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="maximum_age" className="block text-sm font-medium text-gray-700">
                Maximum Age *
              </label>
              <input
                type="number"
                {...register('maximum_age', { required: 'Maximum age is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 65"
              />
              {errors.maximum_age && (
                <p className="mt-2 text-sm text-red-600">{errors.maximum_age.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Loan to Value Ratios */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Loan to Value Ratios</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="loan_to_value_hybrid_electric" className="block text-sm font-medium text-gray-700">
                Hybrid/Electric Vehicle LTV *
              </label>
              <input
                type="text"
                {...register('loan_to_value_hybrid_electric', { required: 'Hybrid/Electric LTV is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 70 (Bank) : 30 (customer)"
              />
              {errors.loan_to_value_hybrid_electric && (
                <p className="mt-2 text-sm text-red-600">{errors.loan_to_value_hybrid_electric.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="loan_to_value_non_hybrid" className="block text-sm font-medium text-gray-700">
                Non-Hybrid Vehicle LTV *
              </label>
              <input
                type="text"
                {...register('loan_to_value_non_hybrid', { required: 'Non-Hybrid LTV is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., 60 (Bank) : 40 (customer)"
              />
              {errors.loan_to_value_non_hybrid && (
                <p className="mt-2 text-sm text-red-600">{errors.loan_to_value_non_hybrid.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Features & Requirements */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Features & Requirements</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-700">
                Features (comma-separated) *
              </label>
              <textarea
                {...register('features', { required: 'Features are required' })}
                rows={4}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="List key features separated by commas"
              />
              {errors.features && (
                <p className="mt-2 text-sm text-red-600">{errors.features.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="eligibility" className="block text-sm font-medium text-gray-700">
                Eligibility Criteria (comma-separated) *
              </label>
              <textarea
                {...register('eligibility', { required: 'Eligibility criteria are required' })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="List eligibility requirements separated by commas"
              />
              {errors.eligibility && (
                <p className="mt-2 text-sm text-red-600">{errors.eligibility.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="required_documents" className="block text-sm font-medium text-gray-700">
                Required Documents (comma-separated) *
              </label>
              <textarea
                {...register('required_documents', { required: 'Required documents are required' })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="List required documents separated by commas"
              />
              {errors.required_documents && (
                <p className="mt-2 text-sm text-red-600">{errors.required_documents.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
                Logo URL
              </label>
              <input
                type="url"
                {...register('logo_url')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label htmlFor="site_visit_url" className="block text-sm font-medium text-gray-700">
                Site Visit URL
              </label>
              <input
                type="url"
                {...register('site_visit_url')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="https://example.com/car-loans"
              />
            </div>

            <div>
              <label htmlFor="score" className="block text-sm font-medium text-gray-700">
                Score (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                {...register('score', { valueAsNumber: true })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="8"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('recommended')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="recommended" className="ml-2 block text-sm text-gray-900">
                  Recommended
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('promoted')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="promoted" className="ml-2 block text-sm text-gray-900">
                  Promoted
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Car Loan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarLoanForm; 