import { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import AddProductStepper from "./stepperComp/AddProductStepper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { useLazyGetAdminProductsAndCountQuery } from "../../store/slices/apiSlice";
import {
  UpdateAddProductIsActive,
  UpdateAddProductIsCompelete,
  UpdateCategoryInfo,
  UpdateProductInfo,
  UpdateProductPreviewImageUrls,
} from "../../store/slices/adminSlice";

import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { BsBoxArrowUpRight } from "react-icons/bs";

const ProductsAdmin = () => {
  const dispatch = useDispatch();

  const { isActive, isComplete } = useSelector(
    (state: RootState) => state.admin.AddProduct
  );

  const handleAddMoreProducts = () => {
    dispatch(
      UpdateCategoryInfo({
        Category: null,
        subCategory: null,
        subsubCategory: null,
      })
    );
    dispatch(
      UpdateProductInfo({
        Brand: "",
        name: "",
        price: "",
        material: "",
        size: "",
        fit: "",
        washcare: "",
        sizes: { S: "", M: "", L: "", XL: "", XXL: "" },
        images: [],
      })
    );
    dispatch(UpdateProductPreviewImageUrls([]));
    dispatch(UpdateAddProductIsCompelete(false));
  };
  const [
    triggerAdminProducts,
    {
      isLoading: AdminProductsIsLoading,
      isSuccess: AdminProductIsSuccess,
      data: AdminProductsData,
    },
  ] = useLazyGetAdminProductsAndCountQuery({});

  useEffect(() => {
    triggerAdminProducts({});
  }, []);

  const handleAddProductIsActive = () => {
    dispatch(UpdateAddProductIsActive(!isActive));
  };

  return (
    <div className="relative w-full h-full  flex flex-col ">
      {isActive ? (
        <div className="w-full h-fit flex flex-col md:p-4 md:px-8">
          <div className="flex  justify-between ">
            <p className=" text-lg lg:text-2xl font-semibold">Add Product</p>
            <FaXmark
              className="cursor-pointer text-lg"
              onClick={handleAddProductIsActive}
            />
          </div>
          {!isComplete ? (
            <AddProductStepper />
          ) : (
            <div className="flex-1  flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="80px"
                height="80px"
              >
                <linearGradient
                  id="IMoH7gpu5un5Dx2vID39Ra"
                  x1="9.858"
                  x2="38.142"
                  y1="9.858"
                  y2="38.142"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#9dffce" />
                  <stop offset="1" stop-color="#50d18d" />
                </linearGradient>
                <path
                  fill="url(#IMoH7gpu5un5Dx2vID39Ra)"
                  d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                />
                <linearGradient
                  id="IMoH7gpu5un5Dx2vID39Rb"
                  x1="13"
                  x2="36"
                  y1="24.793"
                  y2="24.793"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset=".824" stop-color="#135d36" />
                  <stop offset=".931" stop-color="#125933" />
                  <stop offset="1" stop-color="#11522f" />
                </linearGradient>
                <path
                  fill="url(#IMoH7gpu5un5Dx2vID39Rb)"
                  d="M21.293,32.707l-8-8c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414	c0.391-0.391,1.024-0.391,1.414,0L22,27.758l10.879-10.879c0.391-0.391,1.024-0.391,1.414,0l1.414,1.414	c0.391,0.391,0.391,1.024,0,1.414l-13,13C22.317,33.098,21.683,33.098,21.293,32.707z"
                />
              </svg>
              <p className="text-xl font-semibold uppercase">Product Added</p>
              <div
                className="underline pt-2 cursor-pointer"
                onClick={handleAddMoreProducts}
              >
                Add More Products
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between ">
            <p className=" text-lg lg:text-2xl font-semibold">Products</p>
            <button
              className="bg-[#EDF5E8] p-2 rounded-md text-md"
              onClick={handleAddProductIsActive}
            >
              + Add Product
            </button>
          </div>
          <div className="flex justify-center gap-2 md:gap-20 mt-5">
            {[
              {
                img: "http://res.cloudinary.com/dchpasekr/image/upload/v1727944860/uxbjnvozphpsbw050khk.jpg",
                category: "Mens",
              },
              {
                img: "https://res.cloudinary.com/dchpasekr/image/upload/v1728825795/pwjrsylutby9auv1yp9y.jpg",
                category: "Womens",
              },
              {
                img: "http://res.cloudinary.com/dchpasekr/image/upload/v1729164905/hiuf0sahfbwazx37wil9.jpg",
                category: "Kids",
              },
            ].map(({ img, category }, i) => {
              return (
                <Link
                  className="group"
                  key={i}
                  to={`/${category.toLowerCase()}`}
                >
                  <div className="relative max-w-[250px] h-fit">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                    <div className=" absolute  inset-0 group-hover:bg-[rgba(0,0,0,0.5)] bg-[rgba(0,0,0,0.3)] md:text-lg">
                      <p className="text-white absolute bottom-[20%] left-1/2 -translate-x-1/2  text-md md:text-2xl uppercase">
                        {category}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex-1 border-[1.5px] rounded-md mt-5 p-2">
            <p className="text-md font-semibold py-1 border-b-[1.5px]">
              New Added Products
            </p>
            <div className="w-full flex flex-col gap-3">
              <div className=" w-full grid grid-cols-6 text-center gap-2">
                {["Product", "brand", "price", "sizes", "view", "Edit"].map(
                  (el) => (
                    <p key={el} className="text-sm font-semibold py-2">
                      {el}
                    </p>
                  )
                )}
              </div>
              {AdminProductsIsLoading ? (
                <div className="w-full h-[70vh] grid place-content-center">
                  <div className="pageloader"></div>
                </div>
              ) : (
                <div className="w-full ">
                  {AdminProductIsSuccess &&
                    AdminProductsData?.data?.products.map(
                      ({
                        id,
                        images,
                        name,
                        brand,
                        path,
                        price,
                        sizes,
                      }: any) => {
                        return (
                          <div
                            key={id}
                            className="w-full mt-1 grid grid-cols-6 text-center  gap-2 text-sm"
                          >
                            <div className="flex w-full items-center gap-2">
                              <img
                                src={images[0]}
                                alt=""
                                className="h-[25px] object-contain rounded-sm"
                              />
                              <p className="overflow-hidden text-ellipsis whitespace-nowrap pr-1">
                                {name}
                              </p>
                            </div>
                            <p className="overflow-hidden w-full text-ellipsis whitespace-nowrap">
                              {brand}
                            </p>
                            <p className="overflow-hidden w-full text-ellipsis whitespace-nowrap">
                              {price}
                            </p>
                            <p className="overflow-hidden w-full text-sm text-ellipsis whitespace-nowrap">
                              {JSON.stringify(sizes)}
                            </p>
                            <Link
                              to={path}
                              key={id}
                              className="cursor-pointer hover:bg-gray-200 rounded-full"
                            >
                              <BsBoxArrowUpRight className="w-full text-lg" />
                            </Link>
                            <CiEdit className="text-xl w-full cursor-pointer hover:bg-gray-200 rounded-full" />
                          </div>
                        );
                      }
                    )}
                </div>
              )}
              <Link
                to={"/admin/products/All"}
                className="mx-auto border-b-2 border-gray-300"
              >
                View All...
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsAdmin;
