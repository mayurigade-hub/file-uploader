import axios from 'axios';

const API = import.meta.env.VITE_API_URL;
const API_BASE_URL = `${API}/api/auth`;

export interface AuthResponse {
  token: string;
  username: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('username', response.data.username);
    sessionStorage.setItem('name', response.data.name);
    return response.data;
  },

  register: async (
    name: string,
    username: string,
    email: string,
    phone: string,
    password: string
  ): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/register`, { name, username, email, phone, password });
    return response.data;
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('name');
  },

  getToken: () => sessionStorage.getItem('token'),
  getUsername: () => sessionStorage.getItem('username'),
  getName: () => sessionStorage.getItem('name'),
  isAuthenticated: () => !!sessionStorage.getItem('token'),

  getProfile: async (): Promise<any> => {
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<any> => {
    const token = sessionStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/change-password`,
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
