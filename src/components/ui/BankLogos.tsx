import React from 'react';

const bankLogos = [
  { name: 'Bank Asia', src: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/banklogos//Bank_Asia_Limited.svg.png' },
  { name: 'Eastern Bank', src: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/banklogos//ebl-logo.jpg' },
  { name: 'HSBC', src: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/banklogos//HSBC-Logo-1.png' },
  { name: 'City Bank', src: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/banklogos//images%20(2).png' },
  { name: 'BRAC Bank', src: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/banklogos//images.jfif' },
  { name: 'United Commercial Bank', src: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/banklogos//Logo_of_United_Commercial_Bank.svg.png' },
  { name: 'Prime Bank', src: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/banklogos//logo-plc-new.png' },
  { name: 'Standard Chartered', src: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/banklogos//Standard_Chartered_(2021).svg.png' },
];

const BankLogos: React.FC = () => {
  return (
    <div className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-center text-gray-600 text-sm font-semibold mb-6">
          Compare offers from leading banks and financial institutions
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-12">
          {bankLogos.map((bank) => (
            <div key={bank.name} className="flex justify-center">
              <img
                className="h-8 md:h-10 object-contain"
                src={bank.src}
                alt={bank.name}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankLogos; 