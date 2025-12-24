// Traffic types for the Traffic Panel feature

export interface TrafficDataPoint {
  date: string
  ga4_sessions: number | null
  ga4_users: number | null
  gsc_clicks: number | null
  lcp: number | null // Largest Contentful Paint in seconds
  cls: number | null // Cumulative Layout Shift
}

export interface TrafficPanelResponse {
  data: TrafficDataPoint[]
  sources_available: {
    ga4: boolean
    gsc: boolean
    crux: boolean
  }
}

export interface TrafficSourcesResponse {
  ga4_connected: boolean
  gsc_connected: boolean
  crux_available: boolean
}

export interface CsvImportRequest {
  file: File
}

export interface CsvImportResponse {
  message: string
  rows_imported: number
}
