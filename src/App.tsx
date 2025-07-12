import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import SideNav from './components/layout/SideNav';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';

import HomePage from './pages/HomePage';
import BanksPage from './pages/BanksPage';
import LoansPage from './pages/LoansPage';
import CardsPage from './pages/CardsPage';
import CardDetailsPage from './pages/CardDetailsPage';
import HomeLoansPage from './pages/HomeLoansPage';
import PhonePlansPage from './pages/PhonePlansPage';
import InsurancePage from './pages/InsurancePage';
import AboutPage from './pages/AboutPage';
import AdminPortalPage from './pages/AdminPortalPage';
import AdminLoginPage from './pages/AdminLoginPage';
import MobilePaymentsPage from './pages/MobilePaymentsPage';
import MobilePaymentDetailsPage from './pages/MobilePaymentDetailsPage';
import BroadbandComparePage from './pages/BroadbandComparePage';
import CreditScorePage from './pages/CreditScorePage';
import BankAccountsPage from './pages/BankAccountsPage';
import PersonalLoansPage from './pages/PersonalLoansPage';
import CarLoansPage from './pages/CarLoansPage';
import SavingsAccountsPage from './pages/SavingsAccountsPage';
import PartnerWithUsPage from './pages/PartnerWithUsPage';
import ContactPage from './pages/ContactPage';
import InvestWithUsPage from './pages/InvestWithUsPage';
import HowWeMakeMoneyPage from './pages/HowWeMakeMoneyPage';
import MobilePlansPage from './pages/MobilePlansPage';
import GetALoanPage from './pages/GetALoanPage';
import CalculatorPage from './pages/CalculatorPage';
import ReviewsPage from './pages/ReviewsPage';
import CareersPage from './pages/Careers';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ForBanks from './pages/ForBanks';
import BankLoginPage from './pages/BankLoginPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BestRatesFinderPage from './pages/BestRatesFinderPage';
import HRLoginPage from './pages/HRLoginPage';
import HRPage from './pages/HRPage';
import ESPLoginPage from './pages/ESPLoginPage';
import ESPPage from './pages/ESPPage';
import NewsPage from './pages/NewsPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import MediaPage from './pages/MediaPage';
import ProtectedRoute from './components/ProtectedRoute';
import HRProtectedRoute from './components/HRProtectedRoute';
import ESPProtectedRoute from './components/ESPProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import SuitePage from './pages/SuitePage';
import LoginPage from './pages/LoginPage';
import EntertainmentPage from './pages/EntertainmentPage';
import InstantBankPage from './pages/InstantBankPage';
import BOGOPage from './pages/BOGOPage';
import ProfilePage from './pages/ProfilePage';
import MyDashPage from './pages/MyDashPage';

function AppLayout() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/admin-login' || 
                          location.pathname === '/admin' || 
                          location.pathname === '/bank-login' ||
                          location.pathname === '/for-banks' ||
                          location.pathname === '/hr-login' ||
                          location.pathname === '/hr' ||
                          location.pathname === '/esp-login' ||
                          location.pathname === '/esp' ||
                          location.pathname === '/suite' ||
                          location.pathname === '/login' ||
                          location.pathname === '/mydash' ||
                          location.pathname.startsWith('/news/');
  
  return (
    <div className="flex">
      <ScrollToTop />
      {!hideNavAndFooter && <SideNav />}
      <div className={`flex-1 ${!hideNavAndFooter ? 'md:ml-[60px]' : ''}`}>
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/best-rates-finder" element={<BestRatesFinderPage />} />
              <Route path="/banks" element={<BanksPage />} />
              <Route path="/loans" element={<LoansPage />} />
              <Route path="/get-a-loan" element={<GetALoanPage />} />
                      <Route path="/credit-cards" element={<CardsPage />} />
        <Route path="/credit-cards/:id" element={<CardDetailsPage />} />
              <Route path="/instant-bank" element={<InstantBankPage />} />
              <Route path="/home-loans" element={<HomeLoansPage />} />
              <Route path="/personal-loans" element={<PersonalLoansPage />} />
              <Route path="/car-loans" element={<CarLoansPage />} />
              <Route path="/phone-plans" element={<PhonePlansPage />} />
              <Route path="/mobile-plans" element={<MobilePlansPage />} />
              <Route path="/entertainment" element={<EntertainmentPage />} />
              <Route path="/insurance" element={<InsurancePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<ArticleDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/media" 
                element={
                  <ProtectedRoute>
                    <MediaPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin" element={<AdminPortalPage />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/mobile-payments" element={<MobilePaymentsPage />} />
              <Route path="/mobile-payments/:id" element={<MobilePaymentDetailsPage />} />
              <Route path="/broadband" element={<BroadbandComparePage />} />
              <Route path="/credit-score" element={<CreditScorePage />} />
              <Route path="/bank-accounts" element={<BankAccountsPage />} />
              <Route path="/savings-accounts" element={<SavingsAccountsPage />} />
              <Route path="/partner-with-us" element={<PartnerWithUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/invest-with-us" element={<InvestWithUsPage />} />
              <Route path="/how-we-make-money" element={<HowWeMakeMoneyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/bank-login" element={<BankLoginPage />} />
              <Route path="/hr-login" element={<HRLoginPage />} />
              <Route path="/suite" element={<SuitePage />} />
              <Route 
                path="/hr" 
                element={
                  <HRProtectedRoute>
                    <HRPage />
                  </HRProtectedRoute>
                } 
              />
              <Route path="/esp-login" element={<ESPLoginPage />} />
              <Route 
                path="/esp" 
                element={
                  <ESPProtectedRoute>
                    <ESPPage />
                  </ESPProtectedRoute>
                } 
              />
              <Route 
                path="/for-banks" 
                element={
                  <ProtectedRoute>
                    <ForBanks />
                  </ProtectedRoute>
                } 
              />
              <Route path="/bogo" element={<BOGOPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/mydash" element={<MyDashPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        {!hideNavAndFooter && <Footer />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}