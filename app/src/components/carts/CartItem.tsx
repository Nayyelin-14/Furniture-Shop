import type { Cart } from "../../types";
import { Separator } from "../ui/separator";
import { formatPrice } from "../../lib/utils";
import { CartEdit } from "./CartEdit";

interface ItemProps {
  cartItem: Cart;
}
const CartItem = ({ cartItem }: ItemProps) => {
  console.log(cartItem);
  return (
    <div className="space-y-3 mt-4">
      <div className="flex gap-3">
        <img
          src={cartItem.image.url}
          alt={cartItem.name}
          className="size-20 object-cover"
        />
        <div className="flex flex-col space-y-1 ">
          <span className="line-clamp-1 ">{cartItem.name}</span>
          <span className="text-sm text-muted-foreground ">
            {formatPrice(Number(cartItem.price))} x {cartItem.quantity} ={" "}
            {formatPrice(Number(cartItem.price * cartItem.quantity).toFixed(2))}
          </span>
          <span className="text-sm capitalize line-clamp-1 text-muted-foreground">
            {cartItem.category} / {cartItem.subcategory}
          </span>
        </div>
      </div>

      <CartEdit />
      <Separator />
    </div>
  );
};

export default CartItem;
