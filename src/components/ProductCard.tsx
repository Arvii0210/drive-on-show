import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  title: string;
  image: string;
  description?: string;
  link?: string;
  variant?: "card" | "list"; // "card" = visual hero card, "list" = compact product row
  cat?: string;
  cat2?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  description,
  link = "#",
  variant = "card",
  cat,
  cat2,
}) => {
  if (variant === "list") {
    return (
      <article className="flex items-start gap-4 rounded-md border border-primary/10 bg-background p-3 hover:shadow-lg transition">
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-sm border border-primary/8 bg-white/5 overflow-hidden flex items-center justify-center">
          <img src={image} alt={title} className="w-full h-full object-contain" loading="lazy" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm md:text-base font-semibold text-foreground truncate">{title}</h4>

          {cat && (
            <div className="mt-1 text-xs text-neutral-500">
              <span className="font-medium text-xs text-neutral-600">Cat:</span>{" "}
              <span className="ml-1">{cat}</span>
            </div>
          )}

          {cat2 && (
            <div className="mt-1 text-xs text-neutral-500">
              <span className="font-medium text-xs text-neutral-600">Cat:</span>{" "}
              <span className="ml-1">{cat2}</span>
            </div>
          )}

          {description && <p className="mt-2 text-xs text-neutral-600 line-clamp-3">{description}</p>}

          {/* <div className="mt-3 flex items-center justify-between">
            <Link to={link} className="text-sm text-primary hover:underline">
              View
            </Link>
            <span className="text-xs text-neutral-400">●</span>
          </div> */}
        </div>
      </article>
    );
  }

  // default: visual card variant
  return (
    <Card
      className="
        group relative overflow-hidden rounded-2xl
        bg-white/60 dark:bg-white/10 backdrop-blur-md
        ring-1 ring-transparent hover:ring-primary/50
        transition-transform duration-300
        hover:-translate-y-2 hover:shadow-2xl
      "
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="
            h-full w-full object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-110
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <h3 className="absolute bottom-3 left-4 right-4 hidden text-lg font-semibold text-white drop-shadow-md sm:block">
          {title}
        </h3>
      </div>

      <CardContent className="p-5">
        <h3 className="mb-2 text-lg font-semibold sm:hidden">{title}</h3>

        {description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        ) : (
          <div className="text-sm text-muted-foreground">
            {cat && <div className="text-xs">Cat: {cat}</div>}
            {cat2 && <div className="text-xs mt-1">Cat: {cat2}</div>}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          asChild
          size="sm"
          className="
            w-full rounded-full
            transition-colors duration-300
            group-hover:bg-primary/90
          "
        >
          <Link to={link}>View Products</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
