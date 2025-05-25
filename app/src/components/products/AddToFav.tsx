import { type ButtonHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { cn } from "../../lib/utils";

interface FavProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  rating: number;
  productid: number;
}

const AddToFav = ({ productid, rating, className, ...props }: FavProps) => {
  return (
    <Button
      className={cn(
        `size-8 shrink-0 hover:text-red-600 cursor-pointer`,
        className
      )}
      variant={"secondary"}
      size={"icon"}
      {...props}
    >
      <Icons.heartIcon className="size-4 " />
    </Button>
  );
};

export default AddToFav;
