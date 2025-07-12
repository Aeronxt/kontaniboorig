import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import SideNav from './components/layout/SideNav';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';

import ArticleDetailPage from './pages/ArticleDetailPage';
import BankAccountsPage from './pages/BankAccountsPage';
import BestRatesFinderPage from './pages/BestRatesFinderPage';
import BOGOPage from './pages/BOGOPage';
import BroadbandComparePage from './pages/BroadbandComparePage';
import CalculatorPage from './pages/CalculatorPage';
import CardDetailsPage from './pages/CardDetailsPage';
import CardsPage from './pages/CardsPage';
import Careers from './pages/Careers';
import CarLoansPage from './pages/CarLoansPage';
import ContactPage from './pages/ContactPage';
import CreditScorePage from './pages/CreditScorePage';
import EntertainmentPage from './pages/EntertainmentPage';
import GetALoanPage from './pages/GetALoanPage';
import HomeLoansPage from './pages/HomeLoansPage';
import HomePage from './pages/HomePage';
import HowWeMakeMoneyPage from './pages/HowWeMakeMoneyPage';
import InstantBankPage from './pages/InstantBankPage';
import InsurancePage from './pages/InsurancePage';
import InvestWithUsPage from './pages/InvestWithUsPage';
import LoansPage from './pages/LoansPage';
import MediaPage from './pages/MediaPage';
import MobilePaymentDetailsPage from './pages/MobilePaymentDetailsPage';
import MobilePaymentsPage from './pages/MobilePaymentsPage';
import MobilePlansPage from './pages/MobilePlansPage';
import NewsPage from './pages/NewsPage';
import PartnerWithUsPage from './pages/PartnerWithUsPage';
import PersonalLoansPage from './pages/PersonalLoansPage';
import PhonePlansPage from './pages/PhonePlansPage';
import ReviewsPage from './pages/ReviewsPage';
import SavingsAccountsPage from './pages/SavingsAccountsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';

function AppLayout() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname.startsWith('/news/');
  
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
              <Route 
                path="/media" 
                element={
                  <ProtectedRoute>
                    <MediaPage />
                  </ProtectedRoute>
                } 
              />
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
              <Route path="/careers" element={<Careers />} />
              <Route path="/bogo" element={<BOGOPage />} />
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