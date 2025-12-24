import { OpenAPI } from "@/client/core/OpenAPI"
import { request as __request } from "@/client/core/request"
import type { CancelablePromise } from "@/client/core/CancelablePromise"
import type {
  AuditRunPublic,
  AuditRunsPublic,
  AuditIssuesPublic,
  CrawledPagesPublic,
  CrawledPagePublic,
  IssueSeverity,
  IssueType,
} from "@/types/audit"

export interface AuditsStartAuditData {
  projectId: string
}

export interface AuditsListAuditsData {
  projectId: string
  skip?: number
  limit?: number
}

export interface AuditsGetAuditData {
  projectId: string
  auditId: string
}

export interface AuditsGetAuditIssuesData {
  projectId: string
  auditId: string
  skip?: number
  limit?: number
  severity?: IssueSeverity
  issueType?: IssueType
  isNew?: boolean
}

export interface AuditsGetAuditPagesData {
  projectId: string
  auditId: string
  skip?: number
  limit?: number
  statusCode?: number
  isRendered?: boolean
}

export interface AuditsGetPageDetailData {
  projectId: string
  auditId: string
  pageId: string
}

export class AuditsService {
  /**
   * Start Audit
   * Create new audit run and queue it for execution.
   */
  public static startAudit(
    data: AuditsStartAuditData
  ): CancelablePromise<AuditRunPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/{project_id}/audits/",
      path: {
        project_id: data.projectId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * List Audits
   * List all audit runs for a project with pagination.
   */
  public static listAudits(
    data: AuditsListAuditsData
  ): CancelablePromise<AuditRunsPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/audits/",
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
   * Get Audit
   * Get a single audit run by ID.
   */
  public static getAudit(
    data: AuditsGetAuditData
  ): CancelablePromise<AuditRunPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/audits/{audit_id}",
      path: {
        project_id: data.projectId,
        audit_id: data.auditId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Audit Issues
   * Get issues for an audit run with optional filters.
   */
  public static getAuditIssues(
    data: AuditsGetAuditIssuesData
  ): CancelablePromise<AuditIssuesPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/audits/{audit_id}/issues",
      path: {
        project_id: data.projectId,
        audit_id: data.auditId,
      },
      query: {
        skip: data.skip,
        limit: data.limit,
        severity: data.severity,
        issue_type: data.issueType,
        is_new: data.isNew,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Audit Pages
   * Get crawled pages for an audit run with optional filters.
   */
  public static getAuditPages(
    data: AuditsGetAuditPagesData
  ): CancelablePromise<CrawledPagesPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/audits/{audit_id}/pages",
      path: {
        project_id: data.projectId,
        audit_id: data.auditId,
      },
      query: {
        skip: data.skip,
        limit: data.limit,
        status_code: data.statusCode,
        is_rendered: data.isRendered,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Page Detail
   * Get a single crawled page by ID.
   */
  public static getPageDetail(
    data: AuditsGetPageDetailData
  ): CancelablePromise<CrawledPagePublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/audits/{audit_id}/pages/{page_id}",
      path: {
        project_id: data.projectId,
        audit_id: data.auditId,
        page_id: data.pageId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get export URL for audit issues CSV
   */
  public static getExportIssuesUrl(
    projectId: string,
    auditId: string,
    filters?: {
      severity?: IssueSeverity
      issueType?: IssueType
      isNew?: boolean
    }
  ): string {
    const params = new URLSearchParams()
    if (filters?.severity) params.append("severity", filters.severity)
    if (filters?.issueType) params.append("issue_type", filters.issueType)
    if (filters?.isNew !== undefined)
      params.append("is_new", String(filters.isNew))

    const queryString = params.toString()
    const baseUrl = `${OpenAPI.BASE}/api/v1/projects/${projectId}/audits/${auditId}/export/issues.csv`
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }
}
