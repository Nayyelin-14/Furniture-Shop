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

const cartSchema = z.object({
  quantity: z
    .string()
    .min(1, "Quantity must be at least 1")
    .max(4, "Too many items")
    .regex(/^\d+$/, "Must be a number"),
});
interface onEditProps {
  onDelete: () => void;
  onUpdate: (quantity: number) => void;
  quantity: number;
}

export function CartEdit({ onDelete, onUpdate, quantity }: onEditProps) {
  // ...

  const form = useForm<z.infer<typeof cartSchema>>({
    resolver: zodResolver(cartSchema),
    defaultValues: {
      quantity: quantity.toString(),
    },
  });
  function onSubmit(values: z.infer<typeof cartSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);
    toast.success("Added to cart successfully");
  }

  const { setValue, watch } = form;
  const currentQuan = Number(watch("quantity"));

  const quanDecrease = () => {
    const updateQuantity = Math.max(currentQuan - 1, 0);
    setValue("quantity", updateQuantity.toString());
    onUpdate(updateQuantity);
  };
  const quanIncrease = () => {
    const updateQuantity = Math.min(currentQuan + 1, 9999);
    setValue("quantity", updateQuantity.toString());
    onUpdate(updateQuantity);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex  mt-5 justify-between items-center  "
        autoComplete="off"
      >
        <div className="flex items-center w-full">
          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            className="size-8 shrink-0 rounded-r-none border border-black/40 cursor-pointer"
            onClick={quanDecrease}
            disabled={currentQuan === 0}
          >
            <Icons.minus className="size-3" aria-hidden="true" />
            <span className="sr-only">Remove One Item</span>
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">{quantity}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="example@gmail.com"
                    {...field}
                    className="h-8 w-16 rounded-none border-x-0 border-black/40 text-center  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            disabled={currentQuan > 9999}
          >
            <Icons.plus className="size-3" aria-hidden="true" />
            <span className="sr-only">Plus One Item</span>
          </Button>
        </div>
        <div className="">
          <Button
            type="button"
            aria-label="Delete"
            size={"sm"}
            variant={"outline"}
            onClick={onDelete}
            className="size-8 border cursor-pointer hover:text-red-500 border-black/20 "
          >
            <Icons.trashIcon className="size-5 " aria-hidden="true" />
            <span className="sr-only">Delete Item</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
