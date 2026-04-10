import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function PackagingMaterials() {
  const features = [
    {
      title: '고신축성',
      description: '최대 300% 연신으로 필름 절감',
    },
    {
      title: '강력한 점착',
      description: '흔들림 없는 완벽한 적재물 고정',
    },
    {
      title: '고투명도',
      description: '바코드 인식 및 내용물 확인 용이',
    },
    {
      title: '다양한 규격',
      description: '현장 용도에 맞는 두께/폭 선택',
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-4 py-1.5 bg-[#FFF0E9] rounded-full mb-8">
                <span className="text-xs font-bold tracking-widest text-[#FF6321] uppercase">
                  Packaging Materials
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8 leading-tight text-gray-900">
                기계 성능을 극대화하는<br />
                <span className="text-[#FF6321]">프리미엄 스트레치 필름</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-16 max-w-xl leading-relaxed font-normal break-keep">
                한울팩은 기계 공급을 넘어, 장비의 성능을 최상으로 유지하고<br className="hidden md:block" />
                포장 품질을 높일 수 있는 최적의 자재를 함께 제안합니다.<br className="hidden md:block" /><br className="hidden md:block" />
                당사의 고신축 필름은 뛰어난 복원력으로 필름 소모량을<br className="hidden md:block" />
                획기적으로 줄여주어 매우 경제적입니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-[#FFF0E9] rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle2 size={20} className="text-[#FF6321]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-base text-gray-500 leading-relaxed break-keep">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-white rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden group">
                <div className="absolute top-8 left-8 z-10">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    Premium Stretch Film
                  </span>
                </div>
                <img
                  src="https://postfiles.pstatic.net/MjAyNjAzMjNfMSAg/MDAxNzc0Mjc3NTA1ODA0.I8hjQIgdy8z0XOlBOQklZ1ZGWvIU1h-xP1YtQrbNfP8g.tepKUWlCHMTKIbh35SkUBu_FyyDmdv_Mmb8TgU4oIucg.PNG/Generated_Image_March_23,_2026_-_11_50PM.png?type=w773"
                  alt="Premium Stretch Film"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#FF6321]/5 rounded-full blur-3xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#FF6321]/5 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-semibold mb-6">최상의 포장 품질을 약속합니다</h2>
            <p className="text-gray-600 leading-relaxed break-keep">
              한울팩의 스트레치 필름은 수많은 현장 테스트를 거쳐 검증된 제품입니다.<br className="hidden md:block" />
              기계의 부하를 줄여 수명을 연장시키고, 완벽한 적재물 고정으로 운송 중 파손을 방지합니다.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
