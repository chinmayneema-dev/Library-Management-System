import apiClient from './client';

export const listBooks = async (params = {}) => {
  const { data } = await apiClient.get('/books', { params });
  return data;
};

export const searchBooks = async (params = {}) => {
  const { data } = await apiClient.get('/books/search', { params });
  return data;
};

export const addBook = async (payload) => {
  const { data } = await apiClient.post('/books', payload);
  return data;
};

export const updateBook = async (bookId, payload) => {
  const { data } = await apiClient.put(`/books/${bookId}`, payload);
  return data;
};

export const deleteBook = async (bookId) => {
  await apiClient.delete(`/books/${bookId}`);
};







