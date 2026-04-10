import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { Save, Check, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../constants';

export default function AdminSettings() {
  const { config, updateConfig, loading } = useSiteConfig();
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

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
