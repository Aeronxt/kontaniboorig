import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Server, Lightbulb, Shield, ArrowRight, Search, Clock, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InvestWithUsPage = () => {
  const navigate = useNavigate();
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const strategies = [
    {
      number: "01",
      title: "Consumer-First Approach",
      description: "We're revolutionizing financial comparison by putting user needs at the forefront, making financial decisions simpler and more transparent."
    },
    {
      number: "02",
      title: "Data-Driven Innovation",
      description: "Leveraging AI and machine learning to provide personalized financial product recommendations and market insights."
    },
    {
      number: "03",
      title: "Market Expansion",
      description: "Strategic growth into new financial verticals and geographic markets, capturing emerging opportunities in the fintech space."
    }
  ];

  const metrics = [
    { value: "2000x+", label: "Approval Rate Checked" },
    { value: "4600x+", label: "Monthly Products Compared" },
    { value: "100+", label: "Products Compared" },
    { value: "98%", label: "User Satisfaction Rate" }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1B1F3B]">
        <div className="absolute inset-0 w-full h-full">
          <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#23305A" />
                <stop offset="100%" stopColor="#1B1F3B" />
              </linearGradient>
              {/* Glow effect for particles */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background base */}
            <rect width="100%" height="100%" fill="url(#heroGradient)" />

            {/* Fluid animated wave */}
            <g>
              <path>
                <animate attributeName="d" dur="8s" repeatCount="indefinite"
                  values="M0,600 Q360,700 720,600 T1440,600 V800 H0Z;
                          M0,600 Q360,500 720,600 T1440,600 V800 H0Z;
                          M0,600 Q360,700 720,600 T1440,600 V800 H0Z"/>
                <animate attributeName="fill" dur="8s" repeatCount="indefinite"
                  values="#23305A;#1B1F3B;#23305A"/>
              </path>
              <path opacity="0.5">
                <animate attributeName="d" dur="10s" repeatCount="indefinite"
                  values="M0,650 Q480,750 960,650 T1440,650 V800 H0Z;
                          M0,650 Q480,600 960,650 T1440,650 V800 H0Z;
                          M0,650 Q480,750 960,650 T1440,650 V800 H0Z"/>
                <animate attributeName="fill" dur="10s" repeatCount="indefinite"
                  values="#2196F3;#4CAF50;#2196F3"/>
              </path>
            </g>

            {/* Enhanced animated particles */}
            <g className="particles" filter="url(#glow)">
              {[...Array(40)].map((_, i) => (
                <circle
                  key={i}
                  r={1 + Math.random() * 2}
                  fill={i % 3 === 0 ? "#4CAF50" : i % 3 === 1 ? "#2196F3" : "#ffffff"}
                  opacity="0.6"
                >
                  <animate
                    attributeName="cx"
                    dur={`${15 + Math.random() * 20}s`}
                    values={`${Math.random() * 1440};${Math.random() * 1440};${Math.random() * 1440}`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    dur={`${10 + Math.random() * 20}s`}
                    values={`${Math.random() * 800};${Math.random() * 800};${Math.random() * 800}`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    dur={`${3 + Math.random() * 4}s`}
                    values="0.1;0.6;0.1"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    dur={`${4 + Math.random() * 3}s`}
                    values="${1 + Math.random() * 2};${2 + Math.random() * 3};${1 + Math.random() * 2}"
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6"
            {...fadeInUp}
          >
            Shape the Future of<br />Financial Freedom
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join us in revolutionizing how people discover, compare, and choose financial products in Bangladesh
          </motion.p>
          <motion.button
            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => navigate('/contact')}
          >
            Start Investing <ArrowRight className="ml-2" />
          </motion.button>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-4xl font-bold text-blue-600 mb-2">{metric.value}</h3>
                <p className="text-gray-600">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Strategy Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Our Growth Strategy</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the future of financial product discovery and comparison in Bangladesh
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {strategies.map((strategy, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors" />
                <span className="text-5xl font-bold text-blue-100 mb-6 block">{strategy.number}</span>
                <h3 className="text-2xl font-bold mb-4">{strategy.title}</h3>
                <p className="text-gray-600">{strategy.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Invest Section */}
      <section className="py-20 bg-[#1B1F3B] relative overflow-hidden">
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="whyInvestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4CAF50">
                  <animate attributeName="stop-color" 
                    values="#4CAF50; #2196F3; #4CAF50"
                    dur="8s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#2196F3">
                  <animate attributeName="stop-color"
                    values="#2196F3; #4CAF50; #2196F3"
                    dur="8s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              
              <pattern id="floatingHexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
                <path d="M24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2Z" fill="none" stroke="currentColor" strokeWidth="1">
                  <animate attributeName="stroke-opacity"
                    values="0.2;0.5;0.2"
                    dur="3s"
                    repeatCount="indefinite" />
                </path>
                <path d="M74.8,22 87.3,29.2 87.3,43.7 74.8,50.9 62.3,43.7 62.3,29.2Z" fill="none" stroke="currentColor" strokeWidth="1">
                  <animate attributeName="stroke-opacity"
                    values="0.5;0.2;0.5"
                    dur="4s"
                    repeatCount="indefinite" />
                </path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#whyInvestGradient)" opacity="0.05" />
            <rect width="100%" height="100%" fill="url(#floatingHexagons)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Why Invest With Us</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Bangladesh's only proper comparison and fintech helper platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[
              {
                icon: TrendingUp,
                title: "Rapid Growth",
                description: "Experience exponential user growth and market penetration in Bangladesh's emerging fintech sector.",
                color: "blue",
                delay: 0
              },
              {
                icon: Target,
                title: "Market Leadership",
                description: "First-mover advantage in the financial product comparison space with strong brand recognition.",
                color: "purple",
                delay: 0.2
              },
              {
                icon: Server,
                title: "Strong IT Framework",
                description: "Built with cutting-edge technology and robust infrastructure to ensure reliable, secure, and scalable financial services.",
                color: "green",
                delay: 0.4
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-white relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: card.delay }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <card.icon className={`w-12 h-12 mb-6 text-${card.color}-400 transform group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="text-2xl font-bold mb-4 group-hover:text-white/90 transition-colors duration-300">{card.title}</h3>
                <p className="text-gray-300 group-hover:text-white/80 transition-colors duration-300">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Tailored Recommendations",
                description: "We help match your investment goals with the most suitable products based on amount, duration, and return preference.",
                color: "yellow",
                delay: 0
              },
              {
                icon: Clock,
                title: "Save Time & Money",
                description: "No need to visit multiple bank websites—we aggregate and simplify all the data in one place.",
                color: "orange",
                delay: 0.2
              },
              {
                icon: LockKeyhole,
                title: "Secure & Verified",
                description: "All information is sourced directly from official bank websites and verified for accuracy.",
                color: "red",
                delay: 0.4
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-white relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: card.delay }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <card.icon className={`w-12 h-12 mb-6 text-${card.color}-400 transform group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="text-2xl font-bold mb-4 group-hover:text-white/90 transition-colors duration-300">{card.title}</h3>
                <p className="text-gray-300 group-hover:text-white/80 transition-colors duration-300">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
          {/* Animated background elements */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ctaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb">
                  <animate
                    attributeName="stop-color"
                    values="#2563eb; #4f46e5; #2563eb"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#7c3aed">
                  <animate
                    attributeName="stop-color"
                    values="#7c3aed; #2563eb; #7c3aed"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>

              {/* Mesh pattern */}
              <pattern id="mesh" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
                  <animate
                    attributeName="stroke-opacity"
                    values="0.1;0.3;0.1"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
              </pattern>

              {/* Particle effect */}
              <filter id="glow2">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Base gradient */}
            <rect width="100%" height="100%" fill="url(#ctaGradient)" />
            
            {/* Mesh overlay */}
            <rect width="100%" height="100%" fill="url(#mesh)" />

            {/* Animated circles */}
            <g filter="url(#glow2)">
              {[...Array(20)].map((_, i) => (
                <circle
                  key={i}
                  r={2 + Math.random() * 3}
                  fill="rgba(255,255,255,0.5)"
                >
                  <animate
                    attributeName="cx"
                    values={`${Math.random() * 100}%;${Math.random() * 100}%;${Math.random() * 100}%`}
                    dur={`${15 + Math.random() * 25}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${Math.random() * 100}%;${Math.random() * 100}%;${Math.random() * 100}%`}
                    dur={`${15 + Math.random() * 25}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0.8;0.3"
                    dur={`${2 + Math.random() * 4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>

            {/* Animated lines */}
            <g>
              {[...Array(8)].map((_, i) => (
                <path
                  key={i}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                  fill="none"
                >
                  <animate
                    attributeName="d"
                    values={`
                      M${-200 + Math.random() * 200},${Math.random() * 100} 
                      Q${Math.random() * 100},${Math.random() * 100} 
                      ${100 + Math.random() * 200},${Math.random() * 100};
                      
                      M${-200 + Math.random() * 200},${Math.random() * 100} 
                      Q${Math.random() * 100},${Math.random() * 100} 
                      ${100 + Math.random() * 200},${Math.random() * 100}
                    `}
                    dur={`${20 + Math.random() * 10}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="stroke-opacity"
                    values="0.1;0.4;0.1"
                    dur={`${3 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                </path>
              ))}
            </g>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Shape the Future?
          </motion.h2>
          <motion.p
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join us in revolutionizing financial product discovery and comparison in Bangladesh
          </motion.p>
          <motion.button
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            onClick={() => navigate('/contact')}
          >
            Get Started Now
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default InvestWithUsPage; 