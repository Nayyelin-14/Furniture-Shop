import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { lazy, Suspense } from "react";
import RootLayout from "./pages/RootLayout";
import NotFound from "./pages/NotFound";
import About from "./pages/About";

import Services from "./pages/Services";

const BlogLayout = lazy(() => import("./pages/blogs/BlogLayout"));
const BlogDetail = lazy(() => import("./pages/blogs/BlogDetail"));
const Blog = lazy(() => import("./pages/blogs/Blog"));
import ProductLayout from "./pages/products/ProductLayout";
import { Products } from "./pages/products/Products";
import ProductDetail from "./pages/products/ProductDetail";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

const SusepnseFallback = () => (
  <div className="text-center h-screen">Loading</div>
);
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "About",
        element: <About />,
      },
      {
        path: "blogs",
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <BlogLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SusepnseFallback />}>
                <Blog />
              </Suspense>
            ),
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<SusepnseFallback />}>
                <BlogDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "products",
        element: <ProductLayout />,
        children: [
          {
            index: true,
            element: <Products />,
          },
          {
            path: ":productid",
            element: <ProductDetail />,
          },
        ],
      },

      {
        path: "services",
        element: <Services />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
