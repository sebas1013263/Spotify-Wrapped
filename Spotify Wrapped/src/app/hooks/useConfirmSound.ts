"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for playing a confirmation sound when the spacebar is pressed
 * @returns An object with isListening state and toggle function
 */
export const useConfirmSound = () => {
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/audios/confirm_sound.mp3');
      audioRef.current.volume = 0.4; // Adjust volume as needed
    }
    
    return () => {
      // Clean up on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Function to play the confirmation sound
  const playConfirmSound = useCallback(() => {
    if (audioRef.current) {
      // Reset the audio to the beginning for rapid triggering
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing confirm sound:', error);
      });
    }
  }, []);

  // Add event listener for spacebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isListening && event.code === 'Space') {
        event.preventDefault(); // Prevent page scrolling with spacebar
        playConfirmSound();
      }
    };

    if (isListening) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isListening, playConfirmSound]);

  // Toggle function for enabling/disabling the listener
  const toggleListener = useCallback(() => {
    setIsListening(prev => !prev);
  }, []);

  return {
    isListening,
    toggleListener,
    playConfirmSound
  };
};

export default useConfirmSound;
