import ProductFilter from "../../components/products/ProductFilter";
import ProductCard from "../../components/products/ProductCard";
import { filterList, products } from "../../data/products";

import ProductPagination from "../../components/products/pagination";

export const Products = () => {
  return (
    <div className="mx-auto w-[90%] my-10">
      <section className="flex flex-col lg:flex-row">
        <section className="w-full lg:w-1/5 mb-10 lg:mb-0">
          <ProductFilter filterList={filterList} />
        </section>
        <section className="w-full lg:w-4/5">
          <h1 className="mb-5 text-2xl font-bold ">All Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:px-0 gap-4 mb-12">
            {products &&
              products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
          </div>
          <ProductPagination />
        </section>
      </section>
    </div>
  );
};
