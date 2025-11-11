import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Users, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out"
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-premium opacity-20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent" data-aos="fade-up">
            About Aadarsh Enterprise
          </h1>
          <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            Your Trusted Partner in Premium Circular Loom Spare Parts
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" data-aos="fade-up">
            Our Story
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-muted-foreground" data-aos="fade-right">
              <p className="text-lg leading-relaxed">
                Aadarsh Enterprise has been at the forefront of supplying high-quality circular loom
                spare parts for over a decade. Based in Coimbatore, Tamil Nadu, we've built our
                reputation on reliability, quality, and exceptional customer service.
              </p>
              <p className="text-lg leading-relaxed">
                Our journey began with a simple mission: to provide manufacturers with the most
                reliable spare parts for their circular looms. Today, we're proud to serve clients
                across India and beyond, offering an extensive range of parts for leading brands
                including Lohia, GCL, and Starlinger.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
              <div className="bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-border/30 text-center">
                <div className="text-4xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-border/30 text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-border/30 text-center">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-border/30 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" data-aos="fade-up">
            Our Journey
          </h2>
          <div className="space-y-12">
            {[
              { year: "2013", title: "Foundation", desc: "Aadarsh Enterprise was established with a vision to provide quality spare parts" },
              { year: "2016", title: "Expansion", desc: "Extended our product range to include GCL and Starlinger parts" },
              { year: "2019", title: "Digital Transformation", desc: "Launched our online platform for easier ordering and tracking" },
              { year: "2024", title: "Industry Leader", desc: "Recognized as a leading supplier with 500+ satisfied clients nationwide" }
            ].map((item, index) => (
              <div key={index} className="flex gap-8 items-center" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="flex-shrink-0 w-32 text-right">
                  <div className="text-4xl font-bold text-primary">{item.year}</div>
                </div>
                <div className="relative flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-primary ring-8 ring-primary/20"></div>
                  {index < 3 && <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-primary to-primary/20"></div>}
                </div>
                <div className="flex-1 bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" data-aos="fade-up">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Award, title: "Quality", desc: "We never compromise on the quality of our products" },
              { icon: Users, title: "Customer First", desc: "Your satisfaction is our top priority" },
              { icon: Target, title: "Reliability", desc: "Count on us for consistent, dependable service" },
              { icon: TrendingUp, title: "Innovation", desc: "Continuously improving to serve you better" }
            ].map((item, index) => (
              <div key={index} className="text-center group" data-aos="zoom-in" data-aos-delay={index * 100}>
                <div className="bg-card/40 backdrop-blur-sm p-8 rounded-3xl border border-border/30 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 shadow-premium hover:shadow-premium-hover">
                  <div className="bg-gradient-to-br from-primary/20 to-primary/5 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" data-aos="fade-up">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Genuine OEM and high-quality aftermarket parts",
              "Extensive inventory covering all major brands",
              "Fast and reliable delivery across India",
              "Expert technical support and consultation",
              "Competitive pricing with bulk discounts",
              "Quality assurance on all products"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 bg-card/40 backdrop-blur-sm p-6 rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300" data-aos="fade-up" data-aos-delay={index * 50}>
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <p className="text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
