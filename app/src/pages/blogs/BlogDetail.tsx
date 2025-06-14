import { Link, useLoaderData } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Icons } from "../../components/icons";
import TextPurify from "../../components/TextPurify";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postQuery, SinglePostQuery } from "../../api/query";
import type { PostsType, Tag } from "../../types";

const BlogDetail = () => {
  // const { id } = useParams();

  // const post = posts.find((item) => item.id === id);
  const img_path = import.meta.env.VITE_IMG_URL;
  const { postId } = useLoaderData();
  const { data: postDatas } = useSuspenseQuery(postQuery("?limit=6"));
  const { data: postDetail } = useSuspenseQuery(
    SinglePostQuery(Number(postId))
  );
  console.log(postDatas, postDetail);
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
          {postDetail ? (
            <>
              <h3 className="text-xl lg:text-3xl font-extrabold ">
                {postDetail.post.title}
              </h3>
              <div className=" text-sm">
                <span>
                  by{" "}
                  <span className="font-[600]">
                    {postDetail.post.author.fullName}
                  </span>
                  <span className="font-[600]">
                    {postDetail.post.updated_at}
                  </span>
                </span>
              </div>
              <h3 className="text-base font-medium">
                {postDetail.post.content}
              </h3>
              <img
                src={img_path + postDetail.post.modifiedImage}
                alt={postDetail.post.title}
                loading="lazy"
                decoding="async"
                className="w-full rounded-xl"
              />
              <TextPurify content={postDetail.post.body} />
              <div className="space-x-4">
                {postDetail.post &&
                  postDetail.post.postTags.map((tag: Tag) => (
                    <Button
                      key={tag.name}
                      variant={"secondary"}
                      className="border border-black/10 "
                    >
                      {tag.name}
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
            {postDatas.posts &&
              postDatas.posts.map((post: PostsType) => (
                <Link
                  to={`/blogs/${post.id}`}
                  className="flex items-start gap-2"
                >
                  <img
                    src={img_path + post.modifiedImage}
                    alt="Blog"
                    loading="lazy"
                    decoding="async"
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
