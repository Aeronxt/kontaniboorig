import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const navLinks = [
    { name: 'Banks', path: '/banks' },
    { name: 'Instant Bank', path: '/instant-bank' },
    { name: 'Loans', path: '/loans' },
    { name: 'Cards', path: '/credit-cards' },
    { name: 'Mobile Plans', path: '/mobile-plans' },
    { name: 'Entertainment', path: '/entertainment' },
    { name: 'Insurance', path: '/insurance' },
  ];
  
  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isMenuOpen 
          ? 'bg-white shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="relative flex items-center h-16 md:h-20">
          {/* Mobile Menu Button - Absolute positioned */}
          <button 
            className="absolute left-0 md:hidden p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Search Button - Absolute positioned */}
          <button className="absolute right-0 md:hidden p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <Search size={20} />
          </button>

          {/* Logo - Centered on mobile */}
          <div className="w-full flex justify-center md:justify-start md:flex-1">
            <Link to="/" className="flex-shrink-0">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="py-3 px-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;