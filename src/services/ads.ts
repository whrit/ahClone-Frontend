import { OpenAPI } from "@/client/core/OpenAPI"
import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "@/client/core/CancelablePromise"
import type {
  CampaignsResponse,
  SEOPPCOverlapResponse,
  AdsSyncResponse,
  CampaignParams,
  OverlapParams,
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

export class AdsService {
  /**
   * Get Campaigns
   * Get Google Ads campaign performance data.
   */
  public static getCampaigns(
    data: AdsGetCampaignsData
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
  public static getOverlap(
    data: AdsGetOverlapData
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
  public static triggerSync(
    data: AdsTriggerSyncData
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
