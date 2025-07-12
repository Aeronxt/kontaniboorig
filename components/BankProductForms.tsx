import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import BankAccountForm from './forms/BankAccountForm';
import SavingsAccountForm from './forms/SavingsAccountForm';
import PersonalLoanForm from './forms/PersonalLoanForm';
import CreditCardForm from './forms/CreditCardForm';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function BankProductForms() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const categories = [
    { name: 'Bank Accounts', component: BankAccountForm },
    { name: 'Savings Accounts', component: SavingsAccountForm },
    { name: 'Personal Loans', component: PersonalLoanForm },
    { name: 'Credit Cards', component: CreditCardForm },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {categories.map((category) => (
            <Tab
              key={category.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {category.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {categories.map((category, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-6',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <category.component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 