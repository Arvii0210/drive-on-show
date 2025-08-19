import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { projectService, Project } from '@/services/Projectsservice';

const LatestProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectService.getAll().then(setProjects);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="heading-xl text-foreground mb-4">
              Latest <span className="text-primary">Projects</span>
            </h2>
            <p className="text-premium max-w-2xl">
              Discover our recent work showcasing precision engineering and design excellence. 
              Each project reflects our commitment to quality and innovation.
            </p>
          </div>
          <Button className="hidden md:flex btn-accent">
            View All Projects
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-glass hover:shadow-premium transition-all duration-500 hover-lift border border-border/50"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                    {project.description}
                  </span>
                </div>
                
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                </div>

                
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-12 md:hidden">
          <Button className="btn-accent">
            View All Projects
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestProjects;