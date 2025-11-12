import apiClient from './client';

export const listMembers = async (params = {}) => {
  const { data } = await apiClient.get('/members', { params });
  return data;
};

export const addMember = async (payload) => {
  const { data } = await apiClient.post('/members', payload);
  return data;
};

export const getMember = async (memberId) => {
  const { data } = await apiClient.get(`/members/${memberId}`);
  return data;
};

export const getMemberHistory = async (memberId) => {
  const { data } = await apiClient.get(`/members/${memberId}/history`);
  return data;
};







