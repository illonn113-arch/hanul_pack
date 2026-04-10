import { motion, AnimatePresence } from 'motion/react';
import { usePosts } from '../hooks/usePosts';
import { ExternalLink, Layers, Monitor, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Post } from '../types';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';

interface PortfolioProps {
  limit?: number;
  showViewMore?: boolean;
  category?: Post['category'];
  excludeCategory?: Post['category'];
}

export default function Portfolio({ limit, showViewMore = false, category, excludeCategory }: PortfolioProps) {
  const { posts, loading } = usePosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter posts by category or exclude category
  const filteredPosts = category 
    ? posts.filter(p => p.category === category) 
    : excludeCategory 
    ? posts.filter(p => p.category !== excludeCategory)
    : posts;

  // If showViewMore is true (Home screen), show 9 items but fade out the bottom row
  const portfolioItems = showViewMore ? filteredPosts.slice(0, 9) : (limit ? filteredPosts.slice(0, limit) : filteredPosts);

  const allImages = selectedPost ? [selectedPost.imageUrl, ...(selectedPost.imageUrls || [])].filter(Boolean) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <section id="portfolio" className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <span className="text-sm font-bold tracking-widest text-[#FF6321]/80 uppercase mb-4 block">Delivery Cases</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-gray-800 leading-tight">
              한울팩의<br />다양한 납품 사례
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 mt-8 md:mt-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500 shadow-sm">
              <Layers size={14} className="text-[#FF6321]/60" />
              <span>랩핑기</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500 shadow-sm">
              <Monitor size={14} className="text-[#FF6321]/60" />
              <span>테이핑기</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500 shadow-sm">
              <ExternalLink size={14} className="text-[#FF6321]/60" />
              <span>포장자재</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/3] bg-white animate-pulse rounded-3xl border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${showViewMore ? 'pb-40' : ''}`}>
              {portfolioItems.length > 0 ? (
                portfolioItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => {
                      setSelectedPost(item);
                      setCurrentImageIndex(0);
                    }}
                    className="group relative aspect-[4/3] overflow-hidden rounded-[32px] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 cursor-pointer"
                  >
                    <img
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/600`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {item.imageUrls && item.imageUrls.length > 0 && (
                      <div className="absolute top-5 right-5 bg-white/80 backdrop-blur-md text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                        +{item.imageUrls.length} photos
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <span className="text-[10px] font-bold tracking-widest text-[#FF6321] uppercase mb-2">
                        {item.category === 'pallet-wrapper' ? '파렛트랩핑기' : 
                         item.category === 'taping-machine' ? '테이핑기' :
                         item.category === 'packaging-materials' ? '포장자재' :
                         item.category === 'processing-site' ? '가공현장' : '납품사례'}
                      </span>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-400 font-medium">
                  등록된 포트폴리오가 없습니다.
                </div>
              )}
            </div>
            
            {showViewMore && posts.length > 6 && (
              <div className="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/80 via-[#FAFAFA]/40 to-transparent pointer-events-none z-10" />
            )}
          </div>
        )}

        {showViewMore && posts.length > 6 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-[-100px] relative z-20 text-center"
          >
            <Link 
              to="/delivery-cases"
              className="inline-flex items-center gap-3 px-12 py-5 bg-white border border-gray-200 text-gray-500 rounded-full font-bold hover:border-[#FF6321]/50 hover:text-[#FF6321] transition-all group shadow-xl shadow-gray-200/30"
            >
              납품사례 더보기
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform opacity-60" />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Image Section */}
              <div className="relative w-full md:w-2/3 bg-gray-100 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={allImages[currentImageIndex]}
                    alt=""
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all z-10"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all z-10"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-[#FF6321] w-4' : 'bg-black/40 hover:bg-black/60'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/3 p-8 md:p-12 overflow-y-auto bg-white relative">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900 z-10"
                >
                  <X size={24} />
                </button>

                <div className="mb-8">
                  <span className="text-xs font-bold tracking-widest text-[#FF6321] uppercase mb-4 block">
                    {selectedPost.category === 'pallet-wrapper' ? '파렛트랩핑기' : 
                     selectedPost.category === 'taping-machine' ? '테이핑기' :
                     selectedPost.category === 'packaging-materials' ? '포장자재' :
                     selectedPost.category === 'processing-site' ? '가공현장' : '납품사례'}
                  </span>
                  <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-tight">
                    {selectedPost.title}
                  </h2>
                  <div className="h-1 w-12 bg-[#FF6321] mt-6" />
                </div>

                <div className="prose prose-sm prose-orange max-w-none text-gray-600 leading-relaxed">
                  <Markdown>{selectedPost.content}</Markdown>
                </div>

                {/* Remove creation date as requested */}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
