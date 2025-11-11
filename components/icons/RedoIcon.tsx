import React from 'react';

const RedoIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M3 13a9 9 0 1 0 4.2-7.5" />
    <polyline points="13 5 18 10 13 15" />
  </svg>
);

export default RedoIcon;