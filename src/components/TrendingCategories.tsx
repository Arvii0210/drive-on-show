
import React from 'react';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Photography',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop',
    count: '12.5K+ assets',
    color: 'from-blue-600 to-purple-600'
  },
  {
    name: 'Illustrations',
    image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop',
    count: '8.2K+ assets',
    color: 'from-purple-600 to-pink-600'
  },
  {
    name: 'UI/UX Design',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    count: '15.1K+ assets',
    color: 'from-teal-600 to-blue-600'
  },
  {
    name: 'Video Content',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    count: '6.8K+ videos',
    color: 'from-orange-600 to-red-600'
  },
  {
    name: 'Templates',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    count: '9.4K+ templates',
    color: 'from-green-600 to-teal-600'
  },
  {
    name: 'Icons & Graphics',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
    count: '4.7K+ graphics',
    color: 'from-pink-600 to-purple-600'
  }
];

const TrendingCategories = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Trending Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our most popular categories and find the perfect assets for your next creative project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer bg-card border border-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-300 mb-4">{category.count}</p>
                <div className="flex items-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <span className="mr-2 font-semibold">Explore</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCategories;
