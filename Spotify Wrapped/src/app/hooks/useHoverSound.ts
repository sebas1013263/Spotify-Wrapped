"use client";

import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for playing a sound effect when hovering over elements
 * @returns Function to play the hover sound
 */
export const useHoverSound = () => {
  // Use ref to persist audio element between renders
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/audios/select.mp3');
      audioRef.current.volume = 0.3; // Lower volume for hover to differentiate from click
    }
    
    return () => {
      // Clean up on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to play the hover sound
  const playHoverSound = useCallback(() => {
    if (audioRef.current) {
      // Reset the audio to the beginning for rapid triggering
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing hover sound:', error);
      });
    }
  }, []);

  return playHoverSound;
};
