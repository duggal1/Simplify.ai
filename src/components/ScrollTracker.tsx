'use client';
import { useState, useEffect } from 'react';

function ScrollTracker() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = window.scrollY; // Use window.scrollY for better compatibility
      const windowHeight =
        document.documentElement.scrollHeight - 
        document.documentElement.clientHeight;
      const scrolled = Math.min((totalScroll / windowHeight) * 100, 100); // Ensure scrolled does not exceed 100
      setScroll(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call it once to set initial scroll value
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="animate-glow fixed left-0 top-0 z-20 h-2 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
      style={{ width: `${scroll}%` }}
    />
  );
}

export default ScrollTracker;