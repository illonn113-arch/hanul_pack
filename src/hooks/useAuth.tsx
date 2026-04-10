import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const path = `users/${user.uid}`;
        try {
          console.log('User detected, checking permissions for:', user.email);
          // Check if user exists in Firestore, if not create
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            console.log('New user, creating record...');
            // Default role is user, unless it's the default admin email
            const role = user.email === "illonn113@gmail.com" ? "admin" : "user";
            await setDoc(userRef, {
              email: user.email,
              role: role
            });
            setIsAdmin(role === "admin");
          } else {
            const userData = userSnap.data();
            console.log('Existing user data:', userData);
            setIsAdmin(userData.role === "admin");
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          // Don't use handleFirestoreError here as it throws, which might break the observer
          // Just log it and set admin to false
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log('Starting login process...');
      const result = await signInWithPopup(auth, provider);
      console.log('Login successful:', result.user.email);
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
