import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { cn } from "../../lib/utils";
import { useCartStore } from "../../store/cartStore";
import { useEffect } from "react";
const cartSchema = z.object({
  quantity: z
    .string()
    .min(1, "Quantity must be at least 1")
    .max(4, "Too many items")
    .regex(/^\d+$/, "Must be a number"),
});
interface isStockProps {
  isStock: boolean;
  onUpdateCart: (quantity: number) => void;
  productId: number;
}
export function AddtoCartForm({
  isStock,
  onUpdateCart,
  productId,
}: isStockProps) {
  // ...
  const existedCartItem = useCartStore((state) =>
    state.carts.find((item) => item.id === productId)
  );

  const form = useForm<z.infer<typeof cartSchema>>({
    resolver: zodResolver(cartSchema),
    defaultValues: {
      quantity: existedCartItem ? existedCartItem.quantity.toString() : "1",
    },
  });

  const { setValue, watch } = form;
  const currentQuantity = Number(watch("quantity"));

  useEffect(() => {
    if (existedCartItem) {
      setValue("quantity", existedCartItem.quantity.toString(), {
        shouldValidate: true,
      });
    }
  }, [existedCartItem, setValue]);

  const quanIncrease = () => {
    const updateQuantity = Math.min(currentQuantity + 1, 9999);
    setValue("quantity", updateQuantity.toString(), { shouldValidate: true });
  };

  const quanDecrease = () => {
    const updateQuantity = Math.max(currentQuantity - 1, 0);
    setValue("quantity", updateQuantity.toString(), { shouldValidate: true });
  };

  function onSubmit(values: z.infer<typeof cartSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    onUpdateCart(Number(values.quantity));
    toast.success("Added to cart successfully");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex max-w-[200px] gap-4 flex-col "
        autoComplete="off"
      >
        <div className="flex items-center w-full">
          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            className="size-8 shrink-0 rounded-r-none border border-black/40 cursor-pointer"
            onClick={quanDecrease}
            disabled={currentQuantity <= 1}
          >
            <Icons.minus className="size-3" aria-hidden="true" />
            <span className="sr-only">Remove One Item</span>
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">
                  {existedCartItem ? existedCartItem.quantity : 1}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="example@gmail.com"
                    {...field}
                    className="h-8 w-16 rounded-none border-x-0 border-black/40 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            className="size-8 shrink-0 rounded-l-none border border-black/40 cursor-pointer"
            onClick={quanIncrease}
            disabled={currentQuantity >= 9999}
          >
            <Icons.plus className="size-3" aria-hidden="true" />
            <span className="sr-only">Plus One Item</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2.5 w-[65%]">
          <Button
            type="button"
            aria-label="Buy Now"
            size={"sm"}
            className={cn(
              `bg-[#3c715d] w-full font-bold cursor-pointer`,
              !isStock && "bg-slate-500"
            )}
          >
            Buy Now
          </Button>
          <Button
            type="submit"
            aria-label="Add To Cart"
            size={"sm"}
            variant={isStock ? "outline" : "default"}
            className={cn(`w-full font-semibold cursor-pointer`)}
          >
            {existedCartItem ? "Update Cart" : "Add To Cart"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
