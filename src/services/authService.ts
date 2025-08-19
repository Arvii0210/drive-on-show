import api from './api';
import Swal from 'sweetalert2';

export const authService = {
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await api.post<{ token: string }>('/admin/login', { username, password });
      
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  },

  async confirmLogout(): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, logout!'
    });
    
    return result.isConfirmed;
  }
};