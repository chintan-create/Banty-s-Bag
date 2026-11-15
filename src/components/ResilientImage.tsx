import React, { useState } from 'react';
import { Box } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  fallbackCode?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  fallbackCode,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-600 p-6 text-center select-none ${className}`}
      >
        <Box className="w-8 h-8 stroke-[1.25] text-slate-400 mb-3" />
        {fallbackCode && (
          <span className="font-mono text-xs text-slate-400 mb-1 tabular-nums">{fallbackCode}</span>
        )}
        <span className="text-sm font-medium text-slate-700 max-w-[20ch]">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
