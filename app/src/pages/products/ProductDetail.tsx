import { Link, useParams } from "react-router-dom";
import { products } from "../../data/products";
import { Button } from "../../components/ui/button";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import ProductCard from "../../components/products/ProductCard";
import { Icons } from "../../components/icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Separator } from "../../components/ui/separator";
import { formatPrice } from "../../lib/utils";
import StarRating from "../../components/products/StarRating";
import AddToFav from "../../components/products/AddToFav";
import { AddtoCartForm } from "../../components/products/AddToCartForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

const ProductDetail = () => {
  const { productid } = useParams();
  const product = products.find((item) => item.id === productid);
  return (
    <div className="w-[90%] mx-auto my-10">
      <Button asChild variant={"outline"}>
        <Link
          to={"/products"}
          className="flex items-center gap-3"
          aria-label={product?.name}
        >
          <Icons.backIcon />
          All products
        </Link>
      </Button>
      <section className="flex flex-col gap-4   md:flex-row md:gap-8 lg:gap-16 my-6 ">
        <Carousel
          className="w-full md:w-1/2 "
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent>
            {product &&
              product?.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <img
                      src={img}
                      alt={product.name}
                      className="w-full rounded-md object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
        <Separator className=" md:hidden " />
        {/* detail */}
        <div className="flex flex-col w-full gap-4 md:w-1/2 p-0 md:p-2 ">
          <div className="space-y-2">
            <h2 className="line-clamp-1 font-bold text-2xl">{product?.name}</h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(Number(product?.price))}
            </p>
          </div>
          <Separator />
          <p className="text-base text-muted-foreground">
            {product?.inventory} in stock
          </p>

          <div className="flex items-center justify-between">
            <StarRating rating={Number(product?.rating)} />
            <AddToFav
              productid={Number(productid)}
              rating={Number(product?.rating)}
            />
          </div>
          <AddtoCartForm
            isStock={product?.status === "active" ? true : false}
          />
          <Separator />
          <Accordion
            type="single"
            collapsible
            className="w-full "
            defaultValue="item-1"
          >
            <AccordionItem
              value="item-1"
              className="border-none cursor-pointer"
            >
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product?.description ??
                  "Mo description is avaliable for this product."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <section className="space-y-6 mt-0 md:mt-5 ">
        <h2 className="text-2xl font-bold line-clamp-1">More Products</h2>
        <ScrollArea className="pb-8">
          <div className="flex gap-4">
            {products.slice(0, 4).map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                className="min-w-[260px]"
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
};

export default ProductDetail;
