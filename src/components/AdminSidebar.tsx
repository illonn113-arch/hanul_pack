import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Home, LogOut, MessageSquare, Box } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: '대시보드', path: '/admin' },
    { icon: <Box size={20} />, label: '제품 관리', path: '/admin/wrappers' },
    { icon: <Settings size={20} />, label: '추가 옵션 관리', path: '/admin/options' },
    { icon: <MessageSquare size={20} />, label: '문의 내역', path: '/admin/inquiries' },
    { icon: <FileText size={20} />, label: '납품사례 관리', path: '/admin/delivery-cases' },
    { icon: <FileText size={20} />, label: '가공현장 관리', path: '/admin/processing-site' },
    { icon: <Settings size={20} />, label: '사이트 설정', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-black border-r border-white/10 p-6 flex flex-col">
      <div className="mb-12">
        <Link to="/" className="text-2xl font-black tracking-tighter text-[#FF6321]">
          한울팩
        </Link>
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mt-2">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              location.pathname === item.path
                ? "bg-[#FF6321] text-white shadow-lg shadow-[#FF6321]/20"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className={cn(
              "transition-colors",
              location.pathname === item.path ? "text-white" : "text-gray-500 group-hover:text-[#FF6321]"
            )}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/10">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
          <Home size={20} className="text-gray-500 group-hover:text-[#FF6321]" />
          홈페이지로 이동
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-red-400 transition-all group mt-2"
        >
          <LogOut size={20} className="text-gray-500 group-hover:text-red-400" />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
