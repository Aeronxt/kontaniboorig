import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, UserCircle, ArrowRight, Landmark, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const portals = [
  {
    title: 'Admin Portal',
    description: 'Access administrative tools and manage system settings.',
    icon: Building2,
    path: '/admin-login',
    color: 'bg-blue-500',
  },
  {
    title: 'HR Portal',
    description: 'Manage human resources, employee records, and recruitment.',
    icon: Users,
    path: '/hr-login',
    color: 'bg-green-500',
  },
  {
    title: 'Employee Portal',
    description: 'Access employee resources, documents, and self-service tools.',
    icon: UserCircle,
    path: '/esp-login',
    color: 'bg-purple-500',
  },
  {
    title: 'Bank Portal',
    description: 'Access bank-specific features and manage financial services.',
    icon: Landmark,
    path: '/bank-login',
    color: 'bg-orange-500',
  },
  {
    title: 'Media Portal',
    description: 'Create and publish news articles for your financial platform.',
    icon: Edit,
    path: '/media',
    color: 'bg-purple-600',
  },
];

const SuitePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Konta Nibo Suite
          </h1>
          <p className="text-xl text-gray-600">
            Access all our portals from one central location
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.title}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`${portal.color} p-6`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {portal.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {portal.description}
                  </p>
                  <Link
                    to={portal.path}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Access Portal <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SuitePage; 