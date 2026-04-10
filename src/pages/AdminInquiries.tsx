import AdminSidebar from '../components/AdminSidebar';
import { useInquiries } from '../hooks/useInquiries';
import { MessageSquare, Trash2, CheckCircle, Clock, Mail, Phone, Building } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminInquiries() {
  const { inquiries, loading, updateInquiryStatus, deleteInquiry } = useInquiries();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock size={16} className="text-blue-500" />;
      case 'read': return <CheckCircle size={16} className="text-green-500" />;
      case 'replied': return <CheckCircle size={16} className="text-[#FF6321]" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return '신규';
      case 'read': return '확인함';
      case 'replied': return '답변완료';
      default: return status;
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar />
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter mb-2">견적 문의 관리</h1>
          <p className="text-gray-500">고객님들이 남겨주신 견적 문의 내역을 확인하고 관리하세요.</p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6321]"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl">
            <MessageSquare size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
            <p className="text-gray-500 font-bold">아직 접수된 문의가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {inquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                        inquiry.status === 'new' ? 'bg-blue-500/10 text-blue-500' : 
                        inquiry.status === 'read' ? 'bg-green-500/10 text-green-500' : 
                        'bg-[#FF6321]/10 text-[#FF6321]'
                      }`}>
                        {getStatusIcon(inquiry.status)}
                        {getStatusLabel(inquiry.status)}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(inquiry.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                          <Building size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">회사/성함</p>
                          <p className="text-sm font-bold">{inquiry.company ? `${inquiry.company} / ` : ''}{inquiry.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                          <Phone size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">연락처</p>
                          <p className="text-sm font-bold">{inquiry.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                          <Mail size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">이메일</p>
                          <p className="text-sm font-bold">{inquiry.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">문의 내용</p>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{inquiry.message}</p>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    {inquiry.status === 'new' && (
                      <button
                        onClick={() => updateInquiryStatus(inquiry.id, 'read')}
                        className="px-4 py-2 bg-white/5 hover:bg-green-500/20 text-green-500 text-xs font-bold rounded-xl border border-white/10 transition-all"
                      >
                        확인함으로 표시
                      </button>
                    )}
                    {inquiry.status !== 'replied' && (
                      <button
                        onClick={() => updateInquiryStatus(inquiry.id, 'replied')}
                        className="px-4 py-2 bg-white/5 hover:bg-[#FF6321]/20 text-[#FF6321] text-xs font-bold rounded-xl border border-white/10 transition-all"
                      >
                        답변완료로 표시
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('정말 삭제하시겠습니까?')) {
                          deleteInquiry(inquiry.id);
                        }
                      }}
                      className="p-2 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-xl border border-white/10 transition-all"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
