"use client";

import Image from 'next/image';
import { Pixelify_Sans } from 'next/font/google';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import UserStats from '@/app/components/UserStats';
import ArtistQuiz from '@/app/components/ArtistQuiz';
import TopArtists from '@/app/components/TopArtists';
import TopAlbums from '@/app/components/TopAlbums';
import TopHits from '@/app/components/TopHits';
import HitsAnalysis from '@/app/components/HitsAnalysis';
import { useTypingSound } from '@/app/hooks/useTypingSound';
import { useAudio } from '@/app/hooks/useAudio';
import { useConfirmSound } from '@/app/hooks/useConfirmSound';
import { useSelectSound } from '@/app/hooks/useSelectSound';
import { useHoverSound } from '@/app/hooks/useHoverSound';

const playCelebrationSound = () => {
  const audio = new Audio('/audios/celebration.mp3');
  audio.volume = 0.2; 
  audio.play().catch(err => console.error('Error playing celebration sound:', err));
};

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

// Define all sequence states
type SequenceState = 
  | 'INITIAL'
  | 'WELCOME_MESSAGE'
  | 'MUSIC_MOMENTS_MESSAGE'
  | 'USER_STATS'
  | 'ARTIST_SPOTLIGHT_MESSAGE'
  | 'STREAMS_MESSAGE'
  | 'GUESS_MESSAGE'
  | 'ARTIST_QUIZ'
  | 'CORRECT_GUESS_MESSAGE' 
  | 'INCORRECT_GUESS_MESSAGE'
  | 'REVEAL_MESSAGE'
  | 'TOP_ARTISTS'
  | 'CHARTS_MESSAGE'
  | 'ALBUMS_MESSAGE'
  | 'REPEAT_MESSAGE'
  | 'TOP_ALBUMS'
  | 'SONGS_MESSAGE'
  | 'FAVORITES_MESSAGE'
  | 'TOP_HITS'
  | 'ANALYSIS_MESSAGE'
  | 'HITS_ANALYSIS'
  | 'THANK_YOU_MESSAGE'
  | 'COMPLETE';

// Group message states 
const MESSAGE_STATES: SequenceState[] = [
  'WELCOME_MESSAGE',
  'MUSIC_MOMENTS_MESSAGE',
  'ARTIST_SPOTLIGHT_MESSAGE',
  'STREAMS_MESSAGE',
  'GUESS_MESSAGE',
  'CORRECT_GUESS_MESSAGE',
  'INCORRECT_GUESS_MESSAGE',
  'REVEAL_MESSAGE',
  'CHARTS_MESSAGE',
  'ALBUMS_MESSAGE',
  'REPEAT_MESSAGE',
  'SONGS_MESSAGE',
  'FAVORITES_MESSAGE',
  'ANALYSIS_MESSAGE',
  'THANK_YOU_MESSAGE'
];

// Animation timing constants
const ANIMATION_DURATION = 4000;
const TRANSITION_DELAY = 800;
const FADE_DURATION = 1500;
const USER_STATS_DURATION = 6000;
const COMPONENT_FADE_OUT = 1200;
const TYPING_SPEED = 70; // ms per character
const AFTER_TYPING_PAUSE = 2000; // Time to read after typing completes

// Track if the user answered correctly in the quiz
type QuizResult = {
  isCorrect: boolean;
  selectedArtist: string | null;
};

// All messages
const MESSAGES = {
  WELCOME: "WELCOME TO SPOTIFY WRAPPED!",
  MUSIC_MOMENTS: "THIS YEAR WAS FULL OF MEMORABLE MUSIC MOMENTS",
  ARTIST_SPOTLIGHT: "BUT ONE ARTIST TOOK THE SPOTLIGHT",
  STREAMS: "...WITH OVER 26.6 BILLION STREAMS!",
  GUESS: "CAN YOU GUESS WHO CLAIMED THE CROWN THIS YEAR?",
  CORRECT_GUESS: "YOU GUESSED RIGHT!", 
  INCORRECT_GUESS: "NICE TRY!",
  REVEAL: "NOW FOR THE REVEAL...",
  CHARTS: "THESE TOP ARTISTS DOMINATED CHARTS",
  ALBUMS: "...BUT WHICH ALBUMS",
  REPEAT: "HAD EVERYONE HITTING REPEAT?",
  SONGS: "NOW, LET'S DIVE INTO SONGS THAT DEFINED SPOTIFY THIS YEAR",
  FAVORITES: "DID ANY OF YOUR FAVORITES MAKE THE LIST?",
  ANALYSIS: "LET'S ANALYZE YOUR MUSICAL TASTE",
  THANK_YOU: "THANKS FOR RELIVING YOUR YEAR IN MUSIC!"
};

export default function Wrapped() {
  // Viewport size check
  const [windowTooSmall, setWindowTooSmall] = useState(false);
  
  // Main sequence state
  const [sequenceState, setSequenceState] = useState<SequenceState>('INITIAL');
  
  // Page visibility state
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false); // Track when page assets are loaded
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Message display state
  const [message, setMessage] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isInMessageSequence, setIsInMessageSequence] = useState(false);
  
  // Component transition states
  const [currentComponent, setCurrentComponent] = useState<SequenceState | null>(null);
  const [isComponentFadingOut, setIsComponentFadingOut] = useState(false);
  
  // Quiz result state
  const [quizResult, setQuizResult] = useState<QuizResult>({ isCorrect: false, selectedArtist: null });
  
  // Transition lock to prevent race conditions
  const isTransitioning = useRef(false);
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();
  
  // Sound effects
  const playTypingSound = useTypingSound();
  const { isPlaying, toggleAudio } = useAudio('/audios/showcase_xploshi.mp3');
  const { playConfirmSound } = useConfirmSound();
  const playSelectSound = useSelectSound();
  const playHoverSound = useHoverSound();

  // Handle window resize and check for min width
  useEffect(() => {
    const checkWindowSize = () => {
      setWindowTooSmall(window.innerWidth < 700);
    };

    // Initial check
    checkWindowSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkWindowSize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', checkWindowSize);
  }, []);

  // Check if current state is a message state
  const checkIfMessageState = useCallback((state: SequenceState) => {
    return MESSAGE_STATES.includes(state);
  }, []);

  // Update message sequence flag when state changes
  useEffect(() => {
    if (sequenceState !== 'INITIAL') {
      setIsInMessageSequence(checkIfMessageState(sequenceState));
    }
  }, [sequenceState, checkIfMessageState]);

  // Mark page as loaded after initial render and images are loaded
  useEffect(() => {
    // Set page as loaded immediately
    setIsPageLoaded(true);
    
    // Start page visibility transition after a short delay
    const loadTimer = setTimeout(() => {
      setIsPageVisible(true);
    }, 50);
    
    return () => clearTimeout(loadTimer);
  }, []);
  
  // Clean up timeouts on component unmount
  useEffect(() => {
    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
    };
  }, []);

  // Auto-advance function for components that should transition automatically
  const setupAutoAdvance = useCallback((nextState: SequenceState, delay: number) => {
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
    }
    
    autoAdvanceTimeout.current = setTimeout(() => {
      handleComponentTransition(nextState);
    }, delay);
  }, []);
  
  // UserStats auto-advance
  useEffect(() => {
    if (currentComponent === 'USER_STATS' && !isComponentFadingOut && !isTransitioning.current) {
      setupAutoAdvance('ARTIST_SPOTLIGHT_MESSAGE', USER_STATS_DURATION);
    }
  }, [currentComponent, isComponentFadingOut, setupAutoAdvance]);
  
  // Handler for quiz completion
  const handleQuizComplete = useCallback((isCorrect: boolean, selectedArtist: string) => {
    if (sequenceState !== 'ARTIST_QUIZ' || isTransitioning.current) return;
    
    // Store the quiz result
    setQuizResult({ isCorrect, selectedArtist });
    
    // Start component fade out and transition to the appropriate message
    handleComponentTransition(isCorrect ? 'CORRECT_GUESS_MESSAGE' : 'INCORRECT_GUESS_MESSAGE');
  }, [sequenceState]);

  // Handler for top artists completion
  const handleTopArtistsComplete = useCallback(() => {
    if (sequenceState !== 'TOP_ARTISTS' || isTransitioning.current) return;
    
    // Start component fade out
    handleComponentTransition('CHARTS_MESSAGE');
  }, [sequenceState]);

  // Handler for top albums completion
  const handleTopAlbumsComplete = useCallback(() => {
    if (sequenceState !== 'TOP_ALBUMS' || isTransitioning.current) return;
    
    // Explicitly move to the next state
    handleComponentTransition('SONGS_MESSAGE');
  }, [sequenceState]);

  // Handler for top hits completion
  const handleTopHitsComplete = useCallback(() => {
    if (sequenceState !== 'TOP_HITS' || isTransitioning.current) return;
    
    // Start component fade out
    handleComponentTransition('ANALYSIS_MESSAGE');
  }, [sequenceState]);

  // Handler for hits analysis completion
  const handleHitsAnalysisComplete = useCallback(() => {
    if (sequenceState !== 'HITS_ANALYSIS' || isTransitioning.current) return;
    
    // Play sound when completing this section
    playSelectSound();
    
    // Start component fade out
    handleComponentTransition('THANK_YOU_MESSAGE');
  }, [sequenceState, playSelectSound]);

  // Handle component transitions with fade out
  const handleComponentTransition = useCallback((nextState: SequenceState) => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    setIsComponentFadingOut(true);
    
    // Use requestAnimationFrame for smoother timing with CSS animations
    requestAnimationFrame(() => {
      // Set timeout for fade out duration before changing state
      transitionTimeout.current = setTimeout(() => {
        setIsComponentFadingOut(false);
        setCurrentComponent(null);
        setSequenceState(nextState);
        isTransitioning.current = false;
      }, COMPONENT_FADE_OUT);
    });
  }, []);

  // Skipping flag for messages
  const [isSkipping, setIsSkipping] = useState(false);
  
  // Reference to the message container for measuring available width
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // State to track the container width in characters
  const [containerWidthInChars, setContainerWidthInChars] = useState(80); // Default fallback
  
  // Reference to store the current message width value
  const currentMessageWidthRef = useRef<number>(0);
  
  // Real-time update handler for container width that affects message position during typing
  const updateContainerWidth = useCallback(() => {
    if (!messageContainerRef.current) return;
    
    // Get the actual pixel width of the container
    const containerWidth = messageContainerRef.current.clientWidth;
    
    // Create a temporary span to measure the width of a single character
    const tempSpan = document.createElement('span');
    tempSpan.className = pixelifySans.className;
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.fontSize = 'clamp(1rem, 2vw, 1.5rem)';
    tempSpan.innerText = '0'; // Use '0' as reference character (1ch unit)
    
    // Add to DOM temporarily to measure
    document.body.appendChild(tempSpan);
    const charWidth = tempSpan.getBoundingClientRect().width;
    document.body.removeChild(tempSpan);
    
    // Calculate how many characters can fit in the container
    const charsInContainer = Math.floor(containerWidth / charWidth) + 2;
    
    // Update state with the new measurement
    setContainerWidthInChars(charsInContainer);
  }, [pixelifySans.className]);
  
  // Update container width measurement when window resizes
  useEffect(() => {
    // Initialize on component mount using our callback
    updateContainerWidth();
    
    // Use throttled resize handler for better performance 
    let resizeTimer: NodeJS.Timeout | null = null;
    const handleResize = () => {
      // Clear previous timer
      if (resizeTimer) clearTimeout(resizeTimer);
      
      // Set a short timeout to prevent too many updates
      resizeTimer = setTimeout(() => {
        updateContainerWidth();
      }, 50); // Short delay for smooth updates
    };
    
    // Update when window resizes
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [updateContainerWidth]);
  
  // Get the actual width of a specific text string in character units
  const measureTextWidth = useCallback((text: string): number => {
    // Early return for empty text
    if (!text) return 0;
    
    // Create a temporary span to measure the exact width of this specific text
    const tempSpan = document.createElement('span');
    tempSpan.className = pixelifySans.className;
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.fontSize = 'clamp(1rem, 2vw, 1.5rem)'; // Match the actual font size
    tempSpan.innerText = text; // Use the exact message text with all spaces and special characters
    
    // Reference character for measuring 1ch unit
    const refSpan = document.createElement('span');
    refSpan.className = pixelifySans.className;
    refSpan.style.visibility = 'hidden';
    refSpan.style.position = 'absolute';
    refSpan.style.whiteSpace = 'nowrap';
    refSpan.style.fontSize = 'clamp(1rem, 2vw, 1.5rem)';
    refSpan.innerText = '0'; // Use '0' as reference character (1ch unit)
    
    // Add to DOM temporarily to measure
    document.body.appendChild(tempSpan);
    document.body.appendChild(refSpan);
    
    // Get the precise measurements
    const textWidth = tempSpan.getBoundingClientRect().width;
    const charWidth = refSpan.getBoundingClientRect().width;
    
    // Clean up
    document.body.removeChild(tempSpan);
    document.body.removeChild(refSpan);
    
    // Convert pixel width to character units (with padding for better appearance)
    return (textWidth / charWidth) + 1; // Add 1ch for cursor space
  }, [pixelifySans.className]);
  
  // Calculate precise margins for each message to ensure equal space on both sides
  const getMessageStyles = useCallback((text: string) => {
    // For an empty message during typing, use the stored width of the full message
    // Otherwise measure the current text
    const messageWidth = text.length === 0 ? 
      currentMessageWidthRef.current : 
      measureTextWidth(text);
    
    // Calculate exact margin to perfectly center the text
    // This ensures the text starts from the exact same position for all messages
    const margin = Math.max(0, (containerWidthInChars - messageWidth) / 2);
    
    // Convert margin to ch units for consistency
    const marginInCh = `${margin}ch`;
    
    return {
      // Set width based on the exact measured text width
      width: `${messageWidth}ch`,
      // Exact equal margins on both sides
      marginLeft: marginInCh,
      marginRight: marginInCh,
      // Text always starts from the left edge of its container
      textAlign: 'left' as const,
      // Prevent overflow on small screens
      maxWidth: '90%',
      // Add transition for smooth margin updates during screen resize
      transition: 'margin 0.1s ease-out'
    };
  }, [containerWidthInChars, measureTextWidth]);
  
  // Display a message with typewriter effect
  const displayMessage = useCallback(async (text: string): Promise<void> => {
    if (isTransitioning.current) return;
    
    isTransitioning.current = true;
    
    // Measure the message width at the start and store for reference
    currentMessageWidthRef.current = measureTextWidth(text);
    
    // Ensure container width is updated before displaying message
    updateContainerWidth();
    
    // Fade out current component if visible
    if (currentComponent) {
      setIsComponentFadingOut(true);
      // Use requestAnimationFrame for smoother animation
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          setTimeout(resolve, COMPONENT_FADE_OUT);
        });
      });
      setCurrentComponent(null);
      setIsComponentFadingOut(false);
    }
    
    // Show message container and prepare for typing
    setMessage(text);
    setDisplayedText('');
    setIsMessageVisible(true);
    setShowCursor(true);
    setIsTypingComplete(false);
    
    // Type out message one character at a time with optimized rendering
    // Using requestAnimationFrame for better performance
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // Add resize listener that's specific to this typing sequence
    const resizeHandler = () => {
      updateContainerWidth();
    };
    window.addEventListener('resize', resizeHandler);
    
    for (let i = 0; i <= text.length; i++) {
      // Early return if skipping animation
      if (isSkipping) {
        setDisplayedText(text);
        break;
      }
      
      // Wrapper Promise with RAF for smoother animation
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          // Play typing sound for each character (except the last empty character)
          // Only play sounds if audio is not muted
          if (i < text.length && isPlaying) {
            playTypingSound();
          }
          
          // Update text with optimal batching
          setDisplayedText(text.substring(0, i));
          
          // Set a timeout for the next character
          typingTimeout.current = setTimeout(resolve, TYPING_SPEED);
        });
      });
    }
    
    // Remove the specific resize handler we added for this typing sequence
    window.removeEventListener('resize', resizeHandler);
    
    // Pause after typing to allow reading with smoother transition
    // Reset skipping flag
    setIsSkipping(false);
    
    // RAF -> smooth UI updates
    requestAnimationFrame(() => {
      // Show complete message
      setDisplayedText(text);
      setIsTypingComplete(true); // Set flag indicating typing is done
    });
    
    // Wait for user to click or press spacebar with optimized timing
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        typingTimeout.current = setTimeout(resolve, AFTER_TYPING_PAUSE);
      });
    });
    
    setShowCursor(false);
    setIsMessageVisible(false);
    setIsTypingComplete(false);
    await new Promise(resolve => setTimeout(resolve, TRANSITION_DELAY));
    
    isTransitioning.current = false;
  }, [currentComponent, playTypingSound, isPlaying, isSkipping]);

  // Global spacebar handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || isTransitioning.current || windowTooSmall) return;
      
      event.preventDefault();
      playConfirmSound(); // Confirm sound when spacebar is pressed
      
      // Handle spacebar for states that need manual progression
      switch (sequenceState) {
        case 'TOP_ARTISTS':
          handleTopArtistsComplete();
          break;
        case 'TOP_HITS':
          handleTopHitsComplete();
          break;
        case 'HITS_ANALYSIS':
          handleHitsAnalysisComplete();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    sequenceState, 
    handleTopArtistsComplete, 
    handleTopHitsComplete, 
    handleHitsAnalysisComplete, 
    playConfirmSound,
    windowTooSmall
  ]);

  // Main sequence controller
  useEffect(() => {
    const runSequence = async () => {
      // Prevent running the sequence controller during transitions
      if (isTransitioning.current) return;
      
      // Set page to visible initially with optimized animation timing
      if (sequenceState === 'INITIAL') {
        // Use requestAnimationFrame for smoother initial animations
        requestAnimationFrame(() => {
          // Wait for page to be visible before proceeding
          if (!isPageVisible) return;
          
          // Allow fade-in animation to complete with better timing
          setTimeout(async () => {
            // Wait for next animation frame before proceeding
            await new Promise(resolve => requestAnimationFrame(resolve));
            setSequenceState('WELCOME_MESSAGE');
          }, 800); // Slightly shorter for better responsiveness
        });
        return;
      }
      
      // Handle each state in the sequence
      switch (sequenceState) {
        case 'WELCOME_MESSAGE':
          await displayMessage(MESSAGES.WELCOME);
          setSequenceState('MUSIC_MOMENTS_MESSAGE');
          break;
          
        case 'MUSIC_MOMENTS_MESSAGE':
          await displayMessage(MESSAGES.MUSIC_MOMENTS);
          setSequenceState('USER_STATS');
          break;
          
        case 'USER_STATS':
          setCurrentComponent('USER_STATS');
          
          playCelebrationSound();
          break;
          
        case 'ARTIST_SPOTLIGHT_MESSAGE':
          await displayMessage(MESSAGES.ARTIST_SPOTLIGHT);
          setSequenceState('STREAMS_MESSAGE');
          break;
          
        case 'STREAMS_MESSAGE':
          await displayMessage(MESSAGES.STREAMS);
          setSequenceState('GUESS_MESSAGE');
          break;
          
        case 'GUESS_MESSAGE':
          await displayMessage(MESSAGES.GUESS);
          setSequenceState('ARTIST_QUIZ');
          break;
          
        case 'ARTIST_QUIZ':
          setCurrentComponent('ARTIST_QUIZ');
          break;
          
        case 'CORRECT_GUESS_MESSAGE':
          await displayMessage(MESSAGES.CORRECT_GUESS);
          setSequenceState('TOP_ARTISTS');
          break;
          
        case 'INCORRECT_GUESS_MESSAGE':
          await displayMessage(MESSAGES.INCORRECT_GUESS);
          setSequenceState('REVEAL_MESSAGE');
          break;
          
        case 'REVEAL_MESSAGE':
          await displayMessage(MESSAGES.REVEAL);
          setSequenceState('TOP_ARTISTS');
          break;
          
        case 'TOP_ARTISTS':
          setCurrentComponent('TOP_ARTISTS');
          break;
          
        case 'CHARTS_MESSAGE':
          await displayMessage(MESSAGES.CHARTS);
          setSequenceState('ALBUMS_MESSAGE');
          break;
          
        case 'ALBUMS_MESSAGE':
          await displayMessage(MESSAGES.ALBUMS);
          setSequenceState('REPEAT_MESSAGE');
          break;
          
        case 'REPEAT_MESSAGE':
          await displayMessage(MESSAGES.REPEAT);
          setSequenceState('TOP_ALBUMS');
          break;
          
        case 'TOP_ALBUMS':
          setCurrentComponent('TOP_ALBUMS');
          break;
          
        case 'SONGS_MESSAGE':
          await displayMessage(MESSAGES.SONGS);
          setSequenceState('FAVORITES_MESSAGE');
          break;
          
        case 'FAVORITES_MESSAGE':
          await displayMessage(MESSAGES.FAVORITES);
          setSequenceState('TOP_HITS');
          break;
          
        case 'TOP_HITS':
          setCurrentComponent('TOP_HITS');
          break;
          
        case 'ANALYSIS_MESSAGE':
          await displayMessage(MESSAGES.ANALYSIS);
          setSequenceState('HITS_ANALYSIS');
          break;
          
        case 'HITS_ANALYSIS':
          setCurrentComponent('HITS_ANALYSIS');
          break;
          
        case 'THANK_YOU_MESSAGE':
          await displayMessage(MESSAGES.THANK_YOU);
          playConfirmSound();
          setSequenceState('COMPLETE');
          break;
          
        case 'COMPLETE':
          setCurrentComponent('COMPLETE');
          break;
          
        default:
          break;
      }
    };
    
    runSequence();
  }, [sequenceState, displayMessage, isPageVisible, playConfirmSound]);

  // Effect for handling the complete state navigation
  useEffect(() => {
    if (currentComponent === 'COMPLETE') {
      const timer = setTimeout(() => {
        setIsPageVisible(false); // Fade out the page
        
        // Wait for fade animation before navigating
        setTimeout(() => {
          router.push('/'); // Navigate back to main menu
        }, 1000);
      }, 5000); // Wait 5 seconds before returning to home
      
      return () => clearTimeout(timer);
    }
  }, [currentComponent, router]);

  // Determine which component to render based on current state
  const renderCurrentComponent = () => {
    if (!currentComponent) return null;
    
    // Render the appropriate component based on current component state
    switch (currentComponent) {
      case 'USER_STATS':
        return <UserStats />;
        
      case 'ARTIST_QUIZ':
        return <ArtistQuiz onComplete={handleQuizComplete} />;
        
      case 'TOP_ARTISTS':
        return <TopArtists />;
        
      case 'TOP_ALBUMS':
        return <TopAlbums onComplete={handleTopAlbumsComplete} />;
        
      case 'TOP_HITS':
        return <TopHits onComplete={handleTopHitsComplete} />;
        
      case 'HITS_ANALYSIS':
        return <HitsAnalysis onComplete={handleHitsAnalysisComplete} />;
        
      case 'COMPLETE':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className={`
              ${pixelifySans.className}
              text-xl sm:text-2xl md:text-3xl lg:text-[32px]
              text-white mb-4 sm:mb-6
            `}>
              SPOTIFY WRAPPED 2024
            </h2>
            <p className={`
              ${pixelifySans.className}
              text-lg sm:text-xl md:text-2xl lg:text-[24px]
              text-[#2FFD2F]
              mb-8
            `}>
              SEE YOU NEXT YEAR!
            </p>
            <p className={`
              ${pixelifySans.className}
              text-sm sm:text-base md:text-lg lg:text-[20px]
              text-white animate-pulse
            `}>
              Returning to main menu...
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Style for fluid text sizing via clamp()
  const messageTextStyle = {
    fontSize: "clamp(1rem, 2vw, 1.5rem)",
  };

  return (
    <>
      {/* Small Screen Warning Overlay */}
      {windowTooSmall && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className={`${pixelifySans.className} text-white`}>
            <h2 className="text-2xl mb-4 text-[#2FFD2F]">Viewport Too Small</h2>
            <p className="mb-6">
              This application requires a minimum viewport width of 700px for the best experience.
            </p>
            <p>
              Please resize your browser window or view on a larger screen.
            </p>
          </div>
        </div>
      )}

      <div 
        ref={pageRef}
        className={`
          min-h-screen w-full bg-[#000412] flex items-center justify-center overflow-hidden 
          transition-opacity duration-1000 ease-in-out will-change-opacity transform-gpu
          ${isPageLoaded ? '' : 'opacity-0'}
          min-w-[700px]
        `}>
        <div className={`
          relative w-5/6 mx-auto 
          transition-opacity duration-1000 ease-in-out will-change-opacity transform-gpu
          ${isPageVisible ? 'opacity-100' : 'opacity-0'}
        `}>
          {/* Container with fixed aspect ratio */}
          <div className="relative aspect-video">
            {/* Content container with absolute positioning */}
            <div className="absolute inset-0 rounded-lg overflow-hidden before:absolute before:inset-0 before:animate-[borderGlow_3s_ease-in-out_infinite] before:rounded-lg before:pointer-events-none">
              {/* Background image - Load with priority */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/wrapped-bg.png"
                  alt="Wrapped background"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Sound Toggle Button */}
              <div 
                className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-50 cursor-pointer" 
                onClick={() => {
                  playSelectSound();
                  toggleAudio();
                }}
                onMouseEnter={playHoverSound}
                role="button"
                tabIndex={0}
                aria-label={isPlaying ? "Mute sound" : "Unmute sound"}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    playSelectSound();
                    toggleAudio();
                  }
                }}
              >
                <div className="relative w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10">
                  <Image
                    src={isPlaying ? "/sound-on.svg" : "/sound-mute.svg"}
                    alt={isPlaying ? "Sound on" : "Sound muted"}
                    fill
                    className="transition-transform hover:scale-110 active:scale-95 cursor-click"
                    priority
                  />
                </div>
              </div>
              
              {/* Semi-transparent overlay for message states; present during message sequence */}
              <div 
                className={`
                  absolute inset-0 bg-black z-10
                  transition-opacity duration-500 ease-in-out
                  will-change-opacity transform-gpu
                  ${isInMessageSequence ? 'opacity-20' : 'opacity-0 pointer-events-none'}
                `}
                aria-hidden="true"
              />
              
              {/* Message Display with Typewriter Effect */}
              <div 
                className={`
                  absolute inset-0 flex items-center z-20
                  transition-opacity duration-1000 cubic-bezier(0.4, 0.0, 0.2, 1)
                  will-change-opacity transform-gpu
                  ${isMessageVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
              >
                {/* Wrapper container with full width - used for measurement */}
                <div 
                  ref={messageContainerRef}
                  className="relative w-full"
                >
                  {/* Margins calculations individually for each message */}
                  <div 
                    className={`${pixelifySans.className} text-white typewriter-container`}
                    style={{
                      ...messageTextStyle,
                      ...getMessageStyles(message),
                      display: 'block'
                    }}
                  >
                    <span className="typewriter-text">{displayedText}</span>
                    {showCursor && <span className="typewriter-cursor"></span>}
                  </div>
                </div>
              </div>
              
              {/* Component Display - Absolutely positioned with padding for smaller screens */}
              <div 
                className={`
                  absolute inset-0 flex items-center justify-center
                  transition-opacity duration-${COMPONENT_FADE_OUT}ms cubic-bezier(0.4, 0.0, 0.2, 1) p-4
                  will-change-opacity transform-gpu
                  ${isComponentFadingOut ? 'opacity-0' : 'opacity-100'}
                `}
              >
                <div className="w-full h-full flex items-center justify-center transform-gpu">
                  {renderCurrentComponent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}