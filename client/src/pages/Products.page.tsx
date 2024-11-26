import { useEffect, useState } from "react";
import BreadCrums from "../components/BreadCrums/BreadCrums";
import Filters from "../components/ProductView/Filters";
import ProductsDisplay from "../components/ProductView/ProductsDisplay";
import {
  useDeleteProductMutation,
  useLazyGetBrandsAndPricerangeQuery,
  useLazyGetProductsAndCountQuery,
} from "../store/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { useLocation, useNavigate } from "react-router-dom";
import { BiFilterAlt, BiSort } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import "../index.css";
import {
  UpdateDeleteProductInfo,
  UpdateDeleteProductIsActive,
} from "../store/slices/adminSlice";

import PageLoader from "../components/Loaders/PageLoader";
import { getId } from "../utils/GetId";
import FilterLoader from "../components/Loaders/FilterLoader";
import Pagination from "../components/Pagination/Pagination";
import { queryInterface } from "../TsInterfaces/Interfaces";
import { UpdateTotalProductsCount } from "../store/slices/productsSlice";

const Products = () => {
  const Navigate = useNavigate();
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
  const [query, setQuery] = useState<queryInterface>(intitalquery);
  const { Category } = useSelector((state: RootState) => state.categories);
  //Getting the path values
  const CurrentPathArrayValues = pathname.split("/").filter((el) => el);
  const ModifiedCurrentPathArrayValues = CurrentPathArrayValues.reduce(
    (acc: string[], val: string) => {
      let name = val.slice(0, 1).toUpperCase() + val.slice(1);
      if (name.includes("%20")) {
        name = name.replace("%20", " ");
      }
      acc.push(name);
      return acc;
    },
    []
  );

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
    triggerProductsAndCount,
    { isSuccess: ProductsAndCountIsSuccess, data: productsAndCount },
  ] = useLazyGetProductsAndCountQuery();

  const [
    triggerBrandsAndPriceRange,
    { isSuccess: BrandsAndPricesIsSuccess, data: brandsAndPrices },
  ] = useLazyGetBrandsAndPricerangeQuery();

  const [
    triggerdeleteProduct,
    {
      isLoading: deleteProductIsLoading,
      isSuccess: deleteProductIsSuccess,
      data: deleteProductData,
    },
  ] = useDeleteProductMutation();

  useEffect(() => {
    if (Category.length) {
      const id = getId(
        Category,
        ModifiedCurrentPathArrayValues[
          ModifiedCurrentPathArrayValues.length - 1
        ],
        ModifiedCurrentPathArrayValues[0]
      );
      if (id) {
        triggerBrandsAndPriceRange({ id });
      } else {
        Navigate("/pagenotfound");
      }
    }
  }, [Category, pathname, deleteProductIsSuccess, deleteProductData]);

  useEffect(() => {
    if (Category.length) {
      const id = getId(
        Category,
        ModifiedCurrentPathArrayValues[
          ModifiedCurrentPathArrayValues.length - 1
        ],

        ModifiedCurrentPathArrayValues[0]
      );
      if (id) {
        triggerProductsAndCount({ id, ...query });
      } else {
        Navigate("/pagenotfound");
      }
    }
  }, [Category, pathname, query, deleteProductIsSuccess, deleteProductData]);

  useEffect(() => {
    if (deleteProductIsSuccess && deleteProductData) {
      dispatch(UpdateDeleteProductIsActive(false));
      dispatch(UpdateDeleteProductInfo(null));
    }
  }, [deleteProductIsSuccess, deleteProductData]);

  useEffect(() => {
    if (ProductsAndCountIsSuccess && productsAndCount?.data) {
      dispatch(UpdateTotalProductsCount(productsAndCount?.data?.productsCount));
    }
  }, [ProductsAndCountIsSuccess, productsAndCount?.data]);

  useEffect(() => {
    setIsLoading(true);
  }, [pathname]);

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
    <>
      {!isLoading ? (
        <div className="p-3 relative md:p-6 flex flex-col gap-0 w-full">
          {isFilterLoading && <FilterLoader />}
          {/* breadCrums */}
          <BreadCrums />
          {/* products count */}
          <div className="hidden md:flex md:w-fit gap-2 bg-white sticky md:top-24">
            <p>
              {ModifiedCurrentPathArrayValues[0]}{" "}
              {
                ModifiedCurrentPathArrayValues[
                  ModifiedCurrentPathArrayValues.length - 1
                ]
              }{" "}
            </p>{" "}
            -{" "}
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
    </>
  );
};

export default Products;
