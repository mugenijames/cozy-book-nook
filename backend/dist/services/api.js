"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getBooks = void 0;
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
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
const getBooks = () => apiFetch('/api/books');
exports.getBooks = getBooks;
const getBook = (id) => apiFetch(`/api/books/${id}`);
exports.getBook = getBook;
const createBook = (bookData) => apiFetch('/api/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
});
exports.createBook = createBook;
// Add updateBook, deleteBook similarly...
const updateBook = (id, bookData) => apiFetch(`/api/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
});
exports.updateBook = updateBook;
const deleteBook = (id) => apiFetch(`/api/books/${id}`, {
    method: 'DELETE',
});
exports.deleteBook = deleteBook;
