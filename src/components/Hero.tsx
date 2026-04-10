import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { config } = useSiteConfig();
  const [isVisible, setIsVisible] = useState(true);

  return (
    <section 
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#1A1A1A] cursor-pointer"
      onClick={() => setIsVisible(!isVisible)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src="https://postfiles.pstatic.net/MjAyNjA0MTBfMTUx/MDAxNzc1NzgzNjMyNDUw.vc0KmroPGKCrQAaa4wcfy4aOQlbvIcW0QX5C_gQ0KIcg.6G9mo8pW08bfD_2DWlEX0525IxlTliGL_xEdSNOR8gkg.JPEG/PANORAMA_20260329_151807.jpg?type=w773"
          alt="Factory Panorama"
          animate={{
            objectPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        {/* Balanced overlay for centered text */}
        <div className={`absolute inset-0 bg-[#1A1A1A]/40 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-[#1A1A1A]/40 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
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
