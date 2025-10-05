export const REGION = {
  US: "us",
  EU: "eu",
  AU: "au",
  AP: "ap",
  SA: "sa",
  JP: "jp",
  IN: "in"
} as const

export const REGIONS = [
  REGION.US,
  REGION.EU,
  REGION.AU,
  REGION.AP,
  REGION.SA,
  REGION.JP,
  REGION.IN
] as const

export type ProxyRegion = (typeof REGIONS)[number]

export interface LocalProxyOptions {
  port?: number
  region: ProxyRegion
  username?: string
  password?: string
  verbose?: boolean
  ssl?: boolean
  logger?: {
    debug: (...args: unknown[]) => void
    info: (...args: unknown[]) => void
    warn: (...args: unknown[]) => void
    error: (...args: unknown[]) => void
  }
}
