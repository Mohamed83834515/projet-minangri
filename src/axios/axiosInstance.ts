// import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL || "https://api.escuelajs.co/api/v1";

// export const publicInstance = axios.create({
//   baseURL: BASE_URL,
// });

// export const axiosInstance = axios.create({
//   baseURL: BASE_URL,
// });

// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value?: unknown) => void;
//   reject: (reason?: unknown) => void;
// }> = [];

// const processQueue = (error: AxiosError | null, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// const getToken = () => localStorage.getItem("token");
// const setToken = (token: string) => localStorage.setItem("token", token);
// const clearAuth = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("refreshToken");
// };

// const refreshTokenRequest = async (): Promise<string> => {
//   const refreshToken = localStorage.getItem("refreshToken");
//   if (!refreshToken) throw new Error("No refresh token available");

//   const { data } = await publicInstance.post("/auth/refresh", { refreshToken });
//   const newToken = data.token ?? data.access_token;
//   if (!newToken) throw new Error("Token non disponible après refresh");

//   setToken(newToken);
//   return newToken;
// };

// axiosInstance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const token = getToken();
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     if (config.data instanceof FormData) {
//       delete config.headers["Content-Type"];
//     } else {
//       config.headers["Content-Type"] = "application/json";
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     if (!error.response) {
//       return Promise.reject(new Error("Erreur réseau - Vérifiez votre connexion"));
//     }

//     if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//             }
//             return axiosInstance(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const newToken = await refreshTokenRequest();
//         processQueue(null, newToken);

//         if (originalRequest.headers) {
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         }
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         processQueue(error, null);
//         clearAuth();
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );


import { useProjectStore } from '@/stores/projetct-store'
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.escuelajs.co/api/v1'

export const publicInstance = axios.create({ baseURL: BASE_URL })

export const axiosInstance = axios.create({ baseURL: BASE_URL })

// ─── Token helpers ────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('token')
const setToken = (token: string) => localStorage.setItem('token', token)
const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}

// ─── Refresh queue ────────────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token)
  })
  failedQueue = []
}

const refreshTokenRequest = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('No refresh token available')

  const { data } = await publicInstance.post('/auth/refresh', { refreshToken })
  const newToken = data.token ?? data.access_token
  if (!newToken) throw new Error('Token non disponible après refresh')

  setToken(newToken)
  return newToken
}

// ─── Request interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Auth token
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 2. Projet actif → envoyé dans chaque requête
    const { activeProject } = useProjectStore.getState()
    if (activeProject && config.headers) {
      config.headers['X-Project-Id'] = activeProject.id
    }

    // 3. Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    } else {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!error.response) {
      return Promise.reject(new Error('Erreur réseau - Vérifiez votre connexion'))
    }

    if (error.response.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return axiosInstance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshTokenRequest()
        processQueue(null, newToken)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(error, null)
        clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)