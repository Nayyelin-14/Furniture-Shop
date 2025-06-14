import MainNavigation from "./MainNavigation";
import { siteConfig } from "../../config/site";
import MobileNavigation from "./MobileNavigation";
import { ModeToggle } from "../mode-toggle";
import AuthDropDown from "./AuthDropDown";
import { User } from "../../data/user";
import { Cartsheet } from "./Cartsheet";
import Progressbar from "../ui/progressbar";

const Header = () => {
  return (
    <header className="w-full border-b sticky top-0 z-50 border bg-background">
      <Progressbar />
      <nav className="container flex items-center justify-between  h-16 mx-auto w-[90%]">
        <div>
          <MainNavigation items={siteConfig.mainNav} />
          <MobileNavigation items={siteConfig.mainNav} />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Cartsheet />
          <ModeToggle />
          <AuthDropDown user={User} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
