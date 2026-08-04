import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSiteConfig } from "../hooks/useSiteConfig";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import hero1 from "../assets/hero/hero1.jpg";
import hero2 from "../assets/hero/hero2.jpg";
import hero4 from "../assets/hero/hero4.jpg";
import hero5 from "../assets/hero/hero5.jpg";
import hero6 from "../assets/hero/hero6.jpg";
import hero7 from "../assets/hero/hero7.jpg";

const HERO_IMAGES = [hero1, hero2, hero4, hero5, hero6, hero7];

export default function Hero() {
  const { config } = useSiteConfig();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Preload all images on mount
  useEffect(() => {
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto carousel slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#121212] select-none cursor-pointer"
      onClick={() => setIsVisible((prev) => !prev)}
    >
      {/* Background Image Crossfade Slider */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={HERO_IMAGES[currentIndex]}
              alt={`한울팩 대표 현장 ${currentIndex + 1}`}
              onError={(e) => {
                const fallbacks = ["/hero1.jpg", "/hero2.jpg", "/hero4.jpg", "/hero5.jpg", "/hero6.jpg", "/hero7.jpg"];
                const fb = fallbacks[currentIndex % fallbacks.length];
                if (e.currentTarget.src !== window.location.origin + fb) {
                  e.currentTarget.src = fb;
                }
              }}
              className="w-full h-full object-cover object-center block"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlays adjust opacity when text is hidden for clear image viewing */}
        <div className={`absolute inset-0 bg-black/35 pointer-events-none transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-10"}`} />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-10"}`} />
      </div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 pointer-events-none">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center flex flex-col items-center pointer-events-auto"
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-[11px] font-bold tracking-[0.2em] text-[#FF6321] uppercase border border-[#FF6321]/40 rounded-full bg-[#FF6321]/10 backdrop-blur-md shadow-sm">
                Premium Packaging Solutions
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.12] whitespace-pre-line text-[#F5F5F5] drop-shadow-2xl">
                {config.heroTitle}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed whitespace-pre-line break-keep drop-shadow-md">
                {config.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  to="/company"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF6321] hover:bg-[#E5591D] text-white font-bold rounded-full transition-all flex items-center justify-center group shadow-xl shadow-[#FF6321]/25 hover:scale-105 active:scale-95"
                >
                  회사 소개 보기
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="/contact"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full sm:w-auto px-8 py-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-full border border-white/30 backdrop-blur-md transition-all flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg"
                >
                  상담 문의하기
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manual Controls - Prev/Next Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-[#FF6321] text-white border border-white/20 backdrop-blur-md transition-all duration-200 hidden sm:flex items-center justify-center shadow-lg hover:scale-110 active:scale-90"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-[#FF6321] text-white border border-white/20 backdrop-blur-md transition-all duration-200 hidden sm:flex items-center justify-center shadow-lg hover:scale-110 active:scale-90"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Pagination Indicators */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/50 px-4 py-2 rounded-full border border-white/15 backdrop-blur-md shadow-xl"
      >
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className="group relative p-1 focus:outline-none"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 h-2.5 bg-[#FF6321] shadow-md shadow-[#FF6321]/50"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}

