"use client";

import React from 'react';
import Link from 'next/link';
import { Pixelify_Sans } from 'next/font/google';
import Popup from './Popup';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

const Contact: React.FC<ContactProps> = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="relative h-full w-full flex flex-col justify-between overflow-hidden">
        {/* Header positioned at the top */}
        <div className="w-full pt-4 xs:pt-5 sm:pt-6 md:pt-8 lg:pt-10 text-center">
          <h1 className={`${pixelifySans.className} text-white text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wider`}>
            CONTACT
          </h1>
        </div>
        
        {/* Content in the middle with flex-grow to maintain spacing */}
        <div className={`
          ${pixelifySans.className}
          flex-grow flex items-center justify-center
          px-4 sm:px-6 md:px-8 lg:px-12
          my-6 xs:my-8 sm:my-10 md:my-12
        `}>
          <div className={`
            text-white 
            text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl
            max-w-[90%] md:max-w-[80%]
            space-y-4 md:space-y-6
            text-center
            leading-relaxed
          `}>
            <p className="break-words font-medium">Email: <span className="text-[#2FFD2F] hover:text-white transition-colors duration-300">katlimq@g.ucla.edu</span></p>
            
            <div className="flex flex-row items-center justify-center flex-wrap gap-4 sm:gap-8 mt-2">
              <Link 
                href="https://open.spotify.com/user/xkatrina1?si=aca8aea3ae484a10" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#2FFD2F] hover:underline hover:text-white transition-colors duration-200 px-2"
                tabIndex={0}
                aria-label="Visit my Spotify profile"
                onKeyDown={(e) => e.key === 'Enter' && window.open("https://open.spotify.com/user/xkatrina1?si=aca8aea3ae484a10", "_blank")}
              >
                My Spotify!
              </Link>
              
              <Link 
                href="https://www.linkedin.com/in/katlimq/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#2FFD2F] hover:underline hover:text-white transition-colors duration-200 px-2"
                tabIndex={0}
                aria-label="Visit my LinkedIn profile"
                onKeyDown={(e) => e.key === 'Enter' && window.open("https://www.linkedin.com/in/katlimq/", "_blank")}
              >
                LinkedIn
              </Link>
              
              <Link 
                href="https://github.com/katjpg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#2FFD2F] hover:underline hover:text-white transition-colors duration-200 px-2"
                tabIndex={0}
                aria-label="Visit my GitHub profile"
                onKeyDown={(e) => e.key === 'Enter' && window.open("https://github.com/katjpg", "_blank")}
              >
                Github
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom area */}
        <div className="pb-8 sm:pb-10 md:pb-12 lg:pb-14"></div>
      </div>
    </Popup>
  );
};

export default Contact;