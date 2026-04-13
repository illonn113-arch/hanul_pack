import { Link, useLocation } from 'react-router-dom';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { config } = useSiteConfig();
  const { user, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const linkClass = (path: string) => 
    `text-sm font-normal transition-colors ${
      isActive(path) ? 'text-[#FF6321] font-semibold' : 'text-gray-600 hover:text-[#FF6321]'
    }`;

  const mobileLinkClass = (path: string) =>
    `block text-lg font-normal ${
      isActive(path) ? 'text-[#FF6321] font-semibold' : 'text-gray-900'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.name} className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-2xl font-bold tracking-tighter" style={{ color: config.theme.primaryColor }}>
                {config.name}
              </span>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClass('/')}>홈</Link>
            <Link to="/company" className={linkClass('/company')}>회사소개</Link>
            <Link to="/pallet-wrappers" className={linkClass('/pallet-wrappers')}>파렛트랩핑기</Link>
            <Link to="/options" className={linkClass('/options')}>추가 옵션</Link>
            <Link to="/packaging-materials" className={linkClass('/packaging-materials')}>포장자재</Link>
            <Link to="/processing-site" className={linkClass('/processing-site')}>가공현장</Link>
            <Link to="/delivery-cases" className={linkClass('/delivery-cases')}>납품 사례</Link>
            <Link 
              to="/contact"
              className={linkClass('/contact')}
            >
              견적문의
            </Link>
            
            {isAdmin && (
              <Link to="/admin" className="flex items-center space-x-1 text-sm font-medium text-[#FF6321] hover:text-[#E5591D] transition-colors">
                <LayoutDashboard size={16} />
                <span>관리자</span>
              </Link>
            )}
            
            {user && (
              <button onClick={logout} className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
                <LogOut size={16} />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4"
          >
            <Link to="/" onClick={() => setIsOpen(false)} className={mobileLinkClass('/')}>홈</Link>
            <Link to="/company" onClick={() => setIsOpen(false)} className={mobileLinkClass('/company')}>회사소개</Link>
            <Link to="/pallet-wrappers" onClick={() => setIsOpen(false)} className={mobileLinkClass('/pallet-wrappers')}>파렛트랩핑기</Link>
            <Link to="/options" onClick={() => setIsOpen(false)} className={mobileLinkClass('/options')}>추가 옵션</Link>
            <Link to="/packaging-materials" onClick={() => setIsOpen(false)} className={mobileLinkClass('/packaging-materials')}>포장자재</Link>
            <Link to="/processing-site" onClick={() => setIsOpen(false)} className={mobileLinkClass('/processing-site')}>가공현장</Link>
            <Link to="/delivery-cases" onClick={() => setIsOpen(false)} className={mobileLinkClass('/delivery-cases')}>납품 사례</Link>
            <Link 
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={mobileLinkClass('/contact')}
            >
              견적문의
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-lg font-medium text-[#FF6321]">관리자 대시보드</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
