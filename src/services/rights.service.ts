import axios from 'axios';
import { RightsPayload, RightsType} from '@/models/rights.model';
const API_BASE = 'http://localhost:3000/api/rights';

// Types for filtering and payloads
export interface RightsFilters {
  page?: number;
  limit?: number;
  personId?: number;
  bookId?: number;
  rightsType?: RightsType;
}

export interface GetRightsResponse {
  status: string; // for UI usage only
  data: {
    rights: RightsPayload[];
  };
}




export const getRights = async (filters?: RightsFilters): Promise<GetRightsResponse> => {
  const response = await axios.get<GetRightsResponse>(`${API_BASE}`, {
    params: filters,
  });
  return response.data;
};


export const getRightById = async (id: number) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const createRight = async (data: RightsPayload) => {
  const response = await axios.post(`${API_BASE}`, data);
  return response.data;
};

export const updateRight = async (id: number, data: Partial<RightsPayload>) => {
  const response = await axios.put(`${API_BASE}/${id}`, data);
  return response.data;
};

export const deleteRight = async (id: number) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};


