import { 
  useState, useEffect, FormEvent, ChangeEvent, DragEvent 
} from 'react';
import { 
  PlusIcon, PencilIcon, TrashIcon, PhotoIcon, 
  XMarkIcon, // <-- Added import
  ArrowUpTrayIcon // <-- Added import
} from '@heroicons/react/24/outline';
import { galleryService, GalleryItem } from '../../services/galleryService';

const GalleryAdmin = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isModalAnimating, setIsModalAnimating] = useState(false);
  // State for drag-and-drop UI
  const [isDragging, setIsDragging] = useState(false); // <-- Missing state variable

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setIsModalAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsModalAnimating(false);
    }
  }, [showModal]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = await galleryService.getAll();
      setGallery(data);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setShowModal(true);
  
  // The correct closeModal function with animation handling
  const closeModal = () => { // <-- Missing function
    setIsModalAnimating(false);
    setTimeout(() => {
      setShowModal(false);
      resetForm();
    }, 300);
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      galleryService.showToast('Please select a valid image file.', false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  // All the missing drag-and-drop handler functions
  const handleDragEvents = (e: DragEvent<HTMLLabelElement>) => { // <-- Missing function
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => { // <-- Missing function
    handleDragEvents(e);
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => { // <-- Missing function
    handleDragEvents(e);
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => { // <-- Missing function
    handleDragEvents(e);
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => { // <-- Missing function
    setImageFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    removeImage();
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || (!imageFile && !editingId)) {
      galleryService.showToast('Title and image are required.', false);
      return;
    }
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    if (imageFile) submitData.append('image', imageFile);

    const success = editingId 
      ? await galleryService.update(editingId, submitData) 
      : await galleryService.create(submitData);

    if (success) {
      closeModal();
      fetchGallery();
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({ title: item.title, content: item.content || '' });
    setPreviewUrl(item.image);
    setEditingId(item.id);
    openModal();
  };

  const handleDelete = async (id: number) => {
    const confirmed = await galleryService.confirmDelete();
    if (confirmed) {
      const success = await galleryService.delete(id);
      if (success) fetchGallery();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[60px] after:h-[3px] after:bg-primary after:rounded-full">
          Gallery Management
        </h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Gallery Item
        </button>
      </div>

      {/* Gallery List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-2xl shadow-default p-4">
              <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 bg-gray-300 rounded w-20"></div>
                <div className="h-8 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {gallery.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-default">
              <p className="text-textMuted text-lg">No gallery items found. Add your first image!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-t-2xl object-cover h-[180px] w-full"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-2 flex-grow">{item.content || ""}</p>
                    <div className="mt-auto flex justify-between">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Gallery Form Modal */}
       {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ${isModalAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingId ? 'Edit Gallery Item' : 'Add New Item'}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* The single-column form you requested */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Section 1: Image Uploader */}
                <div>
                  <label className="form-label">Image</label>
                  {previewUrl ? (
                    <div className="relative group">
                      <img src={previewUrl} alt="Preview" className="w-full max-h-80 object-cover rounded-lg border border-gray-200" />
                      <button type="button" onClick={removeImage} className="absolute top-3 right-3 p-1.5 bg-white/80 text-gray-800 rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 backdrop-blur-sm" aria-label="Remove image">
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragEvents} onDrop={handleDrop} htmlFor="image-upload" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                      <div className="text-center">
                        <ArrowUpTrayIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-600"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, or GIF (Max. 10MB)</p>
                      </div>
                      <input id="image-upload" type="file" onChange={handleImageChange} className="hidden" accept="image/*" required={!editingId} />
                    </label>
                  )}
                </div>

                {/* Section 2: Title Input */}
                <div>
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="form-input" placeholder="e.g., Modern Villa Interior" required />
                </div>

                {/* Section 3: Description Input */}
                <div>
                  <label htmlFor="content" className="form-label">Description (Optional)</label>
                  <textarea id="content" name="content" value={formData.content} onChange={handleInputChange} className="form-input min-h-[120px]" placeholder="Add a short description about this image..."></textarea>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Save Changes' : 'Create Item'}</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;