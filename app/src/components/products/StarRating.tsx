import { cn } from "../../lib/utils";
import { Icons } from "../icons";

interface RatingProps {
  rating: number;
}

const StarRating = ({ rating }: RatingProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Icons.starIcon
          key={index}
          className={cn(
            `size-4`,
            rating >= index + 1 ? "text-yellow-500" : "text-muted-foreground"
          )}
        />
      ))}
    </div>
  );
};

export default StarRating;
