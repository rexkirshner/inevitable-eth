import React from 'react';
import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export function Figure({ src, alt, caption, width = 800, height = 600 }: FigureProps) {
  return (
    <figure className="my-6">
      <div className="relative border border-[var(--border)] bg-[var(--surface)] p-2">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-[var(--text-secondary)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
