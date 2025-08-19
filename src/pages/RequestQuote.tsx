import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronRight, Home, Send, Mail, Phone, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  requiresDelivery: string;
  requiresMeasurement: string;
  projectType: string;
  deliveryOption: string;
  description: string;
  deliveryDate: string;
  budget: string;
  material: string;
  coating: string;
}

const RequestQuote = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<QuoteFormData>();
  const { toast } = useToast();

  const onSubmit = async (data: QuoteFormData) => {
    try {
      console.log('Quote form data:', data);
      toast({
        title: "✅ Quote Request Submitted",
        description: "Our team will contact you within 24 hours.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white relative overflow-hidden">
      <Navbar />

      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[180px]"></div>
      <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[160px]"></div>

      <section className="relative pt-28 pb-20">
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-10">
            <Link to="/" className="hover:text-primary transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Request a Quote</span>
          </nav>

          {/* Page Heading */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Get Your Personalized Quote
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Share your stainless steel fabrication project details below, and we’ll provide a tailored solution crafted with 40+ years of excellence.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            
            {/* Left Side - Contact Info */}
            <div className="lg:col-span-1 bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-bold mb-6">Contact Our Team</h3>
              <ul className="space-y-6 text-gray-300">
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span>info@kkfabs.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-pink-400" />
                  <span>Coimbatore, Tamil Nadu</span>
                </li>
              </ul>
              <div className="mt-10 text-sm text-gray-400">
                <p>We respond within 24 hours.</p>
                <p className="mt-1">Working Hours: Mon - Sat (9 AM - 7 PM)</p>
              </div>
            </div>

            {/* Right Side - Quote Form */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Name & Phone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name*</Label>
                    <Input id="name" placeholder="Your full name" {...register("name", { required: "Name is required" })} className="h-12 mt-1 bg-white/5 border-white/20 focus:border-primary focus:ring-2 focus:ring-blue-400"/>
                    {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone*</Label>
                    <Input id="phone" placeholder="+91 9876543210" {...register("phone", { required: "Phone is required" })} className="h-12 mt-1 bg-white/5 border-white/20"/>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" {...register("email")} className="h-12 mt-1 bg-white/5 border-white/20"/>
                </div>

                {/* Project Type */}
                <div>
                  <Label>Project Type*</Label>
                  <Select onValueChange={(value) => setValue("projectType", value)}>
                    <SelectTrigger className="h-12 bg-white/5 border-white/20 text-gray-200">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stairs">Stairs</SelectItem>
                      <SelectItem value="railings">Railings</SelectItem>
                      <SelectItem value="gates">Gates</SelectItem>
                      <SelectItem value="doors">Doors</SelectItem>
                      <SelectItem value="windows">Windows</SelectItem>
                      <SelectItem value="custom">Custom Fabrication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Budget & Delivery Date */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Budget</Label>
                    <Select onValueChange={(value) => setValue("budget", value)}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/20 text-gray-200">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5000-less">₹5,000 or less</SelectItem>
                        <SelectItem value="5000-15000">₹5,000 - ₹15,000</SelectItem>
                        <SelectItem value="15000-50000">₹15,000 - ₹50,000</SelectItem>
                        <SelectItem value="50000-plus">₹50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Delivery Date</Label>
                    <Input type="date" {...register("deliveryDate")} className="h-12 mt-1 bg-white/5 border-white/20"/>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label>Project Description</Label>
                  <Textarea placeholder="Describe your project requirements..." {...register("description")} className="min-h-[120px] mt-1 bg-white/5 border-white/20"/>
                </div>

                {/* Submit */}
                <div>
                  <Button type="submit" className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all font-semibold text-lg flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RequestQuote;
