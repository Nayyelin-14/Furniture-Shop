import ProductFilter from "../../components/products/ProductFilter";
import ProductCard from "../../components/products/ProductCard";

// import ProductPagination from "../../components/products/pagination";
import { useInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  CategoriresandTypesQuery,
  productsInfiniteQueryWithFilters,
  queryClient,
} from "../../api/query";
import { Button } from "../../components/ui/button";
import { useSearchParams } from "react-router-dom";

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategories = searchParams.get("categories");
  const rawTypes = searchParams.get("types");

  const selectedCat = rawCategories
    ? decodeURIComponent(rawCategories)
        .split(",")
        .map((cat) => Number(cat.trim()))
        .filter((ca) => !isNaN(ca))
        .map((c) => c.toString())
    : []; //URL	?categories=1,2, rawCategories	"1,2,3" , decodeURIComponent	"1,2,3", split(",")	["1", "2", "3"] ,map(Number)	[1, 2, 3], filter(!isNaN)	[1, 2, 3] , map(toString)	["1", "2", "3"]

  const selectedType = rawTypes
    ? decodeURIComponent(rawTypes)
        .split(",")
        .map((type) => Number(type.trim()))
        .filter((typ) => !isNaN(typ))
        .map((t) => t.toString())
    : [];

  const CATEGORIES = selectedCat ? selectedCat.join(",") : null;
  const TYPES = selectedType ? selectedType.join(",") : null;

  const { data: filterKeys } = useSuspenseQuery(CategoriresandTypesQuery());
  const {
    isFetching,
    data,
    status,
    error,
    isFetchingNextPage,
    // isFetchingPreviousPage,
    fetchNextPage,
    // fetchPreviousPage,
    hasNextPage,
    refetch,
    // hasPreviousPage,
  } = useInfiniteQuery(productsInfiniteQueryWithFilters(CATEGORIES, TYPES));

  const handleFilterChange = (categories: string[], types: string[]) => {
    const newParams = new URLSearchParams(); //creating a new, empty query parameter object
    if (categories.length > 0) {
      newParams.set("categories", categories.join(","));
    }
    if (types.length > 0) {
      newParams.set("types", types.join(","));
    }
    //clear query if new params come
    queryClient.cancelQueries({ queryKey: ["products", "infinite"] });
    //clear cache if new params come
    queryClient.removeQueries({ queryKey: ["products", "infinite"] });
    refetch();
    setSearchParams(newParams);
  };

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];
  return status === "pending" ? (
    <p className="flex items-center justify-center h-screen text-2xl">
      Loading....
    </p>
  ) : status === "error" ? (
    <p className="flex items-center justify-center h-screen text-2xl text-red-600">
      {error.message}
    </p>
  ) : (
    <div className="mx-auto w-[90%] my-10">
      <section className="flex flex-col lg:flex-row">
        <section className="w-full lg:w-1/5 mb-10 lg:mb-0">
          <ProductFilter
            filterList={filterKeys}
            onFilterChange={handleFilterChange}
            selectedCategories={selectedCat}
            selectedTypes={selectedType}
          />
        </section>
        <section className="w-full lg:w-4/5">
          <h1 className="mb-5 text-2xl font-bold ">All Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:px-0 gap-4 mb-12">
            {allProducts &&
              allProducts.map((product) => (
                <ProductCard product={product} key={Number(product.id)} />
              ))}
          </div>
          {/* <ProductPagination />
           */}
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
        </section>
      </section>
    </div>
  );
};
export default Products;
