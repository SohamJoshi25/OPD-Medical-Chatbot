export const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
export const DEVELOPMENT =  import.meta.env.DEV 
export const BACKEND_URL =  DEVELOPMENT ?  "http://localhost:8000" : import.meta.env.BACKEND_URL;