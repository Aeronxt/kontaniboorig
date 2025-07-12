import React from 'react';
import { cn } from '../../utils/cn';

interface LineShadowTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  shadowColor?: string;
}

export const LineShadowText = ({
  children,
  shadowColor = 'white',
  className,
  ...props
}: LineShadowTextProps) => {
  return (
    <span
      className={cn(
        'relative inline-block whitespace-nowrap',
        className
      )}
      {...props}
    >
      <span
        className="absolute inset-x-0 bottom-0 h-[2px] translate-y-[16px]"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shadowColor} 50%, transparent 100%)`,
          opacity: 0.3,
        }}
      />
      {children}
    </span>
  );
}; 