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
  mainFeatures?: { title: string; description: string }[];
  detailedDescription?: string;
  advantages?: { title: string; description: string }[];
  recommendedIndustries?: string[];
  caution?: string;
  customizedInfo?: { description: string; items: string[] };
}

export const fetchPalletWrappers = async (retries = 3): Promise<PalletWrapper[]> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch("/api/wrappers");
      if (!response.ok) throw new Error(`Failed to fetch wrappers: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Retry ${i + 1} for wrappers...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return [];
};

export const savePalletWrappers = async (data: PalletWrapper[]): Promise<void> => {
  const response = await fetch("/api/wrappers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to save wrappers");
};

// This is just a placeholder for types, we'll fetch real data in components
export const palletWrappersData: PalletWrapper[] = [];
