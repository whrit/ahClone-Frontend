import type { CancelablePromise } from "@/client/core/CancelablePromise"
import { OpenAPI } from "@/client/core/OpenAPI"
import { request as __request } from "@/client/core/request"
import type {
  ClusterDetailResponse,
  ClustersResponse,
  GoogleIntegrationStatus,
  GSCPagesResponse,
  GSCPropertyListResponse,
  GSCPropertyPublic,
  GSCQueriesResponse,
  LinkPropertyRequest,
  OpportunitiesResponse,
  OpportunityParams,
  QueryParams,
  TriggerBackfillRequest,
} from "@/types/gsc"

export interface GSCListPropertiesData {
  projectId: string
}

export interface GSCLinkPropertyData {
  projectId: string
  requestBody: LinkPropertyRequest
}

export interface GSCUnlinkPropertyData {
  projectId: string
}

export interface GSCTriggerSyncData {
  projectId: string
}

export interface GSCTriggerBackfillData {
  projectId: string
  requestBody: TriggerBackfillRequest
}

export interface GSCGetQueriesData {
  projectId: string
  params?: QueryParams
}

export interface GSCGetPagesData {
  projectId: string
  params?: QueryParams
}

export interface GSCGetOpportunitiesData {
  projectId: string
  params?: OpportunityParams
}

export interface GSCGetClustersData {
  projectId: string
  skip?: number
  limit?: number
}

export interface GSCGetClusterDetailData {
  projectId: string
  clusterId: string
}

export interface GSCGenerateClustersData {
  projectId: string
}

export class GSCService {
  /**
   * List GSC Properties
   * Get all GSC properties for a project.
   */
  public static listProperties(
    data: GSCListPropertiesData,
  ): CancelablePromise<GSCPropertyListResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/gsc/properties",
      path: {
        project_id: data.projectId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Link GSC Property
   * Link a GSC property to the project.
   */
  public static linkProperty(
    data: GSCLinkPropertyData,
  ): CancelablePromise<GSCPropertyPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/{project_id}/gsc/properties",
      path: {
        project_id: data.projectId,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Unlink GSC Property
   * Unlink the GSC property from the project.
   */
  public static unlinkProperty(
    data: GSCUnlinkPropertyData,
  ): CancelablePromise<{ message: string }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/projects/{project_id}/gsc/properties",
      path: {
        project_id: data.projectId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Trigger Sync
   * Trigger a GSC data sync for the project.
   */
  public static triggerSync(
    data: GSCTriggerSyncData,
  ): CancelablePromise<{ message: string; task_id: string }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/{project_id}/gsc/sync",
      path: {
        project_id: data.projectId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Trigger Backfill
   * Trigger a GSC data backfill for the project.
   */
  public static triggerBackfill(
    data: GSCTriggerBackfillData,
  ): CancelablePromise<{ message: string; task_id: string }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/{project_id}/gsc/backfill",
      path: {
        project_id: data.projectId,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Queries
   * Get GSC query performance data.
   */
  public static getQueries(
    data: GSCGetQueriesData,
  ): CancelablePromise<GSCQueriesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/gsc/queries",
      path: {
        project_id: data.projectId,
      },
      query: {
        skip: data.params?.skip,
        limit: data.params?.limit,
        start_date: data.params?.start_date,
        end_date: data.params?.end_date,
        sort_by: data.params?.sort_by,
        sort_order: data.params?.sort_order,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Pages
   * Get GSC page performance data.
   */
  public static getPages(
    data: GSCGetPagesData,
  ): CancelablePromise<GSCPagesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/gsc/pages",
      path: {
        project_id: data.projectId,
      },
      query: {
        skip: data.params?.skip,
        limit: data.params?.limit,
        start_date: data.params?.start_date,
        end_date: data.params?.end_date,
        sort_by: data.params?.sort_by,
        sort_order: data.params?.sort_order,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Opportunities
   * Get SEO opportunities based on GSC data.
   */
  public static getOpportunities(
    data: GSCGetOpportunitiesData,
  ): CancelablePromise<OpportunitiesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/gsc/opportunities",
      path: {
        project_id: data.projectId,
      },
      query: {
        skip: data.params?.skip,
        limit: data.params?.limit,
        start_date: data.params?.start_date,
        end_date: data.params?.end_date,
        sort_by: data.params?.sort_by,
        sort_order: data.params?.sort_order,
        opportunity_type: data.params?.opportunity_type,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Clusters
   * Get keyword clusters for the project.
   */
  public static getClusters(
    data: GSCGetClustersData,
  ): CancelablePromise<ClustersResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/gsc/clusters",
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
   * Get Cluster Detail
   * Get a single cluster with its members.
   */
  public static getClusterDetail(
    data: GSCGetClusterDetailData,
  ): CancelablePromise<ClusterDetailResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/gsc/clusters/{cluster_id}",
      path: {
        project_id: data.projectId,
        cluster_id: data.clusterId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Generate Clusters
   * Generate keyword clusters for the project.
   */
  public static generateClusters(
    data: GSCGenerateClustersData,
  ): CancelablePromise<{ message: string; task_id: string }> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/{project_id}/gsc/clusters/generate",
      path: {
        project_id: data.projectId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Google Integration Status
   * Check if the user has connected their Google account.
   */
  public static getGoogleIntegrationStatus(): CancelablePromise<GoogleIntegrationStatus> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/integrations/google/status",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Start Google OAuth Flow
   * Get the authorization URL to connect Google Search Console.
   */
  public static startGoogleOAuth(
    service: "gsc" | "ads",
  ): CancelablePromise<{ authorization_url: string; state: string }> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/integrations/google/connect",
      query: {
        service,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Disconnect Google Integration
   * Disconnect a Google integration.
   */
  public static disconnectGoogleIntegration(
    service: "gsc" | "ads",
  ): CancelablePromise<{ message: string }> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/integrations/google/{service}",
      path: {
        service,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}
