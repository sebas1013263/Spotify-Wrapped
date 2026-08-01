import Image from 'next/image';
import { Pixelify_Sans } from 'next/font/google';
import { useState, useEffect } from 'react';
import { useSelectSound } from '@/app/hooks/useSelectSound';
import { useHoverSound } from '@/app/hooks/useHoverSound';
import { useConfirmSound } from '@/app/hooks/useConfirmSound';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

const artists = [
  "BILLIE EILISH",
  "TAYLOR SWIFT",
  "DRAKE"
] as const;

type Artist = typeof artists[number];

interface ArtistQuizProps {
  onComplete: (isCorrect: boolean, selectedArtist: Artist) => void;
}

const ArtistQuiz: React.FC<ArtistQuizProps> = ({ onComplete }) => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  
  // Sound effects
  const playSelectSound = useSelectSound();
  const playHoverSound = useHoverSound();
  const { playConfirmSound } = useConfirmSound();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && selectedArtist) {
        event.preventDefault();
        playConfirmSound();
        // Pass whether the selection is correct (TAYLOR SWIFT) and the selected artist
        onComplete(selectedArtist === "TAYLOR SWIFT", selectedArtist);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtist, onComplete, playConfirmSound]);

  const handleArtistSelect = (artist: Artist) => {
    playSelectSound();
    setSelectedArtist(artist);
  };

  const buttonClass = (artist: Artist) => `
    relative
    w-[35vw] max-w-[400px] min-w-[200px]
    py-[0.8vw] min-h-[40px]
    rounded-[50px]
    border-4
    border-[#2FFD2F]
    transition-all
    duration-200
    flex
    items-center
    justify-center
    ${selectedArtist === artist 
      ? 'bg-[#2FFD2F] text-[#1C5860]' 
      : 'bg-[#066A73] bg-opacity-75 text-white hover:bg-opacity-90'
    }
  `;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center fade-in">
      {/* Title */}
      <h2 className={`
        ${pixelifySans.className}
        text-[2.5vw] sm:text-[2.5vw] md:text-[2.5vw] lg:text-[32px]
        mb-[3vw] sm:mb-[3vw] md:mb-[3vw] lg:mb-10
      `}>
        <span className="text-white">WHO WAS THIS YEAR&apos;S </span>
        <span className="text-[#2FFD2F]">TOP ARTIST</span>
        <span className="text-white">?</span>
      </h2>

      {/* Content Container */}
      <div className="flex flex-row justify-center items-center gap-[4vw] lg:gap-16 mb-[3vw] lg:mb-10">
        {/* Buttons Container */}
        <div className="flex flex-col gap-[1.5vw] lg:gap-6">
          {artists.map((artist) => (
            <button
              key={artist}
              onClick={() => handleArtistSelect(artist)}
              onMouseEnter={playHoverSound}
              className={buttonClass(artist)}
              tabIndex={0}
              role="button"
              aria-label={`Select ${artist}`}
            >
              <span className={`
                ${pixelifySans.className} 
                text-[1.8vw] sm:text-[1.8vw] md:text-[1.8vw] lg:text-[24px]
                whitespace-nowrap
              `}>
                {artist}
              </span>
            </button>
          ))}
        </div>

        {/* Mystery Icon with hover animation */}
        <div 
          className="relative w-[25vw] h-[25vw] max-w-[350px] max-h-[350px] min-w-[150px] min-h-[150px] cursor-album-hover"
          onMouseEnter={playHoverSound}
        >
          <Image
            src="/mystery.svg"
            alt="Mystery icon"
            fill
            className="object-contain p-4"
          />
        </div>
      </div>

      {/* Bottom Text */}
      <h2 className={`
        ${pixelifySans.className}
        text-[2.5vw] sm:text-[2.5vw] md:text-[2.5vw] lg:text-[32px]
        text-center
      `}>
        {!selectedArtist ? (
          <span className="text-white">( GO FOR IT, TAKE A GUESS )</span>
        ) : (
          <>
            PRESS THE <span className="font-bold text-[#2FFD2F] blink-animation">[ SPACEBAR ]</span> TO CONTINUE
          </>
        )}
      </h2>
    </div>
  );
};

export default ArtistQuiz;