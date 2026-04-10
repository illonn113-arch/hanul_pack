import AdminSidebar from '../components/AdminSidebar';
import { usePosts } from '../hooks/usePosts';
import { useInquiries } from '../hooks/useInquiries';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { FileText, Eye, MessageSquare, TrendingUp, Database, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchPalletWrappers, savePalletWrappers, DEFAULT_WRAPPERS } from '../data/palletWrappers';
import { fetchOptions, saveOptions, DEFAULT_OPTIONS } from '../data/options';
import { useState } from 'react';

export default function Admin() {
  const { posts, addPost } = usePosts();
  const { inquiries } = useInquiries();
  const { config } = useSiteConfig();
  const [isSyncing, setIsSyncing] = useState(false);

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  const syncToCloud = async () => {
    if (!confirm('기본 데이터를 클라우드(Firestore)로 복구하시겠습니까? 이 작업은 사라진 사진들을 복구하고 배포된 사이트에서 데이터가 보이게 하는 데 필수적입니다.')) return;
    
    setIsSyncing(true);
    try {
      // 1. Sync Pallet Wrappers using DEFAULT_WRAPPERS to ensure photos are restored
      await savePalletWrappers(DEFAULT_WRAPPERS);

      // 2. Sync Options using DEFAULT_OPTIONS
      await saveOptions(DEFAULT_OPTIONS);

      alert('데이터 복구가 완료되었습니다. 이제 배포된 사이트에서도 사진들이 정상적으로 표시됩니다.');
    } catch (err) {
      console.error(err);
      alert('복구 중 오류가 발생했습니다. 네트워크 상태를 확인해 주세요.');
    } finally {
      setIsSyncing(false);
    }
  };

  const seedData = async () => {
    if (posts.length > 0) {
      alert('이미 게시글이 존재합니다.');
      return;
    }
    
    const samplePosts = [
      {
        title: "고성능 파렛트 랩핑기 납품",
        content: "대형 물류 센터에 고성능 파렛트 랩핑기를 설치 완료했습니다.",
        category: "pallet-wrapper" as const,
        imageUrl: "https://picsum.photos/seed/wrapper/800/600",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        title: "자동 테이핑기 라인 구축",
        content: "생산 라인 효율화를 위한 자동 테이핑기 시스템을 구축했습니다.",
        category: "taping-machine" as const,
        imageUrl: "https://picsum.photos/seed/taping/800/600",
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
      },
      {
        title: "친환경 포장자재 공급",
        content: "기업용 친환경 완충재 및 포장자재 정기 납품 계약을 체결했습니다.",
        category: "packaging-materials" as const,
        imageUrl: "https://picsum.photos/seed/packaging/800/600",
        createdAt: Date.now() - 172800000,
        updatedAt: Date.now() - 172800000,
      }
    ];

    for (const post of samplePosts) {
      await addPost(post);
    }
    alert('샘플 데이터가 성공적으로 생성되었습니다.');
  };

  const stats = [
    { label: '전체 게시글', value: posts.length, icon: <FileText size={24} />, color: 'text-blue-500' },
    { label: '오늘 방문자', value: '1,234', icon: <Eye size={24} />, color: 'text-[#FF6321]' },
    { label: '새로운 문의', value: newInquiriesCount, icon: <MessageSquare size={24} />, color: 'text-green-500' },
    { label: '성장률', value: '+12%', icon: <TrendingUp size={24} />, color: 'text-orange-500' },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">대시보드</h1>
            <p className="text-gray-500">한울팩의 현재 상태를 한눈에 확인하세요.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={syncToCloud}
              disabled={isSyncing}
              className={`px-6 py-3 ${isSyncing ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20`}
            >
              <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? '동기화 중...' : '클라우드 데이터 동기화'}
            </button>
            <button
              onClick={seedData}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl flex items-center gap-2 transition-all border border-white/10"
            >
              <Database size={20} />
              샘플 데이터 생성
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
            >
              <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <p className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-1">{stat.label}</p>
              <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">최근 게시글</h3>
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FF6321]/20 rounded-xl overflow-hidden">
                      <img src={post.imageUrl || `https://picsum.photos/seed/${post.id}/100/100`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{post.title}</p>
                      <p className="text-[10px] text-[#FF6321] font-bold uppercase tracking-widest">
                        {post.category === 'pallet-wrapper' ? '파렛트랩핑기' : 
                         post.category === 'taping-machine' ? '테이핑기' :
                         post.category === 'packaging-materials' ? '포장자재' :
                         post.category === 'portfolio' ? '납품사례' :
                         post.category === 'processing-site' ? '가공현장' : '기타'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">사이트 설정 요약</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">사이트 이름</p>
                <p className="text-lg font-bold">{config.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">메인 컬러</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: config.theme.primaryColor }} />
                  <p className="font-mono text-sm uppercase">{config.theme.primaryColor}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">연락처</p>
                <p className="text-sm text-gray-400">{config.contactEmail}</p>
                <p className="text-sm text-gray-400">{config.contactPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
