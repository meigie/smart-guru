export type Department = 'AAD' | 'HIS' | 'RDD' | 'EDD' | 'HCD' | 'HR' | 'CIS' | 'BSP' | 'BIA'

export interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  department: Department
  createdAt: Date
}

export interface Video {
  id: string
  title: string
  description: string
  duration: number // in seconds
  thumbnailUrl: string
  videoUrl: string
  category: string
  year: number
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED'
  authorId: string
  author: User
  createdAt: Date
  updatedAt: Date
  averageRating: number
  totalRatings: number
  viewCount: number
}

export interface Rating {
  id: string
  videoId: string
  userId: string
  rating: number // 1-5 stars
  comment?: string
  createdAt: Date
}

export interface VideoView {
  id: string
  videoId: string
  userId: string
  watchedAt: Date
  watchDuration: number // in seconds
}

export interface Course {
  id: string
  name: string
  description: string
  category: string
  videos: Video[]
  enrolledUsers: string[]
  createdAt: Date
}

export interface SearchFilters {
  year?: number
  category?: string
  searchTerm?: string
  status?: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED'
} 