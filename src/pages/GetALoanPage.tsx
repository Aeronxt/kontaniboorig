import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Car, User, ArrowRight, Search, CheckCircle, Shield, Info, Clock, Settings, HelpCircle, DollarSign, Percent, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GetALoanPage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const loanTypes = [
    {
      icon: User,
      title: "Personal Loan",
      description: "Compare the best personal loan offers from top banks and lenders in Bangladesh.",
      path: "/personal-loans",
      available: true,
      color: "blue",
      minAmount: "৳50,000",
      maxAmount: "৳20,00,000",
      interestRate: "9% - 16%"
    },
    {
      icon: Home,
      title: "Home Loan",
      description: "Compare home loan rates and features from leading banks to find your best fit.",
      path: "/home-loans",
      available: true,
      color: "green",
      minAmount: "৳5,00,000",
      maxAmount: "৳5,00,00,000",
      interestRate: "7% - 12%"
    },
    {
      icon: Car,
      title: "Car Loan",
      description: "Compare car loan options from trusted providers. Coming soon!",
      path: "",
      available: false,
      color: "purple",
      minAmount: "৳3,00,000",
      maxAmount: "৳50,00,000",
      interestRate: "8% - 14%"
    }
  ];

  const howItWorksSteps = [
    {
      icon: Search,
      title: "Select Your Loan Type",
      description: "Choose the type of loan you're interested in comparing from our selection.",
      color: "blue",
      delay: 0.1
    },
    {
      icon: Settings,
      title: "Customize Your Search",
      description: "Filter by loan amount, term length, interest rates, and other preferences.",
      color: "indigo",
      delay: 0.2
    },
    {
      icon: CheckCircle,
      title: "Compare Offers",
      description: "View side-by-side comparisons of loan options from Bangladesh's top lenders.",
      color: "purple",
      delay: 0.3
    },
    {
      icon: Info,
      title: "Make Informed Decisions",
      description: "Access detailed information, reviews, and insights to choose the best loan.",
      color: "green",
      delay: 0.4
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Independent & Unbiased",
      description: "We don't favor any lender. Our comparisons are fair and transparent so you can trust our results.",
      delay: 0.1
    },
    {
      icon: Clock,
      title: "Save Time & Effort",
      description: "Instead of visiting multiple bank websites, see all your options in one place.",
      delay: 0.2
    },
    {
      icon: HelpCircle,
      title: "Expert Guidance",
      description: "Get helpful tips and advice to understand loan features and make the best choice.",
      delay: 0.3
    }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 relative inline-block font-sans"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">
              Find Your Perfect Loan
            </span>
          </motion.h1>
        </motion.div>

        {/* Loan Type Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {loanTypes.map((loan, index) => (
            <motion.div
              key={index}
              className={`relative group ${loan.available ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
              onClick={() => loan.available && navigate(loan.path)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`h-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 transition-all duration-300 ${hoveredCard === index ? 'bg-white/20' : ''}`}>
                <div className={`w-12 h-12 rounded-lg bg-${loan.color}-500/20 flex items-center justify-center mb-6`}>
                  <loan.icon className={`w-6 h-6 text-${loan.color}-400`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{loan.title}</h3>
                <p className="text-gray-300 mb-6">{loan.description}</p>
                
                {loan.available && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex items-center text-gray-400 mb-1">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Amount Range
                        </div>
                        <div className="text-white">
                          {loan.minAmount} - {loan.maxAmount}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-gray-400 mb-1">
                          <Percent className="w-4 h-4 mr-1" />
                          Interest Rate
                        </div>
                        <div className="text-white">{loan.interestRate}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-white group-hover:text-blue-400 transition-colors mt-4">
                      <span>Compare Options</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )}
                
                {!loan.available && (
                  <div className="text-gray-400 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Coming Soon
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <motion.section 
          className="py-20 mb-20 relative"
          {...fadeIn}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
          </div>
          
          <div className="relative z-10">
            <motion.div 
              className="text-center mb-16"
              {...fadeIn}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">How It Works</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Finding and comparing loans has never been easier. Here's how our platform helps you.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: step.delay }}
                >
                  <motion.div 
                    className={`w-16 h-16 rounded-full bg-${step.color}-500/20 flex items-center justify-center mx-auto mb-6`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <step.icon className={`w-8 h-8 text-${step.color}-400`} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-20 mb-20"
          {...fadeIn}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We make loan comparison simple, transparent, and reliable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-16 mb-10 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-sm"></div>
          </div>
          
          <div className="relative z-10 text-center p-8">
            <motion.h2 
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to find your perfect loan?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Start comparing loan options from Bangladesh's leading banks right now.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all transform hover:scale-105"
              >
                Start Comparing
              </button>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default GetALoanPage; 