import { Link, useParams } from "react-router-dom";
import { posts } from "../../data/posts";
import { Button } from "../../components/ui/button";
import { Icons } from "../../components/icons";
import TextPurify from "../../components/TextPurify";

const BlogDetail = () => {
  const { id } = useParams();

  const post = posts.find((item) => item.id === id);
  return (
    <div className="mx-auto w-[90%] my-10">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-0">
        <section className="w-full lg:w-3/4 lg:pr-16 space-y-4">
          <Button variant={"outline"} asChild>
            <Link to={"/blogs"}>
              <Icons.backIcon />
              All posts
            </Link>
          </Button>
          {post ? (
            <>
              <h3 className="text-xl lg:text-3xl font-extrabold ">
                {post.title}
              </h3>
              <div className=" text-sm">
                <span>
                  by <span className="font-[600]">{post.author}</span>
                  <span className="font-[600]">{post.updated_at}</span>
                </span>
              </div>
              <h3 className="text-base font-medium">{post.content}</h3>
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-xl"
              />
              <TextPurify content={post.body} />
              <div className="space-x-4">
                {post &&
                  post.tags.map((tag) => (
                    <Button
                      key={tag}
                      variant={"secondary"}
                      className="border border-black/10 "
                    >
                      {tag}
                    </Button>
                  ))}
              </div>
            </>
          ) : (
            <p className="mb-16 mt-8 text-center text-xl   font-bold text-muted-foreground lg:mt-24">
              No post Found
            </p>
          )}
        </section>
        <section className="w-full lg:w-1/4 lg:mt-16 space-y-4">
          <div className="flex  gap-3 items-center ">
            <Icons.layers className="size-5" />
            <h3 className="font-semibold">Other Blog Posts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
            {posts &&
              posts.map((post) => (
                <Link
                  to={`/blogs/${post.id}`}
                  className="flex items-start gap-2"
                >
                  <img
                    src={post.image}
                    alt="Blog"
                    className="w-1/4 rounded-lg"
                  />
                  <div className="w-3/4 text-sm font-semibold text-muted-foreground ">
                    <p className="line-clamp-2">{post.content}</p>
                    <p>....see more</p>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;
