import { Link, useLocation } from "react-router-dom";
import couch from "../data/images/couch.png";
import { Button } from "../components/ui/button";
import { CarouselCard } from "../components/products/CarouselCard";
// import { products } from "../data/products";
import BlogCards from "../components/blogs/BlogCards";

import ProductCard from "../components/products/ProductCard";
import type { ProductsType } from "../types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postQuery, productsQuery } from "../api/query";

const Homepage = () => {
  // const { productData, postData } = useLoaderData();

  // const {
  //   data: productData,
  //   isError: isProductError,
  //   error: productError,
  //   isLoading: isProductLoading,
  //   refetch: productRefetch,
  // } = useQuery(productsQuery("?limit=8"));

  // const {
  //   data: postData,
  //   isError: isPostError,
  //   error: postError,
  //   isLoading: isPostLoading,
  //   refetch: postRefetch,
  // } = useQuery(postQuery("?limit=3"));
  // console.log(postData);
  // if (isProductLoading && isPostLoading) {
  //   return (
  //     <p className="flex items-center justify-center h-screen text-2xl text-red-700 font-bold">
  //       Loading.....
  //     </p>
  //   );
  // }
  // if (isPostError && isProductError) {
  //   return (
  //     <div className="flex items-center justify-center h-screen gap-10 flex-col p-4 border border-black/10 shadow-md">
  //       <p className=" text-2xl text-red-700 font-bold">
  //         {postError.message} & {productError.message}
  //       </p>
  //       <Button
  //         variant={"secondary"}
  //         onClick={() => {
  //           productRefetch();
  //           postRefetch();
  //         }}
  //       >
  //         Try Again
  //       </Button>
  //     </div>
  //   );
  // }
  //
  const { data: productData } = useSuspenseQuery(productsQuery("?limit=8"));
  const { data: postData } = useSuspenseQuery(postQuery("?limit=3"));
  const Title = ({
    title,
    herf,
    linkText,
  }: {
    title: string;
    herf: string;
    linkText: string;
  }) => {
    return (
      <div className="flex flex-col md:flex-row md:items-center  md:justify-between  my-10 gap-6 md:gap-0">
        <h2 className="text-2xl font-bold ">{title}</h2>
        <Link
          to={herf}
          className="text-muted-foreground font-semibold underline"
        >
          {linkText}
        </Link>
      </div>
    );
  };
  // console.log(postData);
  // const sampleBlogs = posts.slice(0, 3);
  // const posts = postData?.posts;
  // const sampleProducts = products?.slice(0, 4);
  // const Products = productData.products;

  const location = useLocation();
  const keys = location.state?.keys;
  console.log(location);
  const productsLink = `/products${keys ? `?${keys}` : ""}`;

  return (
    <section className="mx-auto max-w-[90%] my-10">
      <div className="flex  flex-col lg:flex-row  lg:justify-between  lg:gap-10 ">
        <div className="text-center my-8 lg:mt-20 lg:mb-0 lg:text-left lg:w-2/5 ">
          <h1 className="text-4xl font-extrabold mb-4 lg:mb-8 lg:text-6xl text-[#3b5d50] ">
            Modern Interior Design Studio
          </h1>
          <p className="mb-6 lg:mb-8">
            Discover stylish, high-quality furniture for every room. From modern
            designs to timeless classics, we help you create spaces that feel
            like home.
          </p>
          <div className="">
            <Button
              asChild
              className="mr-2 rounded-full bg-orange-300 px-8 py-6  text-base font-bold"
            >
              <Link to={"/"}>Shop Now</Link>
            </Button>
            <Button
              variant={"outline"}
              asChild
              className="rounded-full  px-8 py-6  text-base font-bold text-[#3b5d50] "
            >
              <Link to={"/"}>Explore</Link>
            </Button>
          </div>
        </div>
        <img src={couch} alt="Couch" className="lg:w-3/5" />
      </div>
      {productData && <CarouselCard products={productData.products} />}
      <Title
        title="Featured Products"
        herf={productsLink}
        linkText="View All Products"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:px-0 gap-8">
        {productData &&
          productData.products
            .slice(0, 4)
            .map((product: ProductsType) => (
              <ProductCard product={product} key={product.id} />
            ))}
      </div>
      <Title title="Recent Blogs" herf="/blogs" linkText="View All Blogs" />
      {postData && <BlogCards posts={postData.posts} />}
    </section>
  );
};

export default Homepage;
