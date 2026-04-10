import { motion } from 'motion/react';
import Portfolio from '../components/Portfolio';

export default function ProcessingSite() {

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
              Manufacturing Process
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
              정밀함이 만드는 차이<br />한울팩 가공 현장
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed break-keep">
              CNC 가공을 통해 랩핑기 부품 하나하나를 정밀하게 제작합니다. 
              최고의 품질을 위한 한울팩의 제조 과정을 확인해보세요.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Portfolio Component filtered for processing-site */}
      <div className="py-12">
        <Portfolio category="processing-site" />
      </div>
    </div>
  );
}
