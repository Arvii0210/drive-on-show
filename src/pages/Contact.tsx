import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic"
    });
    
    const productParam = searchParams.get("product");
    if (productParam) {
      setFormData((prev) => ({ ...prev, product: "Other", message: `Inquiry about: ${productParam}\n\n` }));
    }
  }, [searchParams]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // allow only digits and limit to 10 characters
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digits }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Phone validation: if provided, must be exactly 10 digits
    if (formData.phone && formData.phone.length !== 10) {
      toast({
        title: "Error",
        description: "Phone number must be exactly 10 digits.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Enquiry Submitted",
      description: "Thanks — we will contact you within 24–48 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      product: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-premium opacity-20 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div data-aos="zoom-in" className="inline-block px-6 py-3 glass-card rounded-full mb-8 border border-purple-500/30">
            <span className="text-sm font-semibold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Contact Us</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent" data-aos="fade-up">
            Get in Touch
          </h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            We're here to help with all your circular loom spare part needs
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mx-auto mt-8 rounded-full" data-aos="fade-up" data-aos-delay="200"></div>
        </div>
      </section>

      {/* Contact Form and Details */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="glass-card p-10 rounded-3xl shadow-premium border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 group" data-aos="fade-right">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Send us a Message</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    pattern="\d*"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="10-digit number"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <Label htmlFor="product">Product of Interest</Label>
                  <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Select a product category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="Lohia">Lohia</SelectItem>
                      <SelectItem value="GCL">GCL</SelectItem>
                      <SelectItem value="Starlinger">Starlinger</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your requirements..."
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full group hover:shadow-glow transition-all duration-500 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 h-14 text-lg font-semibold rounded-2xl" size="lg">
                  <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">Submit Enquiry</span>
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </form>
            </div>

            {/* Contact Details */}
            <div data-aos="fade-left">
              <h2 className="text-4xl font-bold mb-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-5 p-7 glass-card rounded-2xl border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:shadow-premium group hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Address</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Aadarsh Enterprise<br />
                      Coimbatore, Tamil Nadu, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-7 glass-card rounded-2xl border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 hover:shadow-premium group hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Email</h3>
                    <a
                      href="mailto:mukesh@loomspares.com"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      mukesh@loomspares.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-7 glass-card rounded-2xl border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-500 hover:shadow-premium group hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Phone</h3>
                    <a
                      href="tel:+919363101958"
                      className="text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      +91-9363101958
                    </a>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-10 rounded-3xl overflow-hidden shadow-premium-hover border-2 border-purple-500/30 hover:border-purple-500/50 transition-all duration-500 group" data-aos="fade-up" data-aos-delay="200">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-premium opacity-10 z-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-500"></div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.4907107218974!2d76.96498997480836!3d11.001761689161043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a63fd65319%3A0x63efcd1bf8024895!2sAdarsh%20Enterprises!5e0!3m2!1sen!2sin!4v1762744630648!5m2!1sen!2sin"
                    className="w-full h-96 border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Aadarsh Enterprise Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
