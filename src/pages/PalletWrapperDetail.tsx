import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, ArrowLeft, CheckCircle, X, Maximize2, Play, PlusCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fetchPalletWrappers, type PalletWrapper } from '../data/palletWrappers';
import { useEffect, useState } from 'react';
import { getYoutubeEmbedUrl, getYoutubeThumbnail } from '../lib/utils';

export default function PalletWrapperDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [wrapper, setWrapper] = useState<PalletWrapper | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState<string>('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    fetchPalletWrappers()
      .then(data => {
        const found = data.find(w => w.id === id);
        if (found) {
          setWrapper(found);
          setActiveMedia(found.image);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const allMedia = wrapper ? [
    wrapper.image, 
    ...(wrapper.gallery || []), 
    ...(wrapper.videoUrls || (wrapper.videoUrl ? [wrapper.videoUrl] : []))
  ] : [];
  const currentIndex = allMedia.indexOf(activeMedia);

  const nextMedia = () => {
    const nextIdx = (currentIndex + 1) % allMedia.length;
    setActiveMedia(allMedia[nextIdx]);
  };

  const prevMedia = () => {
    const prevIdx = (currentIndex - 1 + allMedia.length) % allMedia.length;
    setActiveMedia(allMedia[prevIdx]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!wrapper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">제품을 찾을 수 없습니다.</h2>
          <Link to="/pallet-wrappers" className="text-[#FF6321] font-semibold">목록으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  const isFitImage = (url: string) => {
    if (!wrapper.fitImages) return false;
    return wrapper.fitImages.some(fitUrl => url.includes(fitUrl));
  };

  const isVideo = (url: string) => {
    const videoUrls = wrapper?.videoUrls || (wrapper?.videoUrl ? [wrapper?.videoUrl] : []);
    if (videoUrls.includes(url)) return true;
    
    const urlWithoutQuery = url.split('?')[0];
    const isVideoExtension = urlWithoutQuery.match(/\.(mp4|webm|ogg)$/i);
    const isYoutube = url.includes('youtube.com/embed') || url.includes('youtube.com/watch') || url.includes('youtu.be/');
    const isNaverVideo = url.includes('type=mp4');
    
    return !!(isVideoExtension || isYoutube || isNaverVideo);
  };

  const renderVideo = (url: string) => {
    const embedUrl = getYoutubeEmbedUrl(url);
    if (embedUrl.includes('youtube.com/embed')) {
      return (
        <iframe
          src={embedUrl}
          title={`${wrapper?.title} 시연 영상`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
    return (
      <video
        src={url}
        controls
        autoPlay
        muted
        loop
        className="w-full h-full object-contain"
      />
    );
  };

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#FF6321] transition-colors">홈</Link>
            <ChevronRight size={14} />
            <Link to="/pallet-wrappers" className="hover:text-[#FF6321] transition-colors">파렛트랩핑기</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">{wrapper.title}</span>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Section */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className={`relative rounded-[40px] overflow-hidden aspect-[4/3] shadow-2xl transition-colors duration-300 group ${
                  isFitImage(activeMedia) ? 'bg-white p-8' : ''
                }`}
              >
                <AnimatePresence mode="wait">
                  {isVideo(activeMedia) ? (
                    <motion.div
                      key={activeMedia}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full bg-black"
                    >
                      {renderVideo(activeMedia)}
                    </motion.div>
                  ) : (
                    <motion.img
                      key={activeMedia}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={activeMedia}
                      alt={wrapper.title}
                      className={`w-full h-full cursor-zoom-in ${
                        isFitImage(activeMedia) ? 'object-contain' : 'object-cover'
                      }`}
                      onClick={() => setIsLightboxOpen(true)}
                      referrerPolicy="no-referrer"
                    />
                  )}
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button 
                  onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                >
                  <ChevronRight size={24} />
                </button>

                {!isVideo(activeMedia) && (
                  <div className="absolute bottom-6 right-6">
                    <button 
                      onClick={() => setIsLightboxOpen(true)}
                      className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <Maximize2 size={20} />
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-5 gap-4">
                {/* Include main image in gallery for switching back */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer transition-all group relative ${activeMedia === wrapper.image ? 'ring-2 ring-[#FF6321]' : 'hover:ring-2 hover:ring-gray-300'}`}
                  onClick={() => setActiveMedia(wrapper.image)}
                >
                  <img
                    src={wrapper.image}
                    alt={`${wrapper.title} main`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors ${activeMedia === wrapper.image ? 'bg-black/5' : ''}`} />
                </motion.div>

                {wrapper.gallery?.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (idx + 1) * 0.1 }}
                    className={`aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer transition-all group relative ${activeMedia === img ? 'ring-2 ring-[#FF6321]' : 'hover:ring-2 hover:ring-gray-300'}`}
                    onClick={() => setActiveMedia(img)}
                  >
                    {isVideo(img) ? (
                      <video
                        src={img}
                        muted
                        playsInline
                        autoPlay
                        loop
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <img
                        src={img}
                        alt={`${wrapper.title} gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors ${activeMedia === img ? 'bg-black/5' : ''}`} />
                    {isVideo(img) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={24} className="text-white opacity-60 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Video Thumbnails */}
                {(wrapper.videoUrls || (wrapper.videoUrl ? [wrapper.videoUrl] : [])).map((vUrl, vIdx) => (
                  <motion.div
                    key={`video-${vIdx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + ((wrapper.gallery?.length || 0) + 1 + vIdx) * 0.1 }}
                    className={`aspect-square rounded-2xl overflow-hidden bg-gray-900 cursor-pointer transition-all group relative flex items-center justify-center ${activeMedia === vUrl ? 'ring-2 ring-[#FF6321]' : 'hover:ring-2 hover:ring-gray-300'}`}
                    onClick={() => setActiveMedia(vUrl)}
                  >
                    {getYoutubeThumbnail(vUrl) ? (
                      <img 
                        src={getYoutubeThumbnail(vUrl)!} 
                        alt={`Video thumbnail ${vIdx + 1}`}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <video
                        src={vUrl}
                        muted
                        playsInline
                        autoPlay
                        loop
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={32} className="text-white opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-1 left-0 right-0 text-[10px] text-center text-white/70 font-bold uppercase tracking-wider">Video {vIdx + 1}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <div className="mb-4">
                <h1 className="text-[38px] font-bold text-gray-900 mb-4 whitespace-nowrap leading-tight">
                  {wrapper.title.replace(/\s/g, '')}({wrapper.subtitle.replace(/\s/g, '')})
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed break-keep max-w-2xl">
                  {wrapper.description}
                </p>
              </div>

              {/* Features Section */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#FF6321] mb-3">주요 특징</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {wrapper.performance.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 text-[15px] text-gray-700">
                      <div className="mt-1 shrink-0">
                        <CheckCircle size={18} className="text-[#FF6321]" />
                      </div>
                      <span className="break-keep leading-snug whitespace-pre-line">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications Table */}
              <div 
                className="bg-[#F8F9FA] rounded-[32px] p-5 border border-gray-100 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">제품 사양</h3>
                <div className="space-y-0">
                  {wrapper.specs.map((spec, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center py-3 ${index !== wrapper.specs.length - 1 ? 'border-b border-gray-200' : ''}`}
                    >
                      <span className="text-gray-500 font-medium">{spec.label}</span>
                      <span className="text-gray-900 font-bold text-right ml-4">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link
                  to="/contact"
                  className="flex-1 px-6 py-4 bg-[#FF6321] hover:bg-[#E5591D] text-white font-bold rounded-full transition-all text-center shadow-lg shadow-[#FF6321]/20 whitespace-nowrap"
                >
                  견적 및 상담 문의
                </Link>
                <Link
                  to="/options"
                  className="flex-1 px-6 py-4 bg-white border-2 border-[#FF6321] text-[#FF6321] hover:bg-[#FF6321]/5 font-bold rounded-full transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <PlusCircle size={18} />
                  추가 옵션
                </Link>
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-full transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <ArrowLeft size={18} />
                  목록으로
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">상세 내용</h2>
          
          <div className="bg-white rounded-[32px] p-12 border border-gray-100 shadow-sm">
            <div className="space-y-10">
              {/* Description */}
              {wrapper.detailedDescription && (
                <div>
                  <h3 className="text-[22px] font-bold text-[#FF6321] mb-5">제품 상세 설명</h3>
                  <div className="text-gray-700 leading-relaxed text-[17px] markdown-body">
                    <ReactMarkdown>{wrapper.detailedDescription}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Main Features */}
              {wrapper.mainFeatures && wrapper.mainFeatures.length > 0 && (
                <div>
                  <h3 className="text-[22px] font-bold text-[#FF6321] mb-5">주요 특징</h3>
                  <div className="space-y-4 text-gray-700 text-[17px]">
                    {wrapper.mainFeatures.map((feature, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:gap-2">
                        <span className="font-bold shrink-0">{feature.title}:</span>
                        <div className="markdown-body advantage-description">
                          <ReactMarkdown>{feature.description}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advantages */}
              {wrapper.advantages && wrapper.advantages.length > 0 && (
                <div>
                  <h3 className="text-[22px] font-bold text-gray-900 mb-5">주요 장점</h3>
                  <div className="space-y-4 text-gray-700 text-[17px]">
                    {wrapper.advantages.map((adv, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:gap-2">
                        <span className="font-bold shrink-0">{adv.title}:</span>
                        <div className="markdown-body advantage-description">
                          <ReactMarkdown>{adv.description}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Industries */}
              {wrapper.recommendedIndustries && wrapper.recommendedIndustries.length > 0 && (
                <div>
                  <h3 className="text-[22px] font-bold text-gray-900 mb-5">추천 업종</h3>
                  <ul className="space-y-3 text-gray-700 text-[17px] mb-8">
                    {wrapper.recommendedIndustries.map((industry, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-[#FF6321]" />
                        <span>{industry}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Caution */}
              {wrapper.caution && (
                <div>
                  <h3 className="text-[22px] font-bold text-[#FF6321] mb-5">주의 사항</h3>
                  <p className="text-gray-700 font-medium text-[17px] leading-relaxed">
                    {wrapper.caution}
                  </p>
                </div>
              )}

              {/* Customized */}
              {wrapper.customizedInfo && (
                <div>
                  <h3 className="text-[22px] font-bold text-gray-900 mb-5">주문제작 맞춤형 랩핑기 (Customized)</h3>
                  <p className="text-gray-700 mb-5 text-[17px]">
                    {wrapper.customizedInfo.description}
                  </p>
                  <ul className="space-y-3 text-gray-700 text-[17px]">
                    {wrapper.customizedInfo.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={32} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={prevMedia}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <ChevronLeft size={48} />
              </button>
              
              {isVideo(activeMedia) ? (
                <div className="w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center">
                  {renderVideo(activeMedia)}
                </div>
              ) : (
                <motion.img
                  key={activeMedia}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  src={activeMedia}
                  alt={wrapper.title}
                  className="max-w-full max-h-full object-contain shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              )}

              <button 
                onClick={nextMedia}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <ChevronRight size={48} />
              </button>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium py-4">
                {currentIndex + 1} / {allMedia.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
