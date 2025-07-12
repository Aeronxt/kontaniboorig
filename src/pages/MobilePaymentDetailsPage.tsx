import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ChevronLeft } from 'lucide-react';

interface MobilePayment {
  id: number;
  name: string;
  features: string[];
  cash_out_fee: string;
  utility_bills_fee: string;
  credit_card_payment_fees: string;
  digital_to_bank_fees: Record<string, string>;
  apps_available: string[];
  description: Record<string, string>;
  eligibility: Record<string, string>;
  transfer_fees: Record<string, string>;
  international_remittance: Record<string, string>;
  image_url: string | null;
  site_link: string | null;
}

const MobilePaymentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<MobilePayment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentDetails();
  }, [id]);

  const fetchPaymentDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mobile_payment')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setPayment(data);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {content}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B1F3B]"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-gray-600">Payment service not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#f5f7fa]"
    >
      {/* Hero Section */}
      <div className="bg-[#1B1F3B] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <a href="/mobile-payments" className="flex items-center text-white/80 hover:text-white font-medium">
              <ChevronLeft size={20} />
              <span>Back to all services</span>
            </a>
          </div>
          <h1 className="text-5xl font-extrabold mb-3 tracking-tight">{payment.name}</h1>
          <div className="flex items-center gap-4">
            <span className="text-xl font-medium">Mobile Payment Service</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Service Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-600">Cash Out Fee</div>
                  <div className="text-xl font-extrabold">{payment.cash_out_fee.startsWith('$') ? '৳' + payment.cash_out_fee.slice(1) : payment.cash_out_fee}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Utility Bills Fee</div>
                  <div className="text-xl font-extrabold">{payment.utility_bills_fee.startsWith('$') ? '৳' + payment.utility_bills_fee.slice(1) : payment.utility_bills_fee}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Credit Card Payment Fees</div>
                  <div className="text-xl font-extrabold">{payment.credit_card_payment_fees.startsWith('$') ? '৳' + payment.credit_card_payment_fees.slice(1) : payment.credit_card_payment_fees}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Available Apps</div>
                  <div className="text-xl font-extrabold">{payment.apps_available?.length || 0}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {Object.keys(payment.description).length > 0 && renderSection(
              "About this service",
              <div className="bg-white rounded-lg shadow-sm p-6">
                {Object.entries(payment.description).map(([key, value]) => (
                  <p key={key} className="text-gray-600 mb-4 last:mb-0 font-medium">{value}</p>
                ))}
              </div>
            )}

            {/* Features */}
            {payment.features?.length > 0 && renderSection(
              "Features",
              <div className="bg-white rounded-lg shadow-sm p-6">
                <ul className="space-y-2">
                  {payment.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Transfer Fees */}
            {Object.keys(payment.transfer_fees).length > 0 && renderSection(
              "Transfer Fees",
              <div className="space-y-2">
                {Object.entries(payment.transfer_fees).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium">{value.startsWith('$') ? '৳' + value.slice(1) : value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* International Remittance */}
            {Object.keys(payment.international_remittance).length > 0 && renderSection(
              "International Remittance",
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="divide-y">
                  {Object.entries(payment.international_remittance).map(([key, value]) => (
                    <div key={key} className="py-4 first:pt-0 last:pb-0 grid grid-cols-2">
                      <div className="text-gray-600">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                      <div className="font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              {/* Add before the Available Apps section in the sidebar */}
              {payment.site_link && (
                <div className="mb-6">
                  <a 
                    href={payment.site_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 text-white px-4 py-2 rounded text-center font-medium hover:bg-blue-700 transition"
                  >
                    Visit Site
                  </a>
                </div>
              )}

              {/* Available Apps */}
              {payment.apps_available?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Available Apps</h3>
                  <ul className="space-y-2">
                    {payment.apps_available.map((app, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Eligibility */}
              {Object.keys(payment.eligibility).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Eligibility</h3>
                  <div className="divide-y">
                    {Object.entries(payment.eligibility).map(([key, value]) => (
                      <div key={key} className="py-4 first:pt-0 last:pb-0">
                        <div className="text-sm text-gray-600 mb-1">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <div className="font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobilePaymentDetailsPage; 