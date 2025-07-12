import React, { useEffect, useRef } from 'react';
import { ChevronRight, Users, Scale, Target, Lightbulb, ThumbsUp, Briefcase, Award, Clock, ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  // Scroll progress animation
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Floating animation for background elements
  const floatingAnimation = {
    hidden: { y: 0, opacity: 0 },
    visible: {
      y: [-20, 20],
      opacity: 0.3,
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 3,
          ease: "easeInOut"
        },
        opacity: {
          duration: 0.2
        }
      }
    }
  };

  // Reusable animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      } 
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  const slideIn = {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  return (
    <div className="relative">
      {/* Scroll Progress Bar */}
    <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section with Animated Background */}
      <motion.section 
        className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
    >
        {/* Animated Background Elements */}
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full bg-white/5 backdrop-blur-3xl ${
              index % 2 === 0 ? 'w-64 h-64' : 'w-32 h-32'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial="hidden"
            animate="visible"
            variants={floatingAnimation}
            transition={{
              delay: index * 0.2,
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1e293b]/50 to-[#1e293b] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-6xl sm:text-7xl font-bold text-white mb-6 leading-tight"
            >
              About <span className="text-blue-300">Konta Nibo</span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto"
            >
              We're on a mission to become Bangladesh's favorite financial comparison site. 
              Making financial decisions smarter, simpler and designed around you.
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

      {/* Key Highlights with Hover Effects */}
      <section className="py-24 bg-white relative">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: Users, title: "Our team", desc: "Dedicated to making financial decisions simple and accessible." },
              { icon: Target, title: "Our mission", desc: "Empower Bangladeshis to make smarter financial decisions." },
              { icon: Scale, title: "Our independence", desc: "100% independent with no bank affiliations or biases." },
              { icon: Briefcase, title: "Our experience", desc: "Years of researching Bangladesh's financial landscape." }
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
                <p className="text-gray-600 text-center">
                  {item.desc}
              </p>
            </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section with Parallax Scroll */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={slideIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-4xl font-bold mb-8 text-gray-900">Our Story</h2>
              <div className="prose prose-lg text-gray-700">
                <p className="text-xl leading-relaxed">
                  Konta Nibo? was born out of a question every Bangladeshi has asked:
                  <span className="block text-3xl font-bold text-blue-600 my-4">"Konta Nibo?"</span>
                </p>
                <p>
                  Whether it's a bank loan, a credit card, a savings account, or an insurance plan,
                  making the right financial decision in Bangladesh is harder than it should be.
                </p>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <Link 
                    to="/" 
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors group"
                  >
                    Start Comparing
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl transform rotate-3" />
                <img 
                  src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//Image_fx%20(3).jpg" 
                  alt="Bangladeshi team member working" 
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do Section with Card Hover Effects */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What We Do</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Compare Banks & Products",
                desc: "Instantly view and compare loans, credit cards, insurance, savings accounts, and more.",
                link: "/banks",
                linkText: "Compare now"
              },
              {
                title: "Sort Based on Your Needs",
                desc: "Our platform adjusts to your personal goals, whether you're buying a car or building credit history.",
                link: "/personal-loans",
                linkText: "Find your match"
              },
              {
                title: "Digital-First Experience",
                desc: "Everything is online, paperless, and optimized for your mobile—because that's how we roll.",
                link: "/credit-score",
                linkText: "Learn more"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-700 mb-6">
                  {item.desc}
                </p>
                <Link 
                  to={item.link} 
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center group"
                >
                  {item.linkText}
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why We Exist Section - New */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-4 shadow-lg"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-teal-500">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" />
                </svg>
              </motion.div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Why We Exist</h2>
              <div className="w-24 h-1 bg-teal-400 rounded-full mb-2" />
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-teal-100 relative overflow-hidden"
              style={{ boxShadow: '0 8px 24px 0 rgba(16,185,129,0.08)' }}
            >
              <p className="text-lg text-slate-700 font-medium mb-4">
                We believe that financial freedom starts with informed decisions. And yet in Bangladesh, access to reliable financial information is still a luxury.
              </p>
              <p className="text-xl font-bold text-teal-600 mt-4">We're here to change that.</p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -z-10 left-0 top-0 w-full h-full pointer-events-none"
              >
                <div className="w-full h-full bg-gradient-to-tr from-teal-100/40 to-transparent rounded-2xl" />
              </motion.div>
            </motion.div>
            {/* Right List */}
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {[
                "We're here for the young graduates trying to get their first credit card.",
                "For the newly married couple looking for their first home loan.",
                "For the entrepreneur comparing SME loans.",
                "For the student trying to understand what a savings plan even means.",
                "And for the busy professional who just doesn't have time to figure it all out."
              ].map((text, idx) => (
                <motion.li
                  key={idx}
                  variants={fadeInUp}
                  className="flex items-start gap-3 text-lg text-slate-700"
                >
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.2 + idx * 0.1 }}
                    className="mt-1 flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shadow"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-teal-500">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" />
                    </svg>
                  </motion.span>
                  <span>{text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* Introducing the Konta Nibo Score Section - New */}
      <section className="py-24 bg-gradient-to-br from-white to-teal-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-4 shadow-lg"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-teal-500">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 17.25l-6.16 3.24 1.18-6.88L2 9.76l6.92-1.01L12 2.5l3.08 6.25 6.92 1.01-5 4.85 1.18 6.88z" />
                </svg>
              </motion.div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Introducing the Konta Nibo Score</h2>
              <div className="w-24 h-1 bg-teal-400 rounded-full mb-2" />
              <p className="text-xl text-slate-500 mt-2">Tired of jargon? Confused by complicated terms?</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Description */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-left"
            >
              <p className="text-lg text-slate-700 font-medium mb-4">
                We've developed the Konta Nibo Score—a smart, balanced rating system that helps you identify the best-performing products in the market. We analyze everything: interest rates, hidden fees, flexibility, approval chances, customer service, and more.
              </p>
              <p className="text-lg text-slate-700 font-medium mb-4">
                This score is our honest opinion based on facts and feedback—not promotions. Use it as your trusted guide when you're stuck between choices.
              </p>
            </motion.div>
            {/* Right Score Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.2 }}
              className="flex justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(16,185,129,0.18)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center border border-teal-100 relative min-w-[260px]"
                style={{ boxShadow: '0 8px 32px 0 rgba(16,185,129,0.10)' }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 }}
                  className="mb-4"
                >
                  <div className="w-28 h-28 rounded-full bg-teal-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg relative animate-pulse">
                    9.2
                    <span className="absolute w-full h-full rounded-full bg-teal-400/30 blur-2xl animate-ping -z-10" />
                  </div>
                </motion.div>
                <div className="text-xl font-bold text-slate-800 mb-1">Konta Nibo Score</div>
                <div className="text-slate-500 text-center text-base">A comprehensive rating based on multiple factors to help you make the best choice.</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Konta Nibo Credit Approval Rating Section - New */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-100">
        <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 shadow-lg"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m10-10H2" />
                </svg>
              </motion.div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Instant Credit Approval Rating</h2>
              <div className="w-24 h-1 bg-blue-400 rounded-full mb-2" />
              <p className="text-xl text-slate-500 mt-2">No more guesswork. Know your chances before you walk into the bank.</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Description */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-left"
            >
              <p className="text-lg text-slate-700 font-medium mb-4">
                Konta Nibo has created a unique credit approval rating system. Instead of being unsure or making a trip to the bank just to find out your chances, you can now check your approval odds instantly on Konta Nibo.
              </p>
              <p className="text-lg text-slate-700 font-medium mb-4">
                Our system analyzes your profile and the bank's criteria to give you a personalized approval rate and a Konta Nibo Credit Score—so you know where you stand before you even apply.
                </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8"
              >
                <Link
                  to="/credit-score"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors group text-lg font-semibold shadow-lg"
                >
                  Find Out Your Chances
                  <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </motion.div>
            </motion.div>
            {/* Right Interactive Examples */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.2 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Approval Rate Example */}
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(59,130,246,0.18)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-blue-100 min-w-[240px] w-full max-w-xs relative"
                style={{ boxShadow: '0 8px 32px 0 rgba(59,130,246,0.10)' }}
              >
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-3 animate-pulse relative">
                  87%
                  <span className="absolute w-full h-full rounded-full bg-blue-400/30 blur-2xl animate-ping -z-10" />
                </div>
                <div className="text-lg font-bold text-slate-800 mb-1">Konta Nibo Approval Rate</div>
                <div className="text-slate-500 text-center text-base">Your personalized chance of approval for this product.</div>
              </motion.div>
              {/* Credit Score Example */}
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 rgba(16,185,129,0.18)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border border-teal-100 min-w-[240px] w-full max-w-xs relative"
                style={{ boxShadow: '0 8px 32px 0 rgba(16,185,129,0.10)' }}
              >
                <div className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-3 animate-pulse relative">
                  765
                  <span className="absolute w-full h-full rounded-full bg-teal-400/30 blur-2xl animate-ping -z-10" />
                </div>
                <div className="text-lg font-bold text-slate-800 mb-1">Konta Nibo Credit Score</div>
                <div className="text-slate-500 text-center text-base">A dynamic score based on your profile and financial history.</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Review System Section - New */}
      <section className="py-24 bg-gradient-to-br from-white to-teal-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 mb-4 shadow-lg"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-teal-500">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </motion.div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">A Voice for the People</h2>
              <div className="w-24 h-1 bg-teal-400 rounded-full mb-2" />
              <p className="text-xl text-slate-500 mt-2">We believe your opinion matters. That's why we've made it ridiculously simple to share your experience:</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Steps & Description */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col gap-6"
            >
              <p className="text-lg text-slate-700 font-medium mb-2">
                In Bangladesh, there's hardly any way to publicly review the bank or financial service you use. Most feedback is lost in private conversations or social media posts that never reach the right people. Konta Nibo is here to change that—by giving you a public, impactful voice.
              </p>
              <ol className="space-y-4">
                {[
                  'No sign-up required',
                  'No long forms',
                  "Just select the product you used, and post your review. That's it."
                ].map((step, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-bold flex items-center justify-center text-lg shadow">{idx + 1}</span>
                    <span className="text-slate-700 text-base">{step}</span>
                  </li>
                ))}
              </ol>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8"
              >
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 text-teal-700 text-base font-medium shadow-sm">
                  Whether you're happy or disappointed, your voice helps others make better decisions—and helps institutions understand what needs to change.
                </div>
              </motion.div>
            </motion.div>
            {/* Right Animated Reviews */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: '0 8px 32px 0 rgba(16,185,129,0.18)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-teal-100 relative"
                style={{ boxShadow: '0 8px 32px 0 rgba(16,185,129,0.10)' }}
              >
                {/* Review 1 */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 font-bold flex items-center justify-center text-lg">RA</span>
                  <span className="font-semibold text-slate-800">Rahim A.</span>
                  <span className="flex items-center ml-2 text-yellow-400 text-sm">{'★'.repeat(5)}</span>
                </div>
                <div className="text-slate-700 text-base mb-4">"This site helped me find the perfect credit card for my needs. The comparison was clear and saved me so much time!"</div>
                {/* Review 2 */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 font-bold flex items-center justify-center text-lg">SJ</span>
                  <span className="font-semibold text-slate-800">Sabina J.</span>
                  <span className="flex items-center ml-2 text-yellow-400 text-sm">{'★'.repeat(4)}</span>
                </div>
                <div className="text-slate-700 text-base mb-4">"Great platform for comparing loans. Would love to see more insurance options in the future."</div>
                {/* Feedback Buttons */}
                <div className="flex gap-4 mt-4">
                  <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-teal-50 text-teal-600 font-semibold border border-teal-100 hover:bg-teal-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 9l-3 3m0 0l-3-3m3 3V4m0 16v-7" /></svg>
                    Helpful
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-slate-50 text-slate-500 font-semibold border border-slate-200 hover:bg-slate-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 15l3-3m0 0l3 3m-3-3V4m0 16v-7" /></svg>
                    Not Helpful
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Independence Section with Gradient Background */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-600 to-blue-700 text-white relative overflow-hidden">
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
              <h2 className="text-4xl font-bold mb-8">100% Independent.<br />No Affiliations.<br />No Nonsense.</h2>
              <div className="prose prose-lg text-blue-100">
                <p>
                  We have absolutely no connection or affiliation with any banks, insurance providers,
                  or financial institutions displayed on our platform.
                </p>
                <p>
                  What you see is what's actually out there in the market—raw, unfiltered,
                  and honestly presented.
                </p>
              </div>
            </motion.div>

            <motion.div variants={staggerContainer} className="space-y-6">
              {[
                {
                  icon: Award,
                  title: "The Konta Nibo Score",
                  desc: "Our smart, balanced rating system helps you identify the best-performing products in the market."
                },
                {
                  icon: ThumbsUp,
                  title: "Transparency is Our Backbone",
                  desc: "We maintain strict integrity in product information, clearly labeling any promoted content."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-12 w-12 bg-white rounded-full mr-4">
                      <item.icon className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-blue-100">
                    {item.desc}
                </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-2xl leading-relaxed text-gray-700">
              To empower every Bangladeshi to make smarter, faster, and more confident financial decisions—so no one ever has to lose money from the wrong choice again.
            </p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-medium text-blue-600 mt-6"
            >
              We're here to make sure you never have to ask "Konta Nibo?" to anyone else again.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
            <motion.div
            variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            className="text-center"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold mb-6"
            >
              Ready to make smarter financial decisions?
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="flex justify-center gap-4"
            >
              <Link
                to="/compare"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors group"
              >
                Start Comparing
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-colors border-2 border-blue-600"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;