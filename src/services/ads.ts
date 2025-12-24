import type { CancelablePromise } from "@/client/core/CancelablePromise"
import { OpenAPI } from "@/client/core/OpenAPI"
import { request as __request } from "@/client/core/request"
import type {
  AdsSyncResponse,
  CampaignParams,
  CampaignsResponse,
  OverlapParams,
  SEOPPCOverlapResponse,
} from "@/types/ads"

export interface AdsGetCampaignsData {
  projectId: string
  params?: CampaignParams
}

export interface AdsGetOverlapData {
  projectId: string
  params?: OverlapParams
}

export interface AdsTriggerSyncData {
  projectId: string
}

export namespace AdsService {
  /**
   * Get Campaigns
   * Get Google Ads campaign performance data.
   */
  export function getCampaigns(
    data: AdsGetCampaignsData,
  ): CancelablePromise<CampaignsResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/ads/campaigns",
      path: {
        project_id: data.projectId,
      },
      query: {
        period_days: data.params?.period_days,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get SEO/PPC Overlap
   * Get keyword overlap analysis between SEO and PPC.
   */
  export function getOverlap(
    data: AdsGetOverlapData,
  ): CancelablePromise<SEOPPCOverlapResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/ads/seo-overlap",
      path: {
        project_id: data.projectId,
      },
      query: {
        overlap_type: data.params?.overlap_type,
        sort_by: data.params?.sort_by,
        sort_order: data.params?.sort_order,
        limit: data.params?.limit,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Trigger Sync
   * Trigger a Google Ads data sync for the project.
   */
  export function triggerSync(
    data: AdsTriggerSyncData,
  ): CancelablePromise<AdsSyncResponse> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/{project_id}/ads/sync",
      path: {
        project_id: data.projectId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}
