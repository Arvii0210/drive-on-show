import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Fuel, Users, Settings } from "lucide-react";

const FeaturedCars = () => {
  const cars = [
    {
      id: 1,
      name: "BMW X5 M Sport",
      price: "$68,500",
      originalPrice: "$75,000",
      image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      year: "2023",
      mileage: "15,000 miles",
      fuel: "Gasoline",
      transmission: "Automatic",
      seats: "5 seats",
      rating: 4.8,
      badge: "Bestseller",
      features: ["Navigation", "Leather Seats", "Sunroof", "AWD"]
    },
    {
      id: 2,
      name: "Mercedes-Benz C-Class",
      price: "$45,999",
      originalPrice: "$52,000",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
      year: "2022",
      mileage: "22,000 miles",
      fuel: "Gasoline",
      transmission: "Automatic",
      seats: "5 seats",
      rating: 4.9,
      badge: "Certified",
      features: ["Premium Audio", "Heated Seats", "Backup Camera", "Bluetooth"]
    },
    {
      id: 3,
      name: "Audi Q7 Quattro",
      price: "$59,999",
      originalPrice: "$65,000",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
      year: "2023",
      mileage: "8,500 miles",
      fuel: "Gasoline",
      transmission: "Automatic",
      seats: "7 seats",
      rating: 4.7,
      badge: "New Arrival",
      features: ["Virtual Cockpit", "Panoramic Roof", "Adaptive Cruise", "Premium Plus"]
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="text-automotive-blue">Vehicles</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Handpicked premium cars with verified history, exceptional condition, and competitive pricing
          </p>
        </div>

        {/* Cars Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cars.map((car) => (
            <Card key={car.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4" variant="secondary">
                  {car.badge}
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{car.rating}</span>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{car.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{car.year}</span>
                      <span>•</span>
                      <span>{car.mileage}</span>
                    </div>
                  </div>

                  {/* Car Specs */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Fuel className="h-4 w-4 text-automotive-blue" />
                      <span>{car.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Settings className="h-4 w-4 text-automotive-blue" />
                      <span>Auto</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-automotive-blue" />
                      <span>{car.seats}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {car.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {car.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{car.features.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-2xl font-bold text-automotive-blue">{car.price}</div>
                      <div className="text-sm text-muted-foreground line-through">{car.originalPrice}</div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="accent" size="lg" className="px-8">
            View All Vehicles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;