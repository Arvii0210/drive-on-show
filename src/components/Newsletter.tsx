
import React from 'react';
import { Mail, Gift, TrendingUp, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const benefits = [
  {
    icon: Gift,
    text: 'Exclusive free assets weekly'
  },
  {
    icon: TrendingUp,
    text: 'Latest design trends & tips'
  },
  {
    icon: Bell,
    text: 'New collection notifications'
  }
];

const Newsletter = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="mb-12">
          <Mail className="mx-auto mb-6 text-teal-400" size={64} />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stay in the Creative Loop
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Get weekly updates on new resources, design trends, and exclusive freebies 
            delivered straight to your inbox.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.text}
              className="flex items-center justify-center md:justify-start text-gray-300 group hover:text-white transition-colors duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-teal-600 rounded-full p-3 mr-4 group-hover:bg-teal-500 transition-colors duration-300">
                <benefit.icon size={20} className="text-white" />
              </div>
              <span className="font-medium">{benefit.text}</span>
            </div>
          ))}
        </div>

        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-teal-400 focus:bg-white/20 transition-all duration-300 rounded-xl py-4 px-6"
              />
            </div>
            <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              Subscribe
            </Button>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            Join 100,000+ designers • Unsubscribe anytime • No spam, we promise
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Weekly digest
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Exclusive content
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Design tips
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
