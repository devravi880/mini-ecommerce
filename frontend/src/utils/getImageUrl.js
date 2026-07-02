const API_BASE = import.meta.env.VITE_API_BASE_URL.replace('/api', '');

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE}${imagePath}`;
};

export default getImageUrl;
