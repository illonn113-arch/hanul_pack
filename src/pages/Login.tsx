import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { user, isAdmin, login, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  if (user && isAdmin) return <Navigate to="/admin" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6321]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6321]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full px-8 py-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl relative z-10 text-center"
      >
        <h1 className="text-4xl font-black tracking-tighter mb-4 text-[#FF6321]">한울팩</h1>
        <p className="text-gray-400 mb-12">관리자 페이지에 접속하시려면 로그인해주세요.</p>

        <button
          onClick={login}
          className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all"
        >
          <LogIn size={20} />
          Google로 로그인하기
        </button>

        {user && !isAdmin && (
          <p className="mt-6 text-sm text-red-500 font-medium">
            관리자 권한이 없습니다. 관리자에게 문의하세요.
          </p>
        )}
      </motion.div>
    </div>
  );
}
