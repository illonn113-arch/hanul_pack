import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { config } = useSiteConfig();
  const [isVisible, setIsVisible] = useState(true);

  const images = [
    "https://postfiles.pstatic.net/MjAyNjA0MTJfMjM2/MDAxNzc1OTk0MTg1Mzg4.thoqKXI1wtYOEPqfBTeYvn2CWnZaAplz_yY2JHOGBlsg.8Lt_ubhAsjydAAwASv2ebFy_bK2SL5dHMffMl0mcBjsg.JPEG/1.jpg?type=w773",
    "https://postfiles.pstatic.net/MjAyNjA0MTJfMjYz/MDAxNzc1OTk0MTg1MzY5.1OLQ3UYbRLcFUFJK9R9nAswB8buXysw3z4A3EpnqALog.70SGH0UA3hRed7TbQFKWskGeF9yCdoeXkTPLHss4Ncwg.JPEG/2.jpg?type=w773",
    "https://postfiles.pstatic.net/MjAyNjA0MTJfMTUw/MDAxNzc1OTk0MTg1MzYz.BkbcZUcG2SWVKm3H9Hc_pWlbUwyFL4DaUhkMTl4iYeIg.NxhBSdFIKyXntzup64-xITKu_yZ9x7hSo12HPN1aYbIg.JPEG/3.jpg?type=w773",
    "https://postfiles.pstatic.net/MjAyNjA0MTJfMTc1/MDAxNzc1OTk0MTg1MzQ2.e6J1as8UVGTYhbGZxISBQ15rx235HaV-yMjKhtjx2Rog.Ff4Y4gqBPdz3O4sFwFBYgLPUJN_6mC9tY7cGHYweCT8g.JPEG/4.jpg?type=w773"
  ];

  return (
    <section 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#1A1A1A] cursor-pointer"
      onClick={() => setIsVisible(!isVisible)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <motion.div
          animate={{
            x: ['0vw', '-300vw']
          }}
          transition={{
            duration: 92,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          className="flex h-full w-[400vw] flex-nowrap will-change-transform"
        >
          {images.map((src, idx) => (
            <div key={idx} className="w-[100vw] h-full shrink-0">
              <img
                src={src}
                alt={`Hero Background ${idx}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </motion.div>
        {/* Balanced overlay for centered text */}
        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center flex flex-col items-center"
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-[#FF6321] uppercase border border-[#FF6321]/30 rounded-full bg-[#FF6321]/5 backdrop-blur-md">
                Premium Packaging Solutions
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] whitespace-pre-line text-[#F5F5F5] drop-shadow-xl">
                {config.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed whitespace-pre-line break-keep drop-shadow-md">
                {config.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  to="/company"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF6321] hover:bg-[#E5591D] text-white font-bold rounded-full transition-all flex items-center justify-center group shadow-lg shadow-[#FF6321]/20"
                >
                  회사 소개 보기
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="/contact"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center"
                >
                  상담 문의하기
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400"
            >
              <div className="w-6 h-10 border-2 border-gray-200 rounded-full flex justify-center p-1">
                <div className="w-1 h-2 bg-[#FF6321] rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
