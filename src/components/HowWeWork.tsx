import React from 'react';
import { MessageCircle, Ruler, Hammer, CheckCircle } from 'lucide-react';

const HowWeWork = () => {
  const steps = [
    {
      icon: MessageCircle,
      title: 'Consultation',
      description: 'We begin with understanding your vision, requirements, and space specifications.',
      details: ['Site Visit', 'Requirement Analysis', 'Design Discussion', 'Budget Planning'],
      step: '01'
    },
    {
      icon: Ruler,
      title: 'Design & Planning',
      description: 'Our experts create detailed designs and technical drawings for your approval.',
      details: ['3D Modeling', 'Technical Drawings', 'Material Selection', 'Timeline Planning'],
      step: '02'
    },
    {
      icon: Hammer,
      title: 'Fabrication',
      description: 'Precision manufacturing in our state-of-the-art facility with quality control.',
      details: ['Premium Materials', 'Precision Cutting', 'Quality Control', 'Finishing Work'],
      step: '03'
    },
    {
      icon: CheckCircle,
      title: 'Installation',
      description: 'Professional installation by our skilled team with post-installation support.',
      details: ['Expert Installation', 'Safety Compliance', 'Final Inspection', 'Warranty Support'],
      step: '04'
    }
  ];

  return (
    <section className="section-padding bg-slate-200">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-xl text-foreground mb-6">
            How We <span className="text-primary">Work</span>
          </h2>
          <p className="text-premium max-w-3xl mx-auto">
            Our systematic approach ensures every project is delivered with precision, 
            quality, and within timeline. From concept to completion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {/* Connection Lines (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Card */}
              <div className="bg-card rounded-2xl p-8 shadow-glass hover:shadow-premium transition-all duration-500 hover-lift border border-border/50 relative z-10">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {step.description}
                </p>

                {/* Details */}
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile Connection Line */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center py-4">
                  <div className="w-0.5 h-8 bg-border"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {/* <div className="text-center mt-16">
          <div className="bg-card rounded-2xl p-8 shadow-glass border border-border/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground mb-6">
              Let's discuss your requirements and create something extraordinary together.
            </p>
            <button className="btn-accent">
              Schedule Consultation
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HowWeWork;