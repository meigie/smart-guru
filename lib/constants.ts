import { Department } from "@/types"

// Department constants
export const DEPARTMENTS: Department[] = ['AAD', 'HIS', 'RDD', 'EDD', 'HCD', 'HR', 'CIS', 'BSP', 'BIA']

// Department display names (optional - for future use)
export const DEPARTMENT_NAMES: Record<Department, string> = {
  'AAD': 'AAD',
  'HIS': 'HIS', 
  'RDD': 'RDD',
  'EDD': 'EDD',
  'HCD': 'HCD',
  'HR': 'HR',
  'CIS': 'CIS',
  'BSP': 'BSP',
  'BIA': 'BIA'
}

// Video categories
export const VIDEO_CATEGORIES = ["React", "TypeScript", "Next.js", "CSS", "Vue.js", "JavaScript", "Node.js"]

// Video status options
export const VIDEO_STATUSES = ['draft', 'pending_review', 'published', 'archived'] as const

// App configuration
export const APP_CONFIG = {
  maxFileSize: 52428800, // 50MB
  allowedFileTypes: ['ppt', 'pptx'],
  storageType: 'local' as const,
  localStoragePath: './public/uploads'
} 