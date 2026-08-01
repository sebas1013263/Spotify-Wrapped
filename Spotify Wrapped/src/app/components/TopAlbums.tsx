"use client";

import Image from 'next/image';
import { Pixelify_Sans } from 'next/font/google';
import { useState, useEffect } from 'react';
import { useSelectSound } from '@/app/hooks/useSelectSound';
import { useHoverSound } from '@/app/hooks/useHoverSound';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

interface Album {
  id: number;
  image: string;
  alt: string;
  revealed: boolean;
}

const TopAlbums = ({ onComplete }: { onComplete: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // Sound effects
  const playSelectSound = useSelectSound();
  const playHoverSound = useHoverSound();
  
  const [albums, setAlbums] = useState<Album[]>([
    { id: 1, image: '/billie-album.png', alt: 'Billie album cover', revealed: false },
    { id: 2, image: '/taylor-album.png', alt: 'Taylor album cover', revealed: false },
    { id: 3, image: '/sabrina-album.png', alt: 'Sabrina album cover', revealed: false }
  ]);

  // Track when all albums are revealed
  const [allRevealed, setAllRevealed] = useState(false);

  // Handle initial fade-in
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle manual completion via spacebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isFadingOut) {
        event.preventDefault();
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFadingOut]);

  // Check if all albums are revealed
  useEffect(() => {
    if (albums.every(album => album.revealed) && !allRevealed) {
      setAllRevealed(true);
      
      // Wait before auto-transitioning (3 seconds)
      const timer = setTimeout(() => {
        handleComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [albums, allRevealed]);

  // Handle component transition and completion
  const handleComplete = () => {
    if (isFadingOut) return;
    
    // Start fade out animation
    setIsFadingOut(true);
    
    // Call onComplete after fade-out animation finishes
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 1000);
  };

  const handleAlbumClick = (albumId: number) => {
    if (!albums.find(album => album.id === albumId)?.revealed) {
      // Play sound when revealing an album
      playSelectSound();
      
      setAlbums(prevAlbums =>
        prevAlbums.map(album =>
          album.id === albumId ? { ...album, revealed: true } : album
        )
      );
    }
  };

  return (
    <div className={`
      w-full h-full flex flex-col items-center justify-between py-8 
      transition-opacity duration-1000 ease-out
      ${isVisible && !isFadingOut ? 'opacity-100' : ''}
      ${isFadingOut ? 'opacity-0' : ''}
      ${!isVisible ? 'opacity-0' : ''}
    `}>
      {/* Title */}
      <h2 className={`
        ${pixelifySans.className}
        text-[2vw] sm:text-[2vw] md:text-[2vw] lg:text-[32px] mb-8
        text-white
      `}>
        TOP 3 ALBUMS GLOBALLY
      </h2>

      {/* Albums Container */}
      <div className="flex justify-center items-center gap-8 relative">
        {/* Crown Image */}
        <div className="absolute -top-[6vw] left-1/2 -translate-x-1/2 w-[4vw] h-[4vw] max-w-[60px] max-h-[80px]">
          <Image
            src="/crown.svg"
            alt="Crown icon"
            fill
            className="object-contain"
            priority
          />
        </div>

        {albums.map((album) => (
          <div
            key={album.id}
            onClick={() => handleAlbumClick(album.id)}
            onMouseEnter={playHoverSound}
            className="relative cursor-pointer cursor-album-hover"
            role="button"
            tabIndex={0}
            aria-label={`Reveal ${album.alt}`}
            onKeyDown={(e) => e.key === 'Enter' && handleAlbumClick(album.id)}
          >
            <div className="relative w-[20vw] h-[20vw] max-w-[300px] max-h-[300px]">
              {/* Mystery Icon */}
              <div className={`absolute inset-0 transform transition-all duration-[1500ms] ease-in-out
                ${album.revealed ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
                <Image
                  src="/mystery.svg"
                  alt="Mystery icon"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Album Cover */}
              <div className={`absolute inset-0 transform transition-all duration-[1500ms] ease-in-out
                ${album.revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <Image
                  src={album.image}
                  alt={album.alt}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Text */}
      <h2 className={`
        ${pixelifySans.className}
        text-[2vw] sm:text-[2vw] md:text-[2vw] lg:text-[24px] 
      `}>
        {allRevealed ? (
          <>PRESS THE <span className="font-bold text-[#2FFD2F] blink-animation">[ SPACEBAR ]</span> TO CONTINUE</>
        ) : (
          <><span className="text-[#2FFD2F]">CLICK</span><span className="text-white"> TO REVEAL</span></>
        )}
      </h2>
    </div>
  );
};

export default TopAlbums;