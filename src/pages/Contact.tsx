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
import { Mail, MapPin, Phone } from "lucide-react";

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
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-premium opacity-20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent" data-aos="fade-up">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            We're here to help with all your circular loom spare part needs
          </p>
        </div>
      </section>

      {/* Contact Form and Details */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card/40 backdrop-blur-sm p-8 rounded-3xl shadow-premium border border-border/30" data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Send us a Message</h2>
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

                <Button type="submit" className="w-full group hover:shadow-glow transition-all duration-300" size="lg">
                  <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">Submit Enquiry</span>
                </Button>
              </form>
            </div>

            {/* Contact Details */}
            <div data-aos="fade-left">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 group">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Address</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Aadarsh Enterprise<br />
                      Coimbatore, Tamil Nadu, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 group">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                    <Mail className="h-6 w-6 text-primary" />
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

                <div className="flex items-start gap-4 p-6 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 group">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                    <Phone className="h-6 w-6 text-primary" />
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
              <div className="mt-8 rounded-3xl overflow-hidden shadow-premium border border-border/30" data-aos="fade-up" data-aos-delay="200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.4907107218974!2d76.96498997480836!3d11.001761689161043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a63fd65319%3A0x63efcd1bf8024895!2sAdarsh%20Enterprises!5e0!3m2!1sen!2sin!4v1762744630648!5m2!1sen!2sin"
                  className="w-full h-80 border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Aadarsh Enterprise Location"
                />
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
