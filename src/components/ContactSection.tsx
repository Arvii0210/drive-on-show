import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Get in <span className="text-automotive-blue">Touch</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to find your dream car? Contact our expert team for personalized assistance and exclusive deals.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input type="tel" placeholder="+1 (555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Interested in</label>
                  <Input placeholder="e.g. BMW X5, Budget $50-70k" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Tell us about your dream car or any questions you have..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button variant="hero" size="lg" className="w-full">
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="grid gap-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-automotive-blue/10 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-automotive-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Call Us</h3>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Mon-Sat 9AM-8PM</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-automotive-blue/10 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-automotive-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email Us</h3>
                        <p className="text-muted-foreground">info@dreamcars.com</p>
                        <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-automotive-blue/10 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-automotive-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Visit Us</h3>
                        <p className="text-muted-foreground">123 Auto Plaza Drive</p>
                        <p className="text-muted-foreground">Cityville, ST 12345</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-automotive-blue/10 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-automotive-blue" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Business Hours</h3>
                        <div className="text-muted-foreground space-y-1">
                          <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                          <p>Saturday: 9:00 AM - 6:00 PM</p>
                          <p>Sunday: 11:00 AM - 5:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Action Card */}
              <Card className="shadow-lg bg-gradient-to-br from-automotive-blue to-automotive-blue-dark text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to Buy?</h3>
                  <p className="mb-6 opacity-90">
                    Schedule a test drive today and experience your dream car firsthand.
                  </p>
                  <Button variant="accent" size="lg" className="w-full">
                    Schedule Test Drive
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;