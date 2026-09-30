import axios from "axios";
import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Public (login ke bina) - sirf tracking page ke liye
export const publicApi = axios.create({ baseURL });

// Har request me Clerk ka token apne aap lagta hai
export function useApi() {
  const { getToken } = useAuth();
  return useMemo(() => {
    const api = axios.create({ baseURL });
    api.interceptors.request.use(async (cfg) => {
      cfg.headers.Authorization = `Bearer ${await getToken()}`;
      return cfg;
    });
    return api;
  }, [getToken]);
}
