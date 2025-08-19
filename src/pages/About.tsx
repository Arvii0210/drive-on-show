import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Users, Target, Wrench } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Quality Excellence",
      description:
        "Uncompromising standards in every project, ensuring durability and aesthetic appeal.",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description:
        "Building lasting relationships through exceptional service and personalized solutions.",
    },
    {
      icon: Target,
      title: "Precision Engineering",
      description:
        "Meticulous attention to detail in design, fabrication, and installation processes.",
    },
    {
      icon: Wrench,
      title: "Innovation",
      description:
        "Embracing modern techniques while maintaining traditional craftsmanship values.",
    },
  ];

  const products = [
    "Stainless Steel Railings",
    "Glass Balcony Systems",
    "Security Gates & Doors",
    "Custom Fabrication",
    "Architectural Metalwork",
    "Industrial Equipment",
    "Bathroom Glass Solutions",
    "Exterior Structures",
  ];

  const partners = [
    "Tata Steel",
    "JSW Steel",
    "SAIL",
    "Jindal Steel",
    "Guardian Glass",
    "Pilkington",
    "Saint-Gobain",
    "AIS Glass",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section
        className="pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Keerthi &amp; Keerthi Fabs
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            Coimbatore’s trusted name for quality stainless steel fabrication
            since 1980.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block mb-6 px-3 py-1 bg-primary/10 text-primary font-medium rounded-full text-sm">
                EST. 1980
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Four Decades of{" "}
                <span className="text-primary">Craftsmanship</span> Excellence
              </h2>
              <div className="space-y-6 text-gray-600 text-lg">
                <p>
                  Founded in 1980 by visionary craftsmen, Keerthi & Keerthi Fabs
                  began as a small workshop with big dreams. Today, we stand as
                  Coimbatore's premier stainless steel fabrication company,
                  serving clients across South India.
                </p>
                <p>
                  Our journey from a modest beginning to becoming a trusted name
                  in the industry reflects our unwavering commitment to quality,
                  innovation, and customer satisfaction.
                </p>
                <p>
                  With state-of-the-art equipment, skilled craftsmen, and a
                  passion for perfection, we continue to set new standards in
                  stainless steel fabrication.
                </p>
              </div>
              <div className="flex items-center mt-10">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-white overflow-hidden"
                    >
                      <img
                        src={`https://randomuser.me/api/portraits/men/${
                          20 + i
                        }.jpg`}
                        alt="Team member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-6">
                  <p className="text-sm text-gray-500">Led by a team of</p>
                  <p className="font-medium text-gray-900">
                    Passionate Experts
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gray-100 rounded-full blur-3xl"></div>

                <img
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=800&fit=crop"
                  alt="Keerthi & Keerthi Fabs Workshop"
                  className="rounded-3xl shadow-2xl w-full object-cover h-[500px] relative z-10"
                />

                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl z-20 flex items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary text-2xl font-bold">40+</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Years of</p>
                    <p className="text-gray-900 font-semibold">Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-6xl font-bold">40+</div>
              <div className="mt-2">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-bold">2500+</div>
              <div className="mt-2">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-bold">5000+</div>
              <div className="mt-2">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-6xl font-bold">50+</div>
              <div className="mt-2">Expert Craftsmen</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-primary">Core Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our fundamental principles guide every aspect of our work,
              defining our commitment to excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Products Showcase */}
      <section id="our-products" className="bg-muted/30 py-16 text-center">
        <div className="container-custom">
          <h2 className="heading-xl text-foreground mb-16 relative">
            Our Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Product Card */}
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-grip-lines text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Stainless Steel Handrails
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-stairs text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Steel Staircase
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-border-style text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Mounted Steel Railings
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-chair text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Steel Dining Table
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-ruler-horizontal text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Wooden &amp; SS Top Railings
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-th text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Sitout Railings
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-cube text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Steel Fabrication
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-building text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Building Railings
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-cog text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Custom Fabrication
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-swatchbook text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Design Handrails
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-cogs text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Commercial Railings
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-hands-helping text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Hand Rail
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-table text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Steel Chairs and Tables
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-th-large text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Grill Design Hand Railing
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-cogs text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                SS Rasi Patterns
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-plug text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Railings with Cable Barriers
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-layer-group text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Stainless Steel Baluster
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-columns text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Architectural Railings
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-stairs text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Custom Stair Railings
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-umbrella text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Folding Railings
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-pills text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Capsule Railings
              </p>
            </div>
            <div className="bg-card rounded-2xl shadow-md p-8 flex flex-col items-center justify-between h-40 transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:shadow-xl group">
              <i className="fas fa-door-open text-3xl mb-4 text-foreground group-hover:text-white"></i>
              <p className="font-semibold text-foreground group-hover:text-white">
                Designer Gate Models
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      {/* Trusted Partners Carousel */}
      <section id="clients" className="py-16 px-5 text-center overflow-hidden">
        <h2 className="text-4xl font-semibold text-gray-800 mb-16 relative inline-block font-inter">
          Our Trusted Clients
        </h2>
        <div className="relative w-full">
          <div
            className="flex items-center gap-16 animate-scroll whitespace-nowrap"
            style={{
              animation: "scroll 30s linear infinite",
            }}
          >
            {[
              {
                src: "/photos/Viswanathan.jpg",
                alt: "Viswanathan Construction",
                name: "Viswanathan Construction",
              },
              {
                src: "/photos/Sundaram.jpg",
                alt: "Sundaram & Sundaram Architect",
                name: "Sundaram & Sundaram Architect",
              },
              {
                src: "/photos/Emerald.jpg",
                alt: "Emerald Jewel One Industry",
                name: "Emerald Jewel One Industry",
              },
              {
                src: "/photos/Shepherd.jpg",
                alt: "Good Shepherd School",
                name: "Good Shepherd School",
              },
              {
                src: "/photos/hindusthan.jpg",
                alt: "Hindustan Educational Trust",
                name: "Hindustan Educational Trust",
              },
              {
                src: "/photos/Rathinam.jpg",
                alt: "Rathinam Research Foundation",
                name: "Rathinam Research Foundation",
              },
              {
                src: "/photos/Isha.jpg",
                alt: "Isha Foundation",
                name: "Isha Foundation",
              },
              {
                src: "/photos/BRJ.jpg",
                alt: "BRJ Ortho Centre",
                name: "BRJ Ortho Centre",
              },
              // Repeat for infinite effect
              {
                src: "/photos/Viswanathan.jpg",
                alt: "Viswanathan Construction",
                name: "Viswanathan Construction",
              },
              {
                src: "/photos/Sundaram.jpg",
                alt: "Sundaram & Sundaram Architect",
                name: "Sundaram & Sundaram Architect",
              },
              {
                src: "/photos/Emerald.jpg",
                alt: "Emerald Jewel One Industry",
                name: "Emerald Jewel One Industry",
              },
              {
                src: "/photos/Shepherd.jpg",
                alt: "Good Shepherd School",
                name: "Good Shepherd School",
              },
              {
                src: "/photos/hindusthan.jpg",
                alt: "Hindustan Educational Trust",
                name: "Hindustan Educational Trust",
              },
                {
                  src: "/photos/Rathinam.jpg",
                alt: "Rathinam Research Foundation",
                name: "Rathinam Research Foundation",
              },
              {
                src: "/photos/Isha.jpg",
                alt: "Isha Foundation",
                name: "Isha Foundation",
              },
              {
                src: "/photos/BRJ.jpg",
                alt: "BRJ Ortho Centre",
                name: "BRJ Ortho Centre",
              },
            ].map((client, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center min-w-[150px] mx-2"
              >
                <img
                  src={client.src}
                  alt={client.alt}
                  className="h-20 max-w-[120px] object-contain transition-transform duration-300 hover:scale-110 bg-white rounded-lg shadow"
                />
                <p className="mt-2 text-sm text-gray-700">{client.name}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Carousel animation keyframes */}
        <style>
          {`
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @media (max-width: 768px) {
        #clients .animate-scroll {
          gap: 8px;
        }
      }
    `}
        </style>
      </section>

      <Footer />
    </div>
  );
};

export default About;
