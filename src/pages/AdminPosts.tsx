import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { usePosts } from '../hooks/usePosts';
import { Plus, Trash2, Edit2, X, Check, Image as ImageIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post } from '../types';
import { cn } from '../lib/utils';

interface AdminPostsProps {
  mode?: 'delivery-cases' | 'processing-site';
}

export default function AdminPosts({ mode }: AdminPostsProps) {
  const { posts, addPost, updatePost, deletePost, loading } = usePosts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<Omit<Post, 'id'>>({
    title: '',
    content: '',
    category: mode === 'processing-site' ? 'processing-site' : 'portfolio',
    imageUrl: '',
    imageUrls: [],
    order: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Filter posts based on mode
  const filteredPosts = mode === 'processing-site' 
    ? posts.filter(p => p.category === 'processing-site')
    : mode === 'delivery-cases'
    ? posts.filter(p => p.category !== 'processing-site')
    : posts;

  const handleOpenModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        imageUrl: post.imageUrl,
        imageUrls: post.imageUrls || [],
        order: post.order || 0,
        createdAt: post.createdAt,
        updatedAt: Date.now(),
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        content: '',
        category: mode === 'processing-site' ? 'processing-site' : 'portfolio',
        imageUrl: '',
        imageUrls: [],
        order: posts.length > 0 ? Math.max(...posts.map(p => p.order || 0)) + 1 : 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    setIsModalOpen(true);
  };

  const handleMove = async (post: Post, direction: 'up' | 'down') => {
    const currentIndex = filteredPosts.findIndex(p => p.id === post.id);
    if (direction === 'up' && currentIndex > 0) {
      const prevPost = filteredPosts[currentIndex - 1];
      const currentOrder = post.order || 0;
      const prevOrder = prevPost.order || 0;
      
      // Swap orders
      await updatePost(post.id, { order: prevOrder });
      await updatePost(prevPost.id, { order: currentOrder });
    } else if (direction === 'down' && currentIndex < filteredPosts.length - 1) {
      const nextPost = filteredPosts[currentIndex + 1];
      const currentOrder = post.order || 0;
      const nextOrder = nextPost.order || 0;
      
      // Swap orders
      await updatePost(post.id, { order: nextOrder });
      await updatePost(nextPost.id, { order: currentOrder });
    }
  };

  const handleAddImageUrl = () => {
    setFormData({
      ...formData,
      imageUrls: [...(formData.imageUrls || []), '']
    });
  };

  const handleRemoveImageUrl = (index: number) => {
    const newUrls = [...(formData.imageUrls || [])];
    newUrls.splice(index, 1);
    setFormData({ ...formData, imageUrls: newUrls });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...(formData.imageUrls || [])];
    newUrls[index] = value;
    setFormData({ ...formData, imageUrls: newUrls });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await updatePost(editingPost.id, formData);
      } else {
        await addPost(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">
              {mode === 'delivery-cases' ? '납품사례 관리' : 
               mode === 'processing-site' ? '가공현장 관리' : '게시글 관리'}
            </h1>
            <p className="text-gray-500">
              {mode === 'delivery-cases' ? '고객사 납품 사례를 관리하세요.' : 
               mode === 'processing-site' ? 'CNC 가공 및 제조 현장 소식을 관리하세요.' : 
               '납품 사례 및 가공 현장 게시글을 관리하세요.'}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-[#FF6321] hover:bg-[#E5591E] text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#FF6321]/20"
          >
            <Plus size={20} />
            {mode === 'delivery-cases' ? '새 납품사례 추가' : 
             mode === 'processing-site' ? '새 가공현장 추가' : '새 게시글 추가'}
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-[#FF6321]/20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={post.imageUrl || `https://picsum.photos/seed/${post.id}/200/200`}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#FF6321] uppercase px-2 py-0.5 bg-[#FF6321]/10 rounded-full border border-[#FF6321]/20">
                      {post.category === 'pallet-wrapper' ? '파렛트랩핑기' : 
                       post.category === 'taping-machine' ? '테이핑기' :
                       post.category === 'packaging-materials' ? '포장자재' :
                       post.category === 'portfolio' ? '납품사례' :
                       post.category === 'processing-site' ? '가공현장' : '기타'}
                    </span>
                    <h3 className="text-xl font-bold mt-2">{post.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1 mr-2">
                    <button
                      onClick={() => handleMove(post, 'up')}
                      disabled={filteredPosts.indexOf(post) === 0}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all disabled:opacity-30"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMove(post, 'down')}
                      disabled={filteredPosts.indexOf(post) === filteredPosts.length - 1}
                      className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all disabled:opacity-30"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleOpenModal(post)}
                    className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('정말 삭제하시겠습니까?')) deletePost(post.id);
                    }}
                    className="p-3 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black tracking-tighter">
                    {editingPost ? '게시글 수정' : '새 게시글 추가'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                      placeholder="게시글 제목을 입력하세요"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {mode !== 'processing-site' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors appearance-none"
                        >
                          <option value="pallet-wrapper">파렛트랩핑기</option>
                          <option value="taping-machine">테이핑기</option>
                          <option value="packaging-materials">포장자재</option>
                          <option value="portfolio">납품 사례</option>
                          <option value="other">기타</option>
                        </select>
                      </div>
                    )}
                    <div className={cn("space-y-2", mode === 'processing-site' ? "col-span-2" : "")}>
                      <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Main Image URL</label>
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                        placeholder="메인 이미지 URL"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                        placeholder="정렬 순서 (높을수록 먼저 표시)"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Additional Images</label>
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="text-xs font-bold text-[#FF6321] hover:text-[#E5591E] flex items-center gap-1 transition-colors"
                      >
                        <Plus size={14} />
                        이미지 추가
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.imageUrls?.map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6321] transition-colors"
                            placeholder={`추가 이미지 URL ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageUrl(index)}
                            className="p-3 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold tracking-widest text-gray-500 uppercase">Content</label>
                    <textarea
                      required
                      rows={8}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-[#FF6321] transition-colors resize-none"
                      placeholder="내용을 입력하세요 (Markdown 지원)"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-[#FF6321] hover:bg-[#E5591E] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF6321]/20 flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      {editingPost ? '수정 완료' : '게시글 등록'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
