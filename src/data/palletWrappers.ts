import { collection, getDocs, setDoc, doc, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface PalletWrapper {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  videoUrl?: string; // Legacy single video field
  videoUrls?: string[]; // New multiple videos field
  gallery?: string[];
  fitImages?: string[]; // New field for image display mode
  specs: { label: string; value: string }[];
  performance: string[];
  detailedDescription?: string;
  advantages?: { title: string; description: string }[];
  recommendedIndustries?: string[];
  caution?: string;
  customizedInfo?: { description: string; items: string[] };
  order?: number;
}

export const fetchPalletWrappers = async (): Promise<PalletWrapper[]> => {
  try {
    const q = query(collection(db, 'wrappers'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const wrappers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PalletWrapper[];
    
    // Fallback to API if Firestore is empty (for initial migration)
    if (wrappers.length === 0) {
      const response = await fetch("/api/wrappers");
      if (response.ok) {
        return response.json();
      }
    }
    
    return wrappers;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'wrappers');
    return [];
  }
};

export const savePalletWrappers = async (data: PalletWrapper[]): Promise<void> => {
  try {
    // We save each wrapper as a separate document in Firestore
    // To maintain order, we add an 'order' field
    const promises = data.map((wrapper, index) => {
      const wrapperData = { ...wrapper, order: index };
      return setDoc(doc(db, 'wrappers', wrapper.id), wrapperData);
    });
    await Promise.all(promises);
    
    // Also sync to API for backward compatibility if server is running
    fetch("/api/wrappers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {}); // Ignore errors if server is not running
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'wrappers');
    throw error;
  }
};

export const deletePalletWrapper = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'wrappers', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `wrappers/${id}`);
    throw error;
  }
};

export const palletWrappersData: PalletWrapper[] = [];
