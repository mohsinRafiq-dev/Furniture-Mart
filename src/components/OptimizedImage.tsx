import { useState, useEffect, useRef } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

/**
 * Optimized Image Component with lazy loading and fade-in animation
 * Uses Intersection Observer for better performance
 */
export const OptimizedImage = ({
  src,
  alt,
  className = "",
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E",
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading the actual image
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setImageSrc(src);
              setImageLoaded(true);
            };
            img.onerror = () => {
              // Fallback to placeholder on error
              setImageLoaded(true);
            };

            // Stop observing once we've started loading
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`${className} transition-opacity duration-300 ${
        imageLoaded ? "opacity-100" : "opacity-50"
      }`}
    />
  );
};
