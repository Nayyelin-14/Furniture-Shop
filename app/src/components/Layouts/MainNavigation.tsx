import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import type { MainNavItem } from "../../types";
import { siteConfig } from "../../config/site";
import { Icons } from "../icons";

interface MenuType {
  items?: MainNavItem[];
}
const MainNavigation = ({ items }: MenuType) => {
  return (
    <div className="hidden lg:flex items-center gap-[1.5rem]">
      <Link to={"/"} className="flex items-center space-x-2">
        <Icons.logo className="size-7" aria-hidden="true" />
        <span className="text-lg font-bold">{siteConfig.name}</span>
        <span className="sr-only">Home</span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {items?.[0]?.card ? (
            <NavigationMenuItem>
              <NavigationMenuTrigger>{items?.[0].title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex size-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        to="/products"
                      >
                        <Icons.logo className="size-6" aria-hidden="true" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          {siteConfig.name}
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          {siteConfig.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {items?.[0]?.card?.map((item) => (
                    <ListItem
                      key={item.title}
                      href={item.href}
                      title={item.title}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : null}

          {items?.[0]?.menu &&
            items?.[0]?.menu?.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink asChild>
                  <Link
                    to={item.href!}
                    className={navigationMenuTriggerStyle()}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
          to={String(href)}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
export default MainNavigation;
