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
const cartSchema = z.object({
  quantity: z
    .number()
    .min(1)
    .refine((val) => val >= 1, {
      message: "Quantity must be at least 1",
    }),
});

interface isStockProps {
  isStock: boolean;
}
export function AddtoCartForm({ isStock }: isStockProps) {
  // ...

  const form = useForm<z.infer<typeof cartSchema>>({
    resolver: zodResolver(cartSchema),
    defaultValues: {
      quantity: 1,
    },
  });
  function onSubmit(values: z.infer<typeof cartSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);
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
          >
            <Icons.minus className="size-3" aria-hidden="true" />
            <span className="sr-only">Remove One Item</span>
          </Button>
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="example@gmail.com"
                    {...field}
                    className="h-8 w-16 rounded-none border-x-0 border-black/40"
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
              `bg-[#3b5d50] w-full font-bold cursor-pointer`,
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
            className="w-full font-bold cursor-pointer border border-black/20"
          >
            Add To Cart
          </Button>
        </div>
      </form>
    </Form>
  );
}
