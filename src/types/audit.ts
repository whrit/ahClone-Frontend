// Audit types matching backend models

export enum AuditStatus {
  QUEUED = "queued",
  CRAWLING = "crawling",
  RENDERING = "rendering",
  ANALYZING = "analyzing",
  DIFFING = "diffing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum IssueSeverity {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum IssueType {
  // Critical
  SERVER_ERROR_5XX = "server_error_5xx",
  REDIRECT_LOOP = "redirect_loop",
  REDIRECT_CHAIN = "redirect_chain",
  BROKEN_INTERNAL_LINK = "broken_internal_link",

  // High
  CLIENT_ERROR_4XX = "client_error_4xx",
  MISSING_TITLE = "missing_title",
  DUPLICATE_TITLE = "duplicate_title",
  MISSING_META_DESCRIPTION = "missing_meta_description",

  // Medium
  TITLE_TOO_LONG = "title_too_long",
  TITLE_TOO_SHORT = "title_too_short",
  META_DESC_TOO_LONG = "meta_desc_too_long",
  META_DESC_TOO_SHORT = "meta_desc_too_short",
  MISSING_H1 = "missing_h1",
  MULTIPLE_H1 = "multiple_h1",
  MISSING_CANONICAL = "missing_canonical",
  CANONICAL_MISMATCH = "canonical_mismatch",
  NON_HTTPS = "non_https",

  // Low
  THIN_CONTENT = "thin_content",
  ORPHAN_PAGE = "orphan_page",
}

export interface AuditRunStats {
  total_pages: number
  pages_ok: number
  pages_redirect: number
  pages_error: number
  total_issues: number
  issues_critical: number
  issues_high: number
  issues_medium: number
  issues_low: number
}

export interface AuditRunPublic {
  id: string
  project_id: string
  status: AuditStatus
  config: Record<string, any>
  stats: AuditRunStats | null
  progress_pct: number
  progress_message: string | null
  started_at: string | null
  finished_at: string | null
  error_message: string | null
  created_at: string
}

export interface AuditRunsPublic {
  data: AuditRunPublic[]
  count: number
}

export interface CrawledPagePublic {
  id: string
  audit_run_id: string
  url: string
  final_url: string
  depth: number
  status_code: number
  content_type: string | null
  response_time_ms: number | null
  redirect_chain: Record<string, any>[] | null
  title: string | null
  meta_description: string | null
  canonical: string | null
  h1_count: number | null
  first_h1: string | null
  word_count: number | null
  meta_robots: string | null
  is_rendered: boolean
  rendered_at: string | null
  rendered_title: string | null
  rendered_meta_description: string | null
  rendered_h1_count: number | null
  rendered_word_count: number | null
  content_hash: string | null
  crawled_at: string
}

export interface CrawledPagesPublic {
  data: CrawledPagePublic[]
  count: number
}

export interface AuditIssuePublic {
  id: string
  audit_run_id: string
  page_url: string
  issue_type: IssueType
  severity: IssueSeverity
  details: Record<string, any>
  first_seen_run_id: string | null
  is_new: boolean
}

export interface AuditIssuesPublic {
  data: AuditIssuePublic[]
  count: number
}
