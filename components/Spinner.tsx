
import React from 'react';

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`animate-spin rounded-full border-4 border-slate-300 border-t-blue-500 ${className}`}
    style={{ width: '24px', height: '24px' }}
  ></div>
);

export default Spinner;
