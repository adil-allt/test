import { useState, useEffect, useRef } from 'react';

export const useHoverDelay = (delay: number = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverZoneRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = menuRef.current;
      const hoverZone = hoverZoneRef.current;
      
      if (menu && !menu.contains(event.target as Node) && 
          hoverZone && !hoverZone.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    const clearTimeouts = () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      clearTimeouts();
      showTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    const handleMouseLeave = () => {
      clearTimeouts();
      hideTimeoutRef.current = setTimeout(() => {
        const isMenuHovered = menuRef.current?.matches(':hover') || false;
        const isZoneHovered = hoverZoneRef.current?.matches(':hover') || false;
        
        if (!isMenuHovered && !isZoneHovered) {
          setIsVisible(false);
        }
      }, delay);
    };

    document.addEventListener('mousedown', handleClickOutside);

    const hoverZone = hoverZoneRef.current;
    const menu = menuRef.current;

    if (hoverZone) {
      hoverZone.addEventListener('mouseenter', handleMouseEnter);
      hoverZone.addEventListener('mouseleave', handleMouseLeave);
    }

    if (menu) {
      menu.addEventListener('mouseenter', () => {
        clearTimeouts();
        setIsVisible(true);
      });
      menu.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
      if (hoverZone) {
        hoverZone.removeEventListener('mouseenter', handleMouseEnter);
        hoverZone.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (menu) {
        menu.removeEventListener('mouseenter', () => {
          clearTimeouts();
          setIsVisible(true);
        });
        menu.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      clearTimeouts();
    };
  }, [delay]);

  return { isVisible, setIsVisible, hoverZoneRef, menuRef };
};