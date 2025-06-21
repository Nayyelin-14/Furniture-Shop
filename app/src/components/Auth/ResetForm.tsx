import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { LoaderCircle } from "lucide-react";
export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const submit = useSubmit();
  const navigate = useNavigation();
  const isSubmitting = navigate.state === "submitting";
  const actionData = useActionData();

  const resetFormSchema = z.object({
    phone: z
      .string()
      .min(7, "Phone number is too short")
      .max(12, "Phone number is too long")
      .regex(/^\d+$/, "Phone number must be a number"),
  });

  const form = useForm<z.infer<typeof resetFormSchema>>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      phone: "",
    },
  });
  const registerSubmit = (values: z.infer<typeof resetFormSchema>) => {
    submit(values, { method: "post", action: "." }); // dot (.) means current route , cause form under register page with index true
    console.log(values);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <Icons.logo className="h-10 w-10" aria-hidden="true" />
            </div>
            <span className="sr-only">Welcome to NEXT Furniture</span>
          </a>
          <h1 className="text-xl font-bold">Welcome to NEXT Furniture</h1>
          <h1 className="text-md font-bold">Reset Password</h1>
          <div className="text-center text-sm">
            Remember your password?{" "}
            <a href="/login" className="underline underline-offset-4">
              Sign In
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(registerSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="phone"
                        type="text"
                        placeholder="09777********"
                        required
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter phone number to reset your password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {actionData && (
                <p className="text-sm text-red-700">{actionData?.message}</p>
              )}
              <Button
                type="submit"
                className={cn(
                  `${
                    isSubmitting && "bg-gray-300 text-black"
                  } w-full cursor-pointer hover:bg-black/60`
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Request OTP"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our
        <Link to="#">Terms of Service</Link> and{" "}
        <Link to="#">Privacy Policy</Link>.
      </div>
    </div>
  );
}
