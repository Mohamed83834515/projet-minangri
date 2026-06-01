import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

// URL de base pour les requêtes API, configurable via une variable d'environnement
const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://api.ruche-sectoriel.net/api'

// Instance Axios publique sans gestion des tokens
export const publicInstance = axios.create({
  baseURL: BASE_URL,
})

// Instance Axios principale avec gestion des tokens d'authentification et rafraîchissement automatique
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

// Variables pour gérer l'état de rafraîchissement du token et la file d'attente des requêtes en attente
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

// Fonction pour traiter la file d'attente des requêtes en attente de rafraîchissement du token
const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Fonctions pour gérer le token d'authentification dans le localStorage
const getToken = () => localStorage.getItem('token')
const setToken = (token: string) => localStorage.setItem('token', token)
const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}

// Fonction pour rafraîchir le token d'authentification
const refreshTokenRequest = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('No refresh token available')

  const { data } = await publicInstance.post('/auth/refresh', { refreshToken })
  const newToken = data.token ?? data.access_token
  if (!newToken) throw new Error('Token non disponible après refresh')

  setToken(newToken)
  return newToken
}

// Interceptor de requête pour ajouter le token d'authentification et gérer les Content-Type

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    } else {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de réponse pour gérer les erreurs 401 et rafraîchir le token

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!error.response) {
      return Promise.reject(
        new Error('Erreur réseau - Vérifiez votre connexion')
      )
    }

    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
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
