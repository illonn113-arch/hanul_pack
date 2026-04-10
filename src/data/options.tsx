import { Ruler, Eye, Shield, PlusCircle, Settings, Zap, Lock } from 'lucide-react';

export interface OptionItem {
  id: string;
  title: string;
  description: string;
  icon: string | React.ReactNode;
  image: string;
  gallery?: string[];
  details: string[];
  advantages: { title: string; description: string }[];
}

export const getIcon = (iconName: string | React.ReactNode) => {
  if (typeof iconName !== 'string') return iconName;
  
  switch (iconName) {
    case 'Ruler': return <Ruler size={24} />;
    case 'Eye': return <Eye size={24} />;
    case 'Shield': return <Shield size={24} />;
    case 'PlusCircle': return <PlusCircle size={24} />;
    case 'Settings': return <Settings size={24} />;
    case 'Zap': return <Zap size={24} />;
    case 'Lock': return <Lock size={24} />;
    default: return <Settings size={24} />;
  }
};

export const fetchOptions = async (retries = 3): Promise<OptionItem[]> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch("/api/options");
      if (!response.ok) throw new Error(`Failed to fetch options: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1} for options...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return [];
};

export const saveOptions = async (data: OptionItem[]): Promise<void> => {
  const response = await fetch("/api/options", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to save options");
};

export const optionsData: OptionItem[] = [];
