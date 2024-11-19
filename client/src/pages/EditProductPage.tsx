import { LuPlusCircle } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../store/slices/apiSlice";
import { CiEdit } from "react-icons/ci";
import Loader from "../components/Loaders/Loader";
import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import ToastConfig from "../toastConfig/ToastConfig";
import { GoArrowLeft } from "react-icons/go";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const INPUT_FIELDS = [
  "brand",
  "name",
  "price",
  "material",
  "size",
  "fit",
  "washcare",
];

const EditProductPage = () => {
  const { id } = useParams();
  const imageRef = useRef<null | HTMLInputElement>(null);
  const tail_anim1 = useRef<null | HTMLDivElement>(null);
  const { data: productData, isSuccess: productIsSuccess } =
    useGetProductByIdQuery({ id });
  const [updateProduct, setUpdateProduct] = useState<null | any>(null);
  const [
    triggerUpdateProduct,
    {
      isLoading: isUpdating,
      isSuccess: updateProductIsSuccess,
      data: updateProductData,
    },
  ] = useUpdateProductMutation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (productIsSuccess) {
      console.log(productData.data);
      setUpdateProduct(productData?.data);
    }
  }, [productIsSuccess, productData]);

  useEffect(() => {
    if (updateProductData) {
      console.log(updateProductData);
      setUpdateProduct(updateProductData?.data);
    }
  }, [updateProductIsSuccess, updateProductData]);

  const handleProductDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateProduct((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    size: string
  ) => {
    const { value } = e.target;
    setUpdateProduct((prev: any) => ({
      ...prev,
      sizes: { ...prev.sizes, [size]: value },
    }));
  };

  const handleUpdateProduct = () => {
    if (updateProduct && productData?.data) {
      const updatedFields = Object.keys(updateProduct).reduce(
        (acc: any, key) => {
          if (
            key === "images" &&
            productData.data[key].filter(
              (img: string) => !updateProduct?.images?.includes(img)
            ).length
          ) {
            acc[key] = updateProduct[key];
            console.log(updateProduct);
          } else if (key === "updateimages" && updateProduct[key]?.length > 0) {
            acc[key] = updateProduct[key];
          } else if (
            !Array.isArray(updateProduct[key]) &&
            updateProduct[key] !== productData.data[key]
          ) {
            acc[key] = updateProduct[key];
          }
          return acc;
        },
        {}
      );

      if (Object.keys(updatedFields).length) {
        const form = new FormData();
        Object.keys(updatedFields).map((key) => {
          if (key == "images" || key == "updateimages") {
            updatedFields[key].map((val: any) => form.append(key, val));
          } else {
            form.append(key, JSON.stringify(updatedFields[key]));
          }
        });
        console.log(updatedFields);
        triggerUpdateProduct({ id, data: form });
      } else {
        toast.error("Change Something to Update the Product");
      }
    }
  };

  const handleDeleteProduct = (_: any, index: number) => {
    setUpdateProduct((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleDeleteProductFromUpdateimages = (file: React.MouseEvent) => {
    setUpdateProduct((prev: any) => ({
      ...prev,
      updateimages: prev.updateimages.filter((fil: any) => fil !== file),
    }));
  };

  const handleSelectFile = () => {
    (imageRef?.current as HTMLInputElement).click();
  };

  // handling the file Change by selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      if (updateProduct["updateimages"]) {
        setUpdateProduct((prev: any) => ({
          ...prev,
          updateimages: [...prev.updateimages, ...filesArray],
        }));
      } else {
        setUpdateProduct((prev: any) => ({
          ...prev,
          updateimages: filesArray,
        }));
      }
    }
  };

  const handleDragOver = (e: React.MouseEvent) => {
    e.preventDefault();
    if (tail_anim1.current) {
      tail_anim1.current.style.width = "15px";
      tail_anim1.current.style.height = "5px";
    }
  };
  const handleDragLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (tail_anim1.current) {
      // If the drag leaves tail_anim1, reset styles only for tail_anim1
      tail_anim1.current.style.width = "10px";
      tail_anim1.current.style.height = "10px";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files && files.length > 0) {
      const productImageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      setUpdateProduct((prev: any) => ({
        ...prev,
        images: [...prev.images, ...productImageUrls],
      }));
    }

    // If the drag leaves `tail_anim1`, reset styles only for `tail_anim1`
    if (tail_anim1.current) {
      (tail_anim1.current as HTMLDivElement).style.width = "10px";
      (tail_anim1.current as HTMLDivElement).style.height = "10px";
    }
  };

  const Navigate = useNavigate();

  return (
    <div className="p-5 h-fit relative md:p-4 flex flex-col gap-4 w-full">
      <div className="flex gap-4">
        <GoArrowLeft
          onClick={() => Navigate(-1)}
          className="w-[1.6rem] h-full text-2xl cursor-pointer"
        />

        <p className="text-lg font-semibold flex gap-4 items-center">
          Edit Product <CiEdit />
        </p>
      </div>
      <ToastConfig />
      {productIsSuccess ? (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Image Section */}
            <div className="relative images border-2 p-2 h-full">
              <div
                className={`uploadbox w-full h-full min-h-[300px] overflow-x-hidden overflow-y-auto ${
                  updateProduct?.images?.length ? "grid grid-cols-3 gap-2" : ""
                }`}
              >
                {updateProduct?.images?.map((url: string, index: number) => (
                  <div
                    key={index}
                    className="thumbnail_preview w-full h-full relative"
                  >
                    <RxCross2
                      onClick={() => handleDeleteProduct(url, index)}
                      className="text-lg absolute top-1 right-1 cursor-pointer"
                    />
                    <img
                      src={url}
                      alt={`Thumbnail Preview ${index + 1}`}
                      className="w-full h-full object-contain bg-white"
                    />
                  </div>
                ))}
                {updateProduct?.updateimages &&
                updateProduct?.updateimages.length ? (
                  <>
                    {updateProduct?.updateimages.map(
                      (file: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="thumbnail_preview w-full h-full relative"
                          >
                            <RxCross2
                              onClick={() =>
                                handleDeleteProductFromUpdateimages(file)
                              }
                              className="text-lg absolute top-1 right-1 cursor-pointer"
                            />
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Thumbnail Preview ${index + 1}`}
                              className="w-full h-full object-contain bg-white"
                            />
                          </div>
                        );
                      }
                    )}
                  </>
                ) : (
                  ""
                )}

                <div
                  className="thumbnail w-full h-full flex flex-col items-center justify-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragLeave={handleDragLeave}
                >
                  <div
                    className={`circle  bg-[#1f1f1f] rounded-full flex flex-col items-center justify-center ${"w-10 h-10"}`}
                  >
                    <div
                      className={`arrow w-0 h-0  border-l-transparent  border-r-transparent  border-b-[#909090] ${"border-l-[10px] border-r-[10px] border-b-[10px]"}`}
                    ></div>
                    <div
                      ref={tail_anim1}
                      className="arrow_tail w-[8px] h-[8px] bg-[#909090]"
                    ></div>
                    <div
                      className={`rect mt-[4px] ${"w-5 h-[1.5px]"} bg-[#909090]`}
                    ></div>
                  </div>
                  <p className={`${"text-sm text-center"}`}>
                    Drag and Drop images to Upload
                  </p>
                  <p className={`${"text-sm"}`}>or</p>
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
                    className={`cursor-pointer underline text-blue-500 ${"text-sm"}`}
                    onClick={handleSelectFile}
                  >
                    Select File
                  </span>
                </div>
              </div>
              {/* Add Image Icon */}
              <div
                onClick={handleSelectFile}
                className="group absolute bottom-2 left-1/2 transform -translate-x-1/2 transition-all duration-100 ease-in hover:scale-95"
              >
                <LuPlusCircle className="text-4xl cursor-pointer" />
                <div className="absolute whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Add images
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col">
              <div className="input_fields grid grid-cols-2 gap-4">
                {INPUT_FIELDS.map((field) => (
                  <input
                    key={field}
                    name={field}
                    type="text"
                    placeholder={field}
                    value={updateProduct ? updateProduct[field] : ""}
                    onChange={handleProductDetails}
                    className="border-2 border-gray-300 focus:border-black p-2 rounded-md"
                  />
                ))}
              </div>
              <div className="mt-10 mb-2">
                <p className="text-md font-semibold">Sizes:</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  {SIZES.map((size) => (
                    <div
                      key={size}
                      className="flex flex-col items-center gap-2"
                    >
                      <span className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full text-sm">
                        {size}
                      </span>
                      <input
                        name={size}
                        value={updateProduct?.sizes?.[size] || ""}
                        type="text"
                        className="bg-gray-200 w-16 p-1 rounded-md text-sm text-center"
                        placeholder="Number"
                        onChange={(e) => handleSizeChange(e, size)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="h-10 self-end px-3 bg-black text-white rounded-md"
                onClick={handleUpdateProduct}
              >
                {isUpdating ? <Loader /> : "Update"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[90vh] grid place-content-center">
          <div className="pageloader"></div>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
