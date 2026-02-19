import React from 'react';

interface SiteContextPreviewProps {
  thumbnailUrl: string;
  description: string;
}

export const SiteContextPreview: React.FC<SiteContextPreviewProps> = ({ thumbnailUrl, description }) => {
  return (
    <div className="w-64 bg-brand-panel border border-brand-border rounded-lg shadow-2xl p-3 z-30 animate-fade-in">
      <img src={thumbnailUrl} alt="Site context preview" className="w-full rounded-md mb-2 object-cover aspect-[4/3] bg-brand-surface" loading="lazy" />
      <p className="text-xs text-brand-text-secondary">{description}</p>
    </div>
  );
};
