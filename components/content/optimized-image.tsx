'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Extract filename from src
  const filename = src.split('/').pop() || '';
  const baseName = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');

  // Try to load manifest for this image
  // In a real implementation, we'd load this from the manifest.json
  // For now, we'll construct the paths directly

  return (
    <picture>
      {/* AVIF sources - best compression */}
      <source
        type="image/avif"
        srcSet={`
          /images/optimized/${baseName}-mobile.avif 640w,
          /images/optimized/${baseName}-tablet.avif 1024w,
          /images/optimized/${baseName}-desktop.avif 1920w
        `}
        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
      />

      {/* WebP sources - good compression, wider support */}
      <source
        type="image/webp"
        srcSet={`
          /images/optimized/${baseName}-mobile.webp 640w,
          /images/optimized/${baseName}-tablet.webp 1024w,
          /images/optimized/${baseName}-desktop.webp 1920w
        `}
        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
      />

      {/* Fallback to original image */}
      <Image
        src={src}
        alt={alt}
        width={width || 1920}
        height={height || 1080}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        priority={priority}
        quality={90}
      />
    </picture>
  );
}
