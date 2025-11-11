import React from 'react';

const UndoIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M21 13a9 9 0 1 1-4.2-7.5" />
    <polyline points="11 5 6 10 11 15" />
  </svg>
);

export default UndoIcon;