import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Search, Camera, Filter, ArrowUpDown, Check } from "lucide-react";
import { Link } from "react-router-dom";

const filters = ["License", "AI-generated", "Orientation", "Color", "People", "File type"];
const sortOptions = ["Most Relevant", "Most Recent"];
const categories = [
  "All Images", "Vectors", "Illustrations", "Photos", "Icons", "Videos", "PSD",
  "Templates", "Mockups", "3D Models", "Fonts",
];

const HeaderWithDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState("Most Relevant");
  const [activeCategory, setActiveCategory] = useState("All Images");

  const profileRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !(profileRef.current as any).contains(e.target)) {
        setDropdownOpen(false);
      }
      if (dropdownRef.current && !(dropdownRef.current as any).contains(e.target)) {
        setFilterOpen(false);
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Top Header */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="shrink-0">
  <img src="/logo.svg" alt="Logo" className="h-8" />
</Link>

        {/* Search Input */}
        <div className="relative w-full max-w-3xl flex-grow">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search assets or start creating"
            className="w-full rounded-full border border-gray-300 bg-white px-16 py-3 text-base font-medium shadow-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition text-lg"
            >
              ×
            </button>
          )}
          <Camera className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5" />
        </div>

        {/* Pricing & Profile */}
        <div className="flex items-center gap-6 shrink-0">
          <span className="text-orange-500 font-semibold text-base cursor-pointer hover:underline whitespace-nowrap">
            Pricing
          </span>

          {/* Profile Dropdown */}
          <div className="relative flex items-center gap-2" ref={profileRef}>
            <img
              src="/user-avatar.png"
              alt="User"
              className="w-9 h-9 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
            <ChevronDown
              className="w-4 h-4 text-gray-600 cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-72 bg-white border rounded-xl shadow-2xl z-50 transition-all duration-200 animate-fade-in">
                <div className="flex items-center gap-3 p-4 border-b">
                  <img src="/user-avatar.png" alt="avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">user127955820</p>
                    <p className="text-xs text-gray-500">aravindmurugesan260@gmail.com</p>
                  </div>
                </div>
                <div className="p-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm mb-2 transition">
                    Get a plan
                  </button>
                </div>
                <div className="px-4 pb-4 space-y-2 text-sm text-gray-700">
                  {["Subscription", "Account"].map((link) => (
                    <a key={link} href="#" className="block hover:text-blue-600">
                      {link}
                    </a>
                  ))}
                  <a href="#" className="block text-red-600 flex items-center gap-2 hover:underline">
                    <LogOut size={14} /> Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Row */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 border-b">
        <div className="flex items-center gap-8 overflow-x-auto py-4 no-scrollbar text-lg font-semibold relative">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative whitespace-nowrap transition pb-2 ${
                activeCategory === cat
                  ? "text-black font-bold"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute -bottom-0.5 left-0 h-[3px] w-full bg-black rounded-full transition-all duration-300"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter + Sort Bar */}
      <div
        className="max-w-screen-2xl mx-auto px-6 lg:px-10 py-5 flex flex-wrap items-center gap-4 relative z-40"
        ref={dropdownRef}
      >
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setFilterOpen(!filterOpen);
              setSortOpen(false);
            }}
            className="flex items-center gap-2 text-base bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-full text-gray-800 font-medium transition"
          >
            <Filter className="w-4 h-4" />
            {selectedFilter || "Filters"}
            {filterOpen ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {filterOpen && (
            <div className="absolute mt-2 w-64 bg-white border shadow-xl rounded-xl z-50 p-4 space-y-2 transition-all duration-200 animate-fade-in">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setSelectedFilter(f);
                    setFilterOpen(false);
                  }}
                  className="w-full text-left text-base flex justify-between items-center text-gray-700 hover:text-blue-600"
                >
                  {f}
                  {selectedFilter === f && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setSortOpen(!sortOpen);
              setFilterOpen(false);
            }}
            className="flex items-center gap-2 text-base bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-full text-gray-800 font-medium transition"
          >
            <ArrowUpDown className="w-4 h-4" />
            {selectedSort}
            {sortOpen ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {sortOpen && (
            <div className="absolute mt-2 w-56 bg-white border shadow-xl rounded-xl z-50 p-4 space-y-3 transition-all duration-200 animate-fade-in">
              {sortOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-base cursor-pointer hover:text-blue-600"
                >
                  <input
                    type="radio"
                    name="sort"
                    checked={selectedSort === option}
                    onChange={() => setSelectedSort(option)}
                    className="accent-blue-600"
                  />
                  {option}
                  {selectedSort === option && (
                    <Check className="w-4 h-4 text-blue-600 ml-auto" />
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderWithDropdown;
