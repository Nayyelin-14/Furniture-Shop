import type { PostsType } from "../../types";
import { Link } from "react-router-dom";

interface PostProps {
  posts: PostsType[];
}
const BlogCards = ({ posts }: PostProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-3 md:px-0">
      {posts?.map((post) => (
        <Link
          to={`/blogs/${post.id}`}
          className="flex flex-col  gap-3"
          key={post.id}
        >
          <img src={post.image} alt="Post" className="rounded-2xl w-full " />
          <h3 className="line-clamp-1 ml-4 font-semibold">{post.title}</h3>
          <div className="ml-4 text-sm">
            <span>
              by <span className="font-semibold">{post.author}</span>
              <span className="font-semibold">{post.updated_at}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogCards;
