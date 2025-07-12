import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp,
  Star,
  BarChart3,
  Calculator,
  ChevronRight,
  Clock,
  Sparkles,
  Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureCard from '../components/ui/FeatureCard';
import PromoCard from '../components/ui/PromoCard';
import TestimonialCard from '../components/ui/TestimonialCard';
import SearchHero from '../components/search/SearchHero';
import SEO from '../components/SEO';
import { generateSEO } from '../constants/seo';
import DevelopmentModal from '../components/ui/DevelopmentModal';

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredDeals = [
    { 
      id: 1, 
      title: "Compare Credit Cards", 
      provider: "Multiple Banks", 
      offer: "Best Rates",
      description: "Compare credit cards from multiple banks to find the best rewards and benefits for you.",
      category: "cards",
      link: "/credit-cards",
      image: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//image_fx33.jpg"
    },
    {
      id: 9,
      title: "Entertainment Plans",
      provider: "Multiple Providers",
      offer: "Best Packages",
      description: "Compare entertainment packages and streaming services for the best content and value.",
      category: "entertainment",
      link: "/entertainment",
      image: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//4.jpg"
    },
    { 
      id: 2, 
      title: "Personal Loans", 
      provider: "Multiple Lenders", 
      offer: "Low Interest",
      description: "Find and compare personal loans with competitive interest rates and flexible terms.",
      category: "loans",
      link: "/personal-loans",
      image: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//331.jpg"
    },
    { 
      id: 3, 
      title: "Car Loans", 
      provider: "Auto Finance", 
      offer: "Quick Approval",
      description: "Get the best car loan rates to finance your dream vehicle.",
      category: "loans",
      link: "/car-loans",
      image: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//image_fx35.jpg"
    },
    {
      id: 4,
      title: "Home Loans",
      provider: "Mortgage Lenders",
      offer: "Best Rates",
      description: "Compare home loan options and find the best mortgage rates for your new home.",
      category: "loans",
      link: "/home-loans",
      image: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//image_fx%204.jpg"
    },
    {
      id: 5,
      title: "Mobile Payments",
      provider: "Payment Services",
      offer: "Easy Transfers",
      description: "Compare mobile payment solutions for quick and secure money transfers.",
      category: "payments",
      link: "/mobile-payments",
      image: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//image_fx%207.jpg"
    },
    {
      id: 6,
      title: "Mobile Plans",
      provider: "Network Providers",
      offer: "Best Value",
      description: "Find the perfect mobile plan with the right data, calls, and text package.",
      category: "phone-plans",
      link: "/mobile-plans",
      image: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//bangladeshi-girl-holding-cell-phone-hand-with-smiling-face-wearing-red-kurti_220772-561.jpg"
    },
    {
      id: 7,
      title: "Bank Accounts",
      provider: "Multiple Banks",
      offer: "High Interest",
      description: "Compare bank accounts to find the best features and interest rates for your needs.",
      category: "banking",
      link: "/bank-accounts",
      image: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//img33.jpg"
    },
    {
      id: 8,
      title: "Savings Accounts",
      provider: "Multiple Banks",
      offer: "High Returns",
      description: "Find the best savings accounts with competitive interest rates and flexible features.",
      category: "banking",
      link: "/savings-accounts",
      image: "https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//image_fx4.jpg"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Options' },
    { id: 'cards', label: 'Credit Cards' },
    { id: 'loans', label: 'Loans' },
    { id: 'payments', label: 'Payments' },
    { id: 'phone-plans', label: 'Phone Plans' },
    { id: 'banking', label: 'Banking' },
    { id: 'entertainment', label: 'Entertainment' }
  ];

  const filteredDeals = selectedCategory === 'all' 
    ? featuredDeals 
    : featuredDeals.filter(deal => deal.category === selectedCategory);

  const quickTools = [
    {
      icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//calculator.png" alt="EMI Calculator" className="w-14 h-14" />,
      title: "EMI Calculator",
      description: "Calculate EMIs for home, car & personal loans",
      link: "/calculator"
    },
    {
      icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//interest-rate.png" alt="Best Rates Finder" className="w-14 h-14" />,
      title: "Best Rates Finder",
      description: "Find the best interest rates for your needs",
      link: "/best-rates-finder"
    },
    {
      icon: <img src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/newicon//speedometer.png" alt="Check Approval Rate" className="w-14 h-14" />,
      title: "Check Approval Rate",
      description: "See your chances of approval before applying",
      link: "/credit-score"
    }
  ];

  const testimonials = [
    { 
      id: 1, 
      name: "Rahul Ahmed", 
      quote: "Found an amazing Robi mobile plan through KontaNibo. 60GB data with unlimited calls at just ৳599. Best decision ever...",
      rating: 5
    },
    { 
      id: 2, 
      name: "Trishita Rahman", 
      quote: "Switched to City Bank's Platinum card through KontaNibo. Now I get 15% discount at all major shopping malls. Much better than my old card...",
      rating: 5
    },
    { 
      id: 3, 
      name: "Mohammad Karim", 
      quote: "KontaNibo helped me find a high-interest savings account at BRAC Bank. Earning 7% interest compared to my old 4%...",
      rating: 5
    },
    {
      id: 4,
      name: "Nusrat Jahan",
      quote: "Got amazing discounts on Netflix and Amazon Prime through KontaNibo's entertainment deals. Saving money while enjoying shows...",
      rating: 5
    },
    {
      id: 5,
      name: "Imran Hossain",
      quote: "Discovered Grameenphone's unlimited data plan. Perfect for my work-from-home needs. Thanks KontaNibo...",
      rating: 5
    },
    {
      id: 6,
      name: "Tasneem Akter",
      quote: "The Standard Chartered Platinum card I found on KontaNibo gives me access to airport lounges worldwide...",
      rating: 5
    },
    {
      id: 7,
      name: "Abdul Kadir",
      quote: "Dutch-Bangla Bank's premium account found through KontaNibo gives free ATM withdrawals nationwide...",
      rating: 5
    },
    {
      id: 8,
      name: "Sabrina Rahman",
      quote: "Found great Chorki and Bioscope subscription deals. Now my family enjoys the best Bengali content...",
      rating: 5
    }
  ];

  // Homepage structured data
  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Konta Nibo',
    url: 'https://kontanibo.com',
    description: 'Compare top credit cards, bank accounts, and personal loans in Bangladesh. Find the best financial products tailored to your needs in 2025.',
    potentialAction: {
      '@type': 'SearchAction',
      'target': 'https://kontanibo.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      'https://facebook.com/kontanibo',
      'https://twitter.com/kontanibo',
      'https://linkedin.com/company/kontanibo'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SEO 
        pageType="home"
        structuredData={homeStructuredData}
        alternateLanguages={[
          { hreflang: "bn", href: "https://kontanibo.com/bn" },
          { hreflang: "x-default", href: "https://kontanibo.com" }
        ]}
      />
      
      {/* SEO Optimized Hidden Content */}
      <h1 className="sr-only">Best Credit Cards, Loans & Bank Accounts in Bangladesh 2025 | Compare & Save</h1>
      <div className="sr-only">
        <p>Compare top credit cards, bank accounts, and personal loans in Bangladesh. Find the best financial products tailored to your needs in 2025.</p>
        <ul>
          <li>Credit Cards: Compare Visa, Mastercard & Amex</li>
          <li>Personal Loans: Best interest rates and quick approval</li>
          <li>Bank Accounts: High-interest savings and current accounts</li>
          <li>Mobile Plans: Best data and call packages</li>
        </ul>
      </div>

      <DevelopmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SearchHero />
      
      {/* Quick Tools Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Quick Tools</h2>
            <p className="text-gray-600">Helpful tools to make better financial decisions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickTools.map((tool, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <Link to={tool.link} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center mb-4">
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                  <ChevronRight className="mt-4 text-blue-600" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Deals Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Most Compared Options</h2>
              <p className="text-gray-600 max-w-2xl">
                Our top-picked deals that offer exceptional value across different categories.
              </p>
            </div>
            <Link 
              to="/deals" 
              className="flex items-center text-blue-600 mt-4 md:mt-0 font-medium hover:text-blue-700 transition-colors"
            >
              View all deals <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeals.map((deal) => (
              <motion.div
                key={deal.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <Link to={deal.link || '#'} className="block">
                  <div className="relative h-48">
                    <img 
                      src={deal.image} 
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {deal.offer}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2">{deal.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{deal.provider}</p>
                    <p className="text-sm text-gray-700">{deal.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How We Compare Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4"
            >
              How We Compare
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 max-w-3xl mx-auto"
            >
              We gather publicly available data from across Bangladesh's financial sector and present it in a clear, unbiased format. No marketing tricks, just facts to help you decide.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-900">What We Gather</h3>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-gray-700">We collect data from official sources across Bangladesh</p>
                    <p className="text-sm text-gray-500 mt-1">Interest rates, fees, terms, and conditions - directly from providers</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-gray-700">We verify and standardize the information</p>
                    <p className="text-sm text-gray-500 mt-1">Making complex financial data easy to understand and compare</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-blue-600 text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-gray-700">We update our database regularly</p>
                    <p className="text-sm text-gray-500 mt-1">Ensuring you always see the latest rates and offers</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-900">How You Compare</h3>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="text-purple-600 text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-gray-700">Use filters to match your needs</p>
                    <p className="text-sm text-gray-500 mt-1">Narrow down options based on what matters to you</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="text-purple-600 text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-gray-700">Compare side by side</p>
                    <p className="text-sm text-gray-500 mt-1">See how different options stack up against each other</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                    <span className="text-purple-600 text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-gray-700">Connect directly to providers</p>
                    <p className="text-sm text-gray-500 mt-1">Click through to official websites when you're ready</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-3xl mx-auto text-center"
          >
            <p className="text-gray-700 text-lg">
              Fast, unbiased, and made for you. No marketing tricks or flashy ads - just the information you need to make the right choice.
            </p>
            <Link 
              to="/how-we-make-money" 
              className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Learn about our commitment to transparency
              <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600">Real reviews from people who've used our service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(testimonial => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-16 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center "
          style={{ backgroundImage: 'url(\'https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/izel//2180133.jpg\')' }}
        ></div>
        <div className="relative container-custom z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0 lg:mr-8 text-center lg:text-left">
              <motion.h2 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to find the best deals?
              </motion.h2>
              <motion.p 
                className="text-blue-100 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Start comparing today and discover products tailored to your unique needs. 
                Our comprehensive comparison tools make it easy to find the perfect match.
              </motion.p>
            </div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link 
                to="/compare" 
                className="btn bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 font-medium rounded-lg transform hover:scale-105 transition-all"
              >
                Compare Now
              </Link>
              <Link 
                to="/about" 
                className="btn bg-blue-700 text-white hover:bg-blue-800 px-8 py-3 font-medium rounded-lg border border-white/20 transform hover:scale-105 transition-all"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;