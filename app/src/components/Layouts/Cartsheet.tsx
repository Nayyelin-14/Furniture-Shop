import { Link } from "react-router-dom";

import { Icons } from "../icons";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { formatPrice } from "../../lib/utils";
import CartItem from "../carts/CartItem";
import { useCartStore } from "../../store/cartStore";

export function Cartsheet() {
  const itemCount = useCartStore((state) => state.getTotalItems());
  const amountTotal = useCartStore((state) => state.getTotalPrice());
  const cartItems = useCartStore((state) => state.carts);
  // const itemCount = 4;
  // const amountTotal = 130;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer relative"
          size={"icon"}
        >
          <Icons.cartIcon aria-hidden="true" />
          {itemCount > 0 && (
            <Badge className="absolute size-5 -right-2 -top-2 rounded-full">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mt-3">
          <SheetTitle className="text-center text-2xl font-medium">
            {itemCount > 0 ? `Cart - ${itemCount}` : "Empty cart"}
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-[-10px]" />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="max-h-[60vh]  px-4 rounded-md  ">
              {cartItems &&
                cartItems.map((item) => (
                  <CartItem cartItem={item} key={item.id} />
                ))}
            </ScrollArea>
            <Separator />
            <SheetFooter>
              <div className="space-y-2 mb-3 text-md font-medium">
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total</span>

                  <span>{formatPrice(Number(amountTotal))}</span>
                </div>
              </div>
              <SheetClose asChild>
                <Button type="submit" asChild className="w-full">
                  <Link to={"/checkout"} aria-label="Checkout">
                    Continue to checkout
                  </Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <Icons.cartIcon className="size-16" />
            <p className="text-xl font-medium text-muted-foreground">
              Your Cart is empty
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
