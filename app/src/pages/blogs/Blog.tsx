import { useInfiniteQuery } from "@tanstack/react-query";
import BlogPostsList from "../../components/blogs/BlogPostsList";

import { infinitePostQuery } from "../../api/query";
import { Button } from "../../components/ui/button";

const Blog = () => {
  const {
    isFetching,
    data,
    status,
    error,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(infinitePostQuery());
  console.log(data);

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];
  return status === "pending" ? (
    <p className="flex items-center justify-center h-screen text-2xl">
      Loading....
    </p>
  ) : status === "error" ? (
    <p className="flex items-center justify-center h-screen text-2xl text-red-600">
      {error.message}
    </p>
  ) : (
    <div className="w-[90%] mx-auto">
      <h1 className="mt-6 text-center text-2xl font-bold md:text-left">
        Latest Blog Posts
      </h1>
      <BlogPostsList posts={allPosts} />
      <div className="my-5 flex justify-center items-center">
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="cursor-pointer"
          variant={!hasNextPage ? "ghost" : "secondary"}
        >
          {isFetchingNextPage // when data is loading, it shows:
            ? "Loading more"
            : hasNextPage
            ? "Load more" //If there are more pages to load
            : "Nothing more"}
          {/* //no more posts */}
        </Button>
      </div>
      <div>
        {isFetching && !isFetchingNextPage ? "Background updating" : null}
      </div>
    </div>
  );
};

export default Blog;
