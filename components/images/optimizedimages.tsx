import React, { memo, useState } from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  onLoadingComplete?: () => void;
}

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width = 128,
  height = 128,
  quality = 100,
  priority = false,
  className = "",
  objectFit = "cover",
  onLoadingComplete,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className="relative h-full w-full">
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse rounded bg-gray-200" />
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center rounded bg-gray-100">
          <span className="text-gray-400">Failed to load image</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          className={`h-full w-full transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className} `}
          style={{ objectFit }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";
