import React from 'react';

const GifIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 8v8" />
    <path d="M14 12h2a2 2 0 1 0 0-4h-2v4Z" />
    <path d="M4 8h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4" />
    <path d="M5 12v4" />
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

export default GifIcon;
