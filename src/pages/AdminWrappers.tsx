import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, CheckCircle, AlertCircle, ChevronRight, Maximize2, ChevronUp, ChevronDown, ChevronLeft, Upload } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { fetchPalletWrappers, savePalletWrappers, type PalletWrapper } from '../data/palletWrappers';
import { getYoutubeEmbedUrl } from '../lib/utils';

export default function AdminWrappers() {
  const [wrappers, setWrappers] = useState<PalletWrapper[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWrapper, setEditingWrapper] = useState<PalletWrapper | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadWrappers();
  }, []);

  const loadWrappers = async () => {
    try {
      const data = await fetchPalletWrappers();
      setWrappers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWrapper) return;

    // Clean up video URLs (remove empty strings)
    const cleanedVideoUrls = (editingWrapper.videoUrls || []).filter(url => url.trim() !== '');
    const cleanedWrapper = {
      ...editingWrapper,
      videoUrls: cleanedVideoUrls,
      // Keep videoUrl for backward compatibility (set to first video)
      videoUrl: cleanedVideoUrls.length > 0 ? cleanedVideoUrls[0] : ''
    };

    try {
      let updatedWrappers;
      if (wrappers.find(w => w.id === cleanedWrapper.id)) {
        updatedWrappers = wrappers.map(w => w.id === cleanedWrapper.id ? cleanedWrapper : w);
      } else {
        updatedWrappers = [...wrappers, cleanedWrapper];
      }

      await savePalletWrappers(updatedWrappers);
      setWrappers(updatedWrappers);
      setIsModalOpen(false);
      setEditingWrapper(null);
      alert('저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const updatedWrappers = wrappers.filter(w => w.id !== id);
      await savePalletWrappers(updatedWrappers);
      setWrappers(updatedWrappers);
      alert('삭제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newWrappers = [...wrappers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newWrappers.length) return;
    
    // Swap items
    [newWrappers[index], newWrappers[targetIndex]] = [newWrappers[targetIndex], newWrappers[index]];
    
    // Update order fields based on new positions
    const orderedWrappers = newWrappers.map((w, i) => ({
      ...w,
      order: i + 1
    }));
    
    try {
      await savePalletWrappers(orderedWrappers);
      setWrappers(orderedWrappers);
    } catch (err) {
      console.error(err);
      alert('순서 변경 중 오류가 발생했습니다.');
    }
  };

  const handleFileUpload = async (file: File) => {
    // 100MB limit check
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`파일 용량이 너무 큽니다. (최대 100MB)\n현재 파일: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      return null;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Upload failed');
        setIsUploading(false);
        return data.url;
      } else {
        // Handle non-JSON response (likely HTML error page from proxy/infrastructure)
        const text = await response.text();
        console.error("Server returned non-JSON response:", text);
        setIsUploading(false);
        
        if (response.status === 413) {
          throw new Error('파일 용량이 서버 인프라 제한을 초과했습니다. (약 30MB~50MB 제한). 더 큰 영상은 유튜브 링크를 이용해 주세요.');
        }
        throw new Error(`서버 오류 (${response.status}): 파일이 너무 크거나 네트워크 연결이 끊겼습니다. 대용량 영상은 유튜브 링크 사용을 권장합니다.`);
      }
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      alert(err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.');
      return null;
    }
  };

  const openEditModal = (wrapper: PalletWrapper | null) => {
    if (wrapper) {
      setEditingWrapper({ 
        ...wrapper,
        order: wrapper.order || (wrappers.indexOf(wrapper) + 1),
        gallery: wrapper.gallery || [],
        videoUrl: wrapper.videoUrl || '',
        videoUrls: wrapper.videoUrls || (wrapper.videoUrl ? [wrapper.videoUrl] : []),
        fitImages: wrapper.fitImages || [],
        specs: wrapper.specs || [],
        performance: wrapper.performance || [],
        mainFeatures: wrapper.mainFeatures || [],
        advantages: wrapper.advantages || [],
        recommendedIndustries: wrapper.recommendedIndustries || [],
        caution: wrapper.caution || '',
      });
    } else {
      setEditingWrapper({
        id: `wrapper-${Date.now()}`,
        order: wrappers.length + 1,
        title: '',
        subtitle: '',
        description: '',
        image: '',
        videoUrl: '',
        videoUrls: [],
        gallery: [],
        fitImages: [],
        specs: [],
        performance: [],
        mainFeatures: [],
        advantages: [],
        recommendedIndustries: [],
        caution: '',
      });
    }
    setIsModalOpen(true);
  };

  const toggleFitImage = (url: string) => {
    if (!editingWrapper) return;
    const fitImages = editingWrapper.fitImages || [];
    const isFit = fitImages.some(f => url.includes(f));
    
    // We store fragments to be more resilient
    const fragment = url.split('/').pop() || url;

    if (isFit) {
      setEditingWrapper({
        ...editingWrapper,
        fitImages: fitImages.filter(f => !url.includes(f))
      });
    } else {
      setEditingWrapper({
        ...editingWrapper,
        fitImages: [...fitImages, fragment]
      });
    }
  };

  const addGalleryImage = () => {
    const url = prompt('이미지 URL을 입력하세요:');
    if (url && editingWrapper) {
      setEditingWrapper({
        ...editingWrapper,
        gallery: [...(editingWrapper.gallery || []), url]
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    if (!editingWrapper) return;
    const newGallery = [...(editingWrapper.gallery || [])];
    newGallery.splice(index, 1);
    setEditingWrapper({
      ...editingWrapper,
      gallery: newGallery
    });
  };

  const moveGalleryImage = (index: number, direction: 'left' | 'right') => {
    if (!editingWrapper || !editingWrapper.gallery) return;
    const newGallery = [...editingWrapper.gallery];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newGallery.length) return;

    [newGallery[index], newGallery[targetIndex]] = [newGallery[targetIndex], newGallery[index]];
    setEditingWrapper({
      ...editingWrapper,
      gallery: newGallery
    });
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">제품 관리</h1>
            <p className="text-gray-500">파렛트 랩핑기 라인업을 관리합니다.</p>
          </div>
          <button
            onClick={() => openEditModal(null)}
            className="px-6 py-3 bg-[#FF6321] hover:bg-[#E5591D] text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#FF6321]/20"
          >
            <Plus size={20} />
            새 제품 추가
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wrappers.map((wrapper, index) => (
              <motion.div
                key={wrapper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-20 disabled:hover:bg-transparent"
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === wrappers.length - 1}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-20 disabled:hover:bg-transparent"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                  <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden p-2">
                    <img src={wrapper.image} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{wrapper.title}</h3>
                    <p className="text-gray-500 text-sm">{wrapper.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(wrapper)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(wrapper.id)}
                    className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {isModalOpen && editingWrapper && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#111] border border-white/10 rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-2xl font-black tracking-tighter">제품 정보 수정</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8 relative">
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-white font-bold">파일 업로드 중...</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">기본 정보</label>
                      <input
                        type="text"
                        placeholder="제품명 (예: 기본형 랩핑기)"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF6321] transition-all"
                        value={editingWrapper.title}
                        onChange={e => setEditingWrapper({ ...editingWrapper, title: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="부제목 (예: HW-2000)"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF6321] transition-all"
                        value={editingWrapper.subtitle}
                        onChange={e => setEditingWrapper({ ...editingWrapper, subtitle: e.target.value })}
                        required
                      />
                      <textarea
                        placeholder="제품 설명"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF6321] transition-all h-32 resize-none"
                        value={editingWrapper.description}
                        onChange={e => setEditingWrapper({ ...editingWrapper, description: e.target.value })}
                        required
                      />
                      <textarea
                        placeholder="상세 설명 (Markdown 지원)"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF6321] transition-all h-48 resize-none"
                        value={editingWrapper.detailedDescription || ''}
                        onChange={e => setEditingWrapper({ ...editingWrapper, detailedDescription: e.target.value })}
                      />
                      <div className="space-y-4">
                        <div className="flex justify-between items-center ml-1">
                          <label className="block text-[10px] font-bold tracking-widest text-[#FF6321] uppercase">시연 영상 목록</label>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => {
                                if (editingWrapper) {
                                  setEditingWrapper({
                                    ...editingWrapper,
                                    videoUrls: [...(editingWrapper.videoUrls || []), '']
                                  });
                                }
                              }}
                              className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors"
                            >
                              URL 추가
                            </button>
                            <label className="cursor-pointer text-[10px] font-bold text-[#FF6321] hover:underline transition-colors flex items-center gap-1">
                              <Upload size={12} />
                              파일 업로드
                              <input
                                type="file"
                                accept="video/*"
                                multiple
                                className="hidden"
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length > 0 && editingWrapper) {
                                    const urls = await Promise.all(files.map(file => handleFileUpload(file)));
                                    const validUrls = urls.filter((url): url is string => url !== null);
                                    setEditingWrapper({
                                      ...editingWrapper,
                                      videoUrls: [...(editingWrapper.videoUrls || []), ...validUrls]
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {(editingWrapper.videoUrls || []).map((url, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Direct MP4 or YouTube URL"
                                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6321] transition-all"
                                  value={url}
                                  onChange={e => {
                                    const newUrls = [...(editingWrapper.videoUrls || [])];
                                    newUrls[idx] = e.target.value;
                                    setEditingWrapper({ ...editingWrapper, videoUrls: newUrls });
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newUrls = (editingWrapper.videoUrls || []).filter((_, i) => i !== idx);
                                    setEditingWrapper({ ...editingWrapper, videoUrls: newUrls });
                                  }}
                                  className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                              {url && (
                                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10">
                                  {getYoutubeEmbedUrl(url).includes('youtube.com/embed') ? (
                                    <iframe
                                      src={getYoutubeEmbedUrl(url)}
                                      className="w-full h-full"
                                      allowFullScreen
                                    ></iframe>
                                  ) : (
                                    <video
                                      src={url}
                                      controls
                                      className="w-full h-full object-contain"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                          {(editingWrapper.videoUrls || []).length === 0 && (
                            <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl text-gray-500 text-xs">
                              등록된 영상이 없습니다.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">메인 이미지</label>
                      <div className="aspect-video bg-white/5 border border-white/10 rounded-3xl overflow-hidden relative group">
                        {editingWrapper.image ? (
                          <img src={editingWrapper.image} alt="" className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <ImageIcon size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const url = prompt('이미지 URL을 입력하세요:');
                              if (url) setEditingWrapper({ ...editingWrapper, image: url });
                            }}
                            className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm"
                          >
                            URL 입력
                          </button>
                          <label className="px-4 py-2 bg-[#FF6321] text-white font-bold rounded-lg text-sm cursor-pointer flex items-center gap-2">
                            <Upload size={16} />
                            업로드
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file && editingWrapper) {
                                  const url = await handleFileUpload(file);
                                  if (url) setEditingWrapper({ ...editingWrapper, image: url });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleFitImage(editingWrapper.image)}
                          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${
                            editingWrapper.fitImages?.some(f => editingWrapper.image.includes(f))
                              ? 'bg-[#FF6321] border-[#FF6321] text-white'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {editingWrapper.fitImages?.some(f => editingWrapper.image.includes(f)) ? '전체 표시 중 (Fit)' : '전체 표시로 변경'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">갤러리 이미지</label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={addGalleryImage}
                          className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
                        >
                          URL 추가
                        </button>
                        <label className="text-xs font-bold text-[#FF6321] hover:underline cursor-pointer flex items-center gap-1">
                          <Upload size={12} />
                          이미지 업로드
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 0 && editingWrapper) {
                                const urls = await Promise.all(files.map(file => handleFileUpload(file)));
                                const validUrls = urls.filter((url): url is string => url !== null);
                                setEditingWrapper({
                                  ...editingWrapper,
                                  gallery: [...(editingWrapper.gallery || []), ...validUrls]
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {editingWrapper.gallery?.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative group">
                          <img src={img} alt="" className={`w-full h-full p-2 ${editingWrapper.fitImages?.some(f => img.includes(f)) ? 'object-contain' : 'object-cover'}`} referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => moveGalleryImage(idx, 'left')}
                                disabled={idx === 0}
                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-20"
                              >
                                <ChevronLeft size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveGalleryImage(idx, 'right')}
                                disabled={idx === (editingWrapper.gallery?.length || 0) - 1}
                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-20"
                              >
                                <ChevronRight size={14} />
                              </button>
                            </div>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => toggleFitImage(img)}
                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                                title={editingWrapper.fitImages?.some(f => img.includes(f)) ? "채우기로 변경" : "전체 표시로 변경"}
                              >
                                <Maximize2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">주요 특징 (Performance)</label>
                        <button
                          type="button"
                          onClick={() => setEditingWrapper({ ...editingWrapper, performance: [...editingWrapper.performance, ''] })}
                          className="text-xs font-bold text-[#FF6321] hover:underline"
                        >
                          추가
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editingWrapper.performance?.map((p, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FF6321] transition-all text-sm"
                              value={p}
                              onChange={e => {
                                const newPerformance = [...editingWrapper.performance];
                                newPerformance[idx] = e.target.value;
                                setEditingWrapper({ ...editingWrapper, performance: newPerformance });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newPerformance = [...editingWrapper.performance];
                                newPerformance.splice(idx, 1);
                                setEditingWrapper({ ...editingWrapper, performance: newPerformance });
                              }}
                              className="p-2 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">추천 업종 (Industries)</label>
                        <button
                          type="button"
                          onClick={() => setEditingWrapper({ ...editingWrapper, recommendedIndustries: [...(editingWrapper.recommendedIndustries || []), ''] })}
                          className="text-xs font-bold text-[#FF6321] hover:underline"
                        >
                          추가
                        </button>
                      </div>
                      <div className="space-y-2">
                        {editingWrapper.recommendedIndustries?.map((industry, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FF6321] transition-all text-sm"
                              value={industry}
                              onChange={e => {
                                const newIndustries = [...(editingWrapper.recommendedIndustries || [])];
                                newIndustries[idx] = e.target.value;
                                setEditingWrapper({ ...editingWrapper, recommendedIndustries: newIndustries });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newIndustries = [...(editingWrapper.recommendedIndustries || [])];
                                newIndustries.splice(idx, 1);
                                setEditingWrapper({ ...editingWrapper, recommendedIndustries: newIndustries });
                              }}
                              className="p-2 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">상세 주요 특징 (Main Features)</label>
                      <button
                        type="button"
                        onClick={() => setEditingWrapper({ ...editingWrapper, mainFeatures: [...(editingWrapper.mainFeatures || []), { title: '', description: '' }] })}
                        className="text-xs font-bold text-[#FF6321] hover:underline"
                      >
                        특징 추가
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {editingWrapper.mainFeatures?.map((feature, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center">
                            <input
                              type="text"
                              placeholder="특징 제목 (예: 원거리 무선 제어)"
                              className="bg-transparent border-none focus:outline-none text-white font-bold w-full"
                              value={feature.title}
                              onChange={e => {
                                const newFeatures = [...(editingWrapper.mainFeatures || [])];
                                newFeatures[idx] = { ...feature, title: e.target.value };
                                setEditingWrapper({ ...editingWrapper, mainFeatures: newFeatures });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFeatures = [...(editingWrapper.mainFeatures || [])];
                                newFeatures.splice(idx, 1);
                                setEditingWrapper({ ...editingWrapper, mainFeatures: newFeatures });
                              }}
                              className="p-1 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <textarea
                            placeholder="특징 설명"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FF6321] transition-all text-sm h-20 resize-none"
                            value={feature.description}
                            onChange={e => {
                              const newFeatures = [...(editingWrapper.mainFeatures || [])];
                              newFeatures[idx] = { ...feature, description: e.target.value };
                              setEditingWrapper({ ...editingWrapper, mainFeatures: newFeatures });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">주요 장점 (Advantages)</label>
                      <button
                        type="button"
                        onClick={() => setEditingWrapper({ ...editingWrapper, advantages: [...(editingWrapper.advantages || []), { title: '', description: '' }] })}
                        className="text-xs font-bold text-[#FF6321] hover:underline"
                      >
                        장점 추가
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {editingWrapper.advantages?.map((adv, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center">
                            <input
                              type="text"
                              placeholder="장점 제목 (예: 경제성)"
                              className="bg-transparent border-none focus:outline-none text-white font-bold w-full"
                              value={adv.title}
                              onChange={e => {
                                const newAdvantages = [...(editingWrapper.advantages || [])];
                                newAdvantages[idx] = { ...adv, title: e.target.value };
                                setEditingWrapper({ ...editingWrapper, advantages: newAdvantages });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newAdvantages = [...(editingWrapper.advantages || [])];
                                newAdvantages.splice(idx, 1);
                                setEditingWrapper({ ...editingWrapper, advantages: newAdvantages });
                              }}
                              className="p-1 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <textarea
                            placeholder="장점 설명"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FF6321] transition-all text-sm h-20 resize-none"
                            value={adv.description}
                            onChange={e => {
                              const newAdvantages = [...(editingWrapper.advantages || [])];
                              newAdvantages[idx] = { ...adv, description: e.target.value };
                              setEditingWrapper({ ...editingWrapper, advantages: newAdvantages });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">제품 사양 (Specs)</label>
                      <button
                        type="button"
                        onClick={() => setEditingWrapper({ ...editingWrapper, specs: [...editingWrapper.specs, { label: '', value: '' }] })}
                        className="text-xs font-bold text-[#FF6321] hover:underline"
                      >
                        사양 추가
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {editingWrapper.specs?.map((spec, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="라벨 (예: 전원)"
                            className="w-1/3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FF6321] transition-all text-sm"
                            value={spec.label}
                            onChange={e => {
                              const newSpecs = [...editingWrapper.specs];
                              newSpecs[idx] = { ...spec, label: e.target.value };
                              setEditingWrapper({ ...editingWrapper, specs: newSpecs });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="값 (예: 220V 단상)"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FF6321] transition-all text-sm"
                            value={spec.value}
                            onChange={e => {
                              const newSpecs = [...editingWrapper.specs];
                              newSpecs[idx] = { ...spec, value: e.target.value };
                              setEditingWrapper({ ...editingWrapper, specs: newSpecs });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSpecs = [...editingWrapper.specs];
                              newSpecs.splice(idx, 1);
                              setEditingWrapper({ ...editingWrapper, specs: newSpecs });
                            }}
                            className="p-2 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">주의 사항 (Caution)</label>
                      </div>
                      <textarea
                        placeholder="주의 사항 내용을 입력하세요"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#FF6321] transition-all h-32 resize-none"
                        value={editingWrapper.caution || ''}
                        onChange={e => setEditingWrapper({ ...editingWrapper, caution: e.target.value })}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase">주문제작 정보 (Customized Info)</label>
                      </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                      <textarea
                        placeholder="주문제작 설명"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FF6321] transition-all text-sm h-20 resize-none"
                        value={editingWrapper.customizedInfo?.description || ''}
                        onChange={e => {
                          const newCustomizedInfo = {
                            description: e.target.value,
                            items: editingWrapper.customizedInfo?.items || []
                          };
                          setEditingWrapper({ ...editingWrapper, customizedInfo: newCustomizedInfo });
                        }}
                      />
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500">주문제작 항목</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...(editingWrapper.customizedInfo?.items || []), ''];
                              setEditingWrapper({
                                ...editingWrapper,
                                customizedInfo: {
                                  description: editingWrapper.customizedInfo?.description || '',
                                  items: newItems
                                }
                              });
                            }}
                            className="text-xs font-bold text-[#FF6321] hover:underline"
                          >
                            항목 추가
                          </button>
                        </div>
                        {editingWrapper.customizedInfo?.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FF6321] transition-all text-sm"
                              value={item}
                              onChange={e => {
                                const newItems = [...(editingWrapper.customizedInfo?.items || [])];
                                newItems[idx] = e.target.value;
                                setEditingWrapper({
                                  ...editingWrapper,
                                  customizedInfo: {
                                    description: editingWrapper.customizedInfo?.description || '',
                                    items: newItems
                                  }
                                });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...(editingWrapper.customizedInfo?.items || [])];
                                newItems.splice(idx, 1);
                                setEditingWrapper({
                                  ...editingWrapper,
                                  customizedInfo: {
                                    description: editingWrapper.customizedInfo?.description || '',
                                    items: newItems
                                  }
                                });
                              }}
                              className="p-2 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>

                <div className="p-8 border-t border-white/10 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full transition-all"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-8 py-4 bg-[#FF6321] hover:bg-[#E5591D] text-white font-bold rounded-full transition-all shadow-lg shadow-[#FF6321]/20 flex items-center gap-2"
                  >
                    <Save size={20} />
                    저장하기
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
