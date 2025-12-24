// GSC (Google Search Console) types matching backend models

export interface GSCPropertyPublic {
  id: string
  project_id: string
  site_url: string
  permission_level: string | null
  verified: boolean
  linked_at: string
  last_sync_at: string | null
  sync_status: string
  sync_error: string | null
  search_type: string
}

export interface GSCQueryRow {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface GSCQueriesResponse {
  data: GSCQueryRow[]
  count: number
}

export interface GSCPageRow {
  page: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface GSCPagesResponse {
  data: GSCPageRow[]
  count: number
}

export enum OpportunityType {
  LOW_CTR = "low_ctr",
  POSITION_8_20 = "position_8_20",
  RISING = "rising",
  FALLING = "falling",
}

export interface OpportunityRow {
  query: string
  impressions: number
  clicks: number
  ctr: number
  position: number
  opportunity_type: OpportunityType
  potential_clicks: number
}

export interface OpportunitiesResponse {
  data: OpportunityRow[]
  count: number
}

export interface ClusterPublic {
  id: string
  project_id: string
  label: string
  algorithm: string
  created_at: string
  total_clicks: number
  total_impressions: number
  avg_position: number
  query_count: number
}

export interface ClusterMemberPublic {
  id: string
  cluster_id: string
  query: string
  weight: number
}

export interface ClusterWithMembers extends ClusterPublic {
  members: ClusterMemberPublic[]
}

export interface ClustersResponse {
  data: ClusterPublic[]
  count: number
}

export interface ClusterDetailResponse extends ClusterPublic {
  members: ClusterMemberPublic[]
}

export interface GoogleIntegrationStatus {
  gsc_connected: boolean
  ads_connected: boolean
  gsc_email: string | null
  ads_email: string | null
}

export interface GSCPropertyListResponse {
  data: GSCPropertyPublic[]
  count: number
}

export interface LinkPropertyRequest {
  site_url: string
}

export interface TriggerBackfillRequest {
  days: number
}

export interface QueryParams {
  skip?: number
  limit?: number
  start_date?: string
  end_date?: string
  sort_by?: "clicks" | "impressions" | "ctr" | "position"
  sort_order?: "asc" | "desc"
}

export interface OpportunityParams extends QueryParams {
  opportunity_type?: OpportunityType
}
