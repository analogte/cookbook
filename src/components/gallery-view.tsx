"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: number;
  imageUrl: string;
  caption?: string | null;
}

interface GalleryViewProps {
  images: GalleryImage[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function GalleryView({
  images,
  className,
  autoPlay = false,
  autoPlayInterval = 5000,
}: GalleryViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, goToNext, autoPlayInterval, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "Escape") setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, goToPrevious, goToNext]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Main Gallery */}
      <div className={cn("relative overflow-hidden rounded-lg", className)}>
        {/* Main Image */}
        <div className="relative aspect-[16/9]">
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.caption || `Image ${currentIndex + 1}`}
            fill
            className="object-cover"
          />

          {/* Overlay with caption */}
          {currentImage.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-sm text-white">{currentImage.caption}</p>
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Fullscreen button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute right-2 top-2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            <Expand className="h-5 w-5" />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToSlide(index)}
                className={cn(
                  "relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md transition-all",
                  currentIndex === index
                    ? "ring-2 ring-gold"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.caption || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  currentIndex === index
                    ? "w-6 bg-gold"
                    : "bg-charcoal-300 hover:bg-charcoal-400"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          {/* Close button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image */}
          <div className="relative h-[80vh] w-[90vw]">
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.caption || `Image ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Caption */}
          {currentImage.caption && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <p className="rounded-lg bg-black/50 px-4 py-2 text-white backdrop-blur-sm">
                {currentImage.caption}
              </p>
            </div>
          )}

          {/* Counter */}
          <div className="absolute bottom-8 right-8">
            <p className="rounded-lg bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
