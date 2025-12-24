/**
 * Links (Backlinks) Types
 *
 * TypeScript types for backlinks, referring domains, anchor texts,
 * and competitive analysis API responses.
 */

// ==================== API Response Models ====================

export interface RefDomainRow {
  ref_domain: string
  backlinks: number
  dofollow: number
  nofollow: number
  first_seen: string
  last_seen: string
}

export interface RefDomainsResponse {
  data: RefDomainRow[]
  total: number
}

export interface BacklinkRow {
  source_url: string
  target_url: string
  source_domain: string
  anchor_text: string | null
  is_nofollow: boolean
  first_seen: string
  last_seen: string
}

export interface BacklinksResponse {
  data: BacklinkRow[]
  total: number
}

export interface AnchorRow {
  anchor_text: string
  backlinks: number
  ref_domains: number
}

export interface AnchorsResponse {
  data: AnchorRow[]
  total: number
}

export interface OverlapDomain {
  domain: string
  links_to_a: number
  links_to_b: number
  total_backlinks: number
}

export interface OverlapResponse {
  data: OverlapDomain[]
  total: number
}

export interface IntersectDomain {
  domain: string
  backlinks_count: number
  dofollow_count: number
  nofollow_count: number
}

export interface IntersectResponse {
  data: IntersectDomain[]
  total: number
}

// ==================== Service Request Parameters ====================

export interface GetRefDomainsParams {
  domain: string
  skip?: number
  limit?: number
}

export interface GetBacklinksParams {
  domain: string
  ref_domain?: string
  skip?: number
  limit?: number
}

export interface GetAnchorsParams {
  domain: string
  skip?: number
  limit?: number
}

export interface GetOverlapParams {
  domain: string
  competitors: string[]
}

export interface GetIntersectParams {
  domain: string
  competitors: string[]
}
