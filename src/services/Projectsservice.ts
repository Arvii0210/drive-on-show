import api from './api';
import Swal from 'sweetalert2';

export interface Project {
  id: number;
  title: string;
  image: string;
  location: string;
  description: string;
  createdAt: string;
  
}

export const projectService = {
  async getAll(): Promise<Project[]> {
    try {
      const response = await api.get('/latest-projects/all');
      return response.data as Project[];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async create(formData: FormData): Promise<boolean> {
    try {
      await api.post('/latest-projects/add', formData);
      this.showToast('Project created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating project:', error);
      this.showToast('Failed to create project', false);
      return false;
    }
  },

  async update(id: number, formData: FormData): Promise<boolean> {
    try {
      await api.put(`/latest-projects/update/${id}`, formData);
      this.showToast('Project updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      this.showToast('Failed to update project', false);
      return false;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await api.delete(`/latest-projects/${id}`);
      this.showToast('Project deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      this.showToast('Failed to delete project', false);
      return false;
    }
  },

  showToast(message: string, success: boolean = true) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: success ? 'success' : 'error',
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },

  async confirmDelete(): Promise<boolean> {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This project will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });
    
    return result.isConfirmed;
  }
};