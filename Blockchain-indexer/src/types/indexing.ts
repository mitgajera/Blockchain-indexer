export interface IndexingConfig {
  id: number
  name: string
  nftBids: boolean
  tokenPrices: boolean
  borrowableTokens: boolean
  customAddresses: string[]
  webhookId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IndexingConfigForm {
  name: string
  nftBids: boolean
  tokenPrices: boolean
  borrowableTokens: boolean
  customAddresses: string[]
}

export interface IndexingLog {
  id: number
  userId: number
  eventType: string
  status: string
  message?: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface WebhookData {
  transactions: WebhookTransaction[]
}

export interface WebhookTransaction {
  type: string
  signature: string
  timestamp: number
  slot: number
  data: any
}

export interface IndexingStats {
  activeConfigs: number
  totalRecords: number
  recordsByType: {
    nftBids?: number
    tokenPrices?: number
    borrowableTokens?: number
  }
  activity: {
    date: string
    count: number
  }[]
}