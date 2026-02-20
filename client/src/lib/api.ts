import { auth } from './firebase';

// Force the API URL to be absolute with https
const API_URL = 'https://echochat-production.up.railway.app/api';

// Always return the full URL
const getApiUrl = () => API_URL;

async function getAuthToken() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fullUrl = `${getApiUrl()}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const serverAPI = {
  getAll: () => fetchWithAuth('/servers'),
  getOne: (id: string) => fetchWithAuth(`/servers/${id}`),
  create: (data: { name: string; description?: string; icon?: string }) =>
    fetchWithAuth('/servers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  join: (id: string) => fetchWithAuth(`/servers/${id}/join`, { method: 'POST' }),
  leave: (id: string) => fetchWithAuth(`/servers/${id}/leave`, { method: 'DELETE' })
};

export const channelAPI = {
  getMessages: (channelId: string, limit = 50) =>
    fetchWithAuth(`/channels/${channelId}/messages?limit=${limit}`),
  create: (data: { name: string; type: string; serverId: string; topic?: string }) =>
    fetchWithAuth('/channels', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};

export const messageAPI = {
  edit: (messageId: string, content: string) =>
    fetchWithAuth(`/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    }),
  delete: (messageId: string) =>
    fetchWithAuth(`/messages/${messageId}`, { method: 'DELETE' }),
  addReaction: (messageId: string, emoji: string) =>
    fetchWithAuth(`/messages/${messageId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ emoji })
    })
};

export const userAPI = {
  getProfile: (userId: string) => fetchWithAuth(`/users/${userId}`),
  updateProfile: (data: { displayName?: string; bio?: string; avatar?: string; status?: string }) =>
    fetchWithAuth('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
};

export const dmAPI = {
  getAll: () => fetchWithAuth('/dm'),
  send: (data: { receiverId: string; content: string }) =>
    fetchWithAuth('/dm', {
      method: 'POST',
      body: JSON.stringify(data)
    })
};
