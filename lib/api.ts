import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  // You can add auth token here if needed
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Video API
export const videoApi = {
  // Get all videos with filters
  getVideos: (params?: {
    category?: string
    year?: string
    status?: string
    search?: string
  }) => api.get('/videos', { params }),

  // Get single video by ID
  getVideo: (id: string) => api.get(`/videos/${id}`),

  // Create new video
  createVideo: (data: any) => api.post('/videos', data),

  // Update video
  updateVideo: (id: string, data: any) => api.put(`/videos/${id}`, data),

  // Delete video
  deleteVideo: (id: string) => api.delete(`/videos/${id}`),

  // Update video status
  updateStatus: (id: string, status: string) => 
    api.patch(`/videos/${id}/status`, { status }),

  // Rate video
  rateVideo: (id: string, rating: number, comment?: string) =>
    api.post(`/videos/${id}/rate`, { rating, comment }),
}

// Auth API
export const authApi = {
  // Sign up new user
  signup: (data: {
    name: string
    email: string
    password: string
    department: string
  }) => api.post('/auth/signup', data),

  // Sign in user
  signin: (data: {
    email: string
    password: string
  }) => api.post('/auth/signin', data),

  // Sign out user
  signout: () => api.post('/auth/signout'),
}

// User API
export const userApi = {
  // Get current user profile
  getProfile: () => api.get('/users/profile'),

  // Update user profile
  updateProfile: (data: any) => api.put('/users/profile', data),

  // Get all users (admin only)
  getUsers: () => api.get('/users'),

  // Create user (admin only)
  createUser: (data: any) => api.post('/users', data),

  // Update user (admin only)
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),

  // Delete user (admin only)
  deleteUser: (id: string) => api.delete(`/users/${id}`),
}

// Upload API
export const uploadApi = {
  // Upload video file
  uploadVideo: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  },

  // Upload PowerPoint file
  uploadPowerPoint: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return api.post('/upload/powerpoint', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  },
}

// Statistics API
export const statsApi = {
  // Get dashboard statistics
  getDashboardStats: () => api.get('/stats/dashboard'),

  // Get video statistics
  getVideoStats: (videoId: string) => api.get(`/stats/videos/${videoId}`),

  // Get user statistics
  getUserStats: (userId: string) => api.get(`/stats/users/${userId}`),
}

export default api 