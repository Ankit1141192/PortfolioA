const rawApi = import.meta.env.VITE_BACKEND_API || "https://appliedjob1.onrender.com/";
export const backendApi = rawApi.replace(/\/$/, "");
