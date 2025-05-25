import BlogPostsList from "../../components/blogs/BlogPostsList";
import { posts } from "../../data/posts";

const Blog = () => {
  return (
    <div className="w-[90%] mx-auto">
      <h1 className="mt-6 text-center text-2xl font-bold md:text-left">
        Latest Blog Posts
      </h1>
      <BlogPostsList posts={posts} />
    </div>
  );
};

export default Blog;
