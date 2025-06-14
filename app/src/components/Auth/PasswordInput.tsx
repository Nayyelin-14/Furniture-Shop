import * as React from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { EyeClosedIcon } from "lucide-react";
import { cn } from "../../lib/utils";
function PassworInput({ className, ...props }: React.ComponentProps<"input">) {
  const [showpassword, setShowpassword] = React.useState<boolean>(false);
  return (
    <div className="relative">
      <Input
        type={showpassword ? "text" : "password"}
        data-slot="input"
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        onClick={() => setShowpassword((prev) => !prev)}
        variant={"ghost"}
        size="sm"
        className="absolute right-0 top-0 h-full cursor-pointer hover:bg-transparent"
        disabled={props.value === "" || props.disabled}
      >
        {showpassword ? (
          <EyeOpenIcon className="w-4 h-4" aria-hidden="true" />
        ) : (
          <EyeClosedIcon className="w-4 h-4" aria-hidden="true" />
        )}
      </Button>
      <span className="sr-only">
        {showpassword ? "Hide Password" : "Show password"}
      </span>
    </div>
  );
}

export { PassworInput };
