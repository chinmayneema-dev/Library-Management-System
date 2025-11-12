import apiClient from './client';

export const listBorrowRecords = async (params = {}) => {
  const { data } = await apiClient.get('/borrow', { params });
  return data;
};

export const issueBook = async (payload) => {
  const { data } = await apiClient.post('/borrow/issue', payload);
  return data;
};

export const returnBook = async (payload) => {
  const { data } = await apiClient.post('/borrow/return', payload);
  return data;
};







