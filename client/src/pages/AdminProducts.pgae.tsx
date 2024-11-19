import { useEffect, useState } from "react";
import {
  useDeleteProductMutation,
  useLazyGetAdminBrandsAndPricesQuery,
  useLazyGetAdminProductsAndCountQuery,
} from "../store/slices/apiSlice";
import ProductsDisplay from "../components/ProductView/ProductsDisplay";
import { BiFilterAlt, BiSort } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import Filters from "../components/ProductView/Filters";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  UpdateDeleteProductInfo,
  UpdateDeleteProductIsActive,
} from "../store/slices/adminSlice";
import Header from "../components/Header";
import Pagination from "../components/Pagination/Pagination";
import { queryInterface } from "../TsInterfaces/Interfaces";
import PageLoader from "../components/Loaders/PageLoader";
import FilterLoader from "../components/Loaders/FilterLoader";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const [gridview, setGridview] = useState(4);
  const [ismobilefilter, setIsMobileFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const searchParams = new URLSearchParams(search);
  const intitalquery: queryInterface = {
    page: Number(searchParams.get("page")) || 1,
    sort: searchParams.get("sort") || "createdAt",
    order: searchParams.get("order") || "DESC",
    minPrice: Number(searchParams.get("minPrice")) || "",
    maxPrice: Number(searchParams.get("maxPrice")) || "",
    brands:
      searchParams
        .get("brands")
        ?.split(",")
        .filter((el) => el.trim() !== "") || [],
  };
  // query
  const [query, setQuery] = useState<queryInterface>(intitalquery);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, query]);

  const handleSelectGridview = (view: number) => {
    setGridview(view);
  };

  const handleMobileFilter = () => {
    setIsMobileFilter((prev) => !prev);
  };
  const [
    triggerBrandsAndPriceRange,
    { isSuccess: BrandsAndPricesIsSuccess, data: brandsAndPrices },
  ] = useLazyGetAdminBrandsAndPricesQuery();
  const [
    triggerProductsAndCount,
    { isSuccess: ProductsAndCountIsSuccess, data: productsAndCount },
  ] = useLazyGetAdminProductsAndCountQuery();

  const [
    triggerdeleteProduct,
    {
      isLoading: deleteProductIsLoading,
      isSuccess: deleteProductIsSuccess,
      data: deleteProductData,
    },
  ] = useDeleteProductMutation();

  useEffect(() => {
    triggerBrandsAndPriceRange({});
  }, [deleteProductIsSuccess, deleteProductData]);

  useEffect(() => {
    triggerProductsAndCount(query);
  }, [query, deleteProductIsSuccess, deleteProductData]);

  useEffect(() => {
    if (deleteProductIsSuccess && deleteProductData) {
      dispatch(UpdateDeleteProductIsActive(false));
      dispatch(UpdateDeleteProductInfo(null));
    }
  }, [deleteProductIsSuccess, deleteProductData]);

  useEffect(() => {
    setIsFilterLoading(true);
  }, [window.location.search]);

  useEffect(() => {
    if (ProductsAndCountIsSuccess && BrandsAndPricesIsSuccess) {
      setIsLoading(false);
      setIsFilterLoading(false);
    }
  }, [productsAndCount?.data, brandsAndPrices?.data]);

  return (
    <div className="h-fit">
      <Header />
      {!isLoading ? (
        <div className="p-3 relative md:p-6 flex flex-col gap-0 w-full">
          {isFilterLoading && <FilterLoader />}
          {/* products count */}
          <div className="hidden md:flex md:w-fit gap-2 bg-white sticky md:top-24">
            <p>Total Products</p> -{" "}
            <p className="text-gray-500">
              {productsAndCount?.data?.productsCount} items
            </p>
          </div>
          {/*view As &  sort */}
          <div className=" w-full hidden md:flex items-center md:justify-end gap-1  md:gap-10">
            <div className="flex md:gap-2 items-center">
              <p>View As : </p>
              <div className="flex gap-2">
                {[[...Array(2)], [...Array(3)], [...Array(4)]].map(
                  (view, i) => {
                    return (
                      <div
                        key={i}
                        onClick={() => handleSelectGridview(view.length)}
                        className="cursor-pointer border-2 w-fit flex gap-1 p-1 h-8"
                      >
                        {view.map((_, i) => (
                          <div
                            key={i}
                            className={`h-full w-1 ${
                              view.length == gridview
                                ? "bg-black"
                                : "bg-gray-300"
                            }`}
                          ></div>
                        ))}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <button className="w-fit p-2 border-2 border-black">
              Sort by Recommend ▼
            </button>
          </div>
          {/* mobile filter */}
          <div className="sticky flex items-center md:hidden top-[70px] w-full h-10 bg-white z-10">
            <button
              className=" w-full h-full flex items-center justify-center gap-2 text-lg border-[1.5px]"
              onClick={handleMobileFilter}
            >
              <BiFilterAlt />
              Filter
            </button>
            <button className="w-full h-full  flex items-center justify-center gap-2 text-lg border-[1.5px]">
              <BiSort />
              Sort
            </button>

            {/* small screen */}
            {/* {ismobilefilter && ( */}
            <div
              className={`w-full ${
                ismobilefilter ? "block" : "hidden"
              } absolute top-0 z-20 bg-white  flex flex-col md:hidden h-[87.5vh]`}
            >
              <RxCross2
                className="ml-auto text-5xl p-3"
                onClick={handleMobileFilter}
              />
              <Filters
                query={query}
                setQuery={setQuery}
                BrandsData={brandsAndPrices?.data?.brands}
                PricesData={brandsAndPrices?.data?.priceRange}
              />
            </div>
            {/* )} */}
          </div>
          {/*filter &  Products view */}
          <div className="w-full flex">
            {/* medium & large screen */}
            <div className="hidden md:block w-[280px] border-[1px] border-l-transparent">
              <Filters
                query={query}
                setQuery={setQuery}
                BrandsData={brandsAndPrices?.data?.brands}
                PricesData={brandsAndPrices?.data?.priceRange}
              />
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <ProductsDisplay
                gridview={gridview}
                productsData={productsAndCount?.data?.products}
                triggerdeleteProduct={triggerdeleteProduct}
                deleteProductIsLoading={deleteProductIsLoading}
              />

              {productsAndCount?.data?.productsCount &&
              productsAndCount?.data?.productsCount > 0 ? (
                <Pagination
                  query={query}
                  setQuery={setQuery}
                  ProductsCount={productsAndCount?.data?.productsCount}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default AdminProducts;
