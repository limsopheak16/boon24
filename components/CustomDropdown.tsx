import React, { useState, useRef, useEffect } from 'react';
import { siteContextOpts } from '../data/siteContexts';

type SiteContextOption = typeof siteContextOpts[number];

interface CustomDropdownProps {
  label: string;
  value: string;
  categories: { readonly [category: string]: readonly SiteContextOption[] };
  descriptions: { [key in SiteContextOption]: string };
  onChange: (value: SiteContextOption) => void;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  categories,
  descriptions,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleOptionClick = (option: SiteContextOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-brand-text-secondary mb-1">
        {label}
      </label>
      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-brand-surface border border-brand-border rounded-md px-3 py-2 text-left flex justify-between items-center focus:ring-brand-accent focus:border-brand-accent"
        >
          <span className="truncate">{value}</span>
          <svg className={`w-5 h-5 ml-2 transition-transform text-brand-text-secondary ${isOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {isOpen && (
          <ul className="absolute z-20 w-full mt-1 bg-brand-panel border border-brand-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {/* FIX: Use Object.keys to iterate over categories. This avoids a TypeScript inference issue with Object.entries where the value was being typed as 'unknown', causing a crash. */}
            {Object.keys(categories).map((category) => (
                <React.Fragment key={category}>
                    <li className="sticky top-0 bg-brand-panel px-3 py-1.5 text-xs font-bold text-brand-text-secondary uppercase tracking-wider z-10">
                        {category}
                    </li>
                    {categories[category].map(option => (
                        <li
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className={`px-3 py-2 text-sm cursor-pointer pl-6 ${
                            value === option
                                ? 'bg-brand-accent text-brand-bg'
                                : 'text-brand-text-primary hover:bg-brand-border'
                            }`}
                        >
                            {option}
                        </li>
                    ))}
                </React.Fragment>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
