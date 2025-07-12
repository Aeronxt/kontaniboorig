import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Deal {
  id: number;
  title: string;
  provider: string;
  offer: string;
  description: string;
  category: string;
  image: string;
}

interface PromoCardProps {
  deal: Deal;
}

const PromoCard: React.FC<PromoCardProps> = ({ deal }) => {
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: deal.id * 0.1 }}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <img 
          src={deal.image} 
          alt={deal.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            {deal.offer}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold leading-tight text-gray-900">
              {deal.title}
            </h3>
            <p className="text-sm text-gray-600">{deal.provider}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded capitalize ${
            deal.category === 'cards' ? 'bg-purple-100 text-purple-700' :
            deal.category === 'loans' ? 'bg-green-100 text-green-700' :
            deal.category === 'phone-plans' ? 'bg-yellow-100 text-yellow-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {deal.category.replace('-', ' ')}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          {deal.description}
        </p>
        
        <a 
          href="#" 
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View details <ArrowUpRight size={16} className="ml-1" />
        </a>
      </div>
    </motion.div>
  );
};

export default PromoCard;