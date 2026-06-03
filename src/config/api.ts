export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://testing-appbe.onrender.com/api';

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');
