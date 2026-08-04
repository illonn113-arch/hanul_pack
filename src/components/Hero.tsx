import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { ArrowRight, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_DETAIL_IMAGES = [
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMjA5/MDAxNzg1ODQ4MTQxMzY1.vdm_e6ykYLfDJ33YWwj4v5vhyHhcos9uacLo291ErqEg.9x-1evLc6yZq-54oj2r7Wa5AB_711ciUlonmH3WECJkg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-8.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMTE5/MDAxNzg1ODQ4MTQxMzY4.mCXXVV0eWAy-euWeNgsgWuDoUmmw4Tu9RLKLmeeTL7Ag.O1hOepVOu84kbLaHsdMrRNlfv__5f3OQyZWeOCF2KRQg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-7.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfOTkg/MDAxNzg1ODQ4MTQxMzcz.jKV1zlqbRjvtuioLWpHm2XrBUapdob499XCJwMyHr4Eg.0QdXJ4MzTYRqDyJrGpsMct9nuDBZBlp3QEa2xP7l4-cg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-5.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMjE1/MDAxNzg1ODQ4MTQxMzc9.Ppdxw9yvvKE41QnqYHGMc2n4ffRRkOZ-6QLOzq_HtJsg.4WJez7oi35_GF8tfummGO1trwvC1d9nuKezopzbnWfog.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-3.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMjcw/MDAxNzg1ODQ4MTQxMzc9.YRDXxlqWTap8hqA58giVir3AbmzfS34BTRN4TlcioQwg.Uezh3k9ZfqeuMFr4IFYXi-VshvnvNg8A5nH-uyPTqAUg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-2.jpg?type=w773",
  "https://postfiles.pstatic.net/MjAyNjA8MDRfMTIz/MDAxNzg1ODQ4MTQxM3c3.ua7GR7a4mbja_rMcrfFAyz4H4KRByqqljHvPsbt-KHUg.UARWWIOX2k0r8zoMOk9ilF2Erf9WseoOvVvDH-aJcRsg.JPEG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-1.jpg?type=w773"
];

export default function Hero() {
  const { config } = useSiteConfig();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlayText, setShowOverlayText] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const detailList = (config.homeDetailImages && config.homeDetailImages.length > 0)
    ? config.homeDetailImages
    : DEFAULT_DETAIL_IMAGES;

  const heroImg = config.heroImageUrl || "https://postfiles.pstatic.net/MjAyNjA4MDVfMTQg/MDAxNzg1ODU4NDA4NDk5.JC1KHNSG1TIVR0UUoWQyeyUEn6qTB9R9cFaX9-UxNY4g.YV05HrooqTFdeVWoOrp0aiEPXq63YmzB-vctI0dhM8Eg.JPEG/PM-1.P-pa/20260802_165400.jpg?type=w773";

  const allImages = Array.from(new Set([heroImg, ...detailList]));

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [allImages.length, isPaused]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#121212] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Slider */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={allImages[currentIndex]}
            alt={`Hero Slide ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Overlays for dark background readability */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${showOverlayText ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-500 ${showOverlayText ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-[#FF6321] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 active:scale-95 shadow-2xl"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-[#FF6321] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all transform hover:scale-110 active:scale-95 shadow-2xl"
        aria-label="Next Slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Toggle Overlay Text Button */}
      <button
        onClick={() => setShowOverlayText(!showOverlayText)}
        className="absolute top-24 right-6 z-20 px-3 py-1.5 bg-black/50 hover:bg-black/70 text-white/80 hover:text-white rounded-full text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all"
        title="텍스트 가리기/보기"
      >
        {showOverlayText ? <EyeOff size={14} /> : <Eye size={14} />}
        <span>{showOverlayText ? "사진만 보기" : "글씨 보기"}</span>
      </button>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-none">
        <AnimatePresence>
          {showOverlayText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center flex flex-col items-center pointer-events-auto"
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-[#FF6321] uppercase border border-[#FF6321]/30 rounded-full bg-[#FF6321]/10 backdrop-blur-md">
                Premium Packaging Solutions
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] whitespace-pre-line text-[#F5F5F5] drop-shadow-2xl">
                {config.heroTitle}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed whitespace-pre-line break-keep drop-shadow-lg">
                {config.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  to="/company"
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF6321] hover:bg-[#E5591D] text-white font-bold rounded-full transition-all flex items-center justify-center group shadow-lg shadow-[#FF6321]/30"
                >
                  회사 소개 보기
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center"
                >
                  상담 문의하기
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
        {allImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === currentIndex
                ? 'w-8 bg-[#FF6321]'
                : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
        <span className="text-[11px] font-mono text-white/80 ml-2 border-l border-white/20 pl-2">
          {currentIndex + 1} / {allImages.length}
        </span>
      </div>
    </section>
  );
}
