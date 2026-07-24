'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export function YearSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  
  const selectedYear = searchParams.get('year') 
    ? parseInt(searchParams.get('year') as string, 10) 
    : currentYear;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate last 5 years
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (year: number) => {
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', year.toString());
    // Use scroll: false so the page doesn't jump to top when selecting
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-800 border border-neutral-700 text-white font-sans text-xs hover:bg-neutral-700 transition-colors"
      >
        {selectedYear}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-24 rounded-md border border-neutral-700 bg-neutral-800 shadow-xl overflow-hidden z-[60]">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleSelect(year)}
              className={`w-full text-left px-3 py-2 text-xs font-sans hover:bg-neutral-700 transition-colors ${
                year === selectedYear
                  ? "text-white font-bold bg-neutral-700/50"
                  : "text-neutral-400"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default YearSelector;
