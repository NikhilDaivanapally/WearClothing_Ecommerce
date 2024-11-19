# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```



          {/* {Categories?.map(({id name}, i) => {
            return (
              <li
                key={i}
                className="flex flex-col h-full  justify-center cursor-pointer group"
              >
                <Link to={`/${name}`}>
                  <span className="">{name}</span>
                </Link>
                <div className="menu p-4 hidden absolute z-50 top-full left-1/2  -translate-x-1/2 w-screen h-fit  bg-red-100 group-hover:flex justify-center text-xs">
                  <div className="innermenu">

                  </div>
                </div>
              </li>
            );
          })} */}





            // const param = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();

  // useEffect(() => {
  //   setSearchParams({ query: "new search term", sort: "asc" });
  //   // setSearchParams({sort:"asc"})
  // }, []);
  // // const query = searchParams.get("q");
  // // const query2 = searchParams.get("sort");
  // console.log(param, searchParams);






  import { useEffect, useState } from "react";
import BreadCrums from "../components/BreadCrums/BreadCrums";
import Filters from "../components/ProductView/Filters";
import ProductsDisplay from "../components/ProductView/ProductsDisplay";
import {
  useLazyGetBrandsQuery,
  useLazyGetPricesQuery,
  useLazyGetProductsCountQuery,
  useLazyGetProductsQuery,
} from "../store/slices/apiSlice";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";

// import {
//   UpdateBrands,
//   UpdatePriceRange,
//   UpdateProductsData,
//   UpdateTotalProductsCount,
// } from "../store/slices/productsSlice";

import { useLocation } from "react-router-dom";
import { BiFilterAlt, BiSort } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { Category } from "../TsInterfaces/Interfaces";

interface queryInterface {
  page: number;
  sort: string;
  order: string;
  minPrice: string | number;
  maxPrice: string | number;
  brands: string[] | undefined;
}

interface price {
  min: number;
  max: number;
}
const Products = () => {
  const Categories = useSelector(
    (state: RootState) => state.categories.Category
  );

  const CategoriesWiseSubCategories: Record<string, string[]> = {
    Mens: [],
    Kids: [],
    Womens: [],
  };

  const getIds = (categories: Category[], name: string) => {
    categories.forEach((el: Category) => {
      if (el?.subcategories?.length) {
        getIds(el.subcategories, name);
      } else {
        if (CategoriesWiseSubCategories[name]) {
          CategoriesWiseSubCategories[name].push({
            id: el?.id,
            name: el?.name,
          });
        }
      }
    });
  };

  Categories.forEach((el: Category) => {
    getIds(el.subcategories || [], el.name);
  });
  // const dispatch = useDispatch();

  const [gridview, setGridview] = useState(4);
  // ex : Mens(category) Tshirts(subcategory)
  const paths = window.location.pathname.split("/").filter((el) => el);
  const Category = paths[0];
  const CategoryName = Category.slice(0, 1).toUpperCase() + Category.slice(1);
  const subCatgory = window.location.pathname
    .split("/")
    .reverse()
    .slice(0, 1)
    .toString()
    .split("%20")
    .join("_");

  // gettting searchParams from url
  const { pathname } = useLocation();
  const MainCategory = Category.slice(0, 1).toUpperCase() + Category.slice(1);
  const Ctgid = CategoriesWiseSubCategories[`${MainCategory}`]?.filter(
    (el) => el?.name?.toLowerCase() == paths[paths.length - 1]
  );

  console.log(Ctgid[0].id);
  const searchParams = new URLSearchParams(window.location.search);
  const UrledPage = searchParams.get("page");
  const UrledSort = searchParams.get("sort");
  const UrledOrder = searchParams.get("desc")
    ? searchParams.get("desc")?.toUpperCase()
    : "";
  const Urledbrands = searchParams.get("brands")
    ? searchParams
        .get("brands")
        ?.split(",")
        .filter((el) => el.trim() !== "")
    : [];
  const UrledminPrice = searchParams.get("minPrice");
  const UrledmaxPrice = searchParams.get("maxPrice");
  const [ismobilefilter, setIsMobileFilter] = useState(false);
  // no of Products per page
  const userPerpage = 5;
  // query
  const [query, setQuery] = useState<queryInterface>({
    page: Number(UrledPage) || 1,
    sort: UrledSort || "createdAt",
    order: UrledOrder || "DESC",
    minPrice: Number(UrledminPrice) || "",
    maxPrice: Number(UrledmaxPrice) || "",
    brands: Urledbrands || [],
  });
  useEffect(() => {
    // setTimeout(() => {
    window.scrollTo(0, 0);
    // }, 200);
  }, [pathname]);

  interface priceRange {
    minPrice: string | number;
    maxPrice: string | number;
  }
  // const { totalProductsCount, productsData } = useSelector(
  //   (state: RootState) => state.currentPageProducts
  // );
  const priceRange: any = useSelector(
    (state: RootState) => state.currentPageProducts.priceRange
  );
  const handleSelectGridview = (view: number) => {
    setGridview(view);
  };

  // trigger get Products
  const [
    triggerGetProducts,
    {
      isSuccess: ProductsIsSuccess,
      data: ProductsData,
      isLoading: ProductsIsLoading,
    },
  ] = useLazyGetProductsQuery();
  // update the store with the products
  // useEffect(() => {
  //   if (ProductsIsSuccess && ProductsData) {
  //     dispatch(UpdateProductsData(ProductsData));
  //   }
  // }, [ProductsIsSuccess, ProductsData, triggerGetProducts]);

  // trigger the total count of products
  const [
    triggerGetProductcount,
    {
      isSuccess: ProductCountIsSucess,
      data: ProductCountData,
      // isLoading: ProductsCountIsLoading,
    },
  ] = useLazyGetProductsCountQuery();
  // update the store with the productsCount
  // useEffect(() => {
  //   if (ProductCountIsSucess && ProductCountData) {
  //     dispatch(UpdateTotalProductsCount(ProductCountData));
  //   }
  // }, [ProductCountIsSucess, ProductCountData, triggerGetProductcount]);

  // trigger the all brands of the product
  const [
    triggerGetBrands,
    {
      isSuccess: getBrandsIsSuccess,
      data: BrandsData,
      // isLoading: BrandsIsLoading,
    },
  ] = useLazyGetBrandsQuery();
  // update the store with the brands
  // useEffect(() => {
  //   if (getBrandsIsSuccess && BrandsData) {
  //     dispatch(UpdateBrands(BrandsData));
  //   }
  // }, [getBrandsIsSuccess, BrandsData, triggerGetBrands]);

  // trigger the price range
  const [
    triggerGetPrices,
    {
      isSuccess: getPricesIsSuccess,
      data: PricesData,
      // isLoading: PricesisLoading,
    },
  ] = useLazyGetPricesQuery();
  // update the store with the priceRange (min and max)
  // useEffect(() => {
  //   if (getPricesIsSuccess && PricesData) {
  //     dispatch(UpdatePriceRange(PricesData));
  //   }
  // }, [getPricesIsSuccess, PricesData, triggerGetPrices]);

  // trigger the funtion on initial mount and when ever the id changes
  useEffect(() => {
    triggerGetBrands({ id: Ctgid[0].id });
    triggerGetPrices({ id: Ctgid[0].id });
  }, [pathname]);

  // trigger the function on initial mount and when ever the id and the query changes
  useEffect(() => {
    triggerGetProducts({ id: Ctgid[0].id, ...query });
    triggerGetProductcount({ id: Ctgid[0].id, ...query });
  }, [pathname, query]);

  const getProductsbasedOnPricerRange = ({ min, max }: price) => {
    console.log(min, max);

    // Create a new URLSearchParams object based on the current search params
    if (
      Number(min) === Number(priceRange?.minPrice) &&
      Number(max) === Number(priceRange?.maxPrice)
    ) {
      const updatedSearchParams = new URLSearchParams(window.location.search);
      // Update or add the min and max price parameters
      updatedSearchParams.delete("minPrice");
      updatedSearchParams.delete("maxPrice");
      // Build the new URL with updated search parameters
      const newUrl = `${
        window.location.pathname
      }?${updatedSearchParams.toString()}`;

      // Update the browser's history without refreshing the page
      window.history.pushState({}, "", newUrl);
    } else {
      const updatedSearchParams = new URLSearchParams(window.location.search);
      // Update or add the min and max price parameters
      updatedSearchParams.set("minPrice", String(min));
      updatedSearchParams.set("maxPrice", String(max));

      // Build the new URL with updated search parameters
      const newUrl = `${
        window.location.pathname
      }?${updatedSearchParams.toString()}`;

      // Update the browser's history without refreshing the page
      window.history.pushState({}, "", newUrl);
    }
    setQuery((prev: queryInterface) => {
      return {
        ...prev,
        minPrice: Number(min),
        maxPrice: Number(max),
      };
    });
  };

  const getProductsBasedOnBrands = (brands: string[]) => {
    const updatedSearchParams = new URLSearchParams(window.location.search);

    if (brands.length > 0) {
      // Update or add the brands query parameter
      updatedSearchParams.set("brands", brands.join(","));
      updatedSearchParams.delete("page");
    }

    const newUrl = `${
      window.location.pathname
    }?${updatedSearchParams.toString()}`;
    window.history.pushState({}, "", newUrl);

    setQuery((prev) => {
      return {
        ...prev,
        page: 1,
        brands,
      };
    });
  };

  const selectPageHandler = (selectedPage: number) => {
    if (
      selectedPage !== query.page &&
      selectedPage >= 1 &&
      selectedPage <= Math.ceil(ProductCountData || 0 / userPerpage)
    ) {
      setQuery((prev) => {
        return { ...prev, page: selectedPage };
      });
      const updatedSearchParams = new URLSearchParams(window.location.search);
      updatedSearchParams.set("page", String(selectedPage));
      const newUrl = `${
        window.location.pathname
      }?${updatedSearchParams.toString()}`;
      window.history.pushState({}, "", newUrl);
      triggerGetProducts({ id: Ctgid[0].id, ...query, page: selectedPage });
    }
  };

  const handleMobileFilter = () => {
    setIsMobileFilter((prev) => !prev);
  };

  // useEffect(() => {
  //   setIsLoading(false);
  // }, [ProductsData]);

  return (
    <>
      {ProductsIsSuccess ? (
        <div className="p-3 relative md:p-6 flex flex-col gap-0 w-full">
          {/* breadCrums */}
          <BreadCrums />
          {/* {isLoading ? <div>Loading...</div> : <></>} */}
          {ProductCountData ? (
            <>
              {/* products count */}
              <div className="hidden md:flex md:w-fit gap-2 bg-white sticky md:top-24">
                <p>
                  {CategoryName} {subCatgory}{" "}
                </p>{" "}
                - <p className="text-gray-500">{ProductCountData} items</p>
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
                    BrandsData={BrandsData}
                    PricesData={PricesData}
                    getProductsbasedOnPricerRange={
                      getProductsbasedOnPricerRange
                    }
                    getProductbasedOnBrands={getProductsBasedOnBrands}
                  />
                </div>
                {/* )} */}
              </div>
              {/*filter &  Products view */}
              <div className="w-full flex">
                {/* medium & large screen */}
                <div className="hidden md:block w-[280px] border-[1px] border-l-transparent">
                  <Filters
                    BrandsData={BrandsData}
                    PricesData={PricesData}
                    getProductsbasedOnPricerRange={
                      getProductsbasedOnPricerRange
                    }
                    getProductbasedOnBrands={getProductsBasedOnBrands}
                  />
                </div>

                <div className="flex-1 flex flex-col gap-6">
                  <ProductsDisplay
                    gridview={gridview}
                    productsData={ProductsData}
                  />

                  {ProductCountData && ProductCountData > 0 ? (
                    <div className="pagination flex items-center justify-center gap-4 text-black">
                      <span
                        className={`text-2xl select-none hover:border-2 cursor-pointer w-8 h-8 rounded-full grid place-content-center
                  ${query.page > 1 ? "" : "opacity-0"}`}
                        onClick={() => selectPageHandler(query.page - 1)}
                      >
                        <IoIosArrowBack />
                      </span>
                      {ProductCountData > userPerpage &&
                        [
                          ...Array(Math.ceil(ProductCountData / userPerpage)),
                        ].map((_, i) => (
                          <p
                            key={i}
                            onClick={() => selectPageHandler(i + 1)}
                            className={`hover:border-2 select-none cursor-pointer w-8 h-8 rounded-full grid place-content-center ${
                              query.page === i + 1 ? "bg-black text-white" : ""
                            }`}
                          >
                            {i + 1}
                          </p>
                        ))}

                      <span
                        className={`text-2xl hover:border-2 select-none cursor-pointer w-8 h-8 rounded-full grid place-content-center
                  ${
                    query.page < Math.ceil(ProductCountData / userPerpage)
                      ? ""
                      : "opacity-0"
                  }`}
                        onClick={() => selectPageHandler(query.page + 1)}
                      >
                        <IoIosArrowForward />
                      </span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-[87vh] grid place-content-center">
              <p className="text-lg font-semibold">No Products Found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[90vh] grid place-content-center">
          <div className="pageloader"></div>
        </div>
      )}
    </>
  );
};

export default Products;
