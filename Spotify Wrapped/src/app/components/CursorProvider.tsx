"use client";

import { ReactNode, useEffect } from 'react';
import CustomCursor from './CustomCursor';

interface CursorProviderProps {
  children: ReactNode;
}

const CursorProvider = ({ children }: CursorProviderProps) => {
  // Disable the default browser cursor on mount
  useEffect(() => {
    document.documentElement.classList.add('custom-cursor-enabled');
    
    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, []);

  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
};

export default CursorProvider;