import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { projectService } from '../../services/Projectsservice';
import { galleryService } from '../../services/galleryService';

const Dashboard = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const projects = await projectService.getAll();
        const gallery = await galleryService.getAll();
        
        setProjectCount(projects.length);
        setGalleryCount(gallery.length);
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/projects" className="block">
          <div className="bg-white border-none rounded-2xl shadow-default p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-hover text-center">
            <div className="inline-flex items-center justify-center w-[60px] h-[60px] rounded-full bg-primary-light text-primary text-3xl mx-auto">
              <BriefcaseIcon className="w-8 h-8" />
            </div>
            <h6 className="text-textMuted font-medium text-base mt-4 mb-2">Total Projects</h6>
            {loading ? (
              <div className="animate-pulse h-10 w-16 bg-gray-200 rounded mx-auto"></div>
            ) : (
              <h3 className="text-textDark font-bold text-4xl">{projectCount}</h3>
            )}
          </div>
        </Link>

        <Link to="/gallery" className="block">
          <div className="bg-white border-none rounded-2xl shadow-default p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-hover text-center">
            <div className="inline-flex items-center justify-center w-[60px] h-[60px] rounded-full bg-warning-light text-warning text-3xl mx-auto">
              <PhotoIcon className="w-8 h-8" />
            </div>
            <h6 className="text-textMuted font-medium text-base mt-4 mb-2">Total Gallery</h6>
            {loading ? (
              <div className="animate-pulse h-10 w-16 bg-gray-200 rounded mx-auto"></div>
            ) : (
              <h3 className="text-textDark font-bold text-4xl">{galleryCount}</h3>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;