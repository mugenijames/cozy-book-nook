const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Generic fetch wrapper
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed: ${response.status}`);
  }

  return response.json();
};

export const getBooks = () => apiFetch('/api/books');
export const getBook = (id: string) => apiFetch(`/api/books/${id}`);
export const createBook = (bookData: any) =>
  apiFetch('/api/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });

// Add updateBook, deleteBook similarly...
export const updateBook = (id: string, bookData: any) =>
  apiFetch(`/api/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  });

export const deleteBook = (id: string) =>
  apiFetch(`/api/books/${id}`, {
    method: 'DELETE',
  });