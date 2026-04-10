import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchPalletWrappers, type PalletWrapper } from '../data/palletWrappers';

export default function PalletWrappers() {
  const [wrappers, setWrappers] = useState<PalletWrapper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPalletWrappers()
      .then(data => {
        setWrappers(data);
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
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-[#FF6321] transition-colors">홈</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium">파렛트랩핑기</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight text-gray-900 break-keep">
              파렛트랩핑기 <span className="text-[#FF6321]">라인업</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wrappers.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white border border-gray-100 rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-[#FF6321]/10 transition-all duration-500"
              >
                <Link to={`/pallet-wrappers/${item.id}`} className="flex flex-col h-full">
                  <div className="aspect-[4/3] overflow-hidden relative shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {item.title} ({item.subtitle})
                      </h3>
                    </div>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 break-keep">
                      {item.description}
                    </p>
                    
                    <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#FF6321] group/btn">
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

    </div>
  );
}
