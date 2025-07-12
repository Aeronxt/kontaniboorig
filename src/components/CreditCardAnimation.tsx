import React from 'react';

const CreditCardAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          
          <linearGradient id="card-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
          
          {/* Enhanced credit card chip pattern */}
          <pattern id="chip-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M0 20h60M0 40h60M20 0v60M40 0v60"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <circle cx="30" cy="30" r="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </pattern>
          
          {/* Enhanced contactless payment waves */}
          <symbol id="contactless" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
              fill="rgba(255,255,255,0.15)"
              className="animate-pulse"
            />
            <path
              d="M8.5 14.5c1.25 1.25 3.29 1.25 4.54 0l1.06-1.06-1.06-1.06c-.83-.83-2.18-.83-3.01 0l-1.06 1.06 1.06 1.06z"
              fill="rgba(255,255,255,0.15)"
              className="animate-pulse"
            />
          </symbol>
        </defs>
        
        {/* Animated background patterns */}
        <rect width="100%" height="100%" fill="url(#chip-pattern)" className="animate-pattern-shift" />
        
        {/* Animated elements with enhanced effects */}
        <g filter="url(#goo)" className="credit-card-elements">
          {/* Credit card shapes with gradient */}
          {[...Array(8)].map((_, i) => (
            <rect
              key={`card-${i}`}
              className={`animate-float-${i + 1} animate-card-pulse`}
              x={Math.random() * 80 + 10 + "%"}
              y={Math.random() * 80 + 10 + "%"}
              width="160"
              height="100"
              rx="12"
              fill="url(#card-gradient)"
              style={{
                transformOrigin: 'center',
                animation: `float-${i + 1} ${15 + i * 2}s ease-in-out infinite, cardPulse 3s ease-in-out infinite ${i * 0.5}s`
              }}
            />
          ))}
          
          {/* Floating circles with enhanced effects */}
          {[...Array(6)].map((_, i) => (
            <circle
              key={`circle-${i}`}
              className={`animate-float-${i + 9} animate-circle-pulse`}
              cx={Math.random() * 80 + 10 + "%"}
              cy={Math.random() * 80 + 10 + "%"}
              r="25"
              fill="rgba(255,255,255,0.12)"
              style={{
                transformOrigin: 'center',
                animation: `float-${i + 9} ${12 + i * 2}s ease-in-out infinite, circlePulse 4s ease-in-out infinite ${i * 0.3}s`
              }}
            />
          ))}
        </g>
        
        {/* Enhanced animated transaction lines */}
        <g className="transaction-lines">
          {[...Array(15)].map((_, i) => (
            <line
              key={`line-${i}`}
              className="animate-draw animate-line-fade"
              x1={Math.random() * 100 + "%"}
              y1={Math.random() * 100 + "%"}
              x2={Math.random() * 100 + "%"}
              y2={Math.random() * 100 + "%"}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeDasharray="5,3"
              style={{
                animation: `draw ${20 + i * 2}s linear infinite ${i * 0.5}s, lineFade 4s ease-in-out infinite ${i * 0.2}s`
              }}
            />
          ))}
        </g>
        
        {/* Enhanced contactless payment symbols */}
        {[...Array(6)].map((_, i) => (
          <use
            key={`contactless-${i}`}
            href="#contactless"
            className={`animate-float-${i + 15} animate-symbol-pulse`}
            x={Math.random() * 80 + 10 + "%"}
            y={Math.random() * 80 + 10 + "%"}
            width="50"
            height="50"
            style={{
              transformOrigin: 'center',
              animation: `float-${i + 15} ${18 + i * 2}s ease-in-out infinite, symbolPulse 3s ease-in-out infinite ${i * 0.4}s`
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default CreditCardAnimation; 