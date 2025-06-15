import { AxiosError } from "axios";
import { redirect, type ActionFunctionArgs } from "react-router-dom";
import API, { authAPI } from "../../api";
import useAuthStore, { Status } from "../../store/authStore";
import { queryClient } from "../../api/query";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formdata = await request.formData();
  // const authData = {
  //   phone: formdata.get("phone"),
  //   password: formdata.get("password"),
  // };

  const authData = Object.fromEntries(formdata);
  try {
    const response = await authAPI.post("auth/login", authData);
    // const response = await fetch(import.meta.env.VITE_API_URL + "login", {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(authData), // authdata is object , string change pee poh
    //   credentials: "include",
    // });
    console.log(response);
    // const data = response.json(); // response ka A string formatted in JSON (JavaScript Object Notation) pyn lr , obj pyn change
    if (response.status !== 200) {
      console.log(response);
      // return { error: data || "Login failed" };
      return { error: response.data || "Login failed" };
    }

    const redirectTo = new URL(request.url).searchParams.get("redirect") || "/";
    return redirect(redirectTo); // ✅ this was missing
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Login Failed" };
    } else {
      throw error;
    }
  }
};

export const logoutAction = async () => {
  try {
    const response = await API.post("auth/logout");
    console.log(response);
    if (response.status !== 200) {
      return { error: response.data || "Logout failed" };
    } else {
      return redirect("/login");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Logout Failed" };
    } else {
      throw error;
    }
  }
};

export const registerAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState(); //getstate take state or initialState
  const data = await request.formData();
  const registerData = Object.fromEntries(data);
  try {
    const response = await API.post("auth/register", registerData);
    console.log(response);
    if (response.status !== 200) {
      return { error: response.data || "Registeration failed" };
    }

    authStore.setAuth(response.data.phone, response.data.token, Status.otp);
    return redirect("/register/otp");
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registeration Failed" };
    } else {
      throw error;
    }
  }
};

export const OTPAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState(); //getstate take state or initialState
  const data = await request.formData();
  const OTPData = {
    phone: authStore?.phone,
    token: authStore?.token,
    otp: data.get("otp"),
  };
  console.log(OTPData);
  try {
    const response = await API.post("auth/verify", OTPData);
    console.log(response);
    if (response.status !== 200) {
      return { error: response.data || "Verification OTP failed" };
    }
    authStore.setAuth(response.data.phone, response.data.token, Status.confirm);
    return redirect("/register/confirm-password");
    //
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Verification OTP Failed" };
    } else {
      throw error;
    }
  }
};

export const ConfirmPwdAction = async ({ request }: ActionFunctionArgs) => {
  const authStore = useAuthStore.getState(); //getstate take state or initialState
  const data = await request.formData();
  const ConfirmData = {
    phone: authStore?.phone,
    token: authStore?.token,
    password: data.get("password"),
  };
  try {
    const response = await API.post("auth/confirm-password", ConfirmData);

    if (response.status !== 201) {
      return { error: response.data || "Registeration failed" };
    }
    authStore.clearAuth();
    return redirect("/");
    //
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Registeration failed" };
    } else {
      throw error;
    }
  }
};

export const FavProductAction = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (!params.productId) {
    throw new Error("Product Id is not provided");
  }

  const data = {
    productId: Number(params.productId),
    isFavourite: formData.get("isFavourite") === "true", // true string so yin true boolean
  };

  try {
    const response = await API.patch("users/toggle-fav", data);

    if (response.status !== 200) {
      return { error: response.data || "Setting favourite failed" };
    }

    await queryClient.invalidateQueries({
      queryKey: ["product", "detail", params.productId],
    });

    return null;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      return error.response?.data || { error: "Setting favourite failed" };
    } else {
      throw error;
    }
  }
};
