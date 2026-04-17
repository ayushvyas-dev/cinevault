"use client";

import { useRef, useEffect } from "react";

export default function SearchBar({ value, onChange, onClear }) {
  const inputRef = useRef(null);

  // Keyboard shortcut: press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        if (value) onClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [value, onClear]);

  return (
    <div className="max-w-2xl mx-auto relative group">
      {/* Glow effect behind input */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary-light/20 to-primary-dark/20 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
          <svg
            className="w-5 h-5 text-muted group-focus-within:text-primary-light transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          id="movie-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for movies..."
          className="w-full pl-14 pr-24 py-4 bg-surface border border-border rounded-xl
            text-foreground placeholder:text-muted/60
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
            transition-all duration-300
            text-base sm:text-lg"
          aria-label="Search movies"
        />

        {/* Right side: clear button + keyboard shortcut hint */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
          {value && (
            <button
              id="search-clear-button"
              onClick={onClear}
              className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-lighter 
                transition-all duration-200"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          {!value && (
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-muted/50 bg-surface-lighter/50 border border-border/50 rounded-md font-mono">
              /
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
}
