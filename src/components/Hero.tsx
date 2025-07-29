import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 bg-white overflow-hidden">
      {/* 🔥 Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("assets/images/hero-bg.jpg")` }}
        />
        <div className="absolute inset-0 bg-white/70" />
      </div>

      {/* 🌟 Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Discover Free & Premium
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              {" "}Creative Assets
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Download high-quality images, vectors, and videos for personal and commercial use. 
            Join millions of creators worldwide.
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-3 shadow-lg focus-within:ring-2 focus-within:ring-teal-500 transition-all duration-300">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-gray-500 text-lg mr-3"
              />
              <input
                type="text"
                placeholder="Search for photos, vectors, illustrations..."
                className="flex-1 bg-transparent outline-none text-base placeholder-gray-400"
              />
              <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-4 py-2 rounded-full transition-all duration-300 shadow-sm text-sm font-semibold">
                Search
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              to="/category"
              className="inline-flex items-center bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Explore Now
              <FontAwesomeIcon icon={faArrowRight} className="ml-3 text-sm" />
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-8 text-gray-600 text-base sm:text-lg font-medium">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Free to use
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            Commercial license
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
            High quality
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
