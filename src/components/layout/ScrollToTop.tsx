'use client';

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Only scroll to top if we came from a different path
    if (prevPathRef.current !== null && prevPathRef.current !== pathname) {
      window.scrollTo(0, 0);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return null;
} 