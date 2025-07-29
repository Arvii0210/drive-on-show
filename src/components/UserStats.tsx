
import React from 'react';
import { Users, Download, Heart, Star } from 'lucide-react';

const stats = [
  {
    icon: Users,
    number: '1M+',
    label: 'Active Users',
    color: 'text-blue-600'
  },
  {
    icon: Download,
    number: '25M+',
    label: 'Downloads',
    color: 'text-green-600'
  },
  {
    icon: Heart,
    number: '500K+',
    label: 'Happy Creators',
    color: 'text-red-600'
  },
  {
    icon: Star,
    number: '4.9/5',
    label: 'User Rating',
    color: 'text-yellow-600'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Graphic Designer',
    content: 'The quality of assets here is outstanding. It has become my go-to resource for all my design projects.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: 'Mike Chen',
    role: 'Marketing Director',
    content: 'As a contributor, I have earned over $2000 in the first 6 months. The platform is amazing for creators.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Content Creator',
    content: 'The search functionality is incredible. I can find exactly what I need in seconds. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
];

const UserStats = () => {
  return (
    <section className="py-20 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Stats Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by Millions
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
            Join our thriving community of creators and designers from around the world
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center group hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300 mb-4 ${stat.color}`}>
                  <stat.icon size={32} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            What Our Community Says
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserStats;
