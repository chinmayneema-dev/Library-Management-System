export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
};

export const formatStatus = (status) => {
  if (!status) return '—';
  return status.charAt(0) + status.slice(1).toLowerCase();
};







