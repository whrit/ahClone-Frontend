// Google Ads / PPC Types

export interface CampaignPerformance {
  campaign_id: string
  campaign_name: string
  impressions: number
  clicks: number
  cost_micros: number
  conversions: number
  ctr: number
  average_cpc_micros: number
  conversions_value: number
  status: string
}

export interface CampaignsResponse {
  data: CampaignPerformance[]
  count: number
  period_days: number
}

export interface SEOPPCOverlapKeyword {
  keyword: string
  paid_clicks: number
  paid_cost_micros: number
  organic_clicks: number
  organic_position: number
  overlap_type: "both" | "paid_only" | "organic_only"
  opportunity_score: number
}

export interface SEOPPCOverlapResponse {
  data: SEOPPCOverlapKeyword[]
  count: number
  summary: {
    total_keywords: number
    overlap_count: number
    paid_only_count: number
    organic_only_count: number
  }
}

export interface AdsSyncResponse {
  message: string
  task_id: string
}

export interface CampaignParams {
  period_days?: number
}

export interface OverlapParams {
  overlap_type?: "both" | "paid_only" | "organic_only"
  sort_by?: string
  sort_order?: "asc" | "desc"
  limit?: number
}
