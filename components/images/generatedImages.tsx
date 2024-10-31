import { useEffect, useRef, useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import BlurFade from "../magicui/blur-fade";

interface GeneratedImagesProps {
  fluxData: any;
  delay?: number;
  className: string;
}

export function GeneratedImages({
  fluxData,
  delay,
  className,
}: GeneratedImagesProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = fluxData.images.length;

  const startAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }

    autoScrollRef.current = setInterval(() => {
      goToNextSlide();
    }, 3000); // Adjust time as needed
  };

  // Helper function to handle visibility change
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Pause auto-scroll when the tab is inactive
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    } else {
      // Resume auto-scroll when the tab is active again
      startAutoScroll();
    }
  };

  useEffect(() => {
    if (totalSlides > 1) {
      startAutoScroll();
      // Set up visibility change event listener
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        clearInterval(autoScrollRef.current!);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides > 1 && imageContainerRef.current) {
      const handleTransitionEnd = () => {
        setIsTransitioning(false);
        if (currentSlide === 0 && imageContainerRef.current) {
          setCurrentSlide(totalSlides);
          imageContainerRef.current.style.transition = "none";
          imageContainerRef.current.style.transform = `translateX(-${totalSlides * 100}%)`;
        } else if (
          currentSlide === totalSlides + 1 &&
          imageContainerRef.current
        ) {
          setCurrentSlide(1);
          imageContainerRef.current.style.transition = "none";
          imageContainerRef.current.style.transform = `translateX(-100%)`;
        }
      };

      const node = imageContainerRef.current;
      node.addEventListener("transitionend", handleTransitionEnd);

      return () =>
        node.removeEventListener("transitionend", handleTransitionEnd);
    }
  }, [currentSlide, totalSlides]);

  const goToPreviousSlide = () => {
    if (isTransitioning || totalSlides <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
    imageContainerRef.current!.style.transition = "transform 0.5s ease-in-out";
    imageContainerRef.current!.style.transform = `translateX(-${(currentSlide - 1) * 100}%)`;
    startAutoScroll(); // Restart auto-scroll on manual navigation
  };

  const goToNextSlide = () => {
    if (isTransitioning || totalSlides <= 1) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
    imageContainerRef.current!.style.transition = "transform 0.5s ease-in-out";
    imageContainerRef.current!.style.transform = `translateX(-${(currentSlide + 1) * 100}%)`;
    startAutoScroll(); // Restart auto-scroll on manual navigation
  };

  return (
    <BlurFade inView delay={delay}>
      {totalSlides > 1 ? (
        <div className="relative">
          <button
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 transform text-2xl text-white"
            onClick={goToPreviousSlide}
          >
            <ArrowLeft />
          </button>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              ref={imageContainerRef}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              <div className="min-w-full">
                <img
                  src={fluxData.images[totalSlides - 1].imageUrl}
                  alt="Generated Image"
                  className={className}
                />
              </div>
              {fluxData.images.map((image: any, index: number) => (
                <div key={index} className="min-w-full">
                  <img
                    src={image.imageUrl}
                    alt="Generated Image"
                    className={className}
                  />
                </div>
              ))}
              <div className="min-w-full">
                <img
                  src={fluxData.images[0].imageUrl}
                  alt="Generated Image"
                  className={className}
                />
              </div>
            </div>
          </div>
          <button
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 transform text-2xl text-white"
            onClick={goToNextSlide}
          >
            <ArrowRight />
          </button>
        </div>
      ) : (
        <img
          src={fluxData.images[0].imageUrl}
          alt="Generated Image"
          className={className}
        />
      )}
    </BlurFade>
  );
}
