"use client";

import Image from 'next/image';
import { Pixelify_Sans } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useHoverSound } from '@/app/hooks/useHoverSound';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

interface UserStatsProps {
  onComplete?: () => void;
}

const UserStats: React.FC<UserStatsProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const playHoverSound = useHoverSound();

  // Simple fade-in animation for the entire component
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Add keyboard handler if onComplete is provided
  useEffect(() => {
    if (!onComplete) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  return (
    <div 
      className={`w-full h-full flex flex-col items-center justify-center ${isVisible ? 'fade-in' : 'opacity-0'}`}
    >
      {/* Title */}
      <h2 className={`
        ${pixelifySans.className}
        text-white
        text-base sm:text-xl md:text-2xl lg:text-3xl
        mb-8
      `}>
        SPOTIFY ACHIEVED
      </h2>

      {/* Images Container */}
      <div className="relative w-full flex justify-center items-center -space-x-16 mb-8">
        {/* User Ranking SVG */}
        <div className="relative w-[40%] aspect-[3/2]">
          <Image
            src="/user-ranking.svg"
            alt="User ranking visualization"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Map SVG */}
        <div className="relative w-[50%] aspect-[2/1]">
          <Image
            src="/map.svg"
            alt="World map visualization"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Bottom Text */}
      <h2 className={`
        ${pixelifySans.className}
        text-base sm:text-xl md:text-2xl lg:text-3xl
        text-center
      `}>
        <span className="text-white">OVER </span>
        <span 
          className="font-bold text-[#2FFD2F] hover:brightness-110 transition-all duration-200" 
          onMouseEnter={playHoverSound}
        >
          640  MILLION 
        </span>
        <span className="text-white"> ACTIVE  USERS!</span>
      </h2>
    </div>
  );
};

export default UserStats;