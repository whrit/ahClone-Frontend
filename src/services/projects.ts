// Temporary ProjectsService - will be replaced by generated client

import type { Message } from "@/client"
import type { CancelablePromise } from "@/client/core/CancelablePromise"
import { OpenAPI } from "@/client/core/OpenAPI"
import { request as __request } from "@/client/core/request"
import type {
  ProjectCreate,
  ProjectPublic,
  ProjectsPublic,
  ProjectUpdate,
} from "@/types/project"

export interface ProjectsReadProjectsData {
  skip?: number
  limit?: number
}

export interface ProjectsCreateProjectData {
  requestBody: ProjectCreate
}

export interface ProjectsReadProjectData {
  id: string
}

export interface ProjectsUpdateProjectData {
  id: string
  requestBody: ProjectUpdate
}

export interface ProjectsDeleteProjectData {
  id: string
}

export class ProjectsService {
  /**
   * Read Projects
   * Retrieve projects.
   */
  public static readProjects(
    data: ProjectsReadProjectsData = {},
  ): CancelablePromise<ProjectsPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/",
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
   * Create Project
   * Create new project.
   */
  public static createProject(
    data: ProjectsCreateProjectData,
  ): CancelablePromise<ProjectPublic> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/v1/projects/",
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Read Project
   * Get project by ID.
   */
  public static readProject(
    data: ProjectsReadProjectData,
  ): CancelablePromise<ProjectPublic> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/projects/{id}",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Update Project
   * Update a project.
   */
  public static updateProject(
    data: ProjectsUpdateProjectData,
  ): CancelablePromise<ProjectPublic> {
    return __request(OpenAPI, {
      method: "PUT",
      url: "/api/v1/projects/{id}",
      path: {
        id: data.id,
      },
      body: data.requestBody,
      mediaType: "application/json",
      errors: {
        422: "Validation Error",
      },
    })
  }

  /**
   * Delete Project
   * Delete a project.
   */
  public static deleteProject(
    data: ProjectsDeleteProjectData,
  ): CancelablePromise<Message> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/v1/projects/{id}",
      path: {
        id: data.id,
      },
      errors: {
        422: "Validation Error",
      },
    })
  }
}
