import { Link } from "react-router-dom";
import couch from "../data/images/couch.png";
import { Button } from "../components/ui/button";
import { CarouselCard } from "../components/products/CarouselCard";
import { products } from "../data/products";
import BlogCards from "../components/blogs/BlogCards";
import { posts } from "../data/posts";
import ProductCard from "../components/products/ProductCard";

const Homepage = () => {
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

  const sampleBlogs = posts.slice(0, 3);
  const sampleProducts = products?.slice(0, 4);
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
      <CarouselCard products={products} />
      <Title
        title="Featured Products"
        herf="/products"
        linkText="View All Products"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:px-0 gap-8">
        {sampleProducts &&
          sampleProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
      </div>
      <Title title="Recent Blogs" herf="/blogs" linkText="View All Blogs" />
      <BlogCards posts={sampleBlogs} />
    </section>
  );
};

export default Homepage;
