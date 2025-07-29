
import React from 'react';
import { Shield, Zap, Award, Users, Download, Clock } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'High-Quality Free Resources',
    description: 'Every asset is carefully curated and reviewed by our expert team to ensure premium quality.',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: Zap,
    title: 'Commercial-Use Ready',
    description: 'Use our assets for personal and commercial projects without worrying about licensing restrictions.',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: Award,
    title: 'Curated Daily by Experts',
    description: 'Our team of design professionals handpicks the best content to keep our collection fresh and relevant.',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: Users,
    title: 'Vibrant Community',
    description: 'Connect with millions of creators and designers from around the world in our supportive community.',
    color: 'text-teal-600 bg-teal-100'
  },
  {
    icon: Download,
    title: 'Unlimited Downloads',
    description: 'Download as many free assets as you need with no daily limits or restrictions on usage.',
    color: 'text-orange-600 bg-orange-100'
  },
  {
    icon: Clock,
    title: 'Updated Regularly',
    description: 'New content is added daily, ensuring you always have access to the latest trends and styles.',
    color: 'text-red-600 bg-red-100'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Pextee?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're more than just a stock resource platform. We're your creative partner, 
            committed to providing the best assets and experience for your projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${benefit.color} mb-6`}>
                <benefit.icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg mb-6 text-white/90">
              Join millions of designers and creators who trust Pextee for their creative projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                Start Exploring
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
