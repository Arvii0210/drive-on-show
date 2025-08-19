import React, { useState } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';

// --- Data updated to match the visual style of the image ---
const testimonialsData = [
  {
    id: 1,
    name: 'Sabo Masties',
    position: 'Founder @ Rolex',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: '“Our members are so impressed. It’s intuitive. It’s clean. It’s distraction free. If you’re building a community.”'
  },
  {
    id: 2,
    name: 'Musharof Chowdhury',
    position: 'Founder @ Ayro UI',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: '“The team is constantly striving to improve the service and product, and they are succeeding. I am very satisfied.”'
  },
  {
    id: 3,
    name: 'William Smith',
    position: 'Founder @ Trorex',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: '“It’s a beautiful and easy to use UI kit that makes it easy to create a professional and polished look for your website.”'
  },
  {
    id: 4,
    name: 'Meera Krishnan',
    position: 'Architect @ BuildCo',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: '“The attention to detail is incredible. Every component is thoughtfully designed and perfectly executed. Highly recommended!”'
  },
  {
    id: 5,
    name: 'Priya Sharma',
    position: 'Interior Designer',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b2ad?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: '“As a designer, I appreciate the clean aesthetic and robust functionality. It has become an essential tool in my workflow.”'
  }
];

// --- Helper component to render stars ---
const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star 
      key={i} 
      className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
    />
  ));
};

// --- Main Testimonials Component ---
const TestimonialsClean = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Slider Navigation Logic ---
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonialsData.length - 3 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonialsData.length - 3 ? 0 : prevIndex + 1
    );
  };
  
  // --- Get the three testimonials to display ---
  const visibleTestimonials = testimonialsData.slice(currentIndex, currentIndex + 3);

  return (
    <section className="bg-gray-200 py-20 sm:py-28">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What our Clients Says
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            There are many variations of passages of Lorem Ipsum available
            but the majority have suffered alteration in some form.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <blockquote className="text-gray-600 mb-6 flex-grow">
                {testimonial.text}
              </blockquote>
              <div className="flex items-center">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-10 space-x-4">
          <button 
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="w-11 h-11 flex items-center justify-center bg-white rounded-md shadow-md border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </button>
          <button 
            onClick={handleNext}
            aria-label="Next testimonial"
            className="w-11 h-11 flex items-center justify-center bg-white rounded-md shadow-md border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsClean;
