import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../constants';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'siteConfig', 'main');
    
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SiteConfig;
        // Merge with DEFAULT_SITE_CONFIG to ensure new fields (like smartStore) are present
        // while keeping the user's saved values.
        const mergedConfig = {
          ...DEFAULT_SITE_CONFIG,
          ...data,
          socialLinks: {
            ...DEFAULT_SITE_CONFIG.socialLinks,
            ...data.socialLinks
          },
          theme: {
            ...DEFAULT_SITE_CONFIG.theme,
            ...data.theme
          }
        };

        // Special handling for initial transitions & default phrase updates
        if (data.name === 'Ding Studio' || data.name === '한울팩') {
          mergedConfig.name = DEFAULT_SITE_CONFIG.name;
        }
        if (!data.heroTitle || data.heroTitle.includes('최고의 포장') || data.heroTitle.includes('함께합니다') || data.heroTitle === "국산 파렛트랩핑기 전문 제조기업\n한울팩") {
          mergedConfig.heroTitle = DEFAULT_SITE_CONFIG.heroTitle;
        }
        if (!data.heroSubtitle || data.heroSubtitle.includes('산업용 포장')) {
          mergedConfig.heroSubtitle = DEFAULT_SITE_CONFIG.heroSubtitle;
        }
        
        setConfig(mergedConfig);
      } else {
        setConfig(DEFAULT_SITE_CONFIG);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'siteConfig/main');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateConfig = async (newConfig: SiteConfig) => {
    const path = 'siteConfig/main';
    try {
      await setDoc(doc(db, 'siteConfig', 'main'), newConfig);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return { config, loading, updateConfig };
}
