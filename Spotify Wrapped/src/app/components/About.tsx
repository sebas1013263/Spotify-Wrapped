"use client";

import React from 'react';
import { Pixelify_Sans } from 'next/font/google';
import Popup from './Popup';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

interface AboutProps {
  isOpen: boolean;
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className="relative h-full w-full flex flex-col justify-between overflow-hidden">
        {/* Header positioned at the top with consistent padding */}
        <div className="w-full pt-4 xs:pt-5 sm:pt-6 md:pt-8 lg:pt-10 text-center">
          <h1 className={`${pixelifySans.className} text-white text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-wider`}>
            ABOUT
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
            <p>hi, i&apos;m kat!</p>
            
            <p>i&apos;m a designer and engineer studying @ UCLA</p>
            
            <p className="max-w-full break-words">
              This is a recreation of Spotify&apos;s 2024 Wrapped with fun interactivity
              and a <span className="text-[#2FFD2F] font-bold">retro, 90s twist</span> via 
              Next.js.
            </p>
          </div>
        </div>

        {/* Bottom area reserved for exit message in Popup component */}
        <div className="pb-8 sm:pb-10 md:pb-12 lg:pb-14"></div>
      </div>
    </Popup>
  );
};

export default About;