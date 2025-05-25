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
    .number()
    .min(1)
    .refine((val) => val >= 1, {
      message: "Quantity must be at least 1",
    }),
});

export function CartEdit() {
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
        className="flex  mt-5 justify-between items-center  "
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
        <div className="">
          <Button
            type="button"
            aria-label="Delete"
            size={"sm"}
            variant={"outline"}
            className="size-8 border cursor-pointer hover:text-red-500 border-black/20"
          >
            <Icons.trashIcon className="size-5 " aria-hidden="true" />
            <span className="sr-only">Delete Item</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
