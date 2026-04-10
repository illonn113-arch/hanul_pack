import { Ruler, Eye, Shield, PlusCircle, Settings, Zap, Lock } from 'lucide-react';
import { collection, getDocs, setDoc, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface OptionItem {
  id: string;
  title: string;
  description: string;
  icon: string | React.ReactNode;
  image: string;
  gallery?: string[];
  details: string[];
  advantages: { title: string; description: string }[];
  order?: number;
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
  try {
    const q = query(collection(db, 'options'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const options = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as OptionItem[];
    
    // Fallback to API if Firestore is empty
    if (options.length === 0) {
      const response = await fetch("/api/options");
      if (response.ok) {
        return response.json();
      }
    }
    
    return options;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'options');
    return [];
  }
};

export const saveOptions = async (data: OptionItem[]): Promise<void> => {
  try {
    const promises = data.map((option, index) => {
      const optionData = { ...option, order: index };
      // Remove React nodes before saving to Firestore
      if (typeof optionData.icon !== 'string') {
        optionData.icon = 'Settings';
      }
      return setDoc(doc(db, 'options', option.id), optionData);
    });
    await Promise.all(promises);
    
    // Sync to API
    fetch("/api/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'options');
    throw error;
  }
};

export const deleteOption = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'options', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `options/${id}`);
    throw error;
  }
};

export const optionsData: OptionItem[] = [];
