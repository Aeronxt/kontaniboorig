import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Search, Star, ChevronRight, Building2, Briefcase, CreditCard, Home, Car, ShoppingBag, Laptop, Dumbbell, Smartphone, Users, PiggyBank, Phone, Wifi } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface TableConfig {
  tableName: string;
  columns: {
    nameField: string;
    imageField: string;
    hasType?: boolean;
  };
}

const getTableConfig = (categoryId: string): TableConfig | null => {
  const config: { [key: string]: TableConfig } = {
    'Credit Cards': {
      tableName: 'credit_cards',
      columns: {
        nameField: 'card_name',
        imageField: 'image_link',
        hasType: true
      }
    },
    'Mobile Payments': {
      tableName: 'mobile_payment',
      columns: {
        nameField: 'name',
        imageField: 'image_url'
      }
    },
    'Home Loans': {
      tableName: 'homeloans',
      columns: {
        nameField: 'name',
        imageField: 'image_url'
      }
    },
    'Personal Loans': {
      tableName: 'personal_loans',
      columns: {
        nameField: 'name',
        imageField: 'image_url'
      }
    },
    'Bank Accounts': {
      tableName: 'bank_accounts',
      columns: {
        nameField: 'name',
        imageField: 'image_url'
      }
    },
    'Savings Accounts': {
      tableName: 'savings_accounts',
      columns: {
        nameField: 'name',
        imageField: 'image_url'
      }
    },
    'Mobile Plans': {
      tableName: 'mobile_plans',
      columns: {
        nameField: 'name',
        imageField: 'image_url'
      }
    },
    'Broadband': {
      tableName: 'broadband',
      columns: {
        nameField: 'name',
        imageField: 'image_url'
      }
    }
  };

  return config[categoryId] || null;
};

const categories: Category[] = [
  { id: 'Credit Cards', name: 'Credit Cards', icon: <CreditCard className="w-6 h-6" /> },
  { id: 'Mobile Payments', name: 'Mobile Payments', icon: <Smartphone className="w-6 h-6" /> },
  { id: 'Home Loans', name: 'Home Loans', icon: <Home className="w-6 h-6" /> },
  { id: 'Personal Loans', name: 'Personal Loans', icon: <Users className="w-6 h-6" /> },
  { id: 'Bank Accounts', name: 'Bank Accounts', icon: <Building2 className="w-6 h-6" /> },
  { id: 'Savings Accounts', name: 'Savings Accounts', icon: <PiggyBank className="w-6 h-6" /> },
  { id: 'Mobile Plans', name: 'Mobile Plans', icon: <Phone className="w-6 h-6" /> },
  { id: 'Broadband', name: 'Broadband', icon: <Wifi className="w-6 h-6" /> }
];

const ReviewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<TableConfig | null>(null);

  useEffect(() => {
    if (selectedCategory) {
      const config = getTableConfig(selectedCategory);
      setCurrentConfig(config);
      fetchProducts(config);
    }
  }, [selectedCategory]);

  const fetchProducts = async (config: TableConfig | null) => {
    if (!config) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(config.tableName)
        .select('*')
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product: any) => {
    if (!currentConfig) return null;
    return product[currentConfig.columns.imageField];
  };

  const getProductName = (product: any) => {
    if (!currentConfig) return 'Unknown';
    return product[currentConfig.columns.nameField] || product.brand || 'Unknown';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-4 text-center"
          >
            Find a company you can trust
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-center mb-8"
          >
            Real reviews by real people.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search company or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-800 text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-semibold mb-8"
        >
          What are you looking for?
        </motion.h2>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              {category.icon}
              <span className="mt-2 text-sm font-medium">{category.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Products/Companies Grid */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition cursor-pointer col-span-1 md:col-span-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getProductImage(product) ? (
                          <img
                            src={getProductImage(product)}
                            alt={getProductName(product)}
                            className="w-10 h-10 object-contain rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-sm">{getProductName(product)}</h3>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (product.rating || 4)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-xs text-gray-500">
                          {product.review_count || '0'} reviews
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ReviewsPage; 