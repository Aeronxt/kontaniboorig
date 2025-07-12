import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  pageType?: 'home' | 'mobile-plans' | 'broadband' | 'entertainment' | 'bogo' | 'instant-bank' | 'car-loans' | 'home-loans' | 'personal-loans' | 'calculator' | 'best-rates-finder' | 'credit-cards' | 'savings-accounts' | 'bank-accounts' | 'general';
  structuredData?: any;
  alternateLanguages?: { hreflang: string; href: string }[];
  noIndex?: boolean;
}

// Default SEO values for the homepage
const DEFAULT_HOME_SEO = {
  title: 'Best Credit Cards, Loans & Bank Accounts in Bangladesh 2025 | Compare & Save',
  description: 'Compare top credit cards, bank accounts, and personal loans in Bangladesh. Find the best financial products tailored to your needs in 2025.',
  keywords: 'credit cards bangladesh, personal loans bangladesh, bank accounts bangladesh, compare financial products, best credit cards 2025, best loans 2025, savings accounts, financial comparison'
};

// Page-specific SEO configurations
const PAGE_SEO_CONFIG = {
  'credit-cards': {
    title: 'Best Credit Cards in Bangladesh 2025 | Compare & Apply Online',
    description: 'Compare best credit cards in Bangladesh with lowest fees, best rewards & cashback. Find Visa, Mastercard & Amex cards. Apply online instantly.',
    keywords: 'credit cards bangladesh, visa card bangladesh, mastercard bangladesh, amex card, credit card apply online, rewards credit card, cashback credit card, best credit card offers 2025',
    structuredData: {
      '@type': 'Product',
      name: 'Credit Card Comparison',
      description: 'Compare and find the best credit cards in Bangladesh',
      category: 'Financial Services'
    }
  },
  'personal-loans': {
    title: 'Best Personal Loans in Bangladesh 2025 | Compare & Apply Online',
    description: 'Compare personal loan interest rates from top banks in Bangladesh. Get quick approval, flexible EMI options & instant online application.',
    keywords: 'personal loan bangladesh, quick personal loan, instant loan approval, best loan rates 2025, loan emi calculator, bank loan application',
    structuredData: {
      '@type': 'Service',
      name: 'Personal Loan Comparison',
      provider: {
        '@type': 'Organization',
        name: 'Konta Nibo'
      }
    }
  },
  'savings-accounts': {
    title: 'Best Savings Accounts in Bangladesh 2025 | High Interest Rates',
    description: 'Compare savings accounts with highest interest rates from top banks in Bangladesh. Open account online with best benefits and features.',
    keywords: 'savings account bangladesh, high interest savings, best savings rates 2025, online savings account, bank account opening',
    structuredData: {
      '@type': 'Service',
      name: 'Savings Account Comparison',
      provider: {
        '@type': 'Organization',
        name: 'Konta Nibo'
      }
    }
  },
  'bank-accounts': {
    title: 'Best Bank Accounts in Bangladesh 2025 | Compare & Open Online',
    description: 'Compare current accounts, salary accounts & student accounts from top banks in Bangladesh. Open bank account online with best features.',
    keywords: 'bank account bangladesh, current account, salary account, student account, online bank account opening 2025',
    structuredData: {
      '@type': 'Service',
      name: 'Bank Account Comparison',
      provider: {
        '@type': 'Organization',
        name: 'Konta Nibo'
      }
    }
  }
};

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = '/og-banner.png',
  ogUrl,
  canonical,
  pageType = 'general',
  structuredData,
  alternateLanguages = [],
  noIndex = false,
}) => {
  const siteUrl = 'https://kontanibo.com';
  const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const canonicalUrl = canonical || currentUrl;

  // Get page-specific SEO configuration
  const pageConfig = pageType === 'home' ? DEFAULT_HOME_SEO : PAGE_SEO_CONFIG[pageType] || {};

  // Final SEO values with fallbacks
  const finalTitle = title || pageConfig.title || DEFAULT_HOME_SEO.title;
  const finalDescription = description || pageConfig.description || DEFAULT_HOME_SEO.description;
  const finalKeywords = keywords || pageConfig.keywords || DEFAULT_HOME_SEO.keywords;

  // Structured data with defaults
    const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: finalTitle,
    description: finalDescription,
    url: canonicalUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Konta Nibo',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    }
  };

  const finalStructuredData = structuredData || pageConfig.structuredData || baseStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Robots Meta */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Geographic targeting */}
      <meta name="geo.region" content="BD" />
      <meta name="geo.country" content="Bangladesh" />
      <meta name="geo.placename" content="Bangladesh" />

      {/* Language and Content */}
      <meta httpEquiv="Content-Language" content="en-BD" />
      <meta name="language" content="English" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:site_name" content="Konta Nibo" />
      <meta property="og:locale" content="en_BD" />
      <meta property="fb:app_id" content="1008958710478663" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:image:alt" content={finalTitle} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Languages */}
      {alternateLanguages.map((lang, index) => (
        <link key={index} rel="alternate" hrefLang={lang.hreflang} href={lang.href} />
      ))}

      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#1B1F3B" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Konta Nibo" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Konta Nibo" />
      <meta name="publisher" content="Konta Nibo" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} Konta Nibo. All rights reserved.`} />
      <meta name="revisit-after" content="7 days" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//wrczctvglyhprlbkogjb.supabase.co" />

      {/* Preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://wrczctvglyhprlbkogjb.supabase.co" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO; 