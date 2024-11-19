import React, { useEffect, useRef, useState } from "react";
import {
  MdArrowRightAlt,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { TiTick } from "react-icons/ti";
import {
  useAddProductMutation,
  useLazyGetCategoriesQuery,
} from "../../../store/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/Store";
import Loader from "../../Loaders/Loader";
import {
  UpdateAddProductIsCompelete,
  UpdateCategory,
  UpdateProductInfo,
  UpdateProductPreviewImageUrls,
  UpdateSubCategory,
  UpdateSubSubCategory,
} from "../../../store/slices/adminSlice";
import { UpdateCategoryState } from "../../../store/slices/categorySlice";
import { LuPlusCircle } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

const Categorydetails: React.FC = () => {
  const dispatch = useDispatch();

  const categoryInfo = useSelector(
    (state: RootState) => state.admin.AddProduct.CategoryInfo
  );

  const [
    triggerGetCategories,
    { data: categoriesData, isSuccess: isCategoriesSuccess },
  ] = useLazyGetCategoriesQuery();

  useEffect(() => {
    triggerGetCategories({});
  }, [triggerGetCategories]);

  useEffect(() => {
    if (isCategoriesSuccess && categoriesData) {
      dispatch(UpdateCategoryState(categoriesData?.data));
    }
  }, [isCategoriesSuccess, categoriesData, dispatch]);

  const categories = useSelector(
    (state: RootState) => state.categories.Category
  );

  interface Category {
    id: string;
    name: string;
    subcategories?: Category[]; // Subcategories are optional
  }

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = categories.find(
      (el: Category) => el.id == e.target?.value
    );
    dispatch(UpdateCategory(selected));
  };

  const handleSelectSubCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = categoryInfo.Category?.subcategories.find(
      (el: Category) => el.id === e.target.value
    );

    dispatch(UpdateSubCategory(selected));
  };
  const handleSelectSubSubCategory = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = categoryInfo.subCategory?.subcategories.find(
      (el: Category) => el.id === e.target.value
    );

    dispatch(UpdateSubSubCategory(selected));
  };

  return (
    <div className="flex-1 flex flex-col   gap-6">
      <div className="">
        <p className="text-xl mb-4 font-semibold">Select a Category</p>
        <select
          className="p-2 rounded-md border-2"
          onChange={handleSelectCategory}
          name=""
          id=""
          value={categoryInfo.Category?.id || ""}
        >
          <option disabled value="">
            Select a Category
          </option>
          {categories.map((el: Category, i) => (
            <option key={i} value={el.id}>
              {el.name}
            </option>
          ))}
        </select>
      </div>
      {categoryInfo.Category && (
        <div>
          <p className="text-xl font-semibold mb-4">Select a Sub Category</p>
          <select
            className="p-2 rounded-md border-2"
            onChange={handleSelectSubCategory}
            name=""
            id=""
            value={categoryInfo.subCategory?.id || ""}
          >
            <option defaultValue={""} value="">
              Select a sub Category
            </option>
            {categoryInfo.Category.subcategories.map(
              (el: Category, i: number) => (
                <option key={i} value={el.id}>
                  {el.name}
                </option>
              )
            )}
          </select>
        </div>
      )}
      {categoryInfo.subCategory && (
        <div>
          <p className="text-xl font-semibold mb-4">
            Select a Sub Sub Category
          </p>
          <select
            className="p-2 rounded-md border-2"
            onChange={handleSelectSubSubCategory}
            name=""
            id=""
            value={categoryInfo.subsubCategory?.id || ""}
          >
            <option defaultValue={""} value="">
              Select a Sub Category
            </option>
            {categoryInfo.subCategory.subcategories.map(
              (el: Category, i: number) => (
                <option key={i} value={el.id}>
                  {el.name}
                </option>
              )
            )}
          </select>
        </div>
      )}
    </div>
  );
};

const Productdetails: React.FC = () => {
  const dispatch = useDispatch();
  const { ProductInfo, ProductPreviewImageUrls }: any = useSelector(
    (state: RootState) => state.admin.AddProduct
  );
  const handleProductdetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newProductInfo = { ...ProductInfo, [name]: value };
    dispatch(UpdateProductInfo(newProductInfo));
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumber = /^[0-9]*$/.test(value);
    if (isNumber) {
      dispatch(
        UpdateProductInfo({
          ...ProductInfo,
          sizes: { ...ProductInfo.sizes, [name]: value },
        })
      );
    }
  };

  const handleProductPreviewImageUrls = (imgArray: string[]) => {
    dispatch(UpdateProductPreviewImageUrls(imgArray));
  };

  const imageRef = useRef<null | HTMLInputElement>(null);
  const tail_anim1 = useRef<null | HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (tail_anim1.current) {
      (tail_anim1.current as HTMLElement).style.width = "15px";
      (tail_anim1.current as HTMLElement).style.height = "5px";
    }
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (tail_anim1.current) {
      // If the drag leaves tail_anim1, reset styles only for tail_anim1
      (tail_anim1.current as HTMLElement).style.width = "10px";
      (tail_anim1.current as HTMLElement).style.height = "10px";
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const productImageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      handleProductPreviewImageUrls([
        ...ProductPreviewImageUrls,
        ...productImageUrls,
      ]);
      dispatch(
        UpdateProductInfo({
          ...ProductInfo,
          images: [...ProductInfo.images, ...files],
        })
      );
    }
    // If the drag leaves tail_anim1, reset styles only for tail_anim1
    (tail_anim1.current as HTMLElement).style.width = "10px";
    (tail_anim1.current as HTMLElement).style.height = "10px";
  };

  // handling the file Change by selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesList = Array.from(files);
      const productImageUrls = filesList.map((file) =>
        URL.createObjectURL(file)
      );
      handleProductPreviewImageUrls([
        ...ProductPreviewImageUrls,
        ...productImageUrls,
      ]);
      dispatch(
        UpdateProductInfo({
          ...ProductInfo,
          images: [...ProductInfo.images, ...filesList],
        })
      );
    }
  };

  const handleSelectFile = () => {
    (imageRef.current as HTMLInputElement).click();
  };

  const handleDeleteProduct = (deleteimg: string, index: number) => {
    const ProductImagesArray = ProductInfo.images.filter(
      (_: any, i: number) => i !== index
    );
    const ImagesArray = ProductPreviewImageUrls.filter(
      (img: string) => img !== deleteimg
    );
    dispatch(
      UpdateProductInfo({
        ...ProductInfo,
        images: ProductImagesArray,
      })
    );
    handleProductPreviewImageUrls(ImagesArray);
    console.log(ProductInfo.images, ProductPreviewImageUrls);
  };
  return (
    <div className="flex-1">
      <span className="text-sm">
        (Note : 1st image will be taken as main display image)
      </span>
      <div className="overflow-auto">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4 ">
          <div
            className={`relative h-[50vh] md:h-[65vh] images border-2 p-2  `}
          >
            <div
              className={`uploadbox w-full h-full min-h-[300px] overflow-x-hidden overflow-y-auto ${
                ProductPreviewImageUrls.length ? "grid grid-cols-3  gap-2" : ""
              }`}
            >
              {ProductPreviewImageUrls.length > 0 && (
                <>
                  {ProductPreviewImageUrls.map((url: string, index: number) => (
                    <div
                      key={index}
                      className="thumbnail_preview w-full h-full relative"
                    >
                      <RxCross2
                        onClick={() => handleDeleteProduct(url, index)}
                        className="text-lg absolute top-1 right-1 cursor-pointer"
                      />
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          backgroundColor: "white",
                        }}
                        src={url}
                        alt={`Thumbnail Preview ${index + 1}`}
                      />
                    </div>
                  ))}
                </>
              )}

              <div
                className="thumbnail w-full h-full flex flex-col items-center justify-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
              >
                <div
                  className={`circle  bg-[#1f1f1f] rounded-full flex flex-col items-center justify-center ${
                    ProductPreviewImageUrls.length ? "w-10 h-10" : "w-24 h-24"
                  }`}
                >
                  <div
                    className={`arrow w-0 h-0  border-l-transparent  border-r-transparent  border-b-[#909090] ${
                      ProductPreviewImageUrls.length
                        ? "border-l-[10px] border-r-[10px] border-b-[10px]"
                        : "border-l-[15px] border-r-[15px] border-b-[15px]"
                    }`}
                  ></div>
                  <div
                    ref={tail_anim1}
                    className="arrow_tail w-[8px] h-[8px] bg-[#909090]"
                  ></div>
                  <div
                    className={`rect mt-[4px] ${
                      ProductPreviewImageUrls.length
                        ? "w-5 h-[1.5px]"
                        : "w-6 h-1"
                    } bg-[#909090]`}
                  ></div>
                </div>
                <p
                  className={`${
                    ProductPreviewImageUrls.length
                      ? "text-sm text-center"
                      : "text-md"
                  }`}
                >
                  Drag and Drop images to Upload
                </p>
                <p
                  className={`${
                    ProductPreviewImageUrls.length ? "text-sm" : "text-md"
                  }`}
                >
                  or
                </p>
                <input
                  type="file"
                  // name="thumbnail"
                  onChange={handleFileChange}
                  ref={imageRef}
                  multiple
                  hidden
                  accept=".png, .jpg, .jpeg"
                />
                <span
                  className={`cursor-pointer underline text-blue-500 ${
                    ProductPreviewImageUrls.length ? "text-sm" : "text-md"
                  }`}
                  onClick={handleSelectFile}
                >
                  Select File
                </span>
              </div>
            </div>

            {/* Add icon */}
            <div
              className="group absolute bottom-2 left-1/2 -translate-x-1/2 transition-all duration-100 ease-in hover:scale-95"
              onClick={handleSelectFile}
            >
              <LuPlusCircle className="text-4xl  cursor-pointer" />
              <div className="absolute whitespace-nowrap bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Add images
              </div>
            </div>
          </div>

          <div>
            <div className="input_fields h-fit grid grid-cols-2 gap-4">
              {[
                "Brand",
                "name",
                "price",
                "material",
                "size",
                "fit",
                "washcare",
              ].map((val) => {
                return (
                  <input
                    name={val}
                    type="text"
                    placeholder={val}
                    value={ProductInfo[val]}
                    onChange={handleProductdetails}
                    className="border-2 border-gray-300 focus:border-black p-2 rounded-md h-fit"
                  />
                );
              })}
            </div>
            <div className="mt-10 mb-2">
              <p className="text-md font-semibold"> Sizes :</p>
              <div className="flex flex-wrap  gap-4 mt-2">
                {["S", "M", "L", "XL", "XXL"].map((el) => (
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-sm">
                      {el}
                    </span>
                    <input
                      name={el}
                      value={ProductInfo?.sizes[el]}
                      type="text"
                      className="bg-gray-200 w-16 p-1 rounded-md text-sm text-center"
                      placeholder="Number"
                      onChange={handleSizeChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddProduct: React.FC = () => {
  const { CategoryInfo, ProductInfo }: any = useSelector(
    (state: RootState) => state.admin.AddProduct
  );
  const { Category, subCategory, subsubCategory } = CategoryInfo;
  return (
    <div className="flex-1 flex flex-col gap-2  overflow-hidden">
      {/* Category details */}
      <div>
        <p className="text-lg font-semibold">Selected Category</p>
        <div className="flex  items-center gap-4">
          {Category?.name && <span className="text-lg">{Category?.name}</span>}
          <MdArrowRightAlt className="text-4xl" />
          {subCategory?.name && (
            <span className="text-lg">{subCategory?.name}</span>
          )}
          <MdArrowRightAlt className="text-4xl" />
          {subsubCategory?.name && (
            <span className="text-lg">{subsubCategory?.name}</span>
          )}
        </div>
      </div>
      {/* Product details */}
      <div className="h-full flex flex-col ">
        <p className="text-lg font-semibold">Product Details</p>
        <div className="flex flex-col-reverse md:flex-row gap-10 h-full">
          <div className="">
            {Object.keys(ProductInfo).map((key) => {
              if (typeof ProductInfo[key] == "string") {
                return (
                  <div className="flex leading-1">
                    <label className="text-md font-semibold">{key} : </label>
                    <p className="ml-4">{ProductInfo[key]}</p>
                  </div>
                );
              }
            })}
          </div>
          <div className="overflow-auto  h-[50vh] md:h-[65vh] flex-1 grid gap-4 grid-cols-3">
            {Object.keys(ProductInfo).map((key) => {
              if (Array.isArray(ProductInfo[key])) {
                return (
                  <>
                    {ProductInfo[key].map((img) => (
                      <>
                        <img
                          className="w-full object-contain"
                          src={URL.createObjectURL(img)}
                          alt=""
                        />
                      </>
                    ))}
                  </>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const stepConfig = [
  {
    name: "Category Info",
    Component: () => <Categorydetails />,
  },
  {
    name: "Products Info",
    Component: () => <Productdetails />,
  },
  {
    name: "Add Product",
    Component: () => <AddProduct />,
  },
];

const AddProductStepper: React.FC = () => {
  const dispatch = useDispatch();

  const { CategoryInfo, ProductInfo } = useSelector(
    (state: RootState) => state.admin.AddProduct
  );
  const { subsubCategory } = CategoryInfo;
  const [currentStep, setCurrentStep] = useState(1);
  const [margins, setMargins] = useState({ marginLeft: 0, marginRight: 0 });
  const stepRef = useRef<HTMLDivElement[]>([]);
  const calculateProgressbarwidth = () => {
    return ((currentStep - 1) / (stepConfig.length - 1)) * 100;
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    setMargins({
      marginLeft: stepRef.current[0].offsetWidth / 2,
      marginRight: stepRef.current[stepConfig.length - 1].offsetWidth / 2,
    });
  }, [stepRef.current]);
  const ActiveComponent = stepConfig[currentStep - 1]?.Component;
  const [
    addProduct,
    {
      isSuccess: addProductIsSuccess,
      data: ProductData,
      isLoading: addProductIsLoading,
    },
  ] = useAddProductMutation();
  const handleAddProduct = async () => {
    const form = new FormData();

    // Append text fields
    form.append("Brand", ProductInfo.Brand);
    form.append("name", ProductInfo.name);
    form.append("price", ProductInfo.price);
    form.append("material", ProductInfo.material);
    form.append("size", ProductInfo.size);
    form.append("fit", ProductInfo.fit);
    form.append("washcare", ProductInfo.washcare);
    form.append("categoryId", subsubCategory?.id);

    // Append sizes as a JSON string
    form.append("sizes", JSON.stringify(ProductInfo.sizes));

    // Append images
    ProductInfo.images.forEach((image) => {
      form.append("images", image); // All images go under the key 'images'
    });

    await addProduct(form);
  };

  useEffect(() => {
    if (addProductIsSuccess && ProductData) {
      console.log(ProductData);
      dispatch(UpdateAddProductIsCompelete(true));
    }
  }, [addProductIsSuccess]);
  return (
    <div className="w-full flex-1  mt-2 flex flex-col gap-4 overflow-hidden">
      <div className="stepper relative  flex justify-between items-center">
        {stepConfig.map((step, index) => {
          return (
            <div
              key={index}
              className={`step flex flex-col items-center `}
              ref={(el) => {
                if (el) {
                  stepRef.current[index] = el;
                }
              }}
            >
              <div
                className={`step-number w-10 h-10 z-10 rounded-full   flex items-center justify-center ${
                  currentStep > index + 1
                    ? "bg-black text-white"
                    : "bg-gray-200 text-black"
                }
              ${currentStep === index + 1 ? "" : ""}
              `}
              >
                {currentStep > index + 1 ? (
                  <TiTick className="text-2xl" />
                ) : (
                  index + 1
                )}
              </div>
              <p className="step-name">{step.name}</p>
            </div>
          );
        })}
        <div
          className="progress-bar absolute top-1/4 left-0 h-[4px] bg-gray-400"
          style={{
            width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
            marginLeft: margins.marginLeft,
          }}
        >
          <div
            style={{ width: `${calculateProgressbarwidth()}%` }}
            className="progress h-full bg-black transition-all duration-200 ease-in"
          ></div>
        </div>
      </div>
      <ActiveComponent />
      {/* prev & next btns */}
      <div className="mt-auto h-10 flex justify-around">
        {currentStep > 1 && (
          <button
            className="bg-gray-500 p-2 flex items-center px-4 rounded-md text-white"
            onClick={() => handlePrev()}
          >
            <>
              <MdOutlineKeyboardDoubleArrowLeft className="text-lg" />
              <p className="leading-none">Prev</p>
            </>
          </button>
        )}
        <button
          className={`bg-black   w-28   flex justify-center items-center rounded-md text-white`}
          onClick={
            currentStep === stepConfig.length ? handleAddProduct : handleNext
          }
        >
          {currentStep === stepConfig.length ? (
            <p className="leading-none">
              {!addProductIsLoading ? "Add Product" : <Loader />}{" "}
            </p>
          ) : (
            <>
              <p className="leading-none">Next</p>
              <MdOutlineKeyboardDoubleArrowRight className="text-lg" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddProductStepper;
