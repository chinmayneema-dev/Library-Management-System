import apiClient from './client';

export const changePassword = async ({ currentPassword, newPassword }) => {
  const { data } = await apiClient.post('/users/change-password', { currentPassword, newPassword });
  return data;
};







