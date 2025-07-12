import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  quote: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <motion.div 
      className="bg-gray-50 p-6 rounded-lg transform-gpu"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div 
        className="flex space-x-1 mb-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { 
                opacity: 0,
                scale: 0.5,
                y: 10
              },
              visible: { 
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }
              }
            }}
          >
            <Star 
              size={24} 
              className={i < testimonial.rating ? "text-orange-400 fill-orange-400" : "text-gray-200"}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.p 
        className="text-gray-700 text-sm mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          transition: { delay: 0.2, duration: 0.5 }
        }}
        viewport={{ once: true }}
      >
        "{testimonial.quote}"
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ 
          opacity: 1,
          transition: { delay: 0.3, duration: 0.5 }
        }}
        viewport={{ once: true }}
      >
        <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
      </motion.div>
    </motion.div>
  );
};

export default TestimonialCard;