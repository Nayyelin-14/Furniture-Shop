import type { MainNavItem } from "../../types";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config/site";
import { ScrollArea } from "../ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useEffect, useState } from "react";
interface MenuType {
  items?: MainNavItem[];
}
const MobileNavigation = ({ items }: MenuType) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  const query = "(min-width: 1024px)";

  useEffect(() => {
    const onchange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches); //event.matche = A boolean value — it tells you whether the media query now matches after the change.
    };
    const result = matchMedia(query);

    result.addEventListener("change", onchange);

    return () => result.removeEventListener("change", onchange);
  }, [query]);
  if (isDesktop) {
    return null;
  }
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size={"icon"}>
            <Icons.menu aria-hidden="true" className="font-bold size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-9">
          <SheetClose asChild>
            <Link to={"/"} className=" flex items-center">
              <Icons.logo className="size-6 mr-2" />
              <span className="font-bold">{siteConfig.name}</span>
              <span className="sr-only">Home</span>
            </Link>
          </SheetClose>
          <ScrollArea className="my-4 h-calc(100vh-8rem)]">
            {" "}
            <Accordion type="multiple" className="w-full">
              <AccordionItem value={items?.[0]?.title!}>
                <AccordionTrigger>{items?.[0]?.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2 pl-2">
                    {items?.[0]?.card &&
                      items?.[0]?.card?.map((item) => (
                        <SheetClose asChild key={item.title}>
                          <Link to={item.href!} className="text-gray-500/80">
                            {item.title}
                          </Link>
                        </SheetClose>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="h-[1px] w-full bg-black/50" />
            <div className="flex flex-col space-y-2 mt-4 ">
              {items?.[0]?.menu &&
                items?.[0]?.menu?.map((item) => (
                  <SheetClose asChild key={item.title}>
                    <Link to={item.href!}>{item.title}</Link>
                  </SheetClose>
                ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
