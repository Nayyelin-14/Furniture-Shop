import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { authAPI } from "../../api";
// import API from "../../api";
import useAuthStore, { Status } from "../../store/authStore";
import {
  CategoriresandTypesQuery,
  infinitePostQuery,
  postQuery,
  productsInfiniteQueryWithFilters,
  productsQuery,
  queryClient,
  SinglePostQuery,
  singleProductQuery,
} from "../../api/query";

export const HomeLoader = async () => {
  // try {
  //   const postRes = await API.get("users/allPosts?limit=6");
  //   const productsRes = await API.get("users/products?limit=4");
  //   if (productsRes.status !== 200 || postRes.status !== 200) {
  //     return { error: "Something weng wrong" };
  //   }
  //   return { productData: productsRes.data, postData: postRes.data };
  // } catch (error) {
  //   console.log("Error", error);
  // }
  /// ------normal loader------//

  //tanstack + loader
  await queryClient.ensureQueryData(productsQuery("?limit=5"));
  //   ဒါက queryKey နဲ့ queryFn တို့ဖြင့် query data တစ်ခုကို ရရှိပြီးသားလား? မရသေးဘူးလား? ဆိုတာစစ်ပြီး မရှိသေးရင် fetch လုပ်တယ်။ ရှိပြီးသားလျှင် cached data ကိုသာ ထားပါတယ်။ ဘယ်တော့မှ duplicate fetch မဖြစ်အောင် ကာကွယ်ပါတယ်။useQuery() သုံးမယ်ဆိုရင်, UI render မတိုင်မီ server side မှာသော်လည်းကောင်း၊ route change မတိုင်မီသော်လည်းကောင်း data ကို ကြိုတင် preload လုပ်ချင်တဲ့အခါ။
  await queryClient.ensureQueryData(postQuery("?limit=4"));
  return null;
};

export const authCheckLoader = async () => {
  try {
    const response = await authAPI.get("auth/auth-check");
    if (response.status !== 200) {
      return null;
    }
    return redirect("/");
  } catch (error) {
    console.log("Error", error);
  }
};

export const OtpCheckLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore && authStore.status !== Status.otp) {
    return redirect("/register");
  }
  return null;
};

export const ConfirmPwdCheckLoader = async () => {
  const authStore = useAuthStore.getState();

  if (authStore && authStore.status !== Status.confirm) {
    return redirect("/register/otp");
  }
  return null;
};

export const InfiniteBlogsLoader = async () => {
  await queryClient.ensureInfiniteQueryData(infinitePostQuery());
  //  useInfiniteQuery() ကိုသုံးတဲ့ query data အတွက် prefetch (ကြိုတင်ဖတ်သွင်း) လုပ်တာဖြစ်တယ်။ infiniteQuery ဟာ pagination တစ်ခုချင်းစီအတွက် data တောင်းတယ်။ အဲ့ဒါကို preload လုပ်ထားချင်တဲ့အခါ ensureInfiniteQueryData() သုံးတယ်။await queryClient.ensureInfiniteQueryData(infinitePostQuery()); ဒီကတော့ infinitePostQuery() ဆိုတဲ့ pagination query ကို ကြိုတင် preload လုပ်တယ်။ UI မှာ scroll မလုပ်သေးတောင်, page 1 data ကိုသွားခေါ်သိမ်းထားတယ်။🧠 ဘာအတွက် အသုံးဝင်လဲ?
  // Route-based Prefetching: Page တစ်ခုကို ဝင်မယ်ဆိုရင်, UI render မတိုင်ခင် data တွေ preload လုပ်ပြီး loading time လျှော့ချတယ်။ SSR (Server-Side Rendering): Server side မှာ data တွေ preload လုပ်ပြီး client မှာ hydration လုပ်ဖို့။Performance Optimization: Query ထပ်ခါတလဲလဲ fetch မဖြစ်စေဘဲ, cache ထဲမှာရှိနေစေတယ်။
  return null;
};

export const SinglePostLoader = async ({ params }: LoaderFunctionArgs) => {
  console.log(params);
  if (!params.postId) {
    throw new Error("Post id is not provided");
  }
  await queryClient.ensureQueryData(postQuery("?limit=6"));
  await queryClient.ensureQueryData(SinglePostQuery(Number(params.postId)));
  return { postId: params.postId };
};

export const GetProductsWithFilers = async () => {
  await queryClient.ensureQueryData(CategoriresandTypesQuery());
  // await queryClient.prefetchInfiniteQuery(productsInfiniteQueryWithFilters());
  await queryClient.ensureInfiniteQueryData(productsInfiniteQueryWithFilters());
  return null;
};

export const singleProductLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.productId) {
    throw new Error("Product id is not provided");
  }
  console.log(params.productId);
  await queryClient.ensureQueryData(productsQuery("?limit=4"));
  await queryClient.ensureQueryData(
    singleProductQuery(Number(params.productId))
  );

  return { productId: params.productId };
};
