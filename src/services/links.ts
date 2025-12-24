/**
 * LinksService - Backlinks and Referring Domains API Service
 *
 * Provides methods for:
 * - Fetching referring domains
 * - Fetching individual backlinks
 * - Analyzing anchor text distribution
 * - Competitive overlap analysis
 * - Link building opportunities (intersect)
 */

import type { CancelablePromise } from "@/client/core/CancelablePromise"
import { OpenAPI } from "@/client/core/OpenAPI"
import { request as __request } from "@/client/core/request"
import type {
  AnchorsResponse,
  BacklinksResponse,
  GetAnchorsParams,
  GetBacklinksParams,
  GetIntersectParams,
  GetOverlapParams,
  GetRefDomainsParams,
  IntersectResponse,
  OverlapResponse,
  RefDomainsResponse,
} from "@/types/links"

export class LinksService {
  /**
   * Get Referring Domains
   *
   * Fetches a list of domains that link to the target domain,
   * along with backlink counts and dofollow/nofollow splits.
   *
   * @param params - Request parameters including domain and pagination
   * @returns Promise with referring domains data
   */
  public static getRefDomains(
    params: GetRefDomainsParams,
  ): CancelablePromise<RefDomainsResponse> {
    const { domain, skip = 0, limit = 100 } = params

    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/links/domain/{domain}/refdomains",
      path: {
        domain: domain,
      },
      query: {
        skip: skip,
        limit: limit,
      },
      errors: {
        404: "No completed link snapshot found",
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Backlinks
   *
   * Fetches individual backlink records (source URL -> target URL pairs).
   * Optionally filter by referring domain.
   *
   * @param params - Request parameters including domain, optional ref_domain filter, and pagination
   * @returns Promise with backlinks data
   */
  public static getBacklinks(
    params: GetBacklinksParams,
  ): CancelablePromise<BacklinksResponse> {
    const { domain, ref_domain, skip = 0, limit = 100 } = params

    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/links/domain/{domain}/backlinks",
      path: {
        domain: domain,
      },
      query: {
        ref_domain: ref_domain,
        skip: skip,
        limit: limit,
      },
      errors: {
        404: "No completed link snapshot found",
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Anchor Texts
   *
   * Fetches anchor text distribution for a target domain,
   * showing anchor texts used in backlinks along with
   * backlink and referring domain counts.
   *
   * @param params - Request parameters including domain and pagination
   * @returns Promise with anchor text data
   */
  public static getAnchorTexts(
    params: GetAnchorsParams,
  ): CancelablePromise<AnchorsResponse> {
    const { domain, skip = 0, limit = 100 } = params

    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/links/domain/{domain}/anchors",
      path: {
        domain: domain,
      },
      query: {
        skip: skip,
        limit: limit,
      },
      errors: {
        404: "No completed link snapshot found",
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Competitor Overlap
   *
   * Finds domains that link to both the target domain and competitor domains.
   * This identifies shared referring domains, which can indicate
   * industry-relevant sites or partnership opportunities.
   *
   * @param params - Request parameters including domain and competitor list
   * @returns Promise with overlap analysis data
   */
  public static getCompetitorOverlap(
    params: GetOverlapParams,
  ): CancelablePromise<OverlapResponse> {
    const { domain, competitors } = params

    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/links/domain/{domain}/overlap",
      path: {
        domain: domain,
      },
      query: {
        competitors: competitors.join(","),
      },
      errors: {
        404: "No completed link snapshot found",
        422: "Validation Error",
      },
    })
  }

  /**
   * Get Competitor Gap (Intersect)
   *
   * Finds domains that link to competitors but NOT to the target domain.
   * These are link building opportunities - sites that already link
   * to similar/competing content but haven't linked to the target yet.
   *
   * @param params - Request parameters including domain and competitor list
   * @returns Promise with link gap analysis data
   */
  public static getCompetitorGap(
    params: GetIntersectParams,
  ): CancelablePromise<IntersectResponse> {
    const { domain, competitors } = params

    return __request(OpenAPI, {
      method: "GET",
      url: "/api/v1/links/domain/{domain}/intersect",
      path: {
        domain: domain,
      },
      query: {
        competitors: competitors.join(","),
      },
      errors: {
        404: "No completed link snapshot found",
        422: "Validation Error",
      },
    })
  }
}
