import { useCallback, useRef } from 'react';

export const useTypingSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTypingSound = useCallback(() => {
    // Create AudioContext only on first use
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const context = audioContextRef.current;
    
    // Create oscillator
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Set up sound characteristics for retro effect
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, context.currentTime); // A4 note
    
    // Set up volume envelope
    gainNode.gain.setValueAtTime(0.025, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.05);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Play sound
    oscillator.start();
    oscillator.stop(context.currentTime + 0.05);
  }, []);

  return playTypingSound;
};