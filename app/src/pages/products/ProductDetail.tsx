import { useLoaderData, useNavigate } from "react-router-dom";
// import { products } from "../../data/products";
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
import { productsQuery, singleProductQuery } from "../../api/query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { ProductsType, Images } from "../../types";

const ProductDetail = () => {
  // const { productid } = useParams();
  const { productId } = useLoaderData();
  // const product = products.find((item) => item.id === productid);
  const { data: productDatas } = useSuspenseQuery(productsQuery("?limit=4"));
  const { data: productDetail } = useSuspenseQuery(
    singleProductQuery(Number(productId))
  );

  const img_path = import.meta.env.VITE_IMG_URL;

  const navigate = useNavigate();
  return (
    <div className="w-[90%] mx-auto my-10">
      <Button
        asChild
        variant={"outline"}
        className="cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <p
          className="flex items-center gap-3"
          aria-label={productDetail?.product.name}
        >
          <Icons.backIcon />
          All products
        </p>
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
            {productDetail &&
              productDetail?.product.images.map(
                (img: Images, index: number) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={img_path + img.path}
                        alt={productDetail.name}
                        className="w-full rounded-md object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </CarouselItem>
                )
              )}
          </CarouselContent>
        </Carousel>
        <Separator className=" md:hidden " />
        {/* detail */}
        <div className="flex flex-col w-full gap-4 md:w-1/2 p-0 md:p-2 ">
          <div className="space-y-2">
            <h2 className="line-clamp-1 font-bold text-2xl">
              {productDetail?.product.name}
            </h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(Number(productDetail?.product.price))}
            </p>
          </div>
          <Separator />
          <p className="text-base text-muted-foreground">
            {productDetail?.product.inventory} in stock
          </p>

          <div className="flex items-center justify-between">
            <StarRating rating={Number(productDetail?.product.rating)} />
            <AddToFav
              productid={Number(productId)}
              rating={Number(productDetail?.product.rating)}
              isFavouriteorNot={productDetail?.product.users.length === 1}
            />
          </div>
          <AddtoCartForm
            isStock={productDetail?.product.status === "active" ? true : false}
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
                {productDetail?.product.description ??
                  "No description is avaliable for this product."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      <section className="space-y-6 mt-0 md:mt-5 ">
        <h2 className="text-2xl font-bold line-clamp-1">More Products</h2>
        <ScrollArea className="pb-8">
          <div className="flex gap-4">
            {productDatas?.products.slice(0, 4).map((item: ProductsType) => (
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
