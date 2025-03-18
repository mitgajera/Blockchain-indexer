export interface DatabaseConnection {
  id: number
  host: string
  port: number
  database: string
  username: string
  password?: string
  ssl: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseConnectionForm {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl: boolean
}

export interface TestConnectionResult {
  success: boolean
  message: string
  error?: string
}