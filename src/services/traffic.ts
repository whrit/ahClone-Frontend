import type { CancelablePromise } from "@/client/core/CancelablePromise"
import { OpenAPI } from "@/client/core/OpenAPI"
import { request as __request } from "@/client/core/request"
import type {
  CsvImportResponse,
  TrafficPanelResponse,
  TrafficSourcesResponse,
} from "@/types/traffic"

export interface TrafficGetPanelData {
  projectId: string
  period?: 7 | 14 | 28 | 90
}

export interface TrafficGetSourcesData {
  projectId: string
}

export interface TrafficImportCsvData {
  projectId: string
  file: File
}

export namespace TrafficService {
  /**
   * Get Traffic Panel Data
   * Get multi-source traffic data for the specified period.
   */
  export function getPanel(
    data: TrafficGetPanelData,
  ): CancelablePromise<TrafficPanelResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/traffic/panel",
      path: {
        project_id: data.projectId,
      },
      query: {
        period_days: data.period || 28,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Traffic Sources
   * Get available traffic data sources for the project.
   */
  export function getSources(
    data: TrafficGetSourcesData,
  ): CancelablePromise<TrafficSourcesResponse> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{project_id}/traffic/sources",
      path: {
        project_id: data.projectId,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Import CSV Traffic Data
   * Import traffic data from a CSV file.
   */
  export function importCsv(
    data: TrafficImportCsvData,
  ): CancelablePromise<CsvImportResponse> {
    const formData = new FormData()
    formData.append("file", data.file)

    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/{project_id}/traffic/import-csv",
      path: {
        project_id: data.projectId,
      },
      body: formData,
      mediaType: "multipart/form-data",
      errors: {
        422: "Validation Error",
      },
    })
  }
}
