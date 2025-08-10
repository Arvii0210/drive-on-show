
// service.ts
import { PersonFormData, PersonType } from '../models/people.model';

const API_BASE_URL = 'http://localhost:3000/api/persons';

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}


async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return fetch(url, options);
}

export async function createPerson(data: PersonFormData): Promise<any> {
  const formData = new FormData();

  // Append all fields (except arrays and files)
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'languages' && Array.isArray(value)) {
      // Send languages as individual form entries instead of JSON string
      value.forEach((lang, index) => {
        formData.append(`languages[${index}]`, lang);
      });
    } else if ((key === 'document' || key === 'profilePicture') && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value.toString());
    }
  });

  // personType must be uppercase string
  if (data.personType) {
    formData.set('personType', data.personType.toUpperCase());
  }

  const response = await fetchWithAuth(`${API_BASE_URL}/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.message || 'Failed to create person');
  }

  return response.json();
}

export async function updatePerson(id: number, data: Partial<PersonFormData>): Promise<any> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'languages' && Array.isArray(value)) {
      // Send languages as individual form entries instead of JSON string
      value.forEach((lang, index) => {
        formData.append(`languages[${index}]`, lang);
      });
    } else if ((key === 'document' || key === 'profilePicture') && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value.toString());
    }
  });

  const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.message || 'Failed to update person');
  }

  return response.json();
}

export async function getPersonById(id: number): Promise<any> {
  const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, { method: 'GET' });
  if (!response.ok) throw new Error('Person not found');
  return response.json();
}

export async function deletePerson(id: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete person');
}

export async function getAllPersons(params?: { personType?: string }): Promise<any[]> {
  const url = new URL(API_BASE_URL);
  if (params?.personType) {
    url.searchParams.append('personType', params.personType);
  }
  const response = await fetchWithAuth(url.toString(), { method: 'GET' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch persons');
  }
  const data = await response.json();
  // data is the full response object
  return data.data?.persons ?? [];
}

