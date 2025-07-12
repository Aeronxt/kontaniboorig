import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Home, 
  Car, 
  Wallet, 
  ChevronDown, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Shield,
  Star,
  ArrowRight,
  ArrowLeft,
  Target,
  Zap,
  Award,
  BarChart3
} from 'lucide-react';

const creditOptions = [
  { 
    label: 'Credit Card', 
    icon: <CreditCard size={40} />, 
    key: 'credit-card',
    gradient: 'from-blue-500 to-purple-600',
    description: 'Check your credit card approval chances'
  },
  { 
    label: 'Personal Loan', 
    icon: <Wallet size={40} />, 
    key: 'personal-loan',
    gradient: 'from-green-500 to-teal-600',
    description: 'Assess personal loan eligibility'
  },
  { 
    label: 'Car Loan', 
    icon: <Car size={40} />, 
    key: 'car-loan',
    gradient: 'from-orange-500 to-red-600',
    description: 'Evaluate car loan approval rate'
  },
  { 
    label: 'Home Loan', 
    icon: <Home size={40} />, 
    key: 'home-loan',
    gradient: 'from-indigo-500 to-blue-600',
    description: 'Calculate home loan eligibility'
  },
];

interface FormData {
  name: string;
  age: string;
  employment: string;
  monthlyIncome: string;
  creditHistory: string;
  existingCreditLimit: string;
  monthlyLoanRepayment: string;
  savings: string;
  dti: string;
  securityMethod: string;
  securedAssetValue: string;
}

const creditCardFields = {
  age: {
    label: 'Age',
    description: 'Applicants aged 22–50 are often viewed favorably due to stable income and lower risk profiles.',
    options: [
      { label: '22–35', value: '22-35', points: 20 },
      { label: '36–50', value: '36-50', points: 15 },
      { label: '51–60', value: '51-60', points: 10 },
      { label: '18–21', value: '18-21', points: 5 },
      { label: '61+', value: '61+', points: 5 },
    ],
  },
  employment: {
    label: 'Employment Type',
    description: 'Stable employment, especially in the public sector, enhances approval chances.',
    options: [
      { label: 'Salaried (Public Sector)', value: 'public', points: 20 },
      { label: 'Salaried (Private Sector)', value: 'private', points: 18 },
      { label: 'Self-Employed Professional', value: 'self-employed', points: 15 },
      { label: 'Freelancer/Contractual', value: 'freelancer', points: 10 },
      { label: 'Student', value: 'student', points: 5 },
      { label: 'Unemployed', value: 'unemployed', points: 0 },
    ],
  },
  monthlyIncome: {
    label: 'Monthly Income',
    description: 'Higher income levels indicate better repayment capacity.',
    options: [
      { label: 'BDT 100,000+', value: '100000+', points: 20 },
      { label: 'BDT 50,000–99,999', value: '50000-99999', points: 15 },
      { label: 'BDT 30,000–49,999', value: '30000-49999', points: 10 },
      { label: 'Below BDT 30,000', value: '<30000', points: 5 },
    ],
  },
  creditHistory: {
    label: 'Credit History (CIB Report)',
    description: 'A positive credit history enhances approval chances.',
    options: [
      { label: 'Excellent (No Defaults)', value: 'excellent', points: 20 },
      { label: 'Good (Minor Delays)', value: 'good', points: 15 },
      { label: 'Fair (Some Delinquencies)', value: 'fair', points: 10 },
      { label: 'Poor (Defaults/Write-offs)', value: 'poor', points: 5 },
      { label: 'No Credit History', value: 'none', points: 5 },
    ],
  },
  existingCreditLimit: {
    label: 'Existing Credit Limit',
    description: 'Lower existing credit limits suggest less exposure to debt.',
    options: [
      { label: 'None', value: 'none', points: 10 },
      { label: 'Up to BDT 100,000', value: '0-100000', points: 8 },
      { label: 'BDT 100,001–300,000', value: '100001-300000', points: 5 },
      { label: 'Above BDT 300,000', value: '300000+', points: 2 },
    ],
  },
  monthlyLoanRepayment: {
    label: 'Monthly Loan Repayments',
    description: 'Lower monthly obligations indicate better repayment capacity.',
    options: [
      { label: 'None', value: 'none', points: 10 },
      { label: 'Up to BDT 10,000', value: '0-10000', points: 7 },
      { label: 'BDT 10,001–20,000', value: '10001-20000', points: 4 },
      { label: 'Above BDT 20,000', value: '20000+', points: 1 },
    ],
  },
  savings: {
    label: 'Savings',
    description: 'Higher savings reflect financial stability.',
    options: [
      { label: 'Above BDT 500,000', value: '500000+', points: 10 },
      { label: 'BDT 200,001–500,000', value: '200001-500000', points: 8 },
      { label: 'BDT 50,001–200,000', value: '50001-200000', points: 5 },
      { label: 'Up to BDT 50,000', value: '0-50000', points: 2 },
    ],
  },
  dti: {
    label: 'Debt-to-Income Ratio (DTI)',
    description: 'Lower DTI indicates better ability to take on new credit.',
    options: [
      { label: 'Below 30%', value: '<30', points: 10 },
      { label: '30%–50%', value: '30-50', points: 5 },
      { label: 'Above 50%', value: '>50', points: 2 },
    ],
  },
};

const carLoanFields = {
  age: {
    label: 'Age',
    description: 'Applicants aged 22–50 are often viewed favorably due to stable income and lower risk profiles.',
    options: [
      { label: '22–35', value: '22-35', points: 20 },
      { label: '36–50', value: '36-50', points: 15 },
      { label: '51–60', value: '51-60', points: 10 },
      { label: '61–65', value: '61-65', points: 5 },
      { label: 'Below 22', value: '<22', points: 0 },
    ],
  },
  employment: {
    label: 'Employment Type',
    description: 'Stable employment, especially in the public sector, enhances approval chances.',
    options: [
      { label: 'Salaried (Public Sector)', value: 'public', points: 20 },
      { label: 'Salaried (Private Sector)', value: 'private', points: 18 },
      { label: 'Self-Employed Professional', value: 'self-employed', points: 15 },
      { label: 'Business Owner', value: 'business', points: 12 },
      { label: 'Freelancer/Contractual', value: 'freelancer', points: 10 },
      { label: 'Unemployed', value: 'unemployed', points: 0 },
    ],
  },
  monthlyIncome: {
    label: 'Monthly Income',
    description: 'Higher income levels indicate better repayment capacity.',
    options: [
      { label: 'BDT 100,000+', value: '100000+', points: 20 },
      { label: 'BDT 70,000–99,999', value: '70000-99999', points: 15 },
      { label: 'BDT 50,000–69,999', value: '50000-69999', points: 10 },
      { label: 'BDT 30,000–49,999', value: '30000-49999', points: 5 },
      { label: 'Below BDT 30,000', value: '<30000', points: 0 },
    ],
  },
  creditHistory: {
    label: 'Credit History (CIB Report)',
    description: 'A positive credit history enhances approval chances.',
    options: [
      { label: 'Excellent (No Defaults)', value: 'excellent', points: 20 },
      { label: 'Good (Minor Delays)', value: 'good', points: 15 },
      { label: 'Fair (Some Delinquencies)', value: 'fair', points: 10 },
      { label: 'Poor (Defaults/Write-offs)', value: 'poor', points: 5 },
      { label: 'No Credit History', value: 'none', points: 5 },
    ],
  },
  monthlyLoanRepayment: {
    label: 'Existing Loan Obligations',
    description: 'Lower monthly obligations indicate better repayment capacity.',
    options: [
      { label: 'None', value: 'none', points: 10 },
      { label: 'Up to BDT 10,000', value: '0-10000', points: 7 },
      { label: 'BDT 10,001–20,000', value: '10001-20000', points: 4 },
      { label: 'Above BDT 20,000', value: '20000+', points: 1 },
    ],
  },
  savings: {
    label: 'Savings/Assets',
    description: 'Higher savings reflect financial stability.',
    options: [
      { label: 'Above BDT 500,000', value: '500000+', points: 10 },
      { label: 'BDT 200,001–500,000', value: '200001-500000', points: 8 },
      { label: 'BDT 50,001–200,000', value: '50001-200000', points: 5 },
      { label: 'Up to BDT 50,000', value: '0-50000', points: 2 },
    ],
  },
  dti: {
    label: 'Debt-to-Income Ratio (DTI)',
    description: 'Lower DTI indicates better ability to take on new credit.',
    options: [
      { label: 'Below 30%', value: '<30', points: 10 },
      { label: '30%–50%', value: '30-50', points: 5 },
      { label: 'Above 50%', value: '>50', points: 2 },
    ],
  },
};

const homeLoanFields = {
  age: {
    label: 'Age',
    description: 'Applicants aged 25–60 are often viewed favorably due to stable income and lower risk profiles.',
    options: [
      { label: '25–45', value: '25-45', points: 20 },
      { label: '46–60', value: '46-60', points: 15 },
      { label: '61–65', value: '61-65', points: 5 },
      { label: 'Below 25', value: '<25', points: 0 },
    ],
  },
  employment: {
    label: 'Employment Type',
    description: 'Stable employment, especially in the public sector, enhances approval chances.',
    options: [
      { label: 'Salaried (Public Sector)', value: 'public', points: 20 },
      { label: 'Salaried (Private Sector)', value: 'private', points: 18 },
      { label: 'Self-Employed Professional', value: 'self-employed', points: 15 },
      { label: 'Business Owner', value: 'business', points: 12 },
      { label: 'Freelancer/Contractual', value: 'freelancer', points: 10 },
      { label: 'Unemployed', value: 'unemployed', points: 0 },
    ],
  },
  monthlyIncome: {
    label: 'Monthly Income',
    description: 'Higher income levels indicate better repayment capacity.',
    options: [
      { label: 'BDT 100,000+', value: '100000+', points: 20 },
      { label: 'BDT 70,000–99,999', value: '70000-99999', points: 15 },
      { label: 'BDT 50,000–69,999', value: '50000-69999', points: 10 },
      { label: 'BDT 30,000–49,999', value: '30000-49999', points: 5 },
      { label: 'Below BDT 30,000', value: '<30000', points: 0 },
    ],
  },
  creditHistory: {
    label: 'Credit History (CIB Report)',
    description: 'A positive credit history enhances approval chances.',
    options: [
      { label: 'Excellent (No Defaults)', value: 'excellent', points: 20 },
      { label: 'Good (Minor Delays)', value: 'good', points: 15 },
      { label: 'Fair (Some Delinquencies)', value: 'fair', points: 10 },
      { label: 'Poor (Defaults/Write-offs)', value: 'poor', points: 5 },
      { label: 'No Credit History', value: 'none', points: 5 },
    ],
  },
  monthlyLoanRepayment: {
    label: 'Existing Loan Obligations',
    description: 'Lower monthly obligations indicate better repayment capacity.',
    options: [
      { label: 'None', value: 'none', points: 10 },
      { label: 'Up to BDT 10,000', value: '0-10000', points: 7 },
      { label: 'BDT 10,001–20,000', value: '10001-20000', points: 4 },
      { label: 'Above BDT 20,000', value: '20000+', points: 1 },
    ],
  },
  savings: {
    label: 'Savings/Assets',
    description: 'Higher savings reflect financial stability.',
    options: [
      { label: 'Above BDT 500,000', value: '500000+', points: 10 },
      { label: 'BDT 200,001–500,000', value: '200001-500000', points: 8 },
      { label: 'BDT 50,001–200,000', value: '50001-200000', points: 5 },
      { label: 'Up to BDT 50,000', value: '0-50000', points: 2 },
    ],
  },
  dti: {
    label: 'Debt-to-Income Ratio (DTI)',
    description: 'Lower DTI indicates better ability to take on new credit.',
    options: [
      { label: 'Below 30%', value: '<30', points: 10 },
      { label: '30%–50%', value: '30-50', points: 5 },
      { label: 'Above 50%', value: '>50', points: 2 },
    ],
  },
};

const personalLoanFields = {
  age: {
    label: 'Age',
    description: 'Applicants aged 25–60 are often viewed favorably due to stable income and lower risk profiles.',
    options: [
      { label: '25–45', value: '25-45', points: 20 },
      { label: '46–60', value: '46-60', points: 15 },
      { label: '61–65', value: '61-65', points: 5 },
      { label: 'Below 25', value: '<25', points: 0 },
    ],
  },
  employment: {
    label: 'Employment Type',
    description: 'Stable employment, especially in the public sector, enhances approval chances.',
    options: [
      { label: 'Salaried (Public Sector)', value: 'public', points: 20 },
      { label: 'Salaried (Private Sector)', value: 'private', points: 18 },
      { label: 'Self-Employed Professional', value: 'self-employed', points: 15 },
      { label: 'Business Owner', value: 'business', points: 12 },
      { label: 'Freelancer/Contractual', value: 'freelancer', points: 10 },
      { label: 'Unemployed', value: 'unemployed', points: 0 },
    ],
  },
  monthlyIncome: {
    label: 'Monthly Income',
    description: 'Higher income levels indicate better repayment capacity.',
    options: [
      { label: 'BDT 100,000+', value: '100000+', points: 20 },
      { label: 'BDT 70,000–99,999', value: '70000-99999', points: 15 },
      { label: 'BDT 50,000–69,999', value: '50000-69999', points: 10 },
      { label: 'BDT 30,000–49,999', value: '30000-49999', points: 5 },
      { label: 'Below BDT 30,000', value: '<30000', points: 0 },
    ],
  },
  creditHistory: {
    label: 'Credit History (CIB Report)',
    description: 'A positive credit history enhances approval chances.',
    options: [
      { label: 'Excellent (No Defaults)', value: 'excellent', points: 20 },
      { label: 'Good (Minor Delays)', value: 'good', points: 15 },
      { label: 'Fair (Some Delinquencies)', value: 'fair', points: 10 },
      { label: 'Poor (Defaults/Write-offs)', value: 'poor', points: 5 },
      { label: 'No Credit History', value: 'none', points: 5 },
    ],
  },
  monthlyLoanRepayment: {
    label: 'Existing Loan Obligations',
    description: 'Lower monthly obligations indicate better repayment capacity.',
    options: [
      { label: 'None', value: 'none', points: 10 },
      { label: 'Up to BDT 10,000', value: '0-10000', points: 7 },
      { label: 'BDT 10,001–20,000', value: '10001-20000', points: 4 },
      { label: 'Above BDT 20,000', value: '20000+', points: 1 },
    ],
  },
  savings: {
    label: 'Savings/Assets',
    description: 'Higher savings reflect financial stability.',
    options: [
      { label: 'Above BDT 500,000', value: '500000+', points: 10 },
      { label: 'BDT 200,001–500,000', value: '200001-500000', points: 8 },
      { label: 'BDT 50,001–200,000', value: '50001-200000', points: 5 },
      { label: 'Up to BDT 50,000', value: '0-50000', points: 2 },
    ],
  },
  dti: {
    label: 'Debt-to-Income Ratio (DTI)',
    description: 'A lower DTI ratio is favorable for loan approval.',
    options: [
      { label: 'Below 30%', value: '<30', points: 10 },
      { label: '30%–50%', value: '30-50', points: 5 },
      { label: 'Above 50%', value: '>50', points: 2 },
    ],
  },
  securityMethod: {
    label: 'Security Method',
    description: 'Providing collateral or a guarantor can enhance approval chances.',
    options: [
      { label: 'Secured (e.g., Fixed Deposit)', value: 'secured', points: 10 },
      { label: 'Unsecured with Guarantor', value: 'guarantor', points: 7 },
      { label: 'Unsecured without Guarantor', value: 'unsecured', points: 5 },
    ],
  },
  securedAssetValue: {
    label: 'Value of Secured Asset',
    description: 'Higher value of secured assets can improve loan approval chances.',
    options: [
      { label: 'Above BDT 1,000,000', value: '1000000+', points: 10 },
      { label: 'BDT 500,001–1,000,000', value: '500001-1000000', points: 8 },
      { label: 'BDT 100,001–500,000', value: '100001-500000', points: 5 },
      { label: 'Up to BDT 100,000', value: '0-100000', points: 2 },
    ],
  },
};

const getFormFields = (productType: string) => {
  switch (productType) {
    case 'car-loan':
      return carLoanFields;
    case 'home-loan':
      return homeLoanFields;
    case 'personal-loan':
      return personalLoanFields;
    case 'credit-card':
      return creditCardFields;
    default:
      return creditCardFields;
  }
};

const getApprovalFeedback = (approvalRate: number, productType: string) => {
  if (productType === 'personal-loan') {
    if (approvalRate >= 80) {
      return {
        title: 'Excellent Personal Loan Approval Chance!',
        message: 'Your profile shows strong eligibility for a personal loan. You can expect competitive interest rates and favorable terms.',
      };
    } else if (approvalRate >= 60) {
      return {
        title: 'Good Personal Loan Approval Chance',
        message: 'You have a good chance of personal loan approval. Consider comparing offers from different lenders.',
      };
    } else if (approvalRate >= 40) {
      return {
        title: 'Moderate Personal Loan Approval Chance',
        message: 'Consider improving your financial profile or exploring secured loan options for better chances.',
      };
    } else {
      return {
        title: 'Lower Personal Loan Approval Chance',
        message: 'It may be beneficial to improve your credit profile, increase savings, or consider a guarantor before applying.',
      };
    }
  } else if (productType === 'home-loan') {
    if (approvalRate >= 80) {
      return {
        title: 'Excellent Home Loan Approval Chance!',
        message: 'Your profile shows strong eligibility for a home loan. You can confidently apply for competitive mortgage rates.',
      };
    } else if (approvalRate >= 60) {
      return {
        title: 'Good Home Loan Approval Chance',
        message: 'You have a good chance of home loan approval. Consider shopping around for the best mortgage rates.',
      };
    } else if (approvalRate >= 40) {
      return {
        title: 'Moderate Home Loan Approval Chance',
        message: 'Consider improving your financial profile or exploring different home loan options. You might need a larger down payment.',
      };
    } else {
      return {
        title: 'Lower Home Loan Approval Chance',
        message: 'It may be beneficial to improve your credit profile, increase savings, or consider a co-borrower before applying for a home loan.',
      };
    }
  } else if (productType === 'car-loan') {
    if (approvalRate >= 80) {
      return {
        title: 'Excellent Car Loan Approval Chance!',
        message: 'Your profile shows strong eligibility for a car loan. You can confidently apply for competitive rates.',
      };
    } else if (approvalRate >= 60) {
      return {
        title: 'Good Car Loan Approval Chance',
        message: 'You have a good chance of car loan approval, though rates might vary based on other factors.',
      };
    } else if (approvalRate >= 40) {
      return {
        title: 'Moderate Car Loan Approval Chance',
        message: 'Consider improving your financial profile or exploring different car loan options.',
      };
    } else {
      return {
        title: 'Lower Car Loan Approval Chance',
        message: 'It may be beneficial to improve your credit profile or consider a co-signer before applying.',
      };
    }
  }
  
  // Credit card feedback remains unchanged
  if (approvalRate >= 80) {
    return {
      title: 'Excellent Credit Card Approval Chance!',
      message: 'You have a very strong profile for credit card approval.',
    };
  } else if (approvalRate >= 60) {
    return {
      title: 'Good Credit Card Approval Chance',
      message: 'Your profile shows good potential for credit card approval.',
    };
  } else if (approvalRate >= 40) {
    return {
      title: 'Moderate Credit Card Approval Chance',
      message: 'You might want to improve some factors before applying.',
    };
  } else {
    return {
      title: 'Lower Credit Card Approval Chance',
      message: 'Consider improving your credit profile before applying.',
    };
  }
};

const calculateApprovalRate = (data: FormData, productType: string): number => {
  try {
    const fields = getFormFields(productType);
    let totalPoints = 0;
    let maxPoints = 0;

    Object.entries(fields).forEach(([key, field]) => {
      const selectedOption = field.options.find(opt => opt.value === data[key as keyof FormData]);
      if (selectedOption) {
        totalPoints += selectedOption.points;
      }
      maxPoints += Math.max(...field.options.map(opt => opt.points));
    });

    if (maxPoints === 0) return 0;
    return Math.min(Math.round((totalPoints / maxPoints) * 100), 99);
  } catch (error) {
    console.error('Error calculating approval rate:', error);
    return 0;
  }
};

const Meter = ({ value }: { value: number }) => {
  const getColorByValue = (val: number) => {
    if (val >= 80) return 'from-green-400 to-emerald-500';
    if (val >= 60) return 'from-yellow-400 to-orange-500';
    if (val >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getTextColorByValue = (val: number) => {
    if (val >= 80) return 'text-green-600';
    if (val >= 60) return 'text-yellow-600';
    if (val >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <motion.div 
      className="relative w-48 h-48 md:w-64 md:h-64 mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      {/* Background Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - value / 100) }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {value >= 80 ? (
              <>
                <stop offset="0%" stopColor="#4ade80" stopOpacity={1} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
              </>
            ) : value >= 60 ? (
              <>
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={1} />
              </>
            ) : value >= 40 ? (
              <>
                <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
              </>
            )}
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <div className={`text-3xl md:text-4xl font-bold ${getTextColorByValue(value)} mb-1 md:mb-2`}>
            {Math.round(value)}%
          </div>
          <div className="text-xs md:text-sm text-gray-600 font-medium">
            Approval Rate
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Dropdown = ({ 
  label,
  description, 
  options, 
  value, 
  onChange 
}: { 
  label: string;
  description: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">{label}</h3>
          <Info size={14} className="md:w-4 md:h-4 text-gray-400" />
        </div>
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 px-1">
          {description}
        </p>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-white border-2 border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-4 text-left flex justify-between items-center hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className={`text-sm md:text-base ${value ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {value ? options.find(opt => opt.value === value)?.label : 'Select an option...'}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="md:w-5 md:h-5 text-gray-400" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-lg max-h-48 md:max-h-60 overflow-auto"
              >
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 text-left text-sm md:text-base hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-blue-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900">{option.label}</span>
                      {value === option.value && (
                        <CheckCircle size={14} className="md:w-4 md:h-4 text-blue-600" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const DisclaimerModal = ({ onAccept }: { onAccept: () => void }) => (
  <motion.div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 max-w-md w-full shadow-2xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="text-yellow-600" size={20} />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Important Disclaimer</h2>
      </div>
      
      <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 text-gray-600 text-sm md:text-base">
        <p>
          This tool provides an <strong>estimated approval rate</strong> based on general criteria. 
          Actual approval depends on bank-specific policies and additional factors.
        </p>
        <p>
          Results are for <strong>informational purposes only</strong> and do not guarantee approval 
          or constitute financial advice.
        </p>
      </div>
      
      <button
        onClick={onAccept}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
      >
        I Understand
        <ArrowRight size={14} className="md:w-4 md:h-4" />
      </button>
    </motion.div>
  </motion.div>
);

const KontaNiboScore = ({ approvalRate }: { approvalRate: number }) => {
  const getScoreCategory = (score: number) => {
    if (score >= 80) return { 
      label: 'Excellent', 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      icon: <Award className="text-green-600" size={20} />
    };
    if (score >= 60) return { 
      label: 'Good', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      icon: <Star className="text-blue-600" size={20} />
    };
    if (score >= 40) return { 
      label: 'Fair', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-100',
      icon: <BarChart3 className="text-yellow-600" size={20} />
    };
    return { 
      label: 'Poor', 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      icon: <Target className="text-red-600" size={20} />
    };
  };

  const category = getScoreCategory(approvalRate);

  return (
    <motion.div
      className="w-full mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl md:rounded-2xl border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-8 h-8 md:w-10 md:h-10 ${category.bgColor} rounded-full flex items-center justify-center`}>
            <div className="scale-75 md:scale-100">
              {category.icon}
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Konta Nibo Score</h3>
            <p className="text-xs md:text-sm text-gray-600">Credit Assessment Rating</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-xl md:text-2xl font-bold ${category.color}`}>
            {Math.round(approvalRate)}
          </div>
          <div className={`text-xs md:text-sm font-medium ${category.color}`}>
            {category.label}
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                  <motion.div
            className={`h-1.5 md:h-2 rounded-full bg-gradient-to-r ${
              approvalRate >= 80 ? 'from-green-400 to-green-600' :
              approvalRate >= 60 ? 'from-blue-400 to-blue-600' :
              approvalRate >= 40 ? 'from-yellow-400 to-yellow-600' :
              'from-red-400 to-red-600'
            }`}
          initial={{ width: 0 }}
          animate={{ width: `${approvalRate}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

const ImprovementTips = () => {
  const tips = [
    {
      icon: <TrendingUp className="text-green-600" size={20} />,
      title: "Improve Credit History",
      description: "Maintain a clean credit record with timely payments",
      impact: "High Impact"
    },
    {
      icon: <Shield className="text-blue-600" size={20} />,
      title: "Increase Monthly Income",
      description: "Higher income demonstrates better repayment capacity",
      impact: "High Impact"
    },
    {
      icon: <Zap className="text-purple-600" size={20} />,
      title: "Reduce Existing Debt",
      description: "Lower debt-to-income ratio improves approval chances",
      impact: "Medium Impact"
    },
    {
      icon: <Target className="text-orange-600" size={20} />,
      title: "Build Savings",
      description: "Higher savings show financial stability",
      impact: "Medium Impact"
    }
  ];

  return (
    <motion.div
      className="w-full mt-6 md:mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <TrendingUp className="text-blue-600" size={12} />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-gray-900">Improvement Tips</h3>
      </div>
      
      <div className="grid gap-3 md:gap-4">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            className="p-3 md:p-4 bg-white rounded-lg md:rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
          >
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="scale-75 md:scale-100">
                  {tip.icon}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">{tip.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tip.impact === 'High Impact' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tip.impact}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const CreditScorePage: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    employment: '',
    monthlyIncome: '',
    creditHistory: '',
    existingCreditLimit: '',
    monthlyLoanRepayment: '',
    savings: '',
    dti: '',
    securityMethod: '',
    securedAssetValue: '',
  });

  const handleSelect = (key: string) => {
    setSelected(key);
    setStep(1);
    setFormStep(0);
    // Reset form data when switching products
    setFormData({
      name: '',
      age: '',
      employment: '',
      monthlyIncome: '',
      creditHistory: '',
      existingCreditLimit: '',
      monthlyLoanRepayment: '',
      savings: '',
      dti: '',
      securityMethod: '',
      securedAssetValue: '',
    });
  };

  const handleNext = () => {
    const fields = Object.keys(getFormFields(selected || 'credit-card'));
    if (formStep < fields.length) {
      setFormStep(formStep + 1);
    }
  };

  const handleBack = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1);
    } else {
      setStep(0);
    }
  };

  const isCurrentStepValid = () => {
    if (!selected) return false;
    const fields = Object.keys(getFormFields(selected));
    if (formStep < fields.length) {
      const currentField = fields[formStep] as keyof FormData;
      return formData[currentField] !== '';
    }
    return true;
  };

  const renderForm = () => {
    if (!selected) return null;
    
    try {
      const fields = Object.entries(getFormFields(selected));
      
      if (formStep >= fields.length) {
        const approvalRate = calculateApprovalRate(formData, selected);
        const feedback = getApprovalFeedback(approvalRate, selected);
      
      return (
        <motion.div
          className="flex flex-col items-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your Results</h2>
            <p className="text-gray-600 text-sm md:text-base px-4">Based on the information you provided</p>
          </div>
          
          <Meter value={approvalRate} />
          
          <motion.div 
            className="mt-6 md:mt-8 text-center max-w-lg px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
              {feedback.title}
            </h3>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              {feedback.message}
            </p>
          </motion.div>
          
          <KontaNiboScore approvalRate={approvalRate} />
          <ImprovementTips />
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8 px-4">
            <button
              className="px-4 md:px-6 py-2 md:py-3 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              onClick={handleBack}
              type="button"
            >
              <ArrowLeft size={14} className="md:w-4 md:h-4" />
              Back to Questions
            </button>
            <button
              className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg md:rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
              onClick={() => {
                setStep(0);
                setSelected(null);
                setFormStep(0);
              }}
              type="button"
            >
              Check Another Product
              <ArrowRight size={14} className="md:w-4 md:h-4" />
            </button>
          </div>
        </motion.div>
      );
    }

    const currentField = fields[formStep];
    const fieldKey = currentField[0] as keyof FormData;
    const fieldData = currentField[1];

    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress Bar */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs md:text-sm font-medium text-gray-600">
              Question {formStep + 1} of {fields.length}
            </span>
            <span className="text-xs md:text-sm text-gray-500">
              {Math.round(((formStep + 1) / fields.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
            <motion.div
              className="h-1.5 md:h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((formStep + 1) / fields.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <Dropdown
          label={fieldData.label}
          description={fieldData.description}
          options={fieldData.options}
          value={formData[fieldKey]}
          onChange={(value) => setFormData({ ...formData, [fieldKey]: value })}
        />
        
        <div className="flex justify-between items-center mt-6 md:mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 md:px-6 py-2 md:py-3 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <ArrowLeft size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg md:rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 text-sm md:text-base"
          >
            <span className="hidden sm:inline">
              {formStep === fields.length - 1 ? 'View Results' : 'Next Question'}
            </span>
            <span className="sm:hidden">
              {formStep === fields.length - 1 ? 'Results' : 'Next'}
            </span>
            <ArrowRight size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      </motion.div>
    );
    } catch (error) {
      console.error('Error rendering form:', error);
      return (
        <div className="text-center py-8">
          <p className="text-red-600">An error occurred. Please try again.</p>
          <button 
            onClick={() => {
              setStep(0);
              setSelected(null);
              setFormStep(0);
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Over
          </button>
        </div>
      );
    }
  };

  const selectedOption = creditOptions.find(opt => opt.key === selected);

  return (
    <>
      <AnimatePresence>
        {showDisclaimer && (
          <DisclaimerModal onAccept={() => setShowDisclaimer(false)} />
        )}
      </AnimatePresence>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
              Free Credit Score Check Bangladesh: Get Your Credit Report Online Instantly
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Get instant insights into your credit approval chances with our advanced assessment tool
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-8 lg:p-12"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring', delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-6 md:mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
                      Choose Your Product
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg px-2">
                      Select the financial product you want to check approval rates for
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {creditOptions.map((opt, index) => (
                      <motion.button
                        key={opt.key}
                        className="group relative overflow-hidden bg-white border-2 border-gray-200 hover:border-transparent rounded-xl md:rounded-2xl p-4 md:p-8 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        onClick={() => handleSelect(opt.key)}
                        type="button"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${opt.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                          <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${opt.gradient} rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <div className="scale-75 md:scale-100">
                              {opt.icon}
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                            {opt.label}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600">
                            {opt.description}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {step === 1 && selected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-6 md:mb-10">
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${selectedOption?.gradient} rounded-lg md:rounded-xl flex items-center justify-center text-white`}>
                        <div className="scale-75 md:scale-100">
                          {selectedOption?.icon}
                        </div>
                      </div>
                      <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                        {selectedOption?.label} Assessment
                      </h2>
                    </div>
                    <p className="text-gray-600 text-base md:text-lg px-4">
                      Answer a few questions to get your personalized approval rate
                    </p>
                  </div>
                  
                  {renderForm()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreditScorePage; 