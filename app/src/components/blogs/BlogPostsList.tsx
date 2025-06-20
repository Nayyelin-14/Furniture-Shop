import type { PostsType } from "../../types";
import { Link } from "react-router-dom";

interface PostsProps {
  posts: PostsType[];
}

const BlogPostsList = ({ posts }: PostsProps) => {
  const img_path = import.meta.env.VITE_IMG_URL;
  return (
    <div className="grid grid-cols-1 gap-16 px-4 md:grid-cols-2 lg:grid-cols-3 md:px-0 my-10">
      {posts?.map((post) => (
        <Link
          to={`/blogs/${post.id}`}
          className="flex flex-col  gap-1"
          key={post.id}
        >
          <img
            src={img_path + post.modifiedImage}
            alt="Post"
            loading="lazy"
            decoding="async"
            className="rounded-2xl w-full "
          />
          <h3 className="line-clamp-1 font-extrabold text-xl">{post.title}</h3>
          <h3 className="line-clamp-3 font-[400] text-base my-2">
            {post.content}
          </h3>
          <div className="text-sm">
            <span>
              by <span className="font-[600]">{post.author.fullName} </span>
              on <span className="font-[600]">{post.modifiedUpdatedAt}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogPostsList;
