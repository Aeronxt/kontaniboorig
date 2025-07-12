import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Circle, Star, Shield, Check, BadgeCheck } from 'lucide-react';

const HowWeMakeMoneyPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const sections = [
    {
      icon: Users,
      title: "We Don't Charge Users – Ever",
      points: [
        "Using our website to compare financial products, services, or offers is completely free.",
        "We do not collect any payment from our users.",
        "We do not charge for access to comparisons, insights, or guides.",
        "We do not sell user data or request any payment for inquiries."
      ],
      color: "blue"
    },
    {
      icon: Circle,
      title: "Revenue Through Google Ads",
      points: [
        "Our primary source of income comes from Google Ads that appear on various parts of our site.",
        "These ads are shown based on website traffic and relevance.",
        "These ads help us maintain and improve our platform.",
        "We have no control over the content of these ads, which are selected by Google based on user interest and behavior."
      ],
      color: "green"
    },
    {
      icon: Star,
      title: "Promoted Products and Exclusive Offers",
      points: [
        "Some financial institutions or companies may choose to promote their products through:",
        "Sponsored placements on our Exclusive Offers page",
        'Ads within product listings, clearly marked as "Promoted"',
        "We always clearly label all paid promotions or advertisements",
        "Maintain complete transparency regarding paid placements"
      ],
      color: "purple"
    },
    {
      icon: Shield,
      title: "We Never Alter Product Information",
      points: [
        "We are committed to maintaining unbiased and accurate information across our site.",
        "We do not alter or exaggerate product details in favor of any provider.",
        "Our comparison tables and product pages are updated regularly from official sources.",
        "Any promotional listing does not influence our editorial content or rankings."
      ],
      color: "red"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc">
                  <animate
                    attributeName="stop-color"
                    values="#f8fafc;#f1f5f9;#f8fafc"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#f1f5f9">
                  <animate
                    attributeName="stop-color"
                    values="#f1f5f9;#f8fafc;#f1f5f9"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
              
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" fill="none" stroke="#e2e8f0" strokeWidth="1">
                  <animate
                    attributeName="stroke-opacity"
                    values="0.1;0.3;0.1"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </path>
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#heroGradient)" />
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <DollarSign className="w-16 h-16 mx-auto mb-6 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              How We Make Money
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Transparency is at the core of what we do. Here's how we generate revenue while keeping our platform 100% free and unbiased for users like you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-${section.color}-50 rounded-bl-full -mr-20 -mt-20 transition-all duration-300 group-hover:scale-110`} />
                
                <section.icon className={`w-12 h-12 mb-6 text-${section.color}-500 relative z-10`} />
                
                <h2 className="text-2xl font-bold mb-6 relative z-10">{section.title}</h2>
                
                <ul className="space-y-4 relative z-10">
                  {section.points.map((point, pointIndex) => (
                    <motion.li
                      key={pointIndex}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: pointIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Check className={`w-5 h-5 mt-1 flex-shrink-0 text-${section.color}-500`} />
                      <span className="text-slate-600">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" fillOpacity="0.1">
                  <animate
                    attributeName="opacity"
                    values="0.1;0.3;0.1"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center text-white max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <BadgeCheck className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Promise</h2>
            <p className="text-xl mb-12 text-white/90">
              We are here to help you make informed decisions. Whether you're comparing credit cards, loans, broadband, or mobile services, you can trust that:
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                "Every product is fairly presented",
                "Promotions are always clearly labeled",
                "We never compromise on transparency"
              ].map((promise, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-lg font-medium">{promise}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HowWeMakeMoneyPage; 