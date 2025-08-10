// src/services/own-publishing.service.ts
import {
  OwnPublishing,
  OwnPublishingListResponse,
  OwnPublishingCreatePayload,
  OwnPublishingUpdatePayload,
  OrderType,
} from "../models/own-publishing.model";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

// Fetch wrapper to add Authorization header
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return fetch(url, options);
}

export const OwnPublishingService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    personId?: number;
    bookId?: number;
    orderType?: OrderType;
  }): Promise<OwnPublishingListResponse> {
    const query = new URLSearchParams(params as Record<string, string>);
    const res = await fetchWithAuth(
      `${API_BASE_URL}/own-publishing?${query.toString()}`,
      { method: "GET" }
    );

    if (!res.ok) throw new Error("Failed to fetch own publishings");
    const json: ApiResponse<OwnPublishingListResponse> = await res.json();
    return json.data;
  },

  async getById(id: number): Promise<OwnPublishing> {
    const res = await fetchWithAuth(`${API_BASE_URL}/own-publishing/${id}`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("Failed to fetch own publishing");
    const json: ApiResponse<OwnPublishing> = await res.json();
    return json.data;
  },

  async create(payload: OwnPublishingCreatePayload): Promise<OwnPublishing> {
    const res = await fetchWithAuth(`${API_BASE_URL}/own-publishing`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to create own publishing");
    const json: ApiResponse<OwnPublishing> = await res.json();
    return json.data;
  },

  async update(
    id: number,
    payload: OwnPublishingUpdatePayload
  ): Promise<OwnPublishing> {
    const res = await fetchWithAuth(`${API_BASE_URL}/own-publishing/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update own publishing");
    const json: ApiResponse<OwnPublishing> = await res.json();
    return json.data;
  },

  async softDelete(id: number): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE_URL}/own-publishing/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete own publishing");
  },
};
