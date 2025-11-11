import { Package, Grid3x3, Settings } from "lucide-react";

const ProcessSection = () => {
  const steps = [
    {
      icon: Grid3x3,
      title: "Select Category",
      description: "Choose from our range of loom manufacturers",
      delay: 0
    },
    {
      icon: Package,
      title: "Pick Product",
      description: "Browse specific loom models and series",
      delay: 100
    },
    {
      icon: Settings,
      title: "Find Spare Part",
      description: "Get the exact component you need",
      delay: 200
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Finding the right spare part is simple with our organized catalog
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                data-aos="fade-down"
                data-aos-delay={step.delay}
                className="relative"
              >
                <div className="bg-background rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center h-full flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute top-8 -right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30 -translate-y-1/2 z-[-1]">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-primary/30 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
