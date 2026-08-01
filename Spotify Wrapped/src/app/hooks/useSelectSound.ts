"use client";

import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for playing a selection sound on clicks or selections
 * @returns Function to play the selection sound
 */
export const useSelectSound = () => {
  // Use ref to persist audio element between renders
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/audios/select.mp3');
      audioRef.current.volume = 0.8; // Increased volume for better audibility
    }
    
    return () => {
      // Clean up on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to play the selection sound
  const playSelectSound = useCallback(() => {
    if (audioRef.current) {
      // Reset audio to beginning to ensure sound plays every time
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing select sound:', error);
      });
    }
  }, []);

  return playSelectSound;
};

export default useSelectSound;
