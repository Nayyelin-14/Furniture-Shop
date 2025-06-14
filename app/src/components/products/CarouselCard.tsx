import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

import type { ProductsType } from "../../types";
import { Link } from "react-router-dom";

interface ProductProps {
  products: ProductsType[];
}
export function CarouselCard({ products }: ProductProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const img_path = import.meta.env.VITE_IMG_URL;
  return (
    <Carousel
      className="w-[85%] md:w-[90%] mx-auto lg:mx-0 lg:w-full"
      plugins={[plugin.current]}
    >
      <CarouselContent className="-ml-1">
        {products.map((product) => (
          <CarouselItem key={product.id} className="pl-1 lg:basis-1/3">
            <div className="flex gap-2 items-center p-4 lg:px-4 border border-black/4 shadow-sm rounded-md">
              <img
                src={img_path + product.images[0].path}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="size-28 rounded-md object-cover"
              />
              <div className="space-y-3">
                <h3 className="text-sm font-bold line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                <p>
                  <Link
                    to={`products/${product.id}`}
                    className="text-sm font-bold text-[#3b5d50] hover:underline"
                  >
                    Read More
                  </Link>
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
