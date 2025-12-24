import type { CancelablePromise } from "@/client/core/CancelablePromise"
import { OpenAPI } from "@/client/core/OpenAPI"
import { request as __request } from "@/client/core/request"

// Types based on backend models
export interface KeywordTarget {
  id: string
  project_id: string
  keyword: string
  locale: string
  device: "desktop" | "mobile" | "tablet"
  search_engine: "google" | "bing"
  provider_key: string
  refresh_frequency_hours: number
  is_active: boolean
  latest_position: number | null
  position_change: number | null
  created_at: string
  updated_at: string
  last_refresh_at: string | null
  last_refresh_status: string | null
}

export interface KeywordTargetsPublic {
  data: KeywordTarget[]
  count: number
}

export interface KeywordTargetCreate {
  keyword: string
  locale: string
  device: "desktop" | "mobile" | "tablet"
  search_engine?: "google" | "bing"
  provider_key?: string
  refresh_frequency_hours?: number
}

export interface RankObservation {
  id: string
  keyword_target_id: string
  observed_at: string
  rank: number
  url: string | null
  domain: string | null
  title: string | null
  snippet: string | null
  status: "pending" | "success" | "failed" | "rate_limited"
}

export interface RankObservationsPublic {
  data: RankObservation[]
  count: number
}

export interface SerpResult {
  position: number
  url: string
  domain: string
  title: string
  snippet: string
  displayed_url: string | null
}

export interface SerpSnapshot {
  id: string
  keyword_target_id: string
  captured_at: string
  results: SerpResult[]
  total_results: number | null
}

export interface SerpSnapshotsPublic {
  data: SerpSnapshot[]
  count: number
}

export interface ListKeywordTargetsData {
  projectId: string
  skip?: number
  limit?: number
}

export interface GetKeywordTargetData {
  projectId: string
  keywordId: string
}

export interface CreateKeywordTargetData {
  projectId: string
  body: KeywordTargetCreate
}

export interface RefreshKeywordData {
  projectId: string
  keywordId: string
}

export interface GetRankHistoryData {
  projectId: string
  keywordId: string
  skip?: number
  limit?: number
}

export interface GetSerpSnapshotsData {
  projectId: string
  keywordId: string
  skip?: number
  limit?: number
}

export interface GetLatestSnapshotData {
  projectId: string
  keywordId: string
}

export namespace SerpService {
  /**
   * List Keyword Targets
   * List all tracked keywords for a project.
   */
  export function listKeywordTargets(
    data: ListKeywordTargetsData,
  ): CancelablePromise<KeywordTargetsPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/serp/keywords",
      path: {
        project_id: data.projectId,
      },
      query: {
        skip: data.skip,
        limit: data.limit,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Keyword Target
   * Get a single tracked keyword by ID.
   */
  export function getKeywordTarget(
    data: GetKeywordTargetData,
  ): CancelablePromise<KeywordTarget> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/serp/keywords/{keyword_id}",
      path: {
        project_id: data.projectId,
        keyword_id: data.keywordId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Create Keyword Target
   * Add a new keyword to track.
   */
  export function createKeywordTarget(
    data: CreateKeywordTargetData,
  ): CancelablePromise<KeywordTarget> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/{project_id}/serp/keywords",
      path: {
        project_id: data.projectId,
      },
      body: data.body,
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Refresh Keyword
   * Trigger a manual refresh of keyword position.
   */
  export function refreshKeyword(
    data: RefreshKeywordData,
  ): CancelablePromise<KeywordTarget> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/{project_id}/serp/keywords/{keyword_id}/refresh",
      path: {
        project_id: data.projectId,
        keyword_id: data.keywordId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Rank History
   * Get historical rank observations for a keyword.
   */
  export function getRankHistory(
    data: GetRankHistoryData,
  ): CancelablePromise<RankObservationsPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/serp/keywords/{keyword_id}/history",
      path: {
        project_id: data.projectId,
        keyword_id: data.keywordId,
      },
      query: {
        skip: data.skip,
        limit: data.limit,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get SERP Snapshots
   * Get SERP snapshots for a keyword.
   */
  export function getSerpSnapshots(
    data: GetSerpSnapshotsData,
  ): CancelablePromise<SerpSnapshotsPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/serp/keywords/{keyword_id}/snapshots",
      path: {
        project_id: data.projectId,
        keyword_id: data.keywordId,
      },
      query: {
        skip: data.skip,
        limit: data.limit,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Latest Snapshot
   * Get the most recent SERP snapshot for a keyword.
   */
  export function getLatestSnapshot(
    data: GetLatestSnapshotData,
  ): CancelablePromise<SerpSnapshot> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/serp/keywords/{keyword_id}/snapshots/latest",
      path: {
        project_id: data.projectId,
        keyword_id: data.keywordId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}
