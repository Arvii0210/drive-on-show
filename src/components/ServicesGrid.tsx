import React from 'react';
import { Shield, Home, Settings, DoorOpen, Square, Droplets, ArrowRight } from 'lucide-react';

const ServicesGridColorful = () => {
  // --- Updated data with unique color themes for each service ---
  const services = [
    {
      icon: Shield,
      title: 'Railings & Balconies',
      description: 'Custom stainless steel railings, glass balconies, and safety barriers with modern designs.',
      features: ['Glass Balcony Work', 'SS & MS Railings', 'Safety Compliance', 'Custom Designs'],
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: DoorOpen,
      title: 'Gates & Doors',
      description: 'Security gates, main entrance doors, and compound gates with premium finishes.',
      features: ['Main Gates', 'Security Doors', 'Compound Gates', 'Automated Systems'],
      color: 'purple',
      gradient: 'from-purple-500 to-violet-400'
    },
    {
      icon: Settings,
      title: 'Custom Fabrication',
      description: 'Bespoke metalwork, structural fabrication, and industrial equipment manufacturing.',
      features: ['Custom Design', 'Structural Work', 'Industrial Equipment', 'Maintenance'],
      color: 'green',
      gradient: 'from-green-500 to-emerald-400'
    },
    {
      icon: Home,
      title: 'Doors & Windows',
      description: 'Premium doors and windows with stainless steel frames and modern hardware.',
      features: ['Interior Doors', 'Window Frames', 'Security Features', 'Energy Efficient'],
      color: 'amber',
      gradient: 'from-amber-500 to-orange-400'
    },
    {
      icon: Droplets,
      title: 'Bathroom Glass',
      description: 'Elegant bathroom glass partitions, shower enclosures, and mirror installations.',
      features: ['Shower Enclosures', 'Glass Partitions', 'Mirror Work', 'Water-resistant'],
      color: 'sky',
      gradient: 'from-sky-500 to-teal-400'
    },
    {
      icon: Square,
      title: 'Exterior Structures',
      description: 'Outdoor installations, canopies, pergolas, and architectural metalwork.',
      features: ['Canopies', 'Pergolas', 'Outdoor Stairs', 'Weather Resistant'],
      color: 'rose',
      gradient: 'from-rose-500 to-pink-400'
    }
  ];

  // This is a mapping to help Tailwind's JIT compiler recognize the dynamic classes.
  // In many setups, this is not strictly necessary, but it's a good practice for reliability.
  const colorClasses = {
    icon: {
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      green: 'text-green-400',
      amber: 'text-amber-400',
      sky: 'text-sky-400',
      rose: 'text-rose-400',
    },
    iconBg: {
      blue: 'bg-blue-950 group-hover:bg-blue-900/50',
      purple: 'bg-purple-950 group-hover:bg-purple-900/50',
      green: 'bg-green-950 group-hover:bg-green-900/50',
      amber: 'bg-amber-950 group-hover:bg-amber-900/50',
      sky: 'bg-sky-950 group-hover:bg-sky-900/50',
      rose: 'bg-rose-950 group-hover:bg-rose-900/50',
    },
    titleHover: {
      blue: 'group-hover:text-blue-300',
      purple: 'group-hover:text-purple-300',
      green: 'group-hover:text-green-300',
      amber: 'group-hover:text-amber-300',
      sky: 'group-hover:text-sky-300',
      rose: 'group-hover:text-rose-300',
    },
    button: {
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      green: 'text-green-400',
      amber: 'text-amber-400',
      sky: 'text-sky-400',
      rose: 'text-rose-400',
    }
  };

  return (
    <section className="relative py-24 sm:py-32 bg-slate-950 overflow-hidden">
      {/* Background Aurora Gradients */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl opacity-50"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-6">
            Our Core Specializations
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            From intricate railings to robust structural work, we deliver precision-engineered 
            stainless steel solutions that combine functionality with aesthetic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 border border-slate-800 transition-all duration-300 hover:border-slate-700 hover:-translate-y-2 h-full flex flex-col"
            >
              {/* Interactive Glow Effect */}
              <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-2xl`}></div>
              
              <div className="relative z-10 flex-grow">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-slate-800 transition-colors duration-300 ${colorClasses.iconBg[service.color]}`}>
                  <service.icon className={`w-8 h-8 ${colorClasses.icon[service.color]}`} />
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold text-slate-100 mb-4 transition-colors duration-300 ${colorClasses.titleHover[service.color]}`}>
                  {service.title}
                </h3>
                
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-slate-400">
                      <div className={`w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0 bg-gradient-to-br ${service.gradient}`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGridColorful;
