import { Link } from "react-router";
import { Icons } from "../../components/icons";
import { RegisterForm } from "../../components/Auth/RegisterForm";
function Register() {
  return (
    <div className="relative min-h-screen">
      <Link
        to="#"
        className="fixed left-8 top-6 flex items-center text-lg font-bold tracking-tight text-foreground/80 transition-colors hover:text-foreground z-10"
      >
        <Icons.logo className="mr-2 size-6" aria-hidden="true" />
        <span>Furniture Shop</span>
      </Link>
      <main className="flex items-center justify-center min-h-screen ">
        <RegisterForm />
      </main>
    </div>
  );
}

export default Register;
