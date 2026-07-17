const rawApi = import.meta.env.VITE_BACKEND_API || "https://pink-herring-957072.hostingersite.com";
export const backendApi = rawApi.replace(/\/$/, "");
