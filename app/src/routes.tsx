import { createBrowserRouter, redirect } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { lazy, Suspense } from "react";
import RootLayout from "./pages/RootLayout";
const NotFound = lazy(() => import("./pages/NotFound"));
const Services = lazy(() => import("./pages/Services"));

const BlogLayout = lazy(() => import("./pages/blogs/BlogLayout"));
const BlogDetail = lazy(() => import("./pages/blogs/BlogDetail"));
const Blog = lazy(() => import("./pages/blogs/Blog"));
const About = lazy(() => import("./pages/About"));
const ProductDetail = lazy(() => import("./pages/products/ProductDetail"));

const Products = lazy(() => import("./pages/products/Products"));
import ProductLayout from "./pages/products/ProductLayout";
import Login from "./pages/Auth/Login";

import {
  ChangeNewPwdAction,
  changePwdConfirmAction,
  ConfirmPwdAction,
  FavProductAction,
  loginAction,
  logoutAction,
  NewPwdAction,
  NewPwdOTPAction,
  OTPAction,
  registerAction,
  resetPasswordAction,
} from "./router/actions";
import {
  authCheckLoader,
  ChangePasswordLoader,
  ConfirmPwdCheckLoader,
  GetProductsWithFilers,
  HomeLoader,
  InfiniteBlogsLoader,
  NewPwdCheckLoader,
  NewPwdOtpCheckLoader,
  OtpCheckLoader,
  SinglePostLoader,
  singleProductLoader,
} from "./router/loaders";
import AuthRootLayout from "./pages/Auth/AuthRootLayout";
import SingUpPage from "./pages/Auth/SignUp";
import OtpPage from "./pages/Auth/OtpPage";
import ConfirmPwdPage from "./pages/Auth/ConfirmPwd";
import ResetPage from "./pages/Auth/ResetPage";
import VerifyOtpPage from "./pages/Auth/VerifyOtpPage";
import NewPwdPage from "./pages/Auth/NewPwdPage";
import ChangePwd from "./pages/Auth/ChangePwd";

const SusepnseFallback = () => (
  <div className="text-center h-screen">Loading</div>
);
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    element: <RootLayout />,

    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <Homepage />
          </Suspense>
        ),
        loader: HomeLoader,
      },
      {
        path: "About",
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <About />
          </Suspense>
        ),
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
            loader: InfiniteBlogsLoader,
          },
          {
            path: ":postId",
            element: (
              <Suspense fallback={<SusepnseFallback />}>
                <BlogDetail />
              </Suspense>
            ),
            loader: SinglePostLoader,
          },
        ],
      },
      {
        path: "products",
        element: <ProductLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SusepnseFallback />}>
                <Products />
              </Suspense>
            ),
            loader: GetProductsWithFilers,
          },
          {
            path: ":productId",
            element: (
              <Suspense fallback={<SusepnseFallback />}>
                <ProductDetail />
              </Suspense>
            ),
            loader: singleProductLoader,
            action: FavProductAction,
          },
        ],
      },

      {
        path: "services",
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <Services />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<SusepnseFallback />}>
        <Login />
      </Suspense>
    ),
    action: loginAction,
    loader: authCheckLoader,
  },
  {
    path: "/register",
    element: <AuthRootLayout />,

    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <SingUpPage />
          </Suspense>
        ),
        loader: authCheckLoader,
        action: registerAction,
      },
      {
        path: "otp",
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <OtpPage />
          </Suspense>
        ),
        loader: OtpCheckLoader,
        action: OTPAction,
      },
      {
        path: "confirm-password",
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <ConfirmPwdPage />
          </Suspense>
        ),
        loader: ConfirmPwdCheckLoader,
        action: ConfirmPwdAction,
      },
    ],
  },
  {
    path: "/logout",
    action: logoutAction,
    loader: () => {
      return redirect("/");
    },
  },
  {
    path: "/reset-password",
    element: <AuthRootLayout />,
    loader: authCheckLoader,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <ResetPage />
          </Suspense>
        ),

        action: resetPasswordAction,
      },
      {
        path: "verify-otp",
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <VerifyOtpPage />
          </Suspense>
        ),
        loader: NewPwdOtpCheckLoader,
        action: NewPwdOTPAction,
      },
      {
        path: "new-password",
        element: (
          <Suspense fallback={<SusepnseFallback />}>
            <NewPwdPage />
          </Suspense>
        ),
        loader: NewPwdCheckLoader,
        action: NewPwdAction,
      },
    ],
  },
  {
    path: "/change-password-confirm",
    action: changePwdConfirmAction,
  },
  {
    path: "/change-password",
    element: (
      <Suspense fallback={<SusepnseFallback />}>
        <ChangePwd />
      </Suspense>
    ),
    loader: ChangePasswordLoader,
    action: ChangeNewPwdAction,
  },
]);

export default router;
