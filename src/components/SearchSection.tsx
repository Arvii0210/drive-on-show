import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/photos?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/photos');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Find Your Perfect Car</h2>
            <p className="text-muted-foreground">Use our advanced search to discover vehicles that match your needs</p>
          </div>
          
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Make</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                      <SelectItem value="audi">Audi</SelectItem>
                      <SelectItem value="lexus">Lexus</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Model</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="x5">X5</SelectItem>
                      <SelectItem value="c-class">C-Class</SelectItem>
                      <SelectItem value="q7">Q7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-25000">Under $25,000</SelectItem>
                      <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50000-75000">$50,000 - $75,000</SelectItem>
                      <SelectItem value="75000-100000">$75,000 - $100,000</SelectItem>
                      <SelectItem value="100000+">$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mileage (max)</label>
                  <Input placeholder="e.g. 50,000" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fuel Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Fuel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transmission</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Assets</label>
                  <Input 
                    placeholder="Search for images, vectors, icons, or enter tags like 'forest', 'nature'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleSearch} variant="hero" size="lg" className="flex-1">
                  <Search className="h-5 w-5 mr-2" />
                  Search Assets
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/photos')}>
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Browse All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;