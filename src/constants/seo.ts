export const DEFAULT_SEO = {
  title: 'One Click to Compare | Save Smarter with Konta Nibo',
  description: 'Discover, compare, and choose the best financial and lifestyle products in Bangladesh - all in one place. No bias, just facts. One click away.',
  keywords: 'financial comparison, loans, credit cards, banking, savings accounts, mobile plans',
  ogImage: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Purple%20and%20Blue%20Modern%20Gradient%20Advertising%20Report%20Presentation%20(1200%20x%20630%20px).png',
  siteUrl: 'https://kontanibo.com', // Replace with your actual domain
};

export const PAGE_SEO = {
  home: {
    title: 'Konta Nibo - Compare Financial Products & Services in Bangladesh',
    description: 'Find and compare the best financial products in Bangladesh. Credit cards, loans, mobile plans, and banking services with the best rates and offers.',
    keywords: 'financial comparison Bangladesh, credit cards, loans, mobile plans, banking, savings accounts, EMI calculator',
    ogImage: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Purple%20and%20Blue%20Modern%20Gradient%20Advertising%20Report%20Presentation%20(1200%20x%20630%20px).png',
  },
  personalLoans: {
    title: 'Compare Personal Loans in Bangladesh | Best Rates & Offers | Konta Nibo',
    description: 'Compare personal loans from top banks in Bangladesh. Find the lowest interest rates, calculate EMI, and apply online. Get the best personal loan deals today.',
    keywords: 'personal loans Bangladesh, loan comparison, best personal loan rates, EMI calculator, bank loans, quick loans, loan application',
    ogImage: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Purple%20and%20Blue%20Modern%20Gradient%20Advertising%20Report%20Presentation%20(1200%20x%20630%20px).png',
  },
  creditCards: {
    title: 'Compare Credit Cards in Bangladesh | Rewards & Benefits | Konta Nibo',
    description: 'Find the best credit cards in Bangladesh. Compare rewards, cashback, benefits, and annual fees from leading banks. Apply for your ideal credit card today.',
    keywords: 'credit cards Bangladesh, card comparison, rewards credit cards, cashback cards, best credit card offers',
    ogImage: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Purple%20and%20Blue%20Modern%20Gradient%20Advertising%20Report%20Presentation%20(1200%20x%20630%20px).png',
  },
  homeLoans: {
    title: 'Compare Home Loans & Mortgages in Bangladesh | Konta Nibo',
    description: 'Find the best home loan rates in Bangladesh. Compare mortgage options, calculate EMI, and get expert guidance for your home loan journey.',
    keywords: 'home loans Bangladesh, mortgage rates, house loan comparison, property loan, EMI calculator',
    ogImage: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Purple%20and%20Blue%20Modern%20Gradient%20Advertising%20Report%20Presentation%20(1200%20x%20630%20px).png',
  },
  mobilePlans: {
    title: 'Compare Mobile Plans & Packages in Bangladesh | Konta Nibo',
    description: 'Compare mobile plans from all major providers in Bangladesh. Find the best data packages, call rates, and internet bundles for your needs.',
    keywords: 'mobile plans Bangladesh, data packages, phone plans, internet bundles, prepaid plans, postpaid plans',
    ogImage: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Purple%20and%20Blue%20Modern%20Gradient%20Advertising%20Report%20Presentation%20(1200%20x%20630%20px).png',
  },
  bankAccounts: {
    title: 'Compare Bank Accounts in Bangladesh | Savings & Current | Konta Nibo',
    description: 'Find the best bank accounts in Bangladesh. Compare interest rates, features, and benefits from leading banks for savings and current accounts.',
    keywords: 'bank accounts Bangladesh, savings account, current account, best interest rates, banking comparison',
    ogImage: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Purple%20and%20Blue%20Modern%20Gradient%20Advertising%20Report%20Presentation%20(1200%20x%20630%20px).png',
  },
  about: {
    title: 'About Konta Nibo | Your Trusted Financial Comparison Platform',
    description: 'Learn about Konta Nibo, Bangladesh\'s leading financial product comparison platform. Our mission, values, and commitment to helping you make better financial decisions.',
    keywords: 'about Konta Nibo, financial comparison platform, company mission, our values, financial services Bangladesh',
    ogImage: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Purple%20and%20Blue%20Modern%20Gradient%20Advertising%20Report%20Presentation%20(1200%20x%20630%20px).png',
  },
  contact: {
    title: 'Contact Konta Nibo | Get in Touch with Our Team',
    description: 'Contact Konta Nibo for any questions about financial products, partnerships, or support. We\'re here to help you make informed financial decisions.',
    keywords: 'contact Konta Nibo, customer support, financial advice, help center, partnership inquiries',
    ogImage: 'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Purple%20and%20Blue%20Modern%20Gradient%20Advertising%20Report%20Presentation%20(1200%20x%20630%20px).png',
  },
};

export const generateSEO = {
  title: 'Best Credit Cards, Loans & Bank Accounts in Bangladesh 2025 | Compare & Save',
  description: 'Compare top credit cards, bank accounts, and personal loans in Bangladesh. Find the best financial products tailored to your needs in 2025.',
  keywords: 'credit cards bangladesh, personal loans bangladesh, bank accounts bangladesh, compare financial products, best credit cards 2025, best loans 2025, savings accounts, financial comparison',
  ogImage: '/og-banner.png',
  siteUrl: 'https://kontanibo.com'
};

export const generateCustomSEO = (customSEO: Partial<typeof DEFAULT_SEO>) => {
  return {
    ...DEFAULT_SEO,
    ...customSEO,
  };
};

export const SEO_CONFIG = {
  siteName: 'Konta Nibo',
  siteUrl: 'https://kontanibo.com',
  defaultTitle: 'Compare Financial Products in Bangladesh 2025 | Konta Nibo',
  defaultDescription: 'Find and compare the best financial products in Bangladesh. Expert reviews, unbiased comparisons, and latest offers to help you save more.',
  defaultKeywords: 'financial comparison bangladesh, loans, credit cards, banking, savings accounts, mobile plans, broadband internet',
  
  // Social Media
  facebook: {
    appId: '1008958710478663',
    page: 'https://facebook.com/kontanibo'
  },
  twitter: {
    handle: '@kontanibo',
    cardType: 'summary_large_image'
  },
  
  // Organization Info
  organization: {
    name: 'Konta Nibo',
    logo: 'https://kontanibo.com/logo.png',
    foundingDate: '2023',
    founders: [
      {
        '@type': 'Person',
        name: 'Founder Name'
      }
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@kontanibo.com'
    }
  },

  // Structured Data Templates
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Konta Nibo',
      url: 'https://kontanibo.com',
      logo: 'https://kontanibo.com/logo.png',
      sameAs: [
        'https://facebook.com/kontanibo',
        'https://twitter.com/kontanibo',
        'https://linkedin.com/company/kontanibo'
      ]
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Konta Nibo',
      url: 'https://kontanibo.com',
      potentialAction: {
        '@type': 'SearchAction',
        'target': 'https://kontanibo.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  },

  // Language Alternatives
  languages: [
    { code: 'en', name: 'English', url: 'https://kontanibo.com' },
    { code: 'bn', name: 'Bengali', url: 'https://kontanibo.com/bn' }
  ]
};

export const generateProductSchema = (product: {
  name: string;
  description: string;
  category: string;
  image?: string;
  offers?: any;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  ...product,
  brand: {
    '@type': 'Brand',
    name: 'Konta Nibo'
  }
});

export const generateArticleSchema = (article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  ...article,
  publisher: {
    '@type': 'Organization',
    name: 'Konta Nibo',
    logo: {
      '@type': 'ImageObject',
      url: 'https://kontanibo.com/logo.png'
    }
  }
}); 