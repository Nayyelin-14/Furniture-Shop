import Banner from "@/data/images/house.webp";
import { Icons } from "../../components/icons";
import { LoginForm } from "../../components/Auth/LoginForm";
function Login() {
  return (
    <div className="relative w-full min-h-screen ">
      <div className="fixed left-8 top-6 flex items-center text-lg font-bold tracking-tight text-foreground/80 transition-colors hover:text-foreground">
        <Icons.logo className="mr-2 size-6" aria-hidden="true" />
        <span>Furniture Shop</span>
      </div>
      <main className="grid max-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex w-full h-screen place-content-center px-4  overflow-hidden">
          <LoginForm />
        </div>
        <div className="relative hidden lg:block">
          <img
            src={Banner}
            alt="Furniture Shop"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </main>
    </div>
  );
}

export default Login;
