import { useEffect, useState } from "react";

import { GetSearchParams } from "../../utils/GetSearchParams";
interface brands {
  name: string;
  checked: boolean;
}

interface price {
  min: number;
  max: number;
}
interface filter {
  query: any;
  setQuery: any;
  BrandsData: any;
  PricesData: any;
}

const Filters: React.FC<filter> = ({
  query,
  setQuery,
  BrandsData = [],
  PricesData = {},
}) => {
  const { brands: UrledBrands, minPrice }: any = GetSearchParams();

  const getProductsBasedOnBrands = (brands: string[]) => {
    const updatedSearchParams = new URLSearchParams(window.location.search);

    if (brands.length > 0) {
      // Update or add the brands query parameter
      updatedSearchParams.delete("page");
      updatedSearchParams.set("brands", brands.join(","));
    }

    const newUrl = !updatedSearchParams.toString().length
      ? window.location.pathname
      : `${window.location.pathname}?${updatedSearchParams.toString()}`;
    window.history.pushState({}, "", newUrl);

    setQuery({ ...query, brands });
  };

  const getProductsbasedOnPricerRange = (price: price) => {
    let { minPrice, maxPrice } = PricesData;
    minPrice = Number(minPrice).toFixed();
    maxPrice = Number(maxPrice).toFixed();

    // Create a new URLSearchParams object based on the current search params
    if (price.min === Number(minPrice) && price.max === Number(maxPrice)) {
      const updatedSearchParams = new URLSearchParams(window.location.search);
      // Update or add the min and max price parameters
      updatedSearchParams.delete("minPrice");
      updatedSearchParams.delete("maxPrice");
      // Build the new URL with updated search parameters
      const newUrl = !updatedSearchParams.toString().length
        ? window.location.pathname
        : `${window.location.pathname}?${updatedSearchParams.toString()}`;

      // Update the browser's history without refreshing the page
      window.history.pushState({}, "", newUrl);

      setQuery({
        ...query,
        minPrice: Number(price.min),
        maxPrice: Number(price.max),
      });
    } else {
      const updatedSearchParams = new URLSearchParams(window.location.search);
      // Update or add the min and max price parameters
      if (
        !updatedSearchParams.has("minPrice") &&
        updatedSearchParams.has("page")
      ) {
        updatedSearchParams.delete("page");
        updatedSearchParams.set("minPrice", String(price.min));
        updatedSearchParams.set("maxPrice", String(price.max));

        // Build the new URL with updated search parameters
        const newUrl = !updatedSearchParams.toString().length
          ? window.location.pathname
          : `${window.location.pathname}?${updatedSearchParams.toString()}`;

        // Update the browser's history without refreshing the page
        window.history.pushState({}, "", newUrl);
        setQuery({
          ...query,
          page: 1,
          minPrice: Number(price.min),
          maxPrice: Number(price.max),
        });
      } else if (
        updatedSearchParams.has("minPrice") &&
        updatedSearchParams.has("page")
      ) {
        updatedSearchParams.set("minPrice", String(price.min));
        updatedSearchParams.set("maxPrice", String(price.max));
        updatedSearchParams.delete("page");
        // Build the new URL with updated search parameters
        const newUrl = !updatedSearchParams.toString().length
          ? window.location.pathname
          : `${window.location.pathname}?${updatedSearchParams.toString()}`;

        // Update the browser's history without refreshing the page
        window.history.pushState({}, "", newUrl);
        setQuery({
          ...query,
          page: 1,
          minPrice: Number(price.min),
          maxPrice: Number(price.max),
        });
      } else {
        updatedSearchParams.set("minPrice", String(price.min));
        updatedSearchParams.set("maxPrice", String(price.max));
        // Build the new URL with updated search parameters
        const newUrl = !updatedSearchParams.toString().length
          ? window.location.pathname
          : `${window.location.pathname}?${updatedSearchParams.toString()}`;

        // Update the browser's history without refreshing the page
        window.history.pushState({}, "", newUrl);
        setQuery({
          ...query,
          minPrice: Number(price.min),
          maxPrice: Number(price.max),
        });
      }
    }
  };

  useEffect(() => {
    const Brands = BrandsData?.map((val: string) => {
      if (UrledBrands?.includes(val.trim())) {
        return {
          name: val?.trim(),
          checked: true,
        };
      }
      return {
        name: val?.trim(),
        checked: false,
      };
    });
    setBrands(Brands);

    if (minPrice) {
      setValue(Number(minPrice));
      getProductsbasedOnPricerRange({
        min: Number(minPrice),
        max: Number(PricesData?.maxPrice),
      });
    } else if (PricesData) {
      setValue(Number(PricesData?.minPrice));
    }
  }, []);

  const [value, setValue] = useState(0); // Initial value for the range

  // Handle slider value change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
  };

  // on MouseUp trigger the products based on price Range
  const handlePriceChange = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    getProductsbasedOnPricerRange({
      min: value,
      max: Number(PricesData?.maxPrice),
    }); // Pass the new value to the debounced function
  };

  let Brands: brands[] = [];
  const [brands, setBrands] = useState(Brands);

  useEffect(() => {
    if (BrandsData?.length) {
      Brands = BrandsData?.map((val: string) => {
        if (UrledBrands?.includes(val.trim())) {
          return {
            name: val?.trim(),
            checked: true,
          };
        }
        return {
          name: val?.trim(),
          checked: false,
        };
      });
      setBrands(Brands);
    }
  }, [BrandsData]);

  useEffect(() => {
    if (brands?.length) {
      // Get the names of the checked brands
      const isChecked = brands
        ?.filter((item) => item.checked)
        .map((item) => item.name);

      if (isChecked.length > 0) {
        getProductsBasedOnBrands(isChecked);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("brands")) {
          urlParams.delete("brands");
          const newUrl = !urlParams.toString().length
            ? window.location.pathname
            : `${window.location.pathname}?${urlParams.toString()}`;

          window.history.pushState({}, "", newUrl);
        }
        getProductsBasedOnBrands([]);
      }
    }
  }, [brands]);

  // Handle checkbox changes for brands
  const handlebrandCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    // Update the brand's checked state
    setBrands((prev) =>
      prev.map((brand) =>
        brand.name === name
          ? { ...brand, checked: !brand.checked } // Toggle the checked state
          : brand
      )
    );
  };

  return (
    <div className="w-full bg-white px-4 md:sticky md:top-32">
      <p className="text-lg font-semibold uppercase">Filters</p>

      <div className="mt-4 flex flex-col gap-6">
        {/* Brand */}
        <div className="w-full ">
          <p className="uppercase font-semibold">Brand</p>
          <div className="w-full brands_Container overflow-auto flex flex-col gap-3 max-h-[380px]">
            {brands.map(({ name, checked }, i) => {
              return (
                <label key={i} className="flex gap-2">
                  <input
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={handlebrandCheck}
                    hidden
                  />
                  <div
                    className={`w-6 relative h-6 cursor-pointer bg-gray-200 rounded-md ${
                      checked
                        ? "after:content-[''] after:absolute after:inset-0 after:rounded-md after:bg-black before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-[80%] before:border-l-[3px] before:border-b-[3px] before:z-10 before:w-[13px] before:h-2 before:-rotate-45 before:bg-transparent"
                        : ""
                    }`}
                  ></div>
                  <span>{name}</span>
                </label>
              );
            })}
          </div>
        </div>
        {/* Price  */}
        <div className="">
          <p className="uppercase font-semibold">Price</p>
          <input
            type="range"
            min={PricesData?.minPrice}
            max={PricesData?.maxPrice}
            value={value || 0}
            className="cursor-pointer"
            onChange={handleInputChange}
            onMouseUp={handlePriceChange}
            onTouchEnd={handlePriceChange}
          />
          {/* Display the value */}
          <div className="flex mt-2 items-center gap-3">
            {/* min value */}
            <p className="w-10 whitespace-nowrap">
              ₹ {Number(value).toFixed()}
            </p>
            <p>-</p>
            {/* max value */}
            <p>₹ {Number(PricesData?.maxPrice).toFixed()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Filters;
