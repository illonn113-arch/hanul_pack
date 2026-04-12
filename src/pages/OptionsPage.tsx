import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchOptions, getIcon, type OptionItem } from '../data/options';
import { useEffect, useState } from 'react';

export default function OptionsPage() {
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptions()
      .then(data => {
        setOptions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1.5 bg-[#FFF0E9] rounded-full mb-8">
                <span className="text-xs font-bold tracking-widest text-[#FF6321] uppercase">
                  Optional Features
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-8 leading-tight text-gray-900">
                작업 환경에 맞춘<br />
                <span className="text-[#FF6321]">다양한 추가 옵션</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed font-normal break-keep">
                한울팩의 랩핑기는 고객사의 특수한 작업 환경과 요구 사항에 맞춰 
                다양한 옵션을 추가하여 최적의 효율을 낼 수 있도록 제작됩니다.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Options Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-[40px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                <Link to={`/options/${option.id}`} className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  <div className="aspect-square lg:aspect-auto overflow-hidden bg-gray-50">
                    <img
                      src={option.image}
                      alt={option.title}
                      className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-10 flex flex-col justify-center">
                    <div className="w-12 h-12 bg-[#FFF0E9] rounded-2xl flex items-center justify-center text-[#FF6321] mb-6">
                      {getIcon(option.icon)}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#FF6321] transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed break-keep mb-8">
                      {option.description}
                    </p>
                    
                    <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#FF6321] group/btn">
                      상세 정보 보기
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Request Section */}
      <section className="py-24 bg-[#141414] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">
                특수 사양<br />
                <span className="text-[#FF6321]">주문 제작 가능</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed break-keep">
                위에 나열된 옵션 외에도 턴테이블 직경 확장, 기둥 높이 연장, 
                접지형 랩핑기(기둥 틸팅형), 특수 환경용 스테인리스판 부착 등 모든 사양의 커스터마이징이 가능합니다.
              </p>
              
              <div className="space-y-4">
                {[
                  '턴테이블 직경 최대 3,000Φ 제작',
                  '기둥 높이 최대 3,200mm 제작',
                  '특수 중량물용 강화 프레임 / 모터 2마력 / 최대 무게 3톤 제작',
                  '접지형 랩핑기 (기둥 틸팅형) 제작',
                  '도색 변경'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#FF6321]" />
                    <span className="text-lg text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-[40px] p-12 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">지금 바로 상담받으세요</h3>
              <p className="text-gray-400 mb-10">
                현장 상황에 가장 적합한 옵션과 사양을 추천해드립니다. 
                전문 엔지니어가 직접 방문하여 상담해드릴 수 있습니다. (특수형의 경우)
              </p>
              <Link 
                to="/contact"
                className="block w-full py-5 bg-[#FF6321] text-white rounded-full font-bold text-lg shadow-lg shadow-[#FF6321]/20 text-center hover:bg-[#E5591D] transition-all"
              >
                견적 및 상담 문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
