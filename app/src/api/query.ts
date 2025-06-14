import { keepPreviousData, QueryClient } from "@tanstack/react-query";
import API from ".";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

const getPosts = async (q?: string) => {
  const response = await API.get(`users/allPosts${q ?? ""}`);
  return response.data;
};

export const postQuery = (q?: string) => ({
  queryKey: ["posts", q],
  queryFn: () => getPosts(q),
});

const getProducts = async (q?: string) => {
  const response = await API.get(`users/products${q ?? ""}`);
  return response.data;
};

export const productsQuery = (q?: string) => ({
  queryKey: ["products", q],
  queryFn: () => getProducts(q),
});

const fetchPostsWithCursor = async ({ pageParam = null }) => {
  const query = pageParam ? `?limit=6&cursor=${pageParam}` : "?limit=6";
  const response = await API.get(`users/allPosts${query}`);
  return response.data;
};

export const infinitePostQuery = () => ({
  queryKey: ["posts", "infinite"],
  queryFn: fetchPostsWithCursor,
  initialPageParam: null, //start with no cursor
  getNextPageParam: (lastpage, pages) => lastpage.newCursor ?? undefined,
});

const getSinglePost = async (postId: number) => {
  if (!postId) {
    throw new Error("Post id is required");
  }
  const response = await API.get(`users/post/${postId}`);

  return response.data;
};

export const SinglePostQuery = (postId: number) => ({
  queryKey: ["posts", "detail", postId],
  queryFn: () => getSinglePost(postId),
});

const getCategoriresandTypes = async () => {
  const response = await API.get(`users/categories-types`);

  return response.data;
};

export const CategoriresandTypesQuery = () => ({
  queryKey: ["category", "type"],
  queryFn: getCategoriresandTypes,
});

const fetchInfiniteProductswithFilters = async ({
  pageParam = null,
  categories = null,
  types = null,
}: {
  pageParam?: number | null;
  categories?: string | null;
  types?: string | null;
}) => {
  let query = pageParam ? `?limit=9&cursor=${pageParam}` : "?limit=9";
  if (categories) query += `&categories=${categories}`;
  if (types) query += `&types=${types}`;
  const response = await API.get(`users/products/${query}`);
  return response.data;
};

export const productsInfiniteQueryWithFilters = (
  categories: string | null = null,
  types: string | null = null
) => ({
  queryKey: [
    "products",
    "infinite",
    categories ?? undefined,
    types ?? undefined,
  ],
  queryFn: ({ pageParam }: { pageParam: number | null }) =>
    fetchInfiniteProductswithFilters({ pageParam, categories, types }),
  placeholderData: keepPreviousData,
  initialPageParam: null,
  getNextPageParam: (lastPage, pages) => lastPage.newCursor ?? undefined,
  // getPreviouspageParam: (firstPage, pages) => firstPage.prevCursor ?? undefined,
});

const singleProduct = async (productId: number) => {
  const response = await API.get(`users/products/${productId}`);
  return response.data;
};

export const singleProductQuery = (productId: number) => ({
  queryKey: ["product", productId],
  queryFn: () => singleProduct(productId),
});
