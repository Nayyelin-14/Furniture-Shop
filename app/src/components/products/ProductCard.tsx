import { Link } from "react-router-dom";
import type { ProductsType } from "../../types";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Icons } from "../icons";
import { cn, formatPrice } from "../../lib/utils";
import { useCartStore } from "../../store/cartStore";

interface ProductsProps extends React.HTMLAttributes<HTMLDivElement> {
  product: ProductsType;
}
const img_path = import.meta.env.VITE_IMG_URL;
const ProductCard = ({ product, className }: ProductsProps) => {
  const { carts, addItem } = useCartStore();
  const existedCartItem = carts.find((item) => item.id === product.id);
  const addToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].path,
      quantity: 1,
    });
  };
  return (
    <Card
      className={cn(
        "size-full pt-0 overflow-hidden rounded-lg border border-black/10",
        className
      )}
    >
      <Link to={`/products/${product.id}`} aria-label={product.name}>
        <CardHeader className="p-0">
          <AspectRatio ratio={1 / 1} className="bg-muted p-0">
            <img
              src={img_path + product.images[0].path}
              alt="Image"
              className="size-full p-0 object-contain"
              loading="lazy"
              decoding="async"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="space-y-3 mt-3">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(product.price)}
            {product.discount > 0 && (
              <span className="ml-2 font-extralight line-through">
                {formatPrice(product.discount)}
              </span>
            )}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter>
        {product.status === "INACTIVE" ? (
          <>
            <Button
              variant="secondary"
              size={"sm"}
              disabled={true}
              aria-label="Sold Out"
              className="h-8 w-full rounded-sm bg-gray-500 text-white"
            >
              Sold Out
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size={"sm"}
              aria-label="Add to Cart"
              className="h-8 w-full rounded-sm cursor-pointer bg-[#3b5d50]  text-white font-medium"
              onClick={addToCart}
              disabled={!!existedCartItem}
            >
              {existedCartItem && <Icons.plus />}
              {existedCartItem ? "Added Item" : "Add To Cart"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
