import { Outlet } from "react-router-dom";
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen over-flow-hidden">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
