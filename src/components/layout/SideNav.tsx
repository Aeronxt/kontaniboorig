import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, CreditCard, Landmark, Shield, LineChart, Lightbulb, ShoppingBag, Star, BadgePercent, Gauge, Smartphone, Wifi, Wallet, Coins, MessageSquare, Newspaper, Play, Tag, UserCircle, Car, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import HamburgerButton from './HamburgerButton';

interface NavItem {
  icon?: React.ReactNode;
  label: string;
  path: string;
  isHeader?: boolean;
}

const ScrollableDiv = styled.div`
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`;

const SideNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize and body scroll lock
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (isMobile && isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isExpanded]);

  const navItems: NavItem[] = [
    { icon: <UserCircle size={20} />, label: 'Profile', path: '/mydash' },
    { icon: <Home size={20} />, label: 'Home', path: '/' },
    { isHeader: true, label: 'Compare', path: '' },
    { icon: <CreditCard size={20} />, label: 'Credit Cards', path: '/credit-cards' },
    { icon: <Tag size={20} />, label: 'BOGO', path: '/bogo' },
    { icon: <Zap size={20} />, label: 'Instant Bank', path: '/instant-bank' },
    { icon: <Wallet size={20} />, label: 'Mobile Payments', path: '/mobile-payments' },
    { icon: <Landmark size={20} />, label: 'Home Loans', path: '/home-loans' },
    { icon: <Coins size={20} />, label: 'Personal Loans', path: '/personal-loans' },
    { icon: <Car size={20} />, label: 'Car Loans', path: '/car-loans' },
    { icon: <Shield size={20} />, label: 'Insurance', path: '/insurance' },
    { icon: <Smartphone size={20} />, label: 'Mobile Plans', path: '/mobile-plans' },
    { icon: <Play size={20} />, label: 'Entertainment', path: '/entertainment' },
    { icon: <Wifi size={20} />, label: 'Broadband', path: '/broadband' },
    { icon: <Newspaper size={20} />, label: 'News', path: '/news' },
    { isHeader: true, label: 'Tools', path: '' },
    { icon: <Gauge size={20} />, label: 'Credit Score', path: '/credit-score' },
    { icon: <LineChart size={20} />, label: 'Calculator', path: '/calculator' },
    { isHeader: true, label: 'Company', path: '' },
    { icon: <Lightbulb size={20} />, label: 'About Us', path: '/about' },
    { icon: <ShoppingBag size={20} />, label: 'Partner With Us', path: '/partner-with-us' },
    { icon: <Star size={20} />, label: 'Invest With Us', path: '/invest-with-us' },
    { icon: <BadgePercent size={20} />, label: 'How We Make Money', path: '/how-we-make-money' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-[51]">
          <HamburgerButton 
            isOpen={isExpanded} 
            onChange={setIsExpanded}
          />
        </div>
      )}

      {/* Backdrop for mobile */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <motion.nav
        className={`fixed left-0 top-0 h-screen bg-[#1B1F3B] shadow-lg z-50 ${isMobile ? 'w-[240px]' : ''}`}
        initial={isMobile ? { x: '-100%' } : false}
        animate={{
          width: !isMobile ? (isExpanded ? '240px' : '60px') : '240px',
          x: isMobile ? (isExpanded ? 0 : '-100%') : 0
        }}
        transition={{ duration: 0.3 }}
        {...(!isMobile && {
          onMouseEnter: () => setIsExpanded(true),
          onMouseLeave: () => setIsExpanded(false)
        })}
      >
        <ScrollableDiv className="pt-12 h-[calc(100vh-4rem)] overflow-y-auto">
          {navItems.map((item, index) => (
            item.isHeader ? (
              <div
                key={index}
                className="px-4 py-2 text-xs font-semibold text-gray-400"
                style={{ opacity: (isExpanded || isMobile) ? 1 : 0 }}
              >
                {item.label}
              </div>
            ) : item.label === 'Profile' ? (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-100 hover:bg-[#2d325f] transition-colors"
                onClick={() => isMobile && setIsExpanded(false)}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <motion.span
                  className="ml-4 whitespace-nowrap"
                  animate={{ opacity: (isExpanded || isMobile) ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            ) : (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-100 hover:bg-[#2d325f] transition-colors"
                onClick={() => isMobile && setIsExpanded(false)}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <motion.span
                  className="ml-4 whitespace-nowrap"
                  animate={{ opacity: (isExpanded || isMobile) ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            )
          ))}
        </ScrollableDiv>
      </motion.nav>
    </>
  );
};

export default SideNav; 