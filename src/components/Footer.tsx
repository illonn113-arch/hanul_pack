import { useSiteConfig } from '../hooks/useSiteConfig';
import { Instagram, ShoppingBag } from 'lucide-react';

const NaverBlogIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
    <rect x="0" y="0" width="100" height="100" rx="20" fill="#2DB400" />
    <path
      d="M25 35c0-2.8 2.2-5 5-5h40c2.8 0 5 2.2 5 5v25c0 2.8-2.2 5-5 5h-15l-5 7-5-7h-15c-2.8 0-5-2.2-5-5v-25z"
      fill="white"
    />
    <text
      x="50"
      y="52"
      fontFamily="Arial, sans-serif"
      fontSize="18"
      fontWeight="bold"
      fill="#FF6321"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      blog
    </text>
  </svg>
);

export default function Footer() {
  const { config } = useSiteConfig();

  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8">
          <div>
            {config.logoUrl ? (
              <img src={config.logoUrl} alt={config.name} className="h-20 w-auto object-contain mx-auto" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-2xl font-bold tracking-tighter" style={{ color: config.theme.primaryColor }}>
                {config.name}
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500 leading-relaxed space-y-1">
            <p>
              상호명 : 한울팩　대표자 : 정한울　사업자등록번호 : 111-37-43402
            </p>
            <p>
              통신판매업신고번호 : 2025-경기시흥-2218
            </p>
            <p>
              주소 : 경기도 시흥시 마유로 42번길 89 (시화공단) * 현장방문 환영 *
            </p>
            <p>
              TEL : 010-4186-1236　FAX : 031-401-1166　E-mail : illonn113@gmail.com
            </p>
            <p className="pt-4 font-medium text-gray-400">
              COPYRIGHT(C) HANUL PACK. All Rights Reserved.
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <div className="flex items-center gap-6">
            {config.socialLinks.instagram && (
              <a 
                href={config.socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center text-gray-400 hover:text-[#FF6321] hover:border-[#FF6321]/30 hover:shadow-2xl hover:shadow-[#FF6321]/20 transition-all duration-300 group" 
                title="Instagram"
              >
                <Instagram size={40} className="group-hover:scale-110 transition-transform" />
              </a>
            )}
            {config.socialLinks.blog && (
              <a 
                href={config.socialLinks.blog} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center hover:shadow-2xl hover:shadow-[#2DB400]/20 transition-all duration-300 group" 
                title="Naver Blog"
              >
                <NaverBlogIcon size={64} className="group-hover:scale-110 transition-transform" />
              </a>
            )}
            {config.socialLinks.smartStore && (
              <a 
                href={config.socialLinks.smartStore} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-20 h-20 bg-white border border-gray-100 rounded-3xl flex items-center justify-center text-gray-400 hover:text-[#2DB400] hover:border-[#2DB400]/30 hover:shadow-2xl hover:shadow-[#2DB400]/20 transition-all duration-300 group" 
                title="Naver Smart Store"
              >
                <ShoppingBag size={40} className="group-hover:scale-110 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
