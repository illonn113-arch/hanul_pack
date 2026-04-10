import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  increment, 
} from 'firebase/firestore';

export function useVisitors() {
  const { isAdmin } = useAuth();
  const [todayCount, setTodayCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    // Only set up listeners for admins to avoid permission errors for regular users
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const todayStr = getTodayStr();
    const todayRef = doc(db, 'stats', todayStr);
    const totalRef = doc(db, 'stats', 'total');

    const unsubToday = onSnapshot(todayRef, (docSnap) => {
      if (docSnap.exists()) {
        setTodayCount(docSnap.data().count || 0);
      } else {
        setTodayCount(0);
      }
    }, (error) => {
      console.error('Error listening to today visitors:', error);
    });

    const unsubTotal = onSnapshot(totalRef, (docSnap) => {
      if (docSnap.exists()) {
        setTotalCount(docSnap.data().count || 0);
      } else {
        setTotalCount(0);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to total visitors:', error);
      setLoading(false);
    });

    return () => {
      unsubToday();
      unsubTotal();
    };
  }, [isAdmin]);

  const trackVisit = async () => {
    const todayStr = getTodayStr();
    const sessionKey = `visited_${todayStr}`;

    // Only track once per session per day
    if (sessionStorage.getItem(sessionKey)) return;

    const todayRef = doc(db, 'stats', todayStr);
    const totalRef = doc(db, 'stats', 'total');
    
    try {
      // Use setDoc with merge: true and increment to handle both create and update atomically
      // This also avoids the need for a prior getDoc, which simplifies permissions
      await setDoc(todayRef, {
        count: increment(1),
        date: todayStr
      }, { merge: true });

      await setDoc(totalRef, {
        count: increment(1),
        date: 'total'
      }, { merge: true });

      sessionStorage.setItem(sessionKey, 'true');
    } catch (error) {
      // If it's a permission error, it might be because the rules are still propagating
      // or there's a specific validation failure.
      console.error('Error tracking visit:', error);
    }
  };

  const resetVisitors = async () => {
    const todayStr = getTodayStr();
    const todayRef = doc(db, 'stats', todayStr);
    const totalRef = doc(db, 'stats', 'total');

    try {
      await setDoc(todayRef, { count: 0, date: todayStr }, { merge: true });
      await setDoc(totalRef, { count: 0, date: 'total' }, { merge: true });
    } catch (error) {
      console.error('Error resetting visitors:', error);
    }
  };

  return { todayCount, totalCount, trackVisit, resetVisitors, loading };
}

