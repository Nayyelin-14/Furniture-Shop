import type { UserType } from "../../types";
import { Button } from "../ui/button";
import { Form, Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "../icons";

interface UserProps {
  user: UserType;
}
const AuthDropDown = ({ user }: UserProps) => {
  if (!user) {
    return (
      <Button asChild variant={"secondary"} className="border border-black/20">
        <Link to={"/signin"}>
          Sign In <span className="sr-only">Sign In</span>
        </Link>
      </Button>
    );
  }

  const initialName = `${user.firstName.charAt(0) ?? ""}${
    user.lastName.charAt(0) ?? ""
  }`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className=" size-10 rounded-full ">
          <Avatar className="size-10 border border-black/20 shadow-lg">
            <AvatarImage src={user.imageUrl} alt="@profile" aria-label="true" />
            <AvatarFallback className="text-bold text-black">
              {initialName}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="space-y-2 flex flex-col">
            <p className="">
              {user.firstName + " "}
              {user.lastName}
            </p>
            <p className=" text-sm  leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              to={"#"}
              className="group flex items-center gap-2 cursor-pointer"
            >
              <Icons.dsashboardIcon className="group-hover:text-blue-900 transition-transform duration-300 group-hover:rotate-120" />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to={"#"}
              className="group flex items-center gap-2 cursor-pointer"
            >
              <Icons.settingIcon className="group-hover:text-red-900 transition-transform duration-300 group-hover:rotate-90" />
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="group flex items-center gap-2 cursor-pointer w-full bg-transparent text-black hover:bg-transparent border-none "
            >
              <Icons.exitIcon className="group-hover:text-red-900 transition-transform duration-300 group-hover:scale-110" />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </button>
          </Form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthDropDown;
