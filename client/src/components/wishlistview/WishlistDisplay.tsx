import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { RxCross2 } from "react-icons/rx";
import {
  useAddProductToBagMutation,
  useLazyGetCartQuery,
  useLazyGetWishlistQuery,
  useRemoveProductFromWishlistMutation,
} from "../../store/slices/apiSlice";
import React, { useEffect, useRef, useState } from "react";
import { UpdateWishlist } from "../../store/slices/wishlistSlice";
import { Link } from "react-router-dom";
import { UpdateCart } from "../../store/slices/cartItemSlice";
import toast from "react-hot-toast";
import Loader from "../Loaders/Loader";
import FilterLoader from "../Loaders/FilterLoader";

const WishlistDisplay = () => {
  const dispatch = useDispatch();
  const Authuser: any = useSelector((state: RootState) => state.auth.user);
  const sizeContainerRef = useRef<HTMLDivElement | null>(null);

  interface selectedProduct {
    id: string;
    sizes: Object | any;
  }
  const [selectedProduct, setSelectedProduct] =
    useState<selectedProduct | null>(null);
  const [selectedsize, setSelectedSize] = useState<string | null>(null);
  const [
    triggerWishlist,
    { isSuccess: getWishlistIsSuccess, data: WishlistData },
  ] = useLazyGetWishlistQuery();

  const [triggerBag, { isSuccess: getBagIsSuccess, data: BagData }] =
    useLazyGetCartQuery();

  const [
    removeProductFromWishlist,
    {
      isSuccess: RemoveProductFromWishlistIsSuccess,
      isLoading: RemoveProductFromWishlistIsLoading,
      data: RemoveProductFromWishlistData,
    },
  ] = useRemoveProductFromWishlistMutation();

  const [
    addProductToBag,
    {
      isSuccess: AddProductToBagIsSuccess,
      isLoading: AddProductToBagIsLoading,
      data: AddProductToBagData,
    },
  ] = useAddProductToBagMutation();

  useEffect(() => {
    if (getBagIsSuccess && BagData) {
      dispatch(UpdateCart(BagData?.data));
    }
  }, [getBagIsSuccess, BagData]);

  useEffect(() => {
    if (getWishlistIsSuccess && WishlistData) {
      dispatch(UpdateWishlist(WishlistData?.data));
    }
  }, [getWishlistIsSuccess, WishlistData]);

  const handleRemoveFromWishlist = async (id: string | undefined) => {
    await removeProductFromWishlist({ id, wishlistId: WishlistData?.data?.id });
  };

  useEffect(() => {
    triggerWishlist({});
  }, [RemoveProductFromWishlistIsSuccess, RemoveProductFromWishlistData?.data]);

  useEffect(() => {
    triggerBag({});
  }, [AddProductToBagIsSuccess, AddProductToBagData?.data]);

  const handleSelectProduct = async (Obj: any) => {
    setSelectedProduct(Obj);
  };

  const handleMoveToBag = async () => {
    if (selectedsize) {
      await addProductToBag({
        id: selectedProduct?.id,
        size: selectedsize,
        cartId: BagData?.data?.id,
      });
      toast.success("Product Moved To bag");
      handleRemoveFromWishlist(selectedProduct?.id);
    } else {
      if (sizeContainerRef.current) {
        // Add the wiggle class to start the animation
        (sizeContainerRef.current as HTMLDivElement).classList.add("wiggle");

        // Optionally remove the animation class after it finishes
        setTimeout(() => {
          (sizeContainerRef.current as HTMLDivElement).classList.remove(
            "wiggle"
          );
        }, 500); // 500ms matches the animation duration
      }
    }
  };

  useEffect(() => {
    setSelectedProduct(null);
    setSelectedSize(null);
  }, [AddProductToBagData, AddProductToBagIsSuccess]);

  const sizesOrder = ["XS", "S", "M", "L", "XL", "XXL"];
  const sizesOriginal = selectedProduct
    ? Object.keys(selectedProduct.sizes)
    : [];

  const handleResetVal = (e: React.MouseEvent) => {
    if ((e.target as HTMLDivElement).classList.contains("parentContainer")) {
      setSelectedProduct(null);
      setSelectedSize(null);
    }
  };
  return (
    <>
      {Authuser ? (
        !WishlistData?.data?.products?.length ? (
          <div className=" w-full min-h-[90.3vh] p-6 flex items-center justify-center">
            <div className="w-[300px]   flex items-center justify-center flex-col gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-32"
                viewBox="0 0 64 64"
              >
                <path fill="#C7C7ED" d="M7.6 10.2h39.3V64H7.6z" />
                <path fill="#aeadfd" d="M56.4 10.2V64L51 58.3 46.9 64V10.2z" />
                <path fill="#C7C7ED" d="M56.4 64h-9.5l4.1-5.7z" />
                <path fill="#7c7cfe" d="M56.4 10.2V64L51 58.3V10.2z" />
                <path
                  fill="#605EED"
                  d="M36.9 59.2c-.1.5-.3.9-.6 1.3-.6 1.1-1.6 1.9-2.8 2.5l-2.3 1H20.8l-3.1-7.1-.1-.2c-.5-1.2-.6-2.5-.4-3.7.1-.4.2-.7.3-1 .1-.1.1-.2.1-.3.6-1.2 1.6-2.2 2.9-2.8 1.5-.7 3.1-.6 4.6-.1l1.2.6c.2.2.5.4.7.6l.3.3c.4.5.8 1 1.1 1.6l.1.2.2-.1c.4-.2.7-.3 1.1-.4.1 0 .3 0 .4-.1h.1c.4-.1.9-.1 1.3 0 .2 0 .4 0 .6.1.4.1.8.2 1.1.3.3.1.6.3.9.4.1.1.2.1.3.2.3.2.6.5.9.7.5.5.9 1.1 1.2 1.8.6 1.4.6 2.8.3 4.2zm-23.4-.5c.3.1.5.2.7.5l.4.4.3.4.8 1 .3.3-2.1 1.7c-.2.2-.5.3-.8.3h-.4c-.3-.1-.6-.2-.8-.5-.2-.3-.3-.7-.3-1 0-.1 0-.2.1-.3 0-.1 0-.1.1-.2 0 0 0-.1.1-.1l.3-.3-.2-.2v-.1c0-.1-.1-.2-.1-.3V59.6c0-.1.1-.2.1-.2.1-.1.2-.3.3-.4.3-.2.6-.3.9-.3h.3zm1.6-3.6c-.3.2-.7.3-1.1.3l-.8-.1-.6-.1-1.8-.2h-.6l.4-3.7v-.1c0-.4.2-.8.5-1.1.1-.1.2-.2.3-.2 0 0 .1 0 .1-.1.4-.2.8-.4 1.2-.3.5.1 1 .3 1.3.7.1.1.2.2.2.4 0 .1.1.2.1.3v.1c0 .2.1.4 0 .6v.1h.1c.1 0 .2 0 .4.1h.1c.1 0 .2.1.4.2.1 0 .1.1.2.1l.3.3c.1.1.1.2.2.3 0 0 0 .1.1.1.1.1.1.2.1.3.1.2.1.4.1.7 0 .5-.3.9-.6 1.2-.4-.1-.5 0-.6.1zm18.3-6c-.3.2-.7.3-1.1.3l-.8-.1-.6-.1-1.8-.2h-.6l.4-3.7v-.1c0-.4.2-.8.5-1.1.1-.1.2-.2.3-.2 0 0 .1 0 .1-.1.4-.2.8-.4 1.2-.3.5.1 1 .3 1.3.7.1.1.2.2.2.4 0 .1.1.2.1.3v.1c0 .2.1.4 0 .6v.1h.1c.1 0 .2 0 .4.1h.1c.1 0 .2.1.4.2.1 0 .1.1.2.1l.3.3c.1.1.1.2.2.3 0 0 0 .1.1.1.1.1.1.2.1.3.1.2.1.4.1.7 0 .5-.3.9-.6 1.2-.4-.1-.5 0-.6.1zm-12.3-3c0 .2-.1.3-.3.4l-.3.2-.2.2-.6.5-.2.2-1-1.2c-.1-.1-.2-.3-.2-.5v-.1c0-.2.1-.3.3-.5.2-.1.4-.2.6-.2h.4c.1 0 .1.1.2.2l.1-.1c.1 0 .1 0 .2-.1h.4s.1 0 .1.1c.1 0 .2.1.2.2.1.2.2.3.2.5.1.1.1.2.1.2zm-3.3-5.3c0 .4-.1.8-.3 1.2l-.5.6-.4.5-1 1.5-.3.5L12 43c-.4-.2-.6-.6-.7-1 0-.1-.1-.2-.1-.3v-.1c0-.4.1-.9.3-1.3.3-.4.8-.7 1.3-.8H13.6c.2.1.4.1.6.3.1-.1.2-.2.2-.3l.1-.1c.1-.1.2-.2.3-.2.1 0 .1-.1.2-.1s.2-.1.4-.1h.4c.1 0 .2 0 .4.1s.4.1.6.3c.4.3.7.7.8 1.1.1 0 .2.1.2.3zm8.7-1.9c0 .2-.2.5-.3.6l-.4.3-.3.3-.8.8-.3.3-1.6-1.7c-.2-.2-.3-.4-.3-.7V38.5c0-.3.1-.5.4-.7.2-.2.5-.3.8-.3h.3c.1 0 .1 0 .2.1h.1c.1.1.2.1.3.2.1-.1.1-.1.2-.1h.1c.1 0 .2-.1.2-.1h.6c.1 0 .1 0 .2.1s.2.1.3.2c.2.2.3.5.3.7v.3z"
                />
                <circle cx="20.5" cy="15.1" r="2.2" fill="#605EED" />
                <path
                  fill="#C7C7ED"
                  d="M21.6 15.1c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1.5-1.1 1.1-1.1 1.1.5 1.1 1.1z"
                />
                <path
                  fill="#C7C7ED"
                  d="M36.9 15.1c0 1.2-1 2.2-2.2 2.2s-2.2-1-2.2-2.2 1-2.2 2.2-2.2 2.2 1 2.2 2.2z"
                />
                <path
                  fill="#C7C7ED"
                  d="M35.8 15.1c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1.5-1.1 1.1-1.1 1.1.5 1.1 1.1z"
                />
                <path
                  fill="#605EED"
                  d="M21.1 15.2h-1.3V5.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v4.7h-1.3V5.5c0-2.3-1.9-4.2-4.2-4.2s-4.2 1.9-4.2 4.2v9.7zM35.4 15.2h-1.3V5.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5v4.7h-1.3V5.5c0-2.3-1.9-4.2-4.2-4.2-2.3 0-4.2 1.9-4.2 4.2v9.7z"
                />
              </svg>

              <p className="text-2xl">YOUR WISHLIST IS EMPTY</p>
              <span className="text-center">
                Add Products that you like to your wishlist.Review them anytime
                and easily move them to the Bag
              </span>
              <Link to={"/"}>
                <button className="p-3 w-full border-2 rounded-md border-[#C7C7ED] text-sm">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full relative min-h-[90.3vh] p-6">
            <p className="text-lg  ">
              My Wishlist - {WishlistData?.data?.products?.length} items
            </p>
            <div className="wishlistitemsContainer mt-4 grid grid-cols-2 gap-1  md:flex md:flex-wrap md:gap-4">
              {WishlistData?.data?.products?.map((item: any, i: number) => {
                return (
                  <div
                    key={i}
                    className=" md:w-[250px] relative md:border-[1.5px] md:p-2"
                  >
                    <div
                      onClick={() => handleRemoveFromWishlist(item?.id)}
                      className="removeFromwishlist cursor-pointer bg-gray-50 rounded-full p-1 absolute top-2 right-2 md:top-3 md:right-3"
                    >
                      <RxCross2 className="text-xl" />
                    </div>
                    <img src={item.images[0]} alt="" />
                    <p>{item.brand}</p>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.name}
                    </p>
                    <p>₹ {item?.price}</p>
                    <button
                      onClick={() =>
                        handleSelectProduct({
                          id: item?.id,
                          sizes: item?.sizes,
                        })
                      }
                      className="w-full mt-2 p-2 bg-red-100"
                    >
                      Move To Bag
                    </button>
                  </div>
                );
              })}
              {selectedProduct ? (
                <div
                  className="absolute parentContainer inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center"
                  onClick={handleResetVal}
                >
                  <div className="w-[300px] bg-white p-4 rounded-md">
                    <p className="font-semibold text-lg mb-4">Select size :</p>
                    <div className="flex gap-3" ref={sizeContainerRef}>
                      {sizesOrder?.map((key) => {
                        if (sizesOriginal?.includes(key)) {
                          const sizeavailabel = Number(
                            selectedProduct?.sizes[key]
                          );
                          return sizeavailabel ? (
                            <li
                              className={`w-16 h-16 cursor-pointer font-semibold relative rounded-full flex items-center justify-center border-2 ${
                                key == selectedsize ? "border-red-400" : ""
                              }`}
                              key={key}
                            >
                              <span
                                onClick={() => setSelectedSize(key)}
                                className="rounded-full w-full h-full grid place-content-center"
                              >
                                {key}
                              </span>
                              {Number(selectedProduct.sizes[key]) < 10 && (
                                <p className="absolute mt-1 top-full left-1/2 text-sm font-normal whitespace-nowrap py-1 -translate-x-1/2 px-4 rounded-md bg-gray-100">
                                  {selectedProduct.sizes[key]} left
                                </p>
                              )}
                            </li>
                          ) : (
                            <li
                              className="w-16 h-16 cursor-not-allowed font-semibold relative text-gray-300 rounded-full flex items-center justify-center border-2 after:content-[''] after:absolute after:w-[1.5px] after:h-full after:top-0 after:left-1/2 after:z-10 after:rotate-45 after:bg-gray-200"
                              key={key}
                            >
                              {key}
                            </li>
                          );
                        }
                      })}
                    </div>
                    <button
                      className="h-10 w-full grid place-content-center mt-10 bg-red-400 rounded-md"
                      onClick={handleMoveToBag}
                    >
                      {AddProductToBagIsLoading ||
                      RemoveProductFromWishlistIsLoading ? (
                        <Loader color="black" />
                      ) : (
                        "Done"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {RemoveProductFromWishlistIsLoading && <FilterLoader />}
          </div>
        )
      ) : (
        <div className="w-full h-[87vh] grid place-content-center">
          <p className="text-lg font-semibold">Please Login to view wishlist</p>
        </div>
      )}
    </>
  );
};

export default WishlistDisplay;
