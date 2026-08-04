import { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { Save, Check, RotateCcw, Upload, Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Link as LinkIcon, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../constants';

export default function AdminSettings() {
  const { config, updateConfig, loading } = useSiteConfig();
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingDetail, setIsUploadingDetail] = useState(false);
  const [pastedLink, setPastedLink] = useState('');
  const [showRawTextarea, setShowRawTextarea] = useState(false);

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const detailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`파일 용량이 너무 큽니다. (최대 100MB)\n현재 파일: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      return null;
    }

    const data = new FormData();
    data.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const resData = await response.json();
        if (!response.ok) throw new Error(resData.error || '업로드 실패');
        return resData.url;
      } else {
        throw new Error(`서버 오류 (${response.status})`);
      }
    } catch (err) {
      console.error(err);
      alert('파일 업로드 중 오류가 발생했습니다.');
      return null;
    }
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingHero(true);
    const url = await handleFileUpload(files[0]);
    if (url) {
      setFormData(prev => ({ ...prev, heroImageUrl: url }));
    }
    setIsUploadingHero(false);
    if (heroFileInputRef.current) heroFileInputRef.current.value = '';
  };

  const handleDetailFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingDetail(true);
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await handleFileUpload(files[i]);
      if (url) uploadedUrls.push(url);
    }
    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        homeDetailImages: [...(prev.homeDetailImages || []), ...uploadedUrls]
      }));
    }
    setIsUploadingDetail(false);
    if (detailFileInputRef.current) detailFileInputRef.current.value = '';
  };

  const handleAddPastedLink = () => {
    if (!pastedLink.trim()) return;
    // Support multi-line or space separated links
    const newLinks = pastedLink
      .split(/[\n\s]+/)
      .map(s => s.trim())
      .filter(Boolean);

    if (newLinks.length > 0) {
      setFormData(prev => ({
        ...prev,
        homeDetailImages: [...(prev.homeDetailImages || []), ...newLinks]
      }));
      setPastedLink('');
    }
  };

  const handleMoveDetailImage = (index: number, direction: 'up' | 'down') => {
    const current = [...(formData.homeDetailImages || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    [current[index], current[targetIndex]] = [current[targetIndex], current[index]];
    setFormData(prev => ({ ...prev, homeDetailImages: current }));
  };

  const handleDeleteDetailImage = (index: number) => {
    const current = [...(formData.homeDetailImages || [])];
    current.splice(index, 1);
    setFormData(prev => ({ ...prev, homeDetailImages: current }));
  };

  const handleUpdateDetailImageUrl = (index: number, newUrl: string) => {
    const current = [...(formData.homeDetailImages || [])];
    current[index] = newUrl;
    setFormData(prev => ({ ...prev, homeDetailImages: current }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateConfig(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) {
      setFormData(DEFAULT_SITE_CONFIG);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">사이트 설정</h1>
            <p className="text-gray-500">웹사이트의 전반적인 콘텐츠와 디자인을 커스터마이징하세요.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <RotateCcw size={20} />
              초기화
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-3 bg-[#FF6321] hover:bg-[#E5591E] disabled:bg-[#CC4F1A] text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#FF6321]/20"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
              설정 저장
            </button>
          </div>
        </header>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-2xl flex items-center gap-3"
          >
            <Check size={20} />
            설정이 성공적으로 저장되었습니다.
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* General Settings */}
          <div className="space-y-8">
            <section className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#FF6321]/10 rounded-lg flex items-center justify-center text-[#FF6321] text-sm">01</span>
                기본 정보
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Site Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Logo URL</label>
                  <input
                    type="text"
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors resize-none"
                  />
                </div>
              </div>
            </section>

            <section className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#FF6321]/10 rounded-lg flex items-center justify-center text-[#FF6321] text-sm">02</span>
                히어로 섹션
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Hero Title</label>
                  <textarea
                    rows={2}
                    value={formData.heroTitle}
                    onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Hero Subtitle</label>
                  <textarea
                    rows={3}
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors resize-none"
                  />
                </div>
                {/* Hero Main Image Upload & Link */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold tracking-widest text-gray-400 uppercase flex items-center gap-2">
                      <ImageIcon size={16} className="text-[#FF6321]" />
                      Hero Image (메인 대표 배경 이미지)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.heroImageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                      placeholder="블로그 이미지 주소 복사하여 붙여넣기 (https://...)"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                    />
                    <input
                      type="file"
                      ref={heroFileInputRef}
                      onChange={handleHeroFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingHero}
                      onClick={() => heroFileInputRef.current?.click()}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold rounded-xl flex items-center gap-2 transition-all shrink-0 text-sm border border-white/10"
                    >
                      {isUploadingHero ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      사진 파일 직접 업로드
                    </button>
                  </div>
                  {formData.heroImageUrl && (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-white/20 bg-black/40 mt-2">
                      <img
                        src={formData.heroImageUrl}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>

                {/* Home Page Sequential Images (홈화면 연속 상세 이미지) */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <label className="text-sm font-bold text-white flex items-center gap-2">
                        <ImageIcon size={18} className="text-[#FF6321]" />
                        홈화면 연속 상세 이미지 (카탈로그 스트림)
                      </label>
                      <p className="text-xs text-gray-400 mt-1">
                        사진을 직접 파일로 업로드하거나, 블로그 링크를 복사해 붙여넣으세요.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRawTextarea(!showRawTextarea)}
                        className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg flex items-center gap-1.5 border border-white/10 transition-all"
                      >
                        <FileText size={14} />
                        {showRawTextarea ? '목록 보기' : '텍스트 일괄 편집'}
                      </button>
                      <input
                        type="file"
                        ref={detailFileInputRef}
                        onChange={handleDetailFilesUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingDetail}
                        onClick={() => detailFileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#FF6321] hover:bg-[#E5591E] disabled:bg-[#CC4F1A] text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-md text-xs"
                      >
                        {isUploadingDetail ? (
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Upload size={14} />
                        )}
                        사진 파일 여러개 업로드
                      </button>
                    </div>
                  </div>

                  {/* Blog / Web Link Paste Field */}
                  <div className="flex gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div className="relative flex-1">
                      <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={pastedLink}
                        onChange={(e) => setPastedLink(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPastedLink();
                          }
                        }}
                        placeholder="블로그 이미지 주소 복사 후 붙여넣기 (https://...)"
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPastedLink}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs border border-white/10"
                    >
                      <Plus size={14} />
                      링크 추가
                    </button>
                  </div>

                  {/* Mode 1: Raw Textarea Edit */}
                  {showRawTextarea ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">이미지 URL을 한 줄에 하나씩 입력하세요.</p>
                      <textarea
                        rows={8}
                        value={(formData.homeDetailImages || []).join('\n')}
                        onChange={(e) => setFormData({
                          ...formData,
                          homeDetailImages: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                        })}
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6321] transition-colors resize-y text-xs font-mono leading-relaxed"
                      />
                    </div>
                  ) : (
                    /* Mode 2: Sequential Visual Cards List */
                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                      {(!formData.homeDetailImages || formData.homeDetailImages.length === 0) ? (
                        <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 text-gray-400 text-xs">
                          등록된 상세 이미지가 없습니다. 상단의 '사진 파일 여러개 업로드' 또는 '링크 추가'로 사진을 추가해주세요.
                        </div>
                      ) : (
                        formData.homeDetailImages.map((src, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all group"
                          >
                            <span className="w-6 h-6 rounded-full bg-[#FF6321]/20 text-[#FF6321] text-xs font-extrabold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>

                            <div className="w-16 h-16 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0 relative">
                              <img
                                src={src}
                                alt={`Detail ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                                }}
                              />
                            </div>

                            <input
                              type="text"
                              value={src}
                              onChange={(e) => handleUpdateDetailImageUrl(idx, e.target.value)}
                              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#FF6321] transition-colors font-mono truncate"
                            />

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleMoveDetailImage(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1.5 bg-white/5 hover:bg-white/15 disabled:opacity-30 rounded-lg text-gray-300 transition-colors"
                                title="위로 이동"
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveDetailImage(idx, 'down')}
                                disabled={idx === (formData.homeDetailImages?.length || 0) - 1}
                                className="p-1.5 bg-white/5 hover:bg-white/15 disabled:opacity-30 rounded-lg text-gray-300 transition-colors"
                                title="아래로 이동"
                              >
                                <ChevronDown size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDetailImage(idx)}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors ml-1"
                                title="삭제"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Design & Contact Settings */}
          <div className="space-y-8">
            <section className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#FF6321]/10 rounded-lg flex items-center justify-center text-[#FF6321] text-sm">03</span>
                디자인 테마
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Primary Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={formData.theme.primaryColor}
                      onChange={(e) => setFormData({ ...formData, theme: { ...formData.theme, primaryColor: e.target.value } })}
                      className="w-12 h-12 bg-transparent border-none cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.theme.primaryColor}
                      onChange={(e) => setFormData({ ...formData, theme: { ...formData.theme, primaryColor: e.target.value } })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors font-mono uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Font Family</label>
                  <select
                    value={formData.theme.fontFamily}
                    onChange={(e) => setFormData({ ...formData, theme: { ...formData.theme, fontFamily: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors appearance-none"
                  >
                    <option value="Inter, sans-serif">Inter (Modern)</option>
                    <option value="'Noto Sans KR', sans-serif">Noto Sans KR (Clean)</option>
                    <option value="'Playfair Display', serif">Playfair Display (Elegant)</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-[#FF6321]/10 rounded-lg flex items-center justify-center text-[#FF6321] text-sm">04</span>
                연락처 및 소셜
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Phone</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Instagram URL</label>
                  <input
                    type="text"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, instagram: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Blog URL</label>
                  <input
                    type="text"
                    value={formData.socialLinks.blog}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, blog: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Smart Store URL</label>
                  <input
                    type="text"
                    value={formData.socialLinks.smartStore || ''}
                    onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, smartStore: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                  />
                </div>
              </div>
            </section>
          </div>
        </form>
      </main>
    </div>
  );
}
