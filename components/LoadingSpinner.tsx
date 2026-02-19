
import React from 'react';

interface LoadingSpinnerProps {
  message: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-brand-bg bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
      <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-brand-border rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-brand-accent border-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-white text-lg font-semibold tracking-wide">Rendering your vision...</p>
      <div className="mt-2 flex flex-col items-center space-y-1">
        <p className="text-sm text-brand-text-secondary w-64 text-center transition-opacity duration-500" key={message}>{message}</p>
        <p className="text-[10px] text-brand-text-secondary/60 italic">Complex architectural reinterpretations can take up to 60 seconds.</p>
      </div>
    </div>
  );
};
