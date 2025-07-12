import React from 'react';

const NetworkAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
          </filter>
        </defs>
        
        {/* Animated circles */}
        <g filter="url(#goo)">
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              className={`animate-float-${i + 1}`}
              cx={Math.random() * 100 + "%"}
              cy={Math.random() * 100 + "%"}
              r="50"
              fill="rgba(255,255,255,0.1)"
            />
          ))}
        </g>

        {/* Network lines */}
        <g className="network-lines">
          {[...Array(15)].map((_, i) => (
            <line
              key={i}
              className="animate-draw"
              x1={Math.random() * 100 + "%"}
              y1={Math.random() * 100 + "%"}
              x2={Math.random() * 100 + "%"}
              y2={Math.random() * 100 + "%"}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default NetworkAnimation; 