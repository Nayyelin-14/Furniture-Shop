import { Link } from "react-router-dom";
import { Icons } from "../icons";
import { siteConfig } from "../../config/site";
import { SubscribeForm } from "../new-letter";

const Footer = () => {
  return (
    <footer className="w-full border-t border-black/50">
      <div
        className="container mx-auto w-[90%] pb-8 pt-6 
      lg:py-6"
      >
        <section className="flex  flex-col lg:justify-between lg:flex-row gap-10 lg:gap-20">
          <section>
            <Link to={"/"} className="flex items-center space-x-2 ">
              <Icons.logo className="size-6" aria-hidden="true" />
              <span className="font-bold">{siteConfig.name}</span>
              <span className="sr-only">home</span>
            </Link>
          </section>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {siteConfig?.footerNav?.map((item) => (
              <div className="space-y-3" key={item.title}>
                <h4 className="font-semibold">{item.title}</h4>
                <ul>
                  {item.items.map((i) => (
                    <li key={i.title}>
                      <Link
                        target={i.external ? "_blank" : ""}
                        to={i.href}
                        className="text-muted-foreground text-sm hover:text-foreground"
                      >
                        {i.title}
                        <span className="sr-only">{i.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          <section className=" space-y-3">
            <h3 className="font-medium"> Subscribe to our new letter</h3>
            <SubscribeForm />
          </section>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
