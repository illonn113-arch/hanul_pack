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

export const fetchOptions = async (): Promise<OptionItem[]> => {
  const response = await fetch("/api/options");
  if (!response.ok) throw new Error("Failed to fetch options");
  return response.json();
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
