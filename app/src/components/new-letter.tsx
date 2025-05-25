import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { useState } from "react";
import { Loader2 } from "lucide-react";
const emailSchema = z.object({
  email: z.string().email({
    message: "Email must be valid.",
  }),
});

export function SubscribeForm() {
  // ...

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  function onSubmit(values: z.infer<typeof emailSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="relative space-y-0">
              <FormLabel className="sr-only">email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@gmail.com"
                  {...field}
                  className="pr-12 border-black/40"
                />
              </FormControl>

              <FormMessage />
              <Button
                size={"icon"}
                className="absolute right-[1.5px] top-[4px] size-7 z-20"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin cursor-not-allowed" />
                ) : (
                  <Icons.arrow className="size-4" aria-hidden="true" />
                )}
                <span className="sr-only">Join Subscribe</span>
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
