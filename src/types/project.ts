// Temporary Project types - will be replaced by generated types from OpenAPI
export interface ProjectSettings {
  max_pages: number
  max_depth: number
  crawl_concurrency: number
  user_agent: string
  respect_robots_txt: boolean
  include_subdomains: boolean
  strip_query_params: boolean
  include_patterns: string[]
  exclude_patterns: string[]
  enable_js_rendering: boolean
  js_render_mode: string
  max_render_pages: number
  render_timeout_ms: number
  audit_frequency: string
  gsc_sync_frequency: string
  serp_refresh_frequency: string
  keep_audit_runs: number
  keep_serp_days: number
}

export interface ProjectBase {
  name: string
  seed_url: string
  description?: string | null
}

export interface ProjectCreate extends ProjectBase {
  settings?: ProjectSettings | null
}

export interface ProjectUpdate {
  name?: string | null
  seed_url?: string | null
  description?: string | null
  settings?: ProjectSettings | null
}

export interface ProjectPublic extends ProjectBase {
  id: string
  created_by_id: string
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
  last_audit_at: string | null
  last_gsc_sync_at: string | null
  last_serp_refresh_at: string | null
  last_links_snapshot_at: string | null
  last_ppc_sync_at: string | null
}

export interface ProjectsPublic {
  data: ProjectPublic[]
  count: number
}
