"use client";

import React, { useEffect, type ReactNode } from 'react';
import { Pixelify_Sans } from 'next/font/google';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

interface PopupProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ children, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore scrolling when popup is closed
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Check window size for min width 
  useEffect(() => {
    if (!isOpen) return;
    
    const checkWindowSize = () => {
      // If window is too small, add an overlay message
      if (window.innerWidth < 700) {
        const warningDiv = document.createElement('div');
        warningDiv.id = 'popup-size-warning';
        warningDiv.style.position = 'fixed';
        warningDiv.style.inset = '0';
        warningDiv.style.backgroundColor = 'rgba(0,0,0,0.9)';
        warningDiv.style.zIndex = '9999';
        warningDiv.style.display = 'flex';
        warningDiv.style.alignItems = 'center';
        warningDiv.style.justifyContent = 'center';
        warningDiv.style.color = 'white';
        warningDiv.style.padding = '2rem';
        warningDiv.style.textAlign = 'center';
        warningDiv.innerHTML = `
          <div>
            <h2 style="color: #2FFD2F; margin-bottom: 1rem; font-size: 1.5rem;">Viewport Too Small</h2>
            <p style="margin-bottom: 1.5rem;">This application requires a minimum viewport width of 700px for the best experience.</p>
            <p>Please resize your browser window or view on a larger screen.</p>
          </div>
        `;
        
        document.body.appendChild(warningDiv);
      } else {
        // Remove warning if window becomes larger
        const existingWarning = document.getElementById('popup-size-warning');
        if (existingWarning) {
          document.body.removeChild(existingWarning);
        }
      }
    };

    // Initial check
    checkWindowSize();

    // Add event listener
    window.addEventListener('resize', checkWindowSize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkWindowSize);
      const existingWarning = document.getElementById('popup-size-warning');
      if (existingWarning) {
        document.body.removeChild(existingWarning);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden min-w-[700px]"
      aria-modal="true"
      role="dialog"
    >
      {/* Container with aspect ratio handling */}
      <div className="w-5/6 max-h-[90vh] aspect-video relative overflow-hidden will-change-transform">
        {/* Backdrop with blur */}
        <div 
          className="absolute inset-0 bg-[#0F2331] bg-opacity-65 backdrop-blur-[5px] rounded-lg will-change-opacity"
          aria-hidden="true"
        />
        
        {/* Content container */}
        <div className="relative h-full w-full overflow-hidden flex flex-col">
          {children}
          
          {/* ESC fixed at bottom */}
          <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 md:bottom-5 lg:bottom-6 left-0 right-0 flex justify-center z-10">
            <p className={`${pixelifySans.className} text-[14px] xs:text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px] whitespace-nowrap px-2`}>
              <span className="text-white">PRESS THE </span>
              <span className="text-[#2FFD2F] blink-animation">ESC</span>
              <span className="text-white"> KEY TO EXIT</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;