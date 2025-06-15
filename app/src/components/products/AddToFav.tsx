import { type ButtonHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { cn } from "../../lib/utils";
// import { useFetcher } from "react-router-dom";
import { useIsFetching, useMutation } from "@tanstack/react-query";
import API from "../../api";
import { queryClient } from "../../api/query";

interface FavProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  rating: number;
  productid: number;
  isFavouriteorNot: boolean;
}

const AddToFav = ({
  productid,
  // rating,
  isFavouriteorNot,
  className,
  ...props
}: FavProps) => {
  // const fetcher = useFetcher({ key: `products:${productid}` });
  // // const [isFavouriteorNot, setIsFavouriteorNot] = useState(false);
  // console.log(isFavouriteorNot);
  // // for optimistic
  // let isFav = isFavouriteorNot;
  // if (fetcher.formData) {
  //   isFav = fetcher.formData.get("isFavourite") === "true";
  // }

  const isFetching = useIsFetching();

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const data = {
        productId: Number(productid),
        isFavourite: !isFavouriteorNot,
      };
      const response = await API.patch("users/toggle-fav", data);
      if (response.status !== 200) {
        console.log(response.data);
      }
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["product", "detail", productid],
      });
    },
  });
  let isFav = isFavouriteorNot;
  if (isPending || isFetching) {
    isFav = !isFavouriteorNot;
  }
  return (
    // <fetcher.Form method="post">
    <Button
      type="submit"
      className={cn(
        `size-8 shrink-0 hover:text-red-600 cursor-pointer`,
        className
      )}
      variant={"secondary"}
      size={"icon"}
      {...props}
      onClick={() => mutate()}
      // name="isFavourite"
      // value={isFavouriteorNot ? "false" : "true"}
      title={isFav ? "Remove from favourite" : "Add to favourite"}
    >
      {isFav ? (
        <Icons.heartFillIcon className="size-4 text-red-600" />
      ) : (
        <Icons.heartIcon className="size-4 text-red-600" />
      )}
    </Button>
    // </fetcher.Form>
  );
};

export default AddToFav;
