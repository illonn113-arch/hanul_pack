import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle2, ArrowRight, MessageSquare, X } from 'lucide-react';
import { fetchOptions, getIcon, type OptionItem } from '../data/options';
import { useEffect, useState } from 'react';

export default function OptionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [option, setOption] = useState<OptionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOptions()
      .then(data => {
        const found = data.find(o => o.id === id);
        if (found) {
          setOption(found);
        } else {
          navigate('/options');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!option) return null;

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-[#FF6321] transition-colors">홈</Link>
            <ChevronLeft size={12} className="rotate-180" />
            <Link to="/options" className="hover:text-[#FF6321] transition-colors">추가 옵션</Link>
            <ChevronLeft size={12} className="rotate-180" />
            <span className="text-gray-900 font-medium">{option.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF0E9] rounded-full mb-8">
                <span className="text-[#FF6321]">{getIcon(option.icon)}</span>
                <span className="text-xs font-bold tracking-widest text-[#FF6321] uppercase">
                  Option Detail
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight text-gray-900 break-keep">
                {option.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed font-normal break-keep">
                {option.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {option.advantages.map((adv, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">{adv.title}</h4>
                    <p className="text-sm text-gray-500 break-keep">{adv.description}</p>
                  </div>
                ))}
              </div>

              <Link 
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#FF6321] text-white rounded-full font-bold text-lg shadow-lg shadow-[#FF6321]/20 hover:bg-[#E5591D] transition-all"
              >
                견적 및 상담 문의
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div 
                className="aspect-square bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(option.image)}
              >
                <img
                  src={option.image}
                  alt={option.title}
                  className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {option.gallery && option.gallery.length > 0 && (
        <section className="py-24 bg-white border-t border-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">갤러리</h2>
              <div className="h-1.5 w-20 bg-[#FF6321] mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {option.gallery.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="aspect-square bg-gray-50 rounded-[32px] overflow-hidden border border-gray-100 group cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`${option.title} gallery ${i + 1}`}
                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Specs */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">상세 특징</h2>
            <div className="h-1.5 w-20 bg-[#FF6321] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {option.details.map((detail, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <CheckCircle2 size={24} className="text-[#FF6321] shrink-0" />
                <span className="text-lg text-gray-700 font-medium">{detail}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#141414] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageSquare size={48} className="text-[#FF6321] mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight">
            전문 엔지니어와 상담하세요
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto break-keep">
            {option.title} 외에도 현장 상황에 맞는 최적의 솔루션을 제안해드립니다. 
            지금 바로 문의를 남겨주세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/contact"
              className="px-10 py-5 bg-[#FF6321] text-white rounded-full font-bold text-lg shadow-lg shadow-[#FF6321]/20 hover:bg-[#E5591D] transition-all"
            >
              견적 문의하기
            </Link>
            <Link 
              to="/options"
              className="px-10 py-5 bg-white/10 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
            >
              다른 옵션 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Full screen view"
                className="max-w-full max-h-full object-contain shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
