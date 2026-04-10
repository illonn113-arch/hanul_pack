import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Inquiry } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Inquiry[];
      setInquiries(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'inquiries');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    const path = `inquiries/${id}`;
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deleteInquiry = async (id: string) => {
    const path = `inquiries/${id}`;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return { inquiries, loading, updateInquiryStatus, deleteInquiry };
}
