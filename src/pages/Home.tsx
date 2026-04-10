import Hero from '../components/Hero';
import Portfolio from '../components/Portfolio';
import { motion } from 'motion/react';
import { Palette, Layout, Rocket, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main>
      <Hero />
      
      {/* Services Section */}
      <section id="services" className="py-24 bg-[#FCFCFC] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-sm font-bold tracking-widest text-[#FF6321]/70 uppercase mb-4 block">✨ Our Solutions ✨</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight text-gray-800">
              한울팩이 제공하는<br />최상의 포장 솔루션
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Palette size={28} />,
                title: "파렛트랩핑기 📦",
                desc: "물류 효율을 극대화하는 고성능 자동/반자동 파렛트 랩핑 솔루션을 제공합니다.",
                link: "/pallet-wrappers",
                id: "pallet-wrappers"
              },
              {
                icon: <Layout size={28} />,
                title: "테이핑기 🩹",
                desc: "정밀하고 빠른 박스 테이핑 시스템으로 포장 공정을 자동화합니다.",
                link: "/taping-machines",
                id: "taping-machine"
              },
              {
                icon: <Rocket size={28} />,
                title: "포장자재 🏗️",
                desc: "최고 품질의 스트레치 필름, 테이프 등 다양한 포장 소모품을 공급합니다.",
                link: "/packaging-materials",
                id: "packaging-materials"
              },
              {
                icon: <ShieldCheck size={28} />,
                title: "유지보수 🛠️",
                desc: "전문 엔지니어의 점검과 신속한 A/S로 장비의 가동률을 보장합니다.",
                link: "/contact",
                id: "maintenance"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                id={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {service.link.startsWith('/') ? (
                  <Link to={service.link} className="block h-full p-8 bg-white border border-gray-100 rounded-[32px] hover:border-[#FF6321]/30 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
                    <div className="w-14 h-14 bg-[#FFF0E9] rounded-2xl flex items-center justify-center text-[#FF6321]/80 mb-6 group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                      {service.title}
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm break-keep">
                      {service.desc}
                    </p>
                  </Link>
                ) : (
                  <a href={service.link} className="block h-full p-8 bg-white border border-gray-100 rounded-[32px] hover:border-[#FF6321]/30 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500">
                    <div className="w-14 h-14 bg-[#FFF0E9] rounded-2xl flex items-center justify-center text-[#FF6321]/80 mb-6 group-hover:scale-110 transition-transform duration-500">
                      {service.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-sm break-keep">
                      {service.desc}
                    </p>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Portfolio limit={6} showViewMore={true} excludeCategory="processing-site" />
    </main>
  );
}
