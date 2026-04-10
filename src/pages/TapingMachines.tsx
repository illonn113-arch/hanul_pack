import { motion } from 'motion/react';
import { CheckCircle2, Package, Settings, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TapingMachines() {
  const features = [
    {
      title: '고속 자동 테이핑',
      description: '분당 최대 20박스 이상의 빠른 처리 속도',
      icon: <Package size={24} />
    },
    {
      title: '정밀한 테이프 부착',
      description: '주름 없는 완벽한 테이핑 품질 보장',
      icon: <Settings size={24} />
    },
    {
      title: '다양한 박스 규격',
      description: '간편한 조절로 다양한 크기의 박스 대응 가능',
      icon: <ShieldCheck size={24} />
    }
  ];

  const products = [
    {
      id: 'tm-01',
      name: '표준형 반자동 테이핑기',
      description: '중소형 물류 현장에 최적화된 경제적인 모델',
      image: 'https://picsum.photos/seed/taping1/800/600'
    },
    {
      id: 'tm-02',
      name: '고속 자동 테이핑기',
      description: '대량 생산 라인을 위한 완전 자동화 솔루션',
      image: 'https://picsum.photos/seed/taping2/800/600'
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-4 py-1.5 bg-[#FFF0E9] rounded-full mb-8">
                <span className="text-xs font-bold tracking-widest text-[#FF6321] uppercase">
                  Taping Solutions
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8 leading-tight text-gray-900">
                포장 공정의 자동화,<br />
                <span className="text-[#FF6321]">한울팩 테이핑 시스템</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-xl leading-relaxed font-normal break-keep">
                정밀한 테이핑 기술로 박스 포장의 완성도를 높입니다. 
                다양한 생산 환경에 맞춘 최적의 테이핑 솔루션을 경험해보세요.
              </p>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#FF6321] shrink-0 border border-gray-100">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-500 break-keep">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-white rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                <img
                  src="https://picsum.photos/seed/taping-hero/1200/900"
                  alt="Taping Machine"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">제품 라인업</h2>
            <p className="text-gray-500">현장 용도에 맞는 다양한 모델을 확인해보세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="aspect-video rounded-3xl overflow-hidden bg-gray-50 mb-6 border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl flex items-center justify-center relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-20 grayscale transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em]">Coming Soon</p>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#FF6321] transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 break-keep">{product.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
