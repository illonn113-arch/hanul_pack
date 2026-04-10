import { motion } from 'motion/react';
import Portfolio from '../components/Portfolio';
import { Link } from 'react-router-dom';

export default function DeliveryCases() {

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-[#141414] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#FF6321_0%,transparent_50%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-bold tracking-widest text-[#FF6321] uppercase mb-4 block">
              Success Stories
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
              신뢰로 증명하는<br />한울팩 납품 실적
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed break-keep">
              전국 각지의 물류 현장에서 한울팩의 장비들이 활약하고 있습니다. 
              다양한 산업군의 성공적인 자동화 사례를 확인해보세요.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Portfolio Component */}
      <div className="py-12">
        <Portfolio excludeCategory="processing-site" />
      </div>

      {/* Bottom CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">귀사의 현장도 자동화할 수 있습니다</h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto break-keep">
            수많은 납품 경험을 바탕으로 귀사에 가장 적합한 맞춤형 솔루션을 제안해드립니다.
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#FF6321] text-white rounded-full font-bold shadow-lg shadow-[#FF6321]/20"
            >
              상담 신청하기
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}
