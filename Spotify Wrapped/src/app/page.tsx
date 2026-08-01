"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Pixelify_Sans } from 'next/font/google';
import { useState, useEffect, useRef } from 'react';
import About from '@/app/components/About';
import Contact from '@/app/components/Contact';
import { useAudio } from '@/app/hooks/useAudio';
import { useConfirmSound } from '@/app/hooks/useConfirmSound';
import { useSelectSound } from '@/app/hooks/useSelectSound';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function Page() {
  const router = useRouter();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullyRendered, setIsFullyRendered] = useState(false);
  const [windowTooSmall, setWindowTooSmall] = useState(false);
  
  // Refs for images to track loading
  const mainBgRef = useRef<HTMLImageElement>(null);
  
  // Initialize sounds
  const { isPlaying, toggleAudio } = useAudio('/audios/new_you_xploshi.mp3');
  const { playConfirmSound } = useConfirmSound();
  const playSelectSound = useSelectSound();

  // Handle window resize and check for minimum width
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

  // Handle initial loading
  useEffect(() => {
    // Set page as loaded immediately to prevent flicker
    setIsLoaded(true);
    
    // Mark as fully rendered after a short delay
    const renderTimer = setTimeout(() => {
      setIsFullyRendered(true);
    }, 50);
    
    return () => clearTimeout(renderTimer);
  }, []);

  const handleAboutClick = () => {
    playSelectSound();
    setIsAboutOpen(true);
  };
  
  const handleContactClick = () => {
    playSelectSound();
    setIsContactOpen(true);
  };

  const handleNavigateToWrapped = async () => {
    if (isAboutOpen || isContactOpen || isFading) return;
    
    playConfirmSound();
    setIsFading(true);
    
    // Prefetch the wrapped page before navigating
    router.prefetch('/pages/wrapped');
    
    // Wait for fade out animation to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Navigate to wrapped page
    router.push('/pages/wrapped');
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isAboutOpen && !isContactOpen && !isFading && !windowTooSmall) {
        event.preventDefault();
        handleNavigateToWrapped();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router, isAboutOpen, isContactOpen, isFading, windowTooSmall]);

  return (
    <>
      {/* Small Screen Overlay */}
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
        className={`
          min-h-screen w-full bg-[#000412] flex items-center justify-center 
          transition-opacity duration-500 ease-in-out will-change-opacity
          ${isFullyRendered ? 'opacity-100' : 'opacity-0'}
          ${isFading ? 'fade-out' : ''}
          min-w-[700px]
        `}
      >
        <div className="relative w-5/6 aspect-video before:absolute before:inset-0 before:animate-[borderGlow_3s_ease-in-out_infinite] before:rounded-lg before:pointer-events-none will-change-transform">        
          <Image
            ref={mainBgRef}
            src="/main-bg.png"
            alt="Green geometric logo"
            fill
            className="object-contain"
            priority={true}
            onLoad={() => setIsLoaded(true)}
          />
          
          {/* Sound Toggle Button */}
          <div 
            className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-50 cursor-pointer" 
            onClick={() => {
              playSelectSound();
              toggleAudio();
            }}
            role="button"
            tabIndex={0}
            aria-label={isPlaying ? "Mute sound" : "Unmute sound"}
            onKeyDown={(e) => e.key === 'Enter' && toggleAudio()}
          >
            <div className="relative w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10">
              <Image
                src={isPlaying ? "/sound-on.svg" : "/sound-mute.svg"}
                alt={isPlaying ? "Sound on" : "Sound muted"}
                fill
                className="transition-transform hover:scale-110 active:scale-95 object-contain cursor-click"
                priority={true}
              />
            </div>
          </div>
          
          {/* Icons and Text Container */}
          <div className="absolute inset-0 flex items-center justify-between px-[12%] z-10">
            {/* About Icon + Text Group */}
            <div 
              className="group flex flex-col items-center cursor-pointer"
              onClick={handleAboutClick}
              onKeyDown={(e) => e.key === 'Enter' && handleAboutClick()}
              tabIndex={0}
              role="button"
              aria-label="Open About section"
            >
              <div className="relative w-[4vw] h-[4vw] sm:w-[3.5vw] sm:h-[3.5vw] lg:w-[48px] lg:h-[48px]">
                <Image
                  src="/pixel-folder.svg"
                  alt="Folder icon"
                  fill
                  className="transition-colors duration-200 group-hover:brightness-0 group-hover:invert-[.85] group-hover:sepia-[.35] group-hover:saturate-[2500%] group-hover:hue-rotate-[86deg] cursor-folder-hover"
                  priority={true}
                />
              </div>
              <span className={`
                ${pixelifySans.className} 
                text-white 
                text-[1.5vw] sm:text-[1.5vw] md:text-[1.5vw] lg:text-[24px] 
                mt-1
                transition-colors duration-200
                group-hover:text-[#2FFD2F]
              `}>
                ABOUT
              </span>
            </div>
            
            {/* Contact Icon + Text Group */}
            <div 
              className="group flex flex-col items-center cursor-pointer"
              onClick={handleContactClick}
              onKeyDown={(e) => e.key === 'Enter' && handleContactClick()}
              tabIndex={0}
              role="button"
              aria-label="Open Contact section"
            >
              <div className="relative w-[4vw] h-[4vw] sm:w-[3.5vw] sm:h-[3.5vw] lg:w-[48px] lg:h-[48px]">
                <Image
                  src="/pixel-envelope.svg"
                  alt="Envelope icon"
                  fill
                  className="transition-colors duration-200 group-hover:brightness-0 group-hover:invert-[.85] group-hover:sepia-[.35] group-hover:saturate-[2500%] group-hover:hue-rotate-[86deg] cursor-envelope-hover"
                  priority={true}
                />
              </div>
              <span className={`
                ${pixelifySans.className} 
                text-white 
                text-[1.5vw] sm:text-[1.5vw] md:text-[1.5vw] lg:text-[24px] 
                mt-1
                transition-colors duration-200
                group-hover:text-[#2FFD2F]
              `}>
                CONTACT
              </span>
            </div>
          </div>

          {/* Title Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className={`${pixelifySans.className} neon-text text-[4vw] sm:text-[4vw] md:text-[4vw] lg:text-[48px] mt-[1.5%] tracking-wider`}>
              SPOTIFY WRAPPED
            </h1>
          </div>
          
          {/* Subtitle Text */}
          <div className="absolute inset-x-0 bottom-[30%] flex justify-center">
            <h2 className={`${pixelifySans.className} text-white text-[2vw] sm:text-[2vw] md:text-[2vw] lg:text-[24px]`}>
              PRESS THE <span className="font-bold text-[#2FFD2F] blink-animation">[ SPACEBAR ]</span> TO REVEAL
            </h2>
          </div>
        </div>
      </div>

      {/* Popups */}
      <About isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <Contact isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}