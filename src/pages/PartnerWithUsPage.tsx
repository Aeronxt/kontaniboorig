import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Helmet } from 'react-helmet-async';
import { ArrowDown, Users, Target, Scale, Briefcase, ChevronRight, Award, ThumbsUp, ArrowRight, CircleDollarSign, BarChart3, Star } from 'lucide-react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const PartnerWithUsPage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Partner With Us | Konta Nibo</title>
        <meta name="description" content="Partner with Konta Nibo to showcase your financial products to our engaged audience while maintaining transparency and trust." />
      </Helmet>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute w-96 h-96 bg-blue-400 rounded-full blur-3xl -top-48 -left-48 opacity-20 animate-pulse" />
          <div className="absolute w-96 h-96 bg-purple-400 rounded-full blur-3xl -bottom-48 -right-48 opacity-20 animate-pulse" />
        </motion.div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-6xl sm:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Partner With <span className="text-blue-300">Konta Nibo</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto"
            >
              Join Bangladesh's leading financial product comparison platform and connect with users actively seeking the best financial solutions.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="mt-12"
            >
              <ArrowDown className="w-12 h-12 text-white/50 mx-auto animate-bounce" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Key Benefits Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { 
                icon: Star, 
                title: "Promoted Badge", 
                desc: "Get your products highlighted with our special promoted badge for enhanced visibility." 
              },
              { 
                icon: Users, 
                title: "Reach More Users", 
                desc: "Connect with users actively searching for financial products like yours." 
              },
              { 
                icon: BarChart3, 
                title: "Performance Insights", 
                desc: "Track your product's performance with detailed analytics and user engagement data." 
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mx-auto mb-6 transform transition-transform hover:rotate-12">
                  <item.icon className="text-blue-600" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-24 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={slideIn}>
              <h2 className="text-4xl font-bold mb-8 text-white">Our Commitment to Transparency</h2>
              <div className="prose prose-lg text-blue-100">
                <p className="text-blue-100">
                  At Konta Nibo, we maintain strict editorial independence and transparency. 
                  Our commitment to users means we never modify or manipulate information for 
                  promotional purposes.
                </p>
                <p className="text-blue-100">
                  All promoted content is clearly labeled, ensuring users can make informed 
                  decisions while partners benefit from enhanced visibility.
                </p>
              </div>
            </motion.div>

            <motion.div variants={staggerContainer} className="space-y-6">
              {[
                {
                  icon: Award,
                  title: "Clear Promotional Labeling",
                  desc: "All sponsored content is marked with our 'Promoted' badge for full transparency."
                },
                {
                  icon: ThumbsUp,
                  title: "Editorial Independence",
                  desc: "Our product recommendations remain unbiased and based on actual features and benefits."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-12 w-12 bg-white/90 rounded-full mr-4">
                      <item.icon className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-blue-100">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              {
                number: "01",
                title: "Apply",
                desc: "Submit your partnership application with product details"
              },
              {
                number: "02",
                title: "Review",
                desc: "Our team verifies your information and product offerings"
              },
              {
                number: "03",
                title: "Integration",
                desc: "We integrate your products into our comparison platform"
              },
              {
                number: "04",
                title: "Go Live",
                desc: "Your products go live with optional promotional features"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">Ready to Partner With Us?</h2>
            <p className="text-xl text-blue-100">
              Join our network of trusted financial institutions and reach thousands of potential customers.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PartnerWithUsPage; 