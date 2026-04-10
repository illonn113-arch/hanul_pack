import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { fetchOptions, saveOptions, getIcon, type OptionItem } from '../data/options';
import { Plus, Trash2, Save, Image as ImageIcon, Type, FileText, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminOptions() {
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveOptions(options);
      setMessage({ type: 'success', text: '추가 옵션이 성공적으로 저장되었습니다.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const addOption = () => {
    const newOption: OptionItem = {
      id: `option-${Date.now()}`,
      title: '새로운 옵션',
      description: '옵션에 대한 간단한 설명을 입력하세요.',
      icon: 'Settings',
      image: 'https://picsum.photos/seed/option/800/600',
      details: ['특징 1', '특징 2'],
      advantages: [
        { title: '장점 1', description: '장점 설명을 입력하세요.' }
      ]
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (id: string) => {
    if (confirm('정말 이 옵션을 삭제하시겠습니까?')) {
      setOptions(options.filter(o => o.id !== id));
    }
  };

  const updateOption = (id: string, updates: Partial<OptionItem>) => {
    setOptions(options.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const addDetail = (optionId: string) => {
    setOptions(options.map(o => {
      if (o.id === optionId) {
        return { ...o, details: [...o.details, '새로운 특징'] };
      }
      return o;
    }));
  };

  const removeDetail = (optionId: string, index: number) => {
    setOptions(options.map(o => {
      if (o.id === optionId) {
        const newDetails = [...o.details];
        newDetails.splice(index, 1);
        return { ...o, details: newDetails };
      }
      return o;
    }));
  };

  const updateDetail = (optionId: string, index: number, value: string) => {
    setOptions(options.map(o => {
      if (o.id === optionId) {
        const newDetails = [...o.details];
        newDetails[index] = value;
        return { ...o, details: newDetails };
      }
      return o;
    }));
  };

  const addAdvantage = (optionId: string) => {
    setOptions(options.map(o => {
      if (o.id === optionId) {
        return { ...o, advantages: [...o.advantages, { title: '새 장점', description: '설명' }] };
      }
      return o;
    }));
  };

  const removeAdvantage = (optionId: string, index: number) => {
    setOptions(options.map(o => {
      if (o.id === optionId) {
        const newAdvantages = [...o.advantages];
        newAdvantages.splice(index, 1);
        return { ...o, advantages: newAdvantages };
      }
      return o;
    }));
  };

  const updateAdvantage = (optionId: string, index: number, updates: Partial<{ title: string, description: string }>) => {
    setOptions(options.map(o => {
      if (o.id === optionId) {
        const newAdvantages = [...o.advantages];
        newAdvantages[index] = { ...newAdvantages[index], ...updates };
        return { ...o, advantages: newAdvantages };
      }
      return o;
    }));
  };

  const handleFileUpload = async (file: File) => {
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
        const text = await response.text();
        console.error("Server returned non-JSON response:", text);
        setIsUploading(false);
        
        if (response.status === 413) {
          throw new Error('파일 용량이 서버 제한을 초과했습니다. (약 30MB~50MB 제한). 사진 크기를 줄여서 다시 시도해 주세요.');
        }
        throw new Error(`서버 오류 (${response.status}): 파일이 너무 크거나 네트워크 연결이 끊겼습니다.`);
      }
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      alert(err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.');
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-black text-white">
        <AdminSidebar />
        <main className="flex-1 p-12 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto relative">
        {isUploading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-bold">파일 업로드 중...</p>
          </div>
        )}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">추가 옵션 관리</h1>
            <p className="text-gray-500">제품 상세 페이지 및 옵션 페이지에 표시될 추가 옵션을 관리합니다.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={addOption}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl flex items-center gap-2 transition-all border border-white/10"
            >
              <Plus size={20} />
              옵션 추가
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-[#FF6321] hover:bg-[#E5591D] text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#FF6321]/20 disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="font-bold">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
          {options.map((option) => (
            <div key={option.id} className="p-8 bg-white/5 border border-white/10 rounded-[40px] relative group">
              <button
                onClick={() => removeOption(option.id)}
                className="absolute top-8 right-8 p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2 block">아이콘 및 제목</label>
                    <div className="flex gap-4">
                      <select
                        value={typeof option.icon === 'string' ? option.icon : 'Settings'}
                        onChange={(e) => updateOption(option.id, { icon: e.target.value })}
                        className="w-16 h-12 bg-white/5 border border-white/10 rounded-xl px-2 focus:border-[#FF6321] outline-none"
                      >
                        <option value="Ruler">Ruler</option>
                        <option value="Eye">Eye</option>
                        <option value="Shield">Shield</option>
                        <option value="PlusCircle">PlusCircle</option>
                        <option value="Settings">Settings</option>
                        <option value="Zap">Zap</option>
                        <option value="Lock">Lock</option>
                      </select>
                      <input
                        type="text"
                        value={option.title}
                        onChange={(e) => updateOption(option.id, { title: e.target.value })}
                        className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-[#FF6321] outline-none font-bold"
                        placeholder="옵션 제목"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2 block">설명</label>
                    <textarea
                      value={option.description}
                      onChange={(e) => updateOption(option.id, { description: e.target.value })}
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 focus:border-[#FF6321] outline-none resize-none text-sm leading-relaxed"
                      placeholder="옵션에 대한 설명을 입력하세요."
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">대표 이미지</label>
                      <label className="cursor-pointer text-[10px] font-bold text-[#FF6321] hover:underline flex items-center gap-1">
                        <Upload size={12} />
                        업로드
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file);
                              if (url) updateOption(option.id, { image: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                        {option.image ? (
                          <img src={option.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-gray-500" />
                        )}
                      </div>
                      <input
                        type="text"
                        value={option.image}
                        onChange={(e) => updateOption(option.id, { image: e.target.value })}
                        className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-4 focus:border-[#FF6321] outline-none text-xs"
                        placeholder="이미지 URL"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">갤러리 이미지</label>
                      <div className="flex gap-3">
                        <label className="cursor-pointer text-[10px] font-bold text-[#FF6321] hover:underline flex items-center gap-1">
                          <Upload size={12} />
                          업로드
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 0) {
                                const urls = await Promise.all(files.map(file => handleFileUpload(file)));
                                const validUrls = urls.filter((url): url is string => url !== null);
                                const newGallery = [...(option.gallery || []), ...validUrls];
                                updateOption(option.id, { gallery: newGallery });
                              }
                            }}
                          />
                        </label>
                        <button 
                          onClick={() => {
                            const newGallery = [...(option.gallery || []), ''];
                            updateOption(option.id, { gallery: newGallery });
                          }} 
                          className="p-1 hover:text-[#FF6321] transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(option.gallery || []).map((img, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                            {img ? (
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={14} className="text-gray-500" />
                            )}
                          </div>
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const newGallery = [...(option.gallery || [])];
                              newGallery[idx] = e.target.value;
                              updateOption(option.id, { gallery: newGallery });
                            }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-[#FF6321] outline-none"
                            placeholder="이미지 URL"
                          />
                          <button 
                            onClick={() => {
                              const newGallery = [...(option.gallery || [])];
                              newGallery.splice(idx, 1);
                              updateOption(option.id, { gallery: newGallery });
                            }} 
                            className="text-gray-500 hover:text-red-500 p-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Details & Advantages */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">주요 특징</label>
                      <button onClick={() => addDetail(option.id)} className="p-1 hover:text-[#FF6321] transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {option.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={detail}
                            onChange={(e) => updateDetail(option.id, idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-[#FF6321] outline-none"
                          />
                          <button onClick={() => removeDetail(option.id, idx)} className="text-gray-500 hover:text-red-500 p-2">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">장점 (Advantages)</label>
                      <button onClick={() => addAdvantage(option.id)} className="p-1 hover:text-[#FF6321] transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {option.advantages.map((adv, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 relative group/adv">
                          <button
                            onClick={() => removeAdvantage(option.id, idx)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover/adv:opacity-100 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                          <input
                            type="text"
                            value={adv.title}
                            onChange={(e) => updateAdvantage(option.id, idx, { title: e.target.value })}
                            className="w-full bg-transparent font-bold text-sm focus:text-[#FF6321] outline-none"
                            placeholder="장점 제목"
                          />
                          <textarea
                            value={adv.description}
                            onChange={(e) => updateAdvantage(option.id, idx, { description: e.target.value })}
                            className="w-full bg-transparent text-xs text-gray-400 outline-none resize-none"
                            placeholder="장점 설명"
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
