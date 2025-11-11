import React from "react";
import { Link } from "react-router-dom";

type Product = {
  title: string;
  image: string;
  cat?: string;
  cat2?: string;
  link?: string;
};

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p, idx) => (
            <article
              key={idx}
              className="flex gap-4 items-start rounded-lg border border-primary/10 bg-background p-4 hover:shadow-lg transition"
            >
              <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-md border border-primary/8 overflow-hidden bg-white/5 flex items-center justify-center">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm md:text-base font-semibold uppercase text-foreground">
                  {p.title}
                </h4>

                {p.cat && (
                  <div className="mt-1 text-xs text-neutral-500">
                    <span className="font-medium text-xs text-neutral-600">Cat:</span>{" "}
                    <span className="ml-1">{p.cat}</span>
                  </div>
                )}

                {p.cat2 && (
                  <div className="mt-1 text-xs text-neutral-500">
                    <span className="font-medium text-xs text-neutral-600">Cat:</span>{" "}
                    <span className="ml-1">{p.cat2}</span>
                  </div>
                )}

                {/* <div className="mt-3 flex items-center justify-between">
                  {p.link ? (
                    <Link
                      to={p.link}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </Link>
                  ) : (
                    <span />
                  )}

                  <span className="text-xs text-neutral-400">●</span>
                </div> */}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;