// dashboard.service.ts
export interface PeriodStats {
  total: number;
  last7Days: number;
  last15Days: number;
  last30Days: number;
}

export interface TotalsStats {
  persons: PeriodStats;
  books: PeriodStats;
  rights: PeriodStats;
  ownPublishings: PeriodStats;
}

export interface PersonByType {
  type: string;
  count: number;
}

export interface BookByCategory {
  category: string;
  count: number;
}

export interface RecentBook {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
  };
  createdAt: string;
  // Add other book properties as needed
}

export interface DashboardData {
  totals: TotalsStats;
  recentBooks: RecentBook[];
  personsByType: PersonByType[];
  booksByCategory: BookByCategory[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

const API_BASE = 'http://localhost:3000/api/admin';

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

async function fetchWithAuth(url: string, token?: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const updatedOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  return fetch(url, updatedOptions);
}

export async function fetchDashboardStats(token?: string): Promise<DashboardResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE}/dashboard`, token);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as DashboardResponse;
    return data;
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
}
