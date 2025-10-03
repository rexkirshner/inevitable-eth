'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 p-3 bg-[var(--link)] text-white rounded-full shadow-lg hover:bg-[var(--link)] hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--link)] focus:ring-offset-2"
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
