"use client";

import Image from 'next/image';
import { Pixelify_Sans } from 'next/font/google';
import { useState, useEffect } from 'react';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

interface TopHitsProps {
  onComplete?: () => void;
}

const TopHits: React.FC<TopHitsProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && onComplete) {
        event.preventDefault();
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  return (
    <div className={`w-full h-full flex flex-col items-center justify-between py-4 sm:py-6 md:py-8 px-4 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
      {/* Top Text */}
      <h2 className={`
        ${pixelifySans.className}
        text-base sm:text-xl md:text-2xl lg:text-3xl
        text-white mb-2 sm:mb-4 md:mb-6
      `}>
        TOP 10 HITS GLOBALLY
      </h2>

      {/* Top Songs Image - Contained within parent */}
      <div className="relative w-full h-[65%] sm:h-[70%] md:h-[75%] max-w-3xl mx-auto">
        <Image
          src="/top-songs.png"
          alt="Top 10 songs list"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Bottom Text */}
      <h2 className={`
        ${pixelifySans.className}
        text-sm sm:text-base md:text-xl lg:text-2xl
        text-center mt-2 sm:mt-4 md:mt-6 px-2
      `}>
        PRESS THE <span className="font-bold text-[#2FFD2F] blink-animation">[ SPACEBAR ]</span> TO CONTINUE
      </h2>
    </div>
  );
};

export default TopHits;