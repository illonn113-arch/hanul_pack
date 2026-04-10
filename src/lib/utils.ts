import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return '';
  
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) return url;
  
  // Standard watch URL or short URL
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\s?]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  
  return url;
};

export const getYoutubeThumbnail = (url: string) => {
  if (!url) return null;
  
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([^&\s?]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://img.youtube.com/vi/${watchMatch[1]}/mqdefault.jpg`;
  }
  
  return null;
};
