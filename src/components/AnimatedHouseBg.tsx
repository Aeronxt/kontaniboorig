import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHouseBg: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B1F3B] via-[#2d325f] to-[#1B1F3B]">
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Animated house silhouettes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              bottom: `${15 + i * 12}%`,
              left: `${5 + i * 35}%`,
              width: '180px',
              height: '180px',
              opacity: 0.08,
            }}
            animate={{ 
              y: [-5, 5, -5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                fill="currentColor"
                d="M23,11l-11,-8l-11,8l0,2l2,0l0,8l6,0l0,-5l6,0l0,5l6,0l0,-8l2,0l0,-2zm-11,-4l5,4l-10,0l5,-4z"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => {
          const randomX = Math.random() * 100;
          const randomY = Math.random() * 100;
          const duration = 8 + Math.random() * 4;
          const delay = Math.random() * 2;
          
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${randomX}%`,
                top: `${randomY}%`,
                opacity: 0.3,
              }}
              animate={{
                y: [-10, 10],
                x: [-10, 10],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
                delay,
              }}
            />
          );
        })}
      </div>

      {/* Animated waves */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 w-full"
          animate={{
            translateY: [0, -8, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg className="w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path
              fill="rgba(255, 255, 255, 0.03)"
              d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,74.7C840,75,960,85,1080,80C1200,75,1320,53,1380,42.7L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            />
          </svg>
        </motion.div>
        
        <motion.div
          className="absolute bottom-0 left-0 w-full"
          animate={{
            translateY: [0, -12, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <svg className="w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path
              fill="rgba(255, 255, 255, 0.05)"
              d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedHouseBg; 