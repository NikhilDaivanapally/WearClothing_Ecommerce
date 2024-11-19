import { Link, useParams } from "react-router-dom";
import BreadCrums from "../components/BreadCrums/BreadCrums";
import {
  useAddProductToBagMutation,
  useAddProductToWishlistMutation,
  useGetProductByIdQuery,
  useLazyGetCartQuery,
  useLazyGetWishlistQuery,
  useRemoveProductFromWishlistMutation,
} from "../store/slices/apiSlice";
import React, { useEffect, useRef, useState } from "react";
import { LuHeart } from "react-icons/lu";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { FaArrowRightLong } from "react-icons/fa6";
import { UpdatewishlitItems } from "../store/slices/wishlistSlice";
import { UpdateCartItems } from "../store/slices/cartItemSlice";
import toast from "react-hot-toast";
import { UpdateCurrentBuyProduct } from "../store/slices/productsSlice";
import Loader from "../components/Loaders/Loader";
import "../index.css";
import "../App.css";
import PageLoader from "../components/Loaders/PageLoader";

const BuyProduct = () => {
  const dispatch = useDispatch();
  const sizeContainerRef = useRef<HTMLUListElement | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [displayImage, setDisplayImage] = useState<string | undefined>("");
  const Authuser = useSelector((state: RootState) => state.auth.user);

  // to get the product based on id
  const { id } = useParams();
  const { isSuccess: productIsSucess, data: productData } =
    useGetProductByIdQuery({ id });
  // get wishlist and cart items
  const [
    triggerWishlist,
    {
      isLoading: getWishlistIsLoading,
      isSuccess: getWishlistIsSuccess,
      data: WishlistData,
    },
  ] = useLazyGetWishlistQuery();
  const [
    triggerBag,
    { isLoading: getBagIsLoading, isSuccess: getBagIsSuccess, data: BagData },
  ] = useLazyGetCartQuery();

  useEffect(() => {
    if (getWishlistIsSuccess && WishlistData?.data) {
      dispatch(UpdatewishlitItems(WishlistData?.data.products));
    }
  }, [getWishlistIsSuccess, WishlistData]);

  useEffect(() => {
    if (getBagIsSuccess && BagData) {
      dispatch(UpdateCartItems(BagData?.data?.products));
      const product = BagData?.data?.products.filter((el: any) => el.id == id);
      setSize(product[0]?.cartitem?.size);
    }
  }, [getBagIsSuccess, BagData]);

  const [
    addProductToWishlist,
    {
      isLoading: AddProductToWishlistIsLoading,
      isSuccess: AddProductToWishlistIsSuccess,
      data: AddProductToWishlistData,
    },
  ] = useAddProductToWishlistMutation();

  const [
    removeProductFromWishlist,
    {
      isSuccess: RemoveProductFromWishlistIsSuccess,
      data: RemoveProductFromWishlistData,
    },
  ] = useRemoveProductFromWishlistMutation();

  const [
    addProductToBag,
    {
      isLoading: AddProductToBagIsLoading,
      isSuccess: AddProductToBagIsSuccess,
      data: AddProductToBagData,
    },
  ] = useAddProductToBagMutation();

  useEffect(() => {
    if (Authuser) {
      triggerWishlist({});
    }
  }, [
    Authuser,
    AddProductToWishlistIsSuccess,
    RemoveProductFromWishlistIsSuccess,
    AddProductToWishlistData,
    RemoveProductFromWishlistData,
  ]);

  useEffect(() => {
    if (Authuser) {
      triggerBag({});
    }
  }, [AddProductToBagIsSuccess, AddProductToBagData]);

  const wishlistItems = WishlistData?.data?.products.map(
    (prod: any) => prod.id
  );
  const wishlistId = Authuser
    ? useSelector((state: RootState) => state.auth.user.wishlistId)
    : "";
  const cartId = Authuser
    ? useSelector((state: RootState) => state.auth.user.cartId)
    : "";
  const cartItems = BagData?.data?.products.map((prod: any) => prod.id);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (productIsSucess && productData?.data) {
      dispatch(UpdateCurrentBuyProduct(productData?.data));
      setDisplayImage(productData?.data?.images[0]);
    }
  }, [productIsSucess]);

  const sizesOriginal = productData?.data?.sizes
    ? Object.keys(productData?.data?.sizes)
    : [];
  const handleViewImage = (img: any) => {
    setDisplayImage(img);
  };
  const sizesOrder = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleAddToWishlist = async (id: string) => {
    await addProductToWishlist({ id, wishlistId });
    toast.success("Product Added To wishlist");
  };

  const handleAddToBag = async (id: string) => {
    if (size) {
      await addProductToBag({ id, size, cartId });
      triggerBag({});
      toast.success("Product Added To bag");
    } else {
      if (sizeContainerRef.current) {
        // Add the wiggle class to start the animation
        sizeContainerRef.current.classList.add("wiggle");

        // Optionally remove the animation class after it finishes
        setTimeout(() => {
          sizeContainerRef.current?.classList.remove("wiggle");
        }, 500); // 500ms matches the animation duration
      }
    }
  };

  const handleRemoveFromWishlist = async (id: string) => {
    await removeProductFromWishlist({ id, wishlistId });
    toast.success("Product Removed From wishlist");
  };

  const handleSelectSize = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.target as HTMLSpanElement; // Cast target to HTMLSpanElement
    const size = target.innerText; // Now innerText is accessible
    if (size) {
      setSize(size);
    }
  };

  return (
    <>
      {productData?.data ? (
        <div className="p-6 min-h-[90vh]">
          <BreadCrums />

          <div className="w-full h-full p-2 md:p-8  flex flex-col lg:flex-row gap-5">
            <Swiper
              slidesPerView={1}
              centeredSlides={true}
              pagination={{
                clickable: true,
              }}
              navigation={false}
              modules={[Pagination, Navigation]}
              className="w-full md:hidden h-fit  p-2"
            >
              {productData?.data?.images.map((img: string, i: number) => (
                <SwiperSlide key={i} className="w-full  p-2 pb-4">
                  <img
                    src={img}
                    className="w-full max-h-[450px] object-contain"
                    alt=""
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="hidden md:flex lg:sticky lg:top-28 images p-4 min-w-[580px] h-[75vh]   rounded-md">
              <div className="group_images w-[100px]  grid grid-rows-5 gap-2 h-full">
                {productData?.data?.images.map((img: string, i: number) => (
                  <img
                    key={i}
                    onClick={() => handleViewImage(img)}
                    src={img}
                    className="bg-gray-50 cursor-pointer rounded-md w-full h-full object-contain"
                  />
                ))}
              </div>
              <div className="main_image flex-1">
                <img
                  className="w-full h-full object-contain"
                  src={displayImage}
                  alt=""
                />
              </div>
            </div>

            <div className="productDetails flex-1  flex flex-col gap-4">
              <div>
                <p className="text-2xl">{productData?.data?.brand}</p>
                <p className="text-lg text-gray-500">
                  {productData?.data?.name}
                </p>
              </div>
              <p className="text-lg">MRP : {productData?.data?.price}</p>
              <div>
                <p className="font-semibold mb-4">SELECT SIZE</p>
                <ul className="flex gap-4" ref={sizeContainerRef}>
                  {sizesOriginal && (
                    <>
                      {sizesOrder?.map((key) => {
                        if (sizesOriginal?.includes(key)) {
                          const sizeavailabel = Number(
                            productData?.data?.sizes[key]
                          );
                          return sizeavailabel ? (
                            <li
                              className={`w-16 h-16 cursor-pointer font-semibold relative rounded-full flex items-center justify-center border-2 ${
                                key == size ? "border-red-400" : ""
                              }`}
                              key={key}
                            >
                              <span
                                onClick={handleSelectSize}
                                className="rounded-full w-full h-full grid place-content-center"
                              >
                                {key}
                              </span>
                              {Number(productData?.data?.sizes[key]) < 10 && (
                                <p className="absolute mt-1 top-full left-1/2 text-sm font-normal whitespace-nowrap py-1 -translate-x-1/2 px-4 rounded-md bg-gray-100">
                                  {productData?.data?.sizes[key]} left
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
                    </>
                  )}
                </ul>
              </div>
              <div className="w-full grid grid-cols-2 gap-6 mt-8">
                {Authuser ? (
                  <button
                    onClick={
                      wishlistItems?.includes(productData?.data?.id)
                        ? () =>
                            handleRemoveFromWishlist(
                              productData?.data?.product.id
                            )
                        : () => handleAddToWishlist(productData?.data?.id)
                    }
                    className={`
                  ${
                    wishlistItems?.includes(productData?.data?.id)
                      ? "bg-slate-600 text-white"
                      : "bg-transparent text-black"
                  }
                  border-[1.5px] border-black h-12 md:h-14 text-md md:text-lg flex  items-center justify-center gap-2 md:gap-4`}
                  >
                    {AddProductToWishlistIsLoading && !getWishlistIsLoading ? (
                      <>
                        <Loader color="black" />
                      </>
                    ) : (
                      <>
                        <LuHeart
                          className={`text-xl ${
                            wishlistItems?.includes(productData?.data?.id)
                              ? "fill-red-400"
                              : ""
                          }`}
                        />
                        Wishlist
                      </>
                    )}
                  </button>
                ) : (
                  <Link to={"/account/login"} className="w-full">
                    <button
                      className={
                        "bg-transparent text-black w-full border-[1.5px] border-black h-12 md:h-14 text-md md:text-lg flex  items-center justify-center gap-2 md:gap-4"
                      }
                    >
                      <LuHeart className={"text-xl"} /> Wishlist
                    </button>
                  </Link>
                )}

                {Authuser ? (
                  <>
                    {!(AddProductToBagIsLoading && !getBagIsLoading) ? (
                      cartItems?.includes(productData?.data?.id) ? (
                        <Link to="/cart" className="w-full">
                          <button className="border-[1.5px] w-full bg-red-400 border-black h-12 md:h-14 text-md lg:text-lg  flex items-center justify-center gap-2 md:gap-4">
                            Go To Bag <FaArrowRightLong />
                          </button>
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleAddToBag(productData?.data?.id)}
                          className="border-[1.5px] border-black h-12 md:h-14 text-md lg:text-lg  flex items-center justify-center gap-2 md:gap-4"
                        >
                          {" "}
                          <HiOutlineShoppingBag className="text-xl" />
                          Add To Bag
                        </button>
                      )
                    ) : (
                      <button className="border-[1.5px] border-black h-12 md:h-14 text-md lg:text-lg  flex items-center justify-center gap-2 md:gap-4">
                        <Loader color="black" />
                      </button>
                    )}
                  </>
                ) : (
                  <Link to={"/account/login"} className="w-full">
                    <button
                      className={
                        "bg-transparent text-black w-full border-[1.5px] border-black h-12 md:h-14 text-md md:text-lg flex  items-center justify-center gap-2 md:gap-4"
                      }
                    >
                      <HiOutlineShoppingBag className="text-xl" />
                      Add To Bag
                    </button>
                  </Link>
                )}
              </div>
              <div>
                <p className="font-semibold">Material :</p>
                <p>{productData?.data?.material}</p>
              </div>
              <div>
                <p className="font-semibold">Size :</p>
                <p>{productData?.data?.size}</p>
              </div>
              <div>
                <p className="font-semibold">Fit :</p>
                <p>{productData?.data?.fit}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PageLoader />
      )}
    </>
  );
};

export default BuyProduct;
