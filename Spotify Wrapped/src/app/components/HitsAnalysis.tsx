"use client";

import { Pixelify_Sans } from 'next/font/google';
import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700']
});

interface HitsAnalysisProps {
  onComplete: () => void;
}

const HitsAnalysis: React.FC<HitsAnalysisProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onComplete]);

  const data = [
    { name: 'Pop', value: 45 },
    { name: 'Hip-Hop', value: 30 },
    { name: 'Rock', value: 15 },
    { name: 'Other', value: 10 }
  ];

  // Neon colors
  const COLORS = ['#2FFD2F', '#066A73', '#1C5860', '#0F2331'];

  // Custom active shape that extends outward when hovered
  const renderActiveShape = useCallback((props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      </g>
    );
  }, []);

  // Handle mouse hover on chart segments
  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className={`w-full h-full flex flex-col items-center justify-between ${isVisible ? 'fade-in' : 'opacity-0'}`}>
      {/* Title */}
      <h2 className={`
        ${pixelifySans.className}
        text-base sm:text-xl md:text-2xl lg:text-3xl
        text-white pt-4 sm:pt-6 pb-2
        text-center
      `}>
        YOUR MUSICAL TASTE BREAKDOWN
      </h2>

      {/* Main content container with fixed height to prevent expansion */}
      <div className="w-full flex-grow flex items-center justify-center" style={{ maxHeight: 'calc(100% - 130px)' }}>
        <div className="flex flex-row w-full max-w-4xl items-center justify-center px-6">
          {/* Chart Column */}
          <div className="w-1/2 h-[200px] sm:h-[220px] md:h-[240px] lg:h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex !== null ? activeIndex : undefined}
                  activeShape={renderActiveShape}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="75%"
                  dataKey="value"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  paddingAngle={1}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend Column with progress bars */}
          <div className="w-1/2 flex flex-col justify-center items-start space-y-4 md:space-y-5 lg:space-y-6 pl-4">
            {data.map((entry, index) => (
              <div 
                key={entry.name} 
                className={`
                  w-full 
                  transition-all duration-300 ease-in-out
                  ${activeIndex === index ? 'transform scale-105' : ''}
                `}
              >
                <div className="flex items-center gap-3 mb-1">
                  <div 
                    className={`
                      w-4 h-4 md:w-5 md:h-5 border border-white
                      transition-all duration-300
                      ${activeIndex === index ? 'border-2 border-white shadow-glow' : ''}
                    `} 
                    style={{ 
                      backgroundColor: COLORS[index % COLORS.length],
                      boxShadow: activeIndex === index ? `0 0 8px ${COLORS[index]}` : 'none'
                    }}
                  />
                  <span className={`
                    ${pixelifySans.className}
                    text-sm md:text-base lg:text-lg
                    text-white
                    transition-all duration-300
                    ${activeIndex === index ? 'font-bold text-[#2FFD2F]' : ''}
                  `}>
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
                
                {/* Video game style progress bar */}
                <div className={`
                  w-full h-2 md:h-3 bg-transparent 
                  border border-white relative overflow-hidden
                  transition-all duration-300
                  ${activeIndex === index ? 'border-[#2FFD2F]' : ''}
                `}>
                  <div 
                    className="h-full transition-all duration-500 absolute top-0 left-0"
                    style={{ 
                      width: `${entry.value}%`, 
                      backgroundColor: COLORS[index % COLORS.length],
                      filter: activeIndex === index ? 'brightness(1.3)' : 'none'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="w-full flex items-center justify-center py-4 sm:py-6">
        <h2 className={`
          ${pixelifySans.className}
          text-sm sm:text-base md:text-xl lg:text-2xl
          text-center
        `}>
          PRESS THE <span className="font-bold text-[#2FFD2F] blink-animation">[ SPACEBAR ]</span> TO CONTINUE
        </h2>
      </div>
    </div>
  );
};

export default HitsAnalysis;