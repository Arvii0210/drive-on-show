import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { projectService, Project } from '../../services/Projectsservice';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await projectService.getAll();
    setProjects(data);
    setLoading(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      description: '',
    });
    setImageFile(null);
    setPreviewUrl(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || (!imageFile && !editingId)) {
      projectService.showToast('Title and image are required', false);
      return;
    }
    
    // Prepare form data
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('location', formData.location);
    submitData.append('description', formData.description);
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }
    
    let success = false;
    
    if (editingId) {
      success = await projectService.update(editingId, submitData);
    } else {
      success = await projectService.create(submitData);
    }
    
    if (success) {
      resetForm();
      setShowModal(false);
      fetchProjects();
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      location: project.location || '',
      description: project.description || '',
    });
    setPreviewUrl(project.image);
    setEditingId(project.id);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await projectService.confirmDelete();
    if (confirmed) {
      const success = await projectService.delete(id);
      if (success) {
        fetchProjects();
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-[60px] after:h-[3px] after:bg-primary after:rounded-full">
          Latest Projects Management
        </h2>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {/* Projects List */}
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
          {projects.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-default">
              <p className="text-textMuted text-lg">No projects found. Add your first project!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-white rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="rounded-t-2xl object-cover h-[180px] w-full"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-2 flex-grow">{project.description || ""}</p>
                    <p className="text-gray-500 text-sm mb-4">
                      {project.location && (
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {project.location}
                        </span>
                      )}
                    </p>
                    <div className="mt-auto flex justify-between">
                      <button 
                        onClick={() => handleEdit(project)}
                        className="flex items-center bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
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

      {/* Project Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-modal z-10 w-11/12 max-w-2xl p-6">
            <h3 className="text-xl font-bold text-primary mb-4">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="title" className="form-label">Project Name</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input min-h-[100px]"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="image" className="form-label">
                  {editingId ? 'Upload New Image (Optional)' : 'Upload Image'}
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="form-input"
                  accept="image/*"
                  required={!editingId}
                />
                {previewUrl && (
                  <div className="mt-3 text-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-[150px] rounded-lg inline-block border border-borderColor"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;