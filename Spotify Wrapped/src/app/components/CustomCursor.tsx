"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState('default');
  const trailsRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const prevPosRef = useRef({ x: 0, y: 0 });
  const lastTrailTime = useRef(0);

  const createTrail = useCallback((x: number, y: number) => {
    if (!trailsRef.current) return;
    
    const now = Date.now();
    if (now - lastTrailTime.current < 80) return;
    lastTrailTime.current = now;

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    trailsRef.current.appendChild(trail);
    
    setTimeout(() => {
      if (trail && trailsRef.current?.contains(trail)) {
        trailsRef.current.removeChild(trail);
      }
    }, 600);
  }, []);

  const updateCursorType = useCallback((target: Element | null) => {
    if (!target) {
      setCursorType('default');
      return;
    }

    if (target.closest('.cursor-folder-hover')) {
      setCursorType('folder-hover');
    } else if (target.closest('.cursor-envelope-hover')) {
      setCursorType('envelope-hover');
    } else if (target.closest('.cursor-album-hover')) {
      setCursorType('album-hover');
    } else if (target.closest('.cursor-click')) {
      setCursorType('click-hover');
    } else if (
      target.matches('a, button, [role="button"], [tabindex="0"], input, select, textarea, .clickable') || 
      target.closest('a, button, [role="button"], [tabindex="0"], input, select, textarea, .clickable')
    ) {
      setCursorType('default-hover');
    } else {
      setCursorType('default');
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let currentMouseX = 0;
    let currentMouseY = 0;
    
    const updatePosition = (e: MouseEvent) => {
      currentMouseX = e.clientX;
      currentMouseY = e.clientY;
      
      if (cursorType !== 'default' && visible) {
        const dx = currentMouseX - prevPosRef.current.x;
        const dy = currentMouseY - prevPosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
          createTrail(currentMouseX, currentMouseY);
        }
      }
      
      prevPosRef.current = { x: currentMouseX, y: currentMouseY };
      
      if (!visible) {
        setVisible(true);
      }
      
      // Update element detection
      updateCursorType(e.target as Element);
    };

    // Animation loop for smoother cursor movement
    const animateCursor = () => {
      setPosition({ x: currentMouseX, y: currentMouseY });
      animationFrameId = requestAnimationFrame(animateCursor);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    // Add event listeners
    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation loop
    animationFrameId = requestAnimationFrame(animateCursor);

    // Clean up event listeners and animation frame
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [visible, updateCursorType, cursorType, createTrail]);

  return (
    <>
      <div 
        ref={trailsRef} 
        className="fixed inset-0 pointer-events-none z-9990 overflow-hidden"
        aria-hidden="true"
      />
      <div
        ref={cursorRef}
        className={`custom-cursor ${visible ? 'visible' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        aria-hidden="true"
      >
        <div 
          className={`cursor-inner ${isClicking ? 'clicking' : ''} ${cursorType}`}
        />
      </div>
    </>
  );
};

export default CustomCursor;