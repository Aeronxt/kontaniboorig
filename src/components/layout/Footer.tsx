import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import SocialMediaLinks from '../ui/SocialMediaLinks';

interface FooterLink {
  label: string;
  path: string;
  newTab?: boolean;
}

interface FooterLinks {
  'We Compare': FooterLink[];
  'Company': FooterLink[];
  'Connect': FooterLink[];
}

const footerLinks: FooterLinks = {
  'We Compare': [
    { label: 'Credit cards', path: '/credit-cards' },
    { label: 'Mobile plans', path: '/mobile-plans' },
    { label: 'Personal Loans', path: '/personal-loans' },
    { label: 'Car Loans', path: '/car-loans' },
    { label: 'Home loans', path: '/home-loans' },
    { label: 'Health insurance', path: '/insurance' },
    { label: 'Savings accounts', path: '/savings-accounts' },
    { label: 'Bank Accounts', path: '/bank-accounts' },
    { label: 'Car insurance', path: '/insurance' },
    { label: 'Broadband', path: '/broadband' },
    { label: 'Energy', path: '/utilities' },
    { label: 'Travel insurance', path: '/insurance' },
    { label: 'Mobile payments', path: '/mobile-payments' },
  ],
  'Company': [
    { label: 'About us', path: '/about', newTab: false },
    { label: 'How we make money', path: '/how-we-make-money', newTab: false },
    { label: 'Terms of service', path: '/terms-of-service', newTab: false },
  ],
  'Connect': [
    { label: 'Contact us', path: '/contact', newTab: false },
    { label: 'Partner with us', path: '/partner-with-us', newTab: false },
    { label: 'Invest with us', path: '/invest-with-us', newTab: false },
    { label: 'Careers', path: '/careers', newTab: false },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-gray-900 font-semibold mb-4">We Compare</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2">
                {footerLinks['We Compare'].slice(0, 6).map((link: FooterLink) => (
                  <li key={link.label}>
                    {link.newTab ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {footerLinks['We Compare'].slice(6).map((link: FooterLink) => (
                  <li key={link.label}>
                    {link.newTab ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {(['Company', 'Connect'] as const).map((category) => (
            <div key={category}>
              <h3 className="text-gray-900 font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {footerLinks[category].map((link: FooterLink) => (
                  <li key={link.label}>
                    {link.newTab ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img 
                src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//LOG32PNG.png" 
                alt="Konta Nibo Logo" 
                className="h-12 object-contain"
              />
            </div>
            <div className="text-sm text-gray-600">
              <div>© {new Date().getFullYear()} Aeron X Technologies. All rights reserved.</div>
              <div className="mt-1 text-gray-500">Proudly a Bangladeshi Startup (Kontanibo.com)</div>
              <div className="mt-1 text-gray-500">
                Built by{' '}
                <a 
                  href="https://flowscape.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors underline"
                >
                  Flowscape.xyz
                </a>
              </div>
              <div className="mt-4 text-xs text-gray-400 max-w-2xl">
                All product names, logos, and trademarks are property of their respective owners. We provide comparisons for informational purposes only and do not claim ownership of third-party content.
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <SocialMediaLinks />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;