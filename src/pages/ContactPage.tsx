import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, BriefcaseIcon, HelpCircle, Mail, Users } from 'lucide-react';

const ContactPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    contactType: '',
    queryType: '',
    budget: '',
    source: '',
    name: '',
    email: '',
    message: '',
    company: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const slideVariants = {
    enter: {
      x: 100,
      opacity: 0
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: -100,
      opacity: 0
    }
  };

  const handleOptionSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (step < 5) setStep(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    setIsSubmitted(true);
  };

  const handleStartOver = () => {
    setStep(1);
    setFormData({
      contactType: '',
      queryType: '',
      budget: '',
      source: '',
      name: '',
      email: '',
      message: '',
      company: ''
    });
    setIsSubmitted(false);
  };

  const ProgressBar = () => (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
        initial={{ width: "0%" }}
        animate={{ width: `${(step / 5) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );

  const StepIndicator = () => (
    <div className="flex justify-center space-x-4 mb-8">
      {[1, 2, 3, 4, 5].map((num) => (
        <motion.div
          key={num}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            num <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}
          animate={{
            scale: num === step ? 1.2 : 1,
          }}
        >
          {num}
        </motion.div>
      ))}
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white p-8"
        >
          <h2 className="text-4xl font-bold mb-4">Success!</h2>
          <p className="text-xl mb-8">Thanks for your message, we'll be in touch within 24 hours.</p>
          <button
            onClick={handleStartOver}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]">
      <Helmet>
        <title>Contact Us | Konta Nibo</title>
        <meta name="description" content="Get in touch with Konta Nibo for any queries or support." />
      </Helmet>

      <ProgressBar />

      <div className="max-w-4xl mx-auto px-4 py-24">
        <StepIndicator />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">How can we help?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: MessageSquare, label: "General Inquiry", value: "inquiry" },
                    { icon: BriefcaseIcon, label: "Business Partnership", value: "partnership" },
                    { icon: HelpCircle, label: "Support", value: "support" },
                    { icon: Users, label: "Join Our Team", value: "career" }
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect('contactType', option.value)}
                      className="flex items-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <option.icon className="w-6 h-6 mr-4" />
                      <span className="text-lg">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">What's your query about?</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Product Information",
                    "Financial Advice",
                    "Technical Support",
                    "Other"
                  ].map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect('queryType', option)}
                      className="flex items-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <span className="text-lg">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">How did you hear about us?</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    "Google Search",
                    "Social Media",
                    "Friend Referral",
                    "Advertisement",
                    "Other"
                  ].map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect('source', option)}
                      className="flex items-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <span className="text-lg">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">Tell us about yourself</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company Name (Optional)"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(5)}
                    className="w-full p-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Next Step
                  </motion.button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-8">Your Message</h2>
                <div className="space-y-4">
                  <textarea
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    className="w-full p-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="w-full p-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Send Message
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactPage; 