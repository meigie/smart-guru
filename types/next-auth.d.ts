import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: string
    department: 'AAD' | 'HIS' | 'RDD' | 'EDD' | 'HCD' | 'HR' | 'CIS' | 'BSP' | 'BIA'
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      department: 'AAD' | 'HIS' | 'RDD' | 'EDD' | 'HCD' | 'HR' | 'CIS' | 'BSP' | 'BIA'
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
  }
} 