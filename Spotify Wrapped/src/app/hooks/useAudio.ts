import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for managing audio playback
 * Handles background music with persistence between page navigations
 * 
 * @param audioSrc Path to the audio file to play
 * @returns Object containing audio state and toggle function
 */
export function useAudio(audioSrc: string) {
  // Default to playing, but will be overridden by localStorage if available
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element on mount
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.1; // Low volume as requested for background music
    audioRef.current = audio;

    // Check if sound preference was previously stored
    const soundState = localStorage.getItem('spotifyWrappedSoundState');
    if (soundState === 'muted') {
      setIsPlaying(false);
    } else {
      // Start playing audio (wrapped in try/catch for browsers that require user interaction)
      audio.play().catch(error => {
        console.log('Auto-play prevented. User interaction required to play audio:', error);
      });
    }

    // Cleanup function to stop audio on unmount
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc]); // Only run on mount and if audioSrc changes

  // Effect to handle audio state changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Try to play and store preference
      audioRef.current.play().catch(error => {
        console.log('Audio playback error:', error);
      });
      localStorage.setItem('spotifyWrappedSoundState', 'playing');
    } else {
      // Pause and store preference
      audioRef.current.pause();
      localStorage.setItem('spotifyWrappedSoundState', 'muted');
    }
  }, [isPlaying]);

  // Function to toggle audio state
  const toggleAudio = () => {
    setIsPlaying(prevState => !prevState);
  };

  return { isPlaying, toggleAudio };
}