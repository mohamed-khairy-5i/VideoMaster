import axios from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.params) {
      config.params._t = Date.now()
    } else {
      config.params = { _t: Date.now() }
    }
    
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message
    })

    // Handle common error cases
    if (error.code === 'ECONNABORTED') {
      error.message = 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.'
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'خطأ في الشبكة. تأكد من اتصالك بالإنترنت.'
    } else if (error.response?.status === 429) {
      error.message = 'تم تجاوز حد الطلبات. يرجى الانتظار قليلاً قبل المحاولة مرة أخرى.'
    } else if (error.response?.status >= 500) {
      error.message = 'خطأ في الخادم. يرجى المحاولة لاحقاً.'
    }

    return Promise.reject(error)
  }
)

// Video API endpoints
export const videoApi = {
  // Extract video information
  extractInfo: (url: string) =>
    api.post('/info/extract', { url }),

  // Validate URL
  validateUrl: (url: string) =>
    api.post('/info/validate', { url }),

  // Get supported platforms
  getPlatforms: () =>
    api.get('/info/platforms'),

  // Get available formats
  getFormats: () =>
    api.get('/info/formats'),

  // Prepare download
  prepareDownload: (url: string, format: string = 'mp4', quality: string = '720p') =>
    api.post('/download/prepare', { url, format, quality }),

  // Batch download (future feature)
  prepareBatchDownload: (urls: string[], format: string = 'mp4', quality: string = '720p') =>
    api.post('/download/batch', { urls, format, quality }),

  // Get download status
  getDownloadStatus: (id: string) =>
    api.get(`/download/status/${id}`),

  // Get download history
  getDownloadHistory: (page: number = 1, limit: number = 10) =>
    api.get('/download/history', { params: { page, limit } })
}

// Health API endpoints
export const healthApi = {
  // Basic health check
  check: () =>
    api.get('/health'),

  // Detailed health check
  detailed: () =>
    api.get('/health/detailed')
}

// Utility functions
export const apiUtils = {
  // Check if API is available
  isApiAvailable: async (): Promise<boolean> => {
    try {
      await healthApi.check()
      return true
    } catch (error) {
      console.error('API is not available:', error)
      return false
    }
  },

  // Get API status
  getStatus: async () => {
    try {
      const response = await healthApi.detailed()
      return {
        available: true,
        ...response.data
      }
    } catch (error) {
      return {
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  },

  // Test URL validation
  testUrl: async (url: string) => {
    try {
      const response = await videoApi.validateUrl(url)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default api