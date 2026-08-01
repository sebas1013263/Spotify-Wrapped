"use client";

import Image from 'next/image';
import { Pixelify_Sans } from 'next/font/google';
import { useState, useEffect } from 'react';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

interface TopArtistsProps {
  forceReset?: boolean;
}

const TopArtists: React.FC<TopArtistsProps> = ({ forceReset = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTaylorSwift, setShowTaylorSwift] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [isMysteryFading, setIsMysteryFading] = useState(false);
  const [isWinnerFading, setIsWinnerFading] = useState(false);
  const [showTopTen, setShowTopTen] = useState(false);
  // Add state for the shaking effect
  const [isShaking, setIsShaking] = useState(false);

  // Reset animation states when forceReset changes
  useEffect(() => {
    if (forceReset) {
      setIsVisible(false);
      setShowTaylorSwift(false);
      setShowFinalText(false);
      setIsMysteryFading(false);
      setIsWinnerFading(false);
      setShowTopTen(false);
    }
  }, [forceReset]);

  useEffect(() => {
    let mounted = true;
    const timeouts: NodeJS.Timeout[] = [];

    const addTimeout = (callback: () => void, delay: number) => {
      const timeout = setTimeout(() => {
        if (mounted) {
          callback();
        }
      }, delay);
      timeouts.push(timeout);
      return timeout;
    };

    // Reset all states before starting animation
    setShowTaylorSwift(false);
    setShowFinalText(false);
    setIsMysteryFading(false);
    setIsWinnerFading(false);
    setShowTopTen(false);

    // Start animation sequence
    addTimeout(() => setIsVisible(true), 100);
    
    // Start the shaking animation before revealing
    addTimeout(() => setIsShaking(true), 1000);
    addTimeout(() => setIsShaking(false), 2000); // Stop shaking before fade
    
    addTimeout(() => setIsMysteryFading(true), 2000);
    addTimeout(() => setShowTaylorSwift(true), 3500);
    addTimeout(() => setShowFinalText(true), 4300);
    addTimeout(() => setIsWinnerFading(true), 7000);
    addTimeout(() => setShowTopTen(true), 8000);

    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, [forceReset]); // Add forceReset as dependency

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center px-4 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
      {!showTopTen ? (
        // Winner Reveal Container - Centered with max width for larger screens
        <div className={`flex flex-col items-center transform transition-all duration-[1500ms] ease-in-out max-w-md w-full ${isWinnerFading ? 'opacity-0 scale-105' : ''}`}>
          {/* Images Container */}
          <div className="relative flex flex-col items-center mb-2">
            {/* Crown Image - Fixed sizing with responsive adjustments */}
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-16 -mb-2 sm:-mb-3 z-10">
              <Image
                src="/crown.svg"
                alt="Crown icon"
                fill
                className="object-contain"
              />
            </div>
            
            {/* Mystery/Taylor Image Container - Responsive fixed sizing */}
            <div className="relative w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] lg:w-[280px] lg:h-[280px]">
              {/* Mystery Icon with shaking effect */}
              <div 
                className={`absolute inset-0 transform transition-all duration-[1500ms] ease-in-out
                  ${isMysteryFading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
                  ${isShaking ? 'animate-mystery-shake' : ''}`}
              >
                <Image
                  src="/mystery.svg"
                  alt="Mystery icon"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>

              {/* Taylor Swift Image */}
              <div className={`absolute inset-0 transform transition-all duration-[1500ms] ease-in-out
                ${showTaylorSwift ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <Image
                  src="/taylor-swift.png"
                  alt="Taylor Swift"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Winner Text */}
          <h2 className={`
            ${pixelifySans.className}
            text-base sm:text-lg md:text-xl lg:text-2xl
            transform transition-all duration-[1500ms] ease-in-out
            text-center px-2 whitespace-nowrap
            ${showFinalText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}>
            {!showFinalText ? (
              <span className="text-white font-bold">WINNER</span>
            ) : (
              <>
                <span className="text-white">( </span>
                <span className="font-bold text-[#2FFD2F]">TAYLOR SWIFT</span>
                <span className="text-white"> TAKES THE CROWN! )</span>
              </>
            )}
          </h2>
        </div>
      ) : (
        // Top Ten List Container - Full width with padding
        <div className="w-full flex flex-col items-center justify-between h-full py-6 sm:py-8 md:py-12 fade-in px-4">
          {/* Top Text */}
          <h2 className={`
            ${pixelifySans.className}
            text-base sm:text-xl md:text-2xl lg:text-3xl
            text-white mb-4 sm:mb-6 md:mb-8
          `}>
            TOP 10 ARTISTS GLOBALLY
          </h2>

          {/* Top Artists Image - Contained within parent */}
          <div className="relative w-full h-[50%] sm:h-[60%] max-w-2xl mx-auto">
            <Image
              src="/top-artists.png"
              alt="Top 10 artists list"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Bottom Text */}
          <h2 className={`
            ${pixelifySans.className}
            text-sm sm:text-base md:text-xl lg:text-2xl
            text-center mt-4 sm:mt-6 md:mt-8 px-2
          `}>
            PRESS THE <span className="font-bold text-[#2FFD2F] blink-animation">[ SPACEBAR ]</span> TO CONTINUE
          </h2>
        </div>
      )}
    </div>
  );
};

export default TopArtists;