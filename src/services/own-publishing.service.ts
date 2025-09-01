// src/services/own-publishing.service.ts
import {
  OwnPublishing,
  OwnPublishingListResponse,
  OwnPublishingCreatePayload,
  OwnPublishingUpdatePayload,
  OrderType,
} from "../models/own-publishing.model";

const API_BASE_URL =
  "http://localhost:3000/api/own-publishing";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

// Fetch wrapper to add Authorization header and JSON content type if body present
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : (options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Automatically add Content-Type json if body exists and header not already set
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export const OwnPublishingService = {
  async getAll(params?: {
    page?: number;
    limit?: number;
    personId?: number;
    bookId?: number;
    orderType?: OrderType;
  }): Promise<OwnPublishingListResponse> {
    // Convert params numbers to strings properly
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const res = await fetchWithAuth(
      `${API_BASE_URL}/?${queryParams.toString()}`,
      { method: "GET" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch own publishings: ${res.statusText}`);
    }
    const json: ApiResponse<OwnPublishingListResponse> = await res.json();
    return json.data;
  },

  async getById(id: number): Promise<OwnPublishing> {
  if (!id || id <= 0) throw new Error("Invalid ID");

  const res = await fetchWithAuth(`${API_BASE_URL}/${id}`, { method: "GET" });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || res.statusText);
  }

  // Backend sends { data: {...} }
  const raw = json.data || json;

  return raw as OwnPublishing;
},



  async create(payload: OwnPublishingCreatePayload): Promise<OwnPublishing> {
    const res = await fetchWithAuth(`${API_BASE_URL}/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to create own publishing: ${res.status} ${text}`);
    }
    const json: ApiResponse<OwnPublishing> = await res.json();
    return json.data;
  },

  async update(
  id: number,
  payload: OwnPublishingUpdatePayload
): Promise<OwnPublishing> {
  if (!id || id <= 0) throw new Error("Invalid ID provided");

  const res = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const json: ApiResponse<OwnPublishing> = await res.json();

  if (!res.ok) {
    throw new Error(
      `Failed to update own publishing: ${res.status} ${json.message || res.statusText}`
    );
  }

  return json.data;
},

async softDelete(id: number): Promise<{ message: string }> {
  if (!id || id <= 0) throw new Error("Invalid ID provided");

  const res = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  const json: ApiResponse<null> = await res.json();

  if (!res.ok) {
    throw new Error(
      `Failed to delete own publishing: ${res.status} ${json.message || res.statusText}`
    );
  }

  return { message: json.message || "Own publishing deleted successfully" };
},

};
