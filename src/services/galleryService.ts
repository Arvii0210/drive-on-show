import api from './api';
import Swal from 'sweetalert2';

export interface GalleryItem {
  id: number;
  title: string;
  content: string;
  image: string;
}

export const galleryService = {
  async getAll(): Promise<GalleryItem[]> {
    try {
      const response = await api.get<GalleryItem[]>('/gallery/all');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      return [] as GalleryItem[];
    }
  },

  async create(formData: FormData): Promise<boolean> {
    try {
      await api.post('/gallery/add', formData);
      this.showToast('Gallery item added successfully!');
      return true;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      this.showToast('Failed to add gallery item', false);
      return false;
    }
  },

  async update(id: number, formData: FormData): Promise<boolean> {
    try {
      await api.put(`/gallery/update/${id}`, formData);
      this.showToast('Gallery item updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating gallery item:', error);
      this.showToast('Failed to update gallery item', false);
      return false;
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      await api.delete(`/gallery/delete/${id}`);
      this.showToast('Gallery item deleted successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      this.showToast('Failed to delete gallery item', false);
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
      text: 'This gallery item will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });
    
    return result.isConfirmed;
  }
};