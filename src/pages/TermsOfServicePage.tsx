import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const termsSections = [
  {
    title: '1. Introduction',
    content: `Welcome to Konta Nibo, a website that helps users in Bangladesh compare financial products, services, and general offerings in an easy and informative way (the "Platform"). These Terms of Service ("Terms") govern your access to and use of the Platform.\nBy using our Platform, you confirm that you have read, understood, and agreed to be bound by these Terms. If you do not agree to these Terms, you should not use or access the Platform.\nThroughout these Terms, "we", "us", or "our" refers to Konta Nibo, and "you" or "your" refers to any user or visitor accessing the Platform.`
  },
  {
    title: '2. Modifications to These Terms',
    content: `We may update these Terms from time to time. We encourage you to review the Terms regularly to stay informed of any changes. Your continued use of the Platform after any such updates constitutes your acceptance of the revised Terms.`
  },
  {
    title: '3. Electronic Communication',
    content: `By using our Platform, you consent to receive communications from us electronically. This includes all legal notices, disclosures, and updates related to the Platform. We may communicate with you via email or by posting notices on the Platform.`
  },
  {
    title: '4. Privacy Policy',
    content: `We respect your privacy and are committed to protecting it. We do not collect, store, or process any personal data through any of our services. You can use our platform anonymously, and we do not track or record any identifiable information.\nOur credit rating and approval system is a calculator powered by an algorithm. It is designed to provide fast, situational results based solely on the information you voluntarily input. This tool operates without verifying your identity and does not collect or store any personal or financial information.\nBy using our services, you acknowledge and agree that no personal data is being collected or retained by us.`
  },
  {
    title: '5. Comparison Services',
    content: `The Platform allows users to compare financial and service offerings based on publicly available information and/or user-submitted data. This includes, but is not limited to, bank accounts, savings options, and financial tools in the Bangladeshi market.\nKonta Nibo is not affiliated with any financial institution or service provider. We do not offer financial advice, brokerage, or intermediary services. The information provided is for general informational purposes only and should not be interpreted as professional or financial advice.`
  },
  {
    title: '6. Acceptable Use',
    content: `You agree to use the Platform lawfully and in accordance with these Terms. You must not:\n- Violate any laws or regulations in connection with your use of the Platform.\n- Use the Platform to distribute harmful, deceptive, unlawful, or infringing content.\n- Attempt to gain unauthorized access to any part of the Platform or its systems.\n- Interfere with the security, integrity, or functionality of the Platform.\nWe reserve the right to restrict or terminate access to any user who violates these Terms or misuses the Platform.`
  },
  {
    title: '7. Intellectual Property',
    content: `All content on the Platform, including but not limited to text, graphics, logos, and software, is the property of Konta Nibo or its licensors and is protected by intellectual property laws. You may not reproduce, modify, distribute, or create derivative works without our prior written consent.`
  },
  {
    title: '8. Disclaimer and Limitation of Liability',
    content: `The Platform is provided on an "as-is" and "as-available" basis. While we strive to ensure accuracy, we do not guarantee that all information is current, complete, or free from errors.\nKonta Nibo is not liable for:\n- Any direct, indirect, or consequential loss or damage incurred by users from reliance on content provided.\n- Any inaccuracies or omissions in the information displayed.\n- Any technical issues or interruptions in accessing the Platform.`
  },
  {
    title: '9. External Links',
    content: `The Platform may contain links to third-party websites or services. These are provided for your convenience only. We do not endorse, control, or take responsibility for the content or practices of these third-party sites.`
  },
  {
    title: '10. Governing Law',
    content: `These Terms are governed by the laws of Bangladesh. Any disputes arising from the use of the Platform will be subject to the exclusive jurisdiction of the courts of Bangladesh.`
  },
  {
    title: '11. Contact Us',
    content: `If you have any questions, concerns, or feedback regarding these Terms or the Platform, please click the "Contact Us" button on our website, or email us at support@kontanibo.com.`
  }
];

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 relative">
      <Helmet>
        <title>Terms of Service | Konta Nibo</title>
        <meta name="description" content="Read the Terms of Service for Konta Nibo. Learn about your rights, privacy, and how to use our platform responsibly." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="tosHeroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
              <pattern id="tosGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20h40M20 0v40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tosHeroGradient)" />
            <rect width="100%" height="100%" fill="url(#tosGrid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <FileText className="w-16 h-16 mx-auto mb-6 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Please read these Terms of Service carefully before using Konta Nibo. Your use of our platform means you agree to these terms.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            {termsSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="mb-10 last:mb-0"
              >
                <h2 className="text-2xl font-bold mb-4 text-blue-700">{section.title}</h2>
                {section.content.split('\n').map((para, i) => (
                  <p key={i} className="text-slate-700 text-lg mb-4 whitespace-pre-line">{para}</p>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Floating Contact Us Button */}
      <Link
        to="/contact"
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all animate-bounce"
        style={{ boxShadow: '0 8px 24px 0 rgba(37,99,235,0.15)' }}
      >
        <Mail className="w-5 h-5" /> Contact Us
      </Link>
    </div>
  );
};

export default TermsOfServicePage; 