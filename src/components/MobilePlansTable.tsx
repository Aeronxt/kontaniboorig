import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface MobilePlan {
  id: string;
  brand: string;
  product_name: string;
  tagline: string | null;
  recommended: boolean;
  data: string | null;
  talk_time: string | null;
  sms: string | null;
  score: number | null;
  app_score: number | null;
  logo_url: string | null;
  visit_site_link: string | null;
  reviews: {
    average_rating?: number;
    total_reviews?: number;
  } | null;
  features: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  eligibility: string | null;
  has_4g: boolean;
  has_4g_plus: boolean;
  has_app: boolean;
  is_prepaid: boolean;
  is_postpaid: boolean;
  has_esim: boolean;
  validity_days: number | null;
  terms_and_conditions: string | null;
  has_roaming: boolean;
  has_entertainment: boolean;
  has_retail_travel_discounts: boolean;
  has_mobile_payment: boolean;
  has_bonus: boolean;
  details: string | null;
  price: number | null;
  is_promoted: boolean;
  is_recommended: boolean;
  created_at?: string;
  updated_at?: string;
}

interface MobilePlanModalProps {
  plan: MobilePlan | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'add' | 'edit';
  onSubmit?: (data: Partial<MobilePlan>) => Promise<void>;
}

const MobilePlanModal: React.FC<MobilePlanModalProps> = ({ plan, isOpen, onClose, mode, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<MobilePlan>>(plan || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(plan || {});
    setError(null);
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    // Validate only required fields
    if (!formData.brand?.trim()) {
      setError('Brand is required');
      return;
    }
    if (!formData.product_name?.trim()) {
      setError('Product name is required');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error instanceof Error ? error.message : 'Failed to save mobile plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {mode === 'view' ? 'Plan Details' : mode === 'add' ? 'Add New Plan' : 'Edit Plan'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}
          {mode === 'view' ? (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <p><span className="font-medium">Brand:</span> {plan?.brand}</p>
                  <p><span className="font-medium">Product Name:</span> {plan?.product_name}</p>
                  <p><span className="font-medium">Tagline:</span> {plan?.tagline || '-'}</p>
                  <p><span className="font-medium">Data:</span> {plan?.data || '-'}</p>
                  <p><span className="font-medium">Talk Time:</span> {plan?.talk_time || '-'}</p>
                  <p><span className="font-medium">SMS:</span> {plan?.sms || '-'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Features & Benefits</h3>
                <div className="space-y-4">
                  <p><span className="font-medium">4G:</span> {plan?.has_4g ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">4G+:</span> {plan?.has_4g_plus ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">eSIM:</span> {plan?.has_esim ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Roaming:</span> {plan?.has_roaming ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Entertainment:</span> {plan?.has_entertainment ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Mobile Payment:</span> {plan?.has_mobile_payment ? 'Yes' : 'No'}</p>
                  <p><span className="font-medium">Bonus:</span> {plan?.has_bonus ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.product_name || ''}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                  <input
                    type="text"
                    value={formData.data || ''}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Talk Time</label>
                  <input
                    type="text"
                    value={formData.talk_time || ''}
                    onChange={(e) => setFormData({ ...formData, talk_time: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMS</label>
                  <input
                    type="text"
                    value={formData.sms || ''}
                    onChange={(e) => setFormData({ ...formData, sms: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.score || ''}
                    onChange={(e) => setFormData({ ...formData, score: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">App Score</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.app_score || ''}
                    onChange={(e) => setFormData({ ...formData, app_score: parseFloat(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Validity (days)</label>
                  <input
                    type="number"
                    value={formData.validity_days || ''}
                    onChange={(e) => setFormData({ ...formData, validity_days: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logo_url || ''}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visit Site Link</label>
                  <input
                    type="url"
                    value={formData.visit_site_link || ''}
                    onChange={(e) => setFormData({ ...formData, visit_site_link: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
                <textarea
                  value={formData.features?.join('\n') || ''}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pros (one per line)</label>
                <textarea
                  value={formData.pros?.join('\n') || ''}
                  onChange={(e) => setFormData({ ...formData, pros: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cons (one per line)</label>
                <textarea
                  value={formData.cons?.join('\n') || ''}
                  onChange={(e) => setFormData({ ...formData, cons: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility</label>
                <textarea
                  value={formData.eligibility || ''}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms and Conditions</label>
                <textarea
                  value={formData.terms_and_conditions || ''}
                  onChange={(e) => setFormData({ ...formData, terms_and_conditions: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
                <textarea
                  value={formData.details || ''}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium mb-2">Features</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.has_4g || false}
                    onChange={(e) => setFormData({ ...formData, has_4g: e.target.checked })}
                  />
                  <span>4G</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.has_4g_plus || false}
                    onChange={(e) => setFormData({ ...formData, has_4g_plus: e.target.checked })}
                  />
                  <span>4G+</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.has_esim || false}
                    onChange={(e) => setFormData({ ...formData, has_esim: e.target.checked })}
                  />
                  <span>eSIM</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.has_roaming || false}
                    onChange={(e) => setFormData({ ...formData, has_roaming: e.target.checked })}
                  />
                  <span>Roaming</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.has_entertainment || false}
                    onChange={(e) => setFormData({ ...formData, has_entertainment: e.target.checked })}
                  />
                  <span>Entertainment</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.has_mobile_payment || false}
                    onChange={(e) => setFormData({ ...formData, has_mobile_payment: e.target.checked })}
                  />
                  <span>Mobile Payment</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.has_app || false}
                    onChange={(e) => setFormData({ ...formData, has_app: e.target.checked })}
                  />
                  <span>Has App</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.has_retail_travel_discounts || false}
                    onChange={(e) => setFormData({ ...formData, has_retail_travel_discounts: e.target.checked })}
                  />
                  <span>Retail/Travel Discounts</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.has_bonus || false}
                    onChange={(e) => setFormData({ ...formData, has_bonus: e.target.checked })}
                  />
                  <span>Bonus</span>
                </label>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium mb-2">Plan Type</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_prepaid || false}
                    onChange={(e) => setFormData({ ...formData, is_prepaid: e.target.checked })}
                  />
                  <span>Prepaid</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_postpaid || false}
                    onChange={(e) => setFormData({ ...formData, is_postpaid: e.target.checked })}
                  />
                  <span>Postpaid</span>
                </label>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium mb-2">Status</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_promoted || false}
                    onChange={(e) => setFormData({ ...formData, is_promoted: e.target.checked })}
                  />
                  <span>Promoted</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.recommended || false}
                    onChange={(e) => setFormData({ ...formData, recommended: e.target.checked })}
                  />
                  <span>Recommended</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const MobilePlansTable: React.FC = () => {
  const [plans, setPlans] = useState<MobilePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<MobilePlan | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MobilePlan | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('mobile_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setPlans(data);
      }
    } catch (error) {
      console.error('Error fetching mobile plans:', error);
      setError('Failed to load mobile plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAdd = async (planData: Partial<MobilePlan>) => {
    try {
      // Only include fields that are actually set
      const dataToInsert = {
        brand: planData.brand?.trim(),  // Required
        product_name: planData.product_name?.trim(),  // Required
        // Optional fields - only include if they have a value
        ...(planData.tagline && { tagline: planData.tagline.trim() }),
        ...(planData.data && { data: planData.data.trim() }),
        ...(planData.talk_time && { talk_time: planData.talk_time.trim() }),
        ...(planData.sms && { sms: planData.sms.trim() }),
        ...(planData.logo_url && { logo_url: planData.logo_url.trim() }),
        ...(planData.visit_site_link && { visit_site_link: planData.visit_site_link.trim() }),
        ...(planData.eligibility && { eligibility: planData.eligibility.trim() }),
        ...(planData.terms_and_conditions && { terms_and_conditions: planData.terms_and_conditions.trim() }),
        ...(planData.details && { details: planData.details.trim() }),
        // Arrays - only include if they have values
        ...(planData.features?.length && { features: planData.features }),
        ...(planData.pros?.length && { pros: planData.pros }),
        ...(planData.cons?.length && { cons: planData.cons }),
        // Numeric fields - only include if they have values
        ...(typeof planData.score === 'number' && { score: planData.score }),
        ...(typeof planData.app_score === 'number' && { app_score: planData.app_score }),
        ...(typeof planData.validity_days === 'number' && { validity_days: planData.validity_days }),
        ...(typeof planData.price === 'number' && { price: planData.price }),
        // Boolean fields - include with default false
        has_4g: planData.has_4g || false,
        has_4g_plus: planData.has_4g_plus || false,
        has_app: planData.has_app || false,
        is_prepaid: planData.is_prepaid || false,
        is_postpaid: planData.is_postpaid || false,
        has_esim: planData.has_esim || false,
        has_roaming: planData.has_roaming || false,
        has_entertainment: planData.has_entertainment || false,
        has_retail_travel_discounts: planData.has_retail_travel_discounts || false,
        has_mobile_payment: planData.has_mobile_payment || false,
        has_bonus: planData.has_bonus || false,
        is_promoted: planData.is_promoted || false,
        is_recommended: planData.is_recommended || false,
        // Initialize reviews if not provided
        reviews: planData.reviews || { average_rating: 0, total_reviews: 0 }
      };

      console.log('Attempting to insert data:', dataToInsert);

      const { data, error } = await supabase
        .from('mobile_plans')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Successfully inserted data:', data);
      await fetchPlans();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Full error object:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to add mobile plan: ${error.message}`);
      } else {
        throw new Error('Failed to add mobile plan: Unknown error occurred');
      }
    }
  };

  const handleEdit = async (planData: Partial<MobilePlan>) => {
    if (!editingPlan?.id) return;

    try {
      const { error } = await supabase
        .from('mobile_plans')
        .update(planData)
        .eq('id', editingPlan.id);

      if (error) throw error;
      await fetchPlans();
      setEditingPlan(null);
    } catch (error) {
      console.error('Error updating mobile plan:', error);
      throw new Error('Failed to update mobile plan. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    setDeleteLoading(id);
    setError(null);
    try {
      const { error } = await supabase
        .from('mobile_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPlans(prev => prev.filter(plan => plan.id !== id));
    } catch (error) {
      console.error('Error deleting mobile plan:', error);
      setError('Failed to delete mobile plan. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Mobile Plans</h2>
          <button
            onClick={() => fetchPlans()}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            disabled={loading}
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add New Plan
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talk/SMS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16">
                        {plan.logo_url ? (
                          <img 
                            src={plan.logo_url} 
                            alt={plan.brand}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">No Logo</span>
                          </div>
                        )}
                      </div>
                      <div className="font-medium text-gray-900">{plan.brand}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.data || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.talk_time && <div>Talk: {plan.talk_time}</div>}
                    {plan.sms && <div>SMS: {plan.sms}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {plan.has_4g && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">4G</span>}
                      {plan.has_4g_plus && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">4G+</span>}
                      {plan.has_esim && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">eSIM</span>}
                      {plan.has_roaming && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Roaming</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.score || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => setSelectedPlan(plan)}
                    >
                      View
                    </button>
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => setEditingPlan(plan)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDelete(plan.id)}
                      disabled={deleteLoading === plan.id}
                    >
                      {deleteLoading === plan.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MobilePlanModal
        plan={selectedPlan}
        isOpen={selectedPlan !== null}
        onClose={() => setSelectedPlan(null)}
        mode="view"
      />

      <MobilePlanModal
        plan={null}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        mode="add"
        onSubmit={handleAdd}
      />

      {editingPlan && (
        <MobilePlanModal
          plan={editingPlan}
          isOpen={true}
          onClose={() => setEditingPlan(null)}
          mode="edit"
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
};

export default MobilePlansTable; 