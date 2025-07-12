import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => {
  return (
    <img 
      src="https://wrczctvglyhprlbkogjb.supabase.co/storage/v1/object/public/webimages//LOGPN2.png"
      alt="Konta Nibo"
      className={className}
    />
  );
};

export default Logo;