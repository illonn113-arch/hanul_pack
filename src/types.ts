export interface SiteConfig {
  name: string;
  logoUrl?: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    blog?: string;
    smartStore?: string;
  };
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: 'pallet-wrapper' | 'taping-machine' | 'packaging-materials' | 'portfolio' | 'processing-site' | 'other';
  imageUrl: string;
  imageUrls?: string[];
  order?: number;
  createdAt: number;
  updatedAt: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: 'logo' | 'website';
  imageUrl: string;
  order: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  createdAt: number;
  status: 'new' | 'read' | 'replied';
}
