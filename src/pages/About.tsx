import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Herobg from "@/assets/hero2.jpg";

const About = () => {
  const services = [
    "Manufacturing of loom spares",
    "Custom spare part design",
    "Quality assurance & testing",
    "Fast delivery & customer support",
    "Global export solutions",
  ];

  const whyChooseUs = [
    "High-quality materials & strict QA",
    "Fast lead times & reliable shipping",
    "In-house testing & inspection",
  ];

  const stats = [
    { label: "Years", value: "25+" },
    { label: "Clients", value: "120+" },
    { label: "Markets", value: "45+" },
  ];

  const details = [
    {
      title: "Our Replacement Policy",
      content:
        "We back our products with a clear replacement policy for defective parts within the warranty period. Contact sales with order details for fast resolution.",
    },
    {
      title: "Infrastructure - State of Art",
      content:
        "Modern production lines, CNC machining, heat treatment and inspection labs ensure consistent, repeatable quality across batches.",
    },
    {
      title: "Quality Measures",
      content:
        "Incoming material checks, in-process inspection and final dimensional & functional testing before dispatch.",
    },
    {
      title: "Exports",
      content:
        "Experienced export logistics team, export documentation and global shipping partners covering 40+ markets.",
    },
    {
      title: "Stock & Delivery",
      content:
        "Optimised inventory for fast lead-times. Priority production options available for repeat OEM customers.",
    },
    {
      title: "Disclaimer",
      content:
        "Product specifications are subject to change for continuous improvement. Contact us for final OEM-fitment confirmation.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleIndex = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/10 to-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] md:h-[60vh] lg:h-[55vh] flex items-center">
        {/* Background image + cinematic overlays */}
        <div className="absolute inset-0 -z-10">
          <img
            src={Herobg} 
            alt="Aadarsh hero background"
            className="w-full h-full object-cover object-center filter brightness-75 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(255,255,255,0.02),transparent)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="rounded-3xl p-8 md:p-12 bg-white/60 shadow-2xl border border-primary/10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-black leading-tight">
               About Aadarsh Enterprise
              </h1>
              <p className="mt-4 text-sm md:text-base text-black max-w-2xl">
                Premium loom spares engineered for durability, precision and seamless OEM compatibility.
                Trusted by manufacturers worldwide.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="rounded-full px-6 py-3 shadow-lg">
                  <Link to="/products">Explore Products</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="rounded-full px-6 py-3 border border-primary/20">
                  <Link to="/contact">Request Quote</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

       {/* Company Overview */}
      <section className="py-16 bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6 lg:grid lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 space-y-6"
          >
            <h2 className="text-3xl font-bold">Company Overview</h2>
            <p className="leading-relaxed text-lg">
              Aadarsh Enterprise is one of India's trusted manufacturers and exporters of high-precision loom spares and accessories. We specialise in grommet bands, heald belts and OEM-grade components for GCL, Starlinger and Lohia looms—engineered for longevity and optimal performance.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Quality Assurance",
                  desc: "Material traceability, strict inspection and final testing.",
                },
                {
                  title: "Fast Turnaround",
                  desc: "Optimised production and dependable logistics worldwide.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <h4 className="font-semibold mb-2">{card.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Capabilities</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {["Precision machining", "Custom design", "R&D & testing"].map((c, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <span className="font-medium">{c}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 p-8 bg-gradient-to-br from-[#E71971]/10 to-[#FF8C00]/10 rounded-2xl border border-gray-200 dark:border-gray-700"
          >
            <h4 className="text-2xl font-bold">Why Choose Us</h4>
            <ul className="space-y-4">
              {whyChooseUs.map((w, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#E71971] mt-1 mr-3" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              // size="md"
              // variant="gradient"
              className="w-full rounded-full py-3"
            >
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </motion.aside>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center mb-12">
          <h3 className="text-3xl font-bold">Our Services</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            End-to-end solutions for industrial excellence.
          </p>
        </div>
        <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 transition"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-tr from-[#E71971] to-[#FF8C00] rounded-lg text-white">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{s}</h4>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Expertise, fast delivery & strict QA.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Accordion detail list - styled to match your screenshot */}
      <section className="py-20 bg-primary/40">
  <div className="container mx-auto px-6 max-w-5xl text-center">
    {/* Section Heading */}
    <div className="mb-12">
      <h2 className="text-4xl font-semibold text-[#5B3A29] mb-3">
        Frequently Asked Questions
      </h2>
      <p className="text-lg text-[#6b4f42] max-w-2xl mx-auto">
        Get quick answers about our process, products, and services — all in one place.
      </p>
    </div>

    {/* Accordion */}
    <div className="space-y-5 text-left">
      {details.map((d, i) => {
        const open = openIndex === i;
        return (
          <div
            key={d.title}
            className="rounded-2xl border border-[#D8CFC9] bg-[#f6f0eb] shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleIndex(i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              aria-expanded={open}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8DDD7] text-[#8b6f61]">
                  <Plus className={`h-4 w-4 transition-transform ${open ? "rotate-45" : ""}`} />
                </span>
                <span className="text-lg font-semibold text-[#5B3A29]">{d.title}</span>
              </div>

              {open ? (
                <Check className="h-5 w-5 text-[#5B3A29]" />
              ) : (
                <span className="text-[#8b6f61]">
                  <Plus className="h-5 w-5" />
                </span>
              )}
            </button>

            <div
              className={`px-6 pb-5 transition-[max-height,opacity] duration-300 ${
                open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
              style={{ overflow: "hidden" }}
            >
              <p className="text-sm text-[#3d2f29] leading-relaxed">{d.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

      {/* CTA Band */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <h4 className="text-lg font-bold">Ready to upgrade your production line?</h4>
              <p className="text-sm text-primary-foreground/85 mt-1">Connect with our engineering team for custom solutions.</p>
            </div>
            <div>
              <Button asChild size="lg" variant="secondary" className="rounded-full px-6">
                <Link to="/contact">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
