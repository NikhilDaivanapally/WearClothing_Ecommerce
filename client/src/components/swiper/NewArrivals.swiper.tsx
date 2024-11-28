import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { RootState } from "../../store/Store";
import { LuHeart } from "react-icons/lu";
import {
  useAddProductToWishlistMutation,
  useLazyGetWishlistQuery,
  useRemoveProductFromWishlistMutation,
} from "../../store/slices/apiSlice";
import { useEffect } from "react";
import { UpdateWishlist } from "../../store/slices/wishlistSlice";
interface product {
  id: string;
  brand: string;
  name: string;
  price: string;
  sizes: any;
  images: string[];
  path: string;
}

interface newarrivals {
  slidesperview: number;
  data: product[];
}

const NewArrivals = ({ slidesperview, data = [] }: newarrivals) => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  // If user is authenticated get the user wishlistItems from the store
  const Authuser: any = useSelector((state: RootState) => state.auth.user);
  const { id: wishlistId, products: wishlistItems }: any = Authuser
    ? useSelector((state: RootState) => state.wishlist.wishlist)
    : "";

  const wishlistItemsIds = wishlistItems?.map((prod: product) => prod?.id);

  // Add product to wishlist
  const [
    addProductToWishlist,
    {
      isSuccess: AddProductToWishlistIsSuccess,
      data: AddProductToWishlistData,
    },
  ] = useAddProductToWishlistMutation();

  // Remove product from wishlist
  const [
    removeProductFromWishlist,
    {
      isSuccess: RemoveProductFromWishlistIsSuccess,
      data: RemoveProductFromWishlistData,
    },
  ] = useRemoveProductFromWishlistMutation();

  // trigger the getWishlistItems when the user is authenticated
  useEffect(() => {
    if (Authuser) {
      triggerWishlist({});
    }
  }, [Authuser]);

  // get the wishlistItems of authenticated user
  const [
    triggerWishlist,
    { isSuccess: getWishlistIsSuccess, data: WishlistData },
  ] = useLazyGetWishlistQuery();

  // update wishlistItems to the store
  useEffect(() => {
    if (getWishlistIsSuccess && WishlistData) {
      dispatch(UpdateWishlist(WishlistData?.data));
    }
  }, [getWishlistIsSuccess, WishlistData]);

  const handleAddToWishlist = async (id: string) => {
    await addProductToWishlist({ id, wishlistId });
    if (AddProductToWishlistIsSuccess) {
      triggerWishlist({});
    }
  };
  const handleRemoveFromWishlist = async (id: string) => {
    await removeProductFromWishlist({ id, wishlistId });
    triggerWishlist({});
  };

  //  trigger getWishlist to reflect the change when ever the AddProductToWishlistIsSuccess , RemoveProductFromWishlistIsSuccess
  useEffect(() => {
    if (AddProductToWishlistIsSuccess && AddProductToWishlistData) {
      triggerWishlist({});
    }
  }, [AddProductToWishlistIsSuccess, AddProductToWishlistData]);

  useEffect(() => {
    if (RemoveProductFromWishlistIsSuccess && RemoveProductFromWishlistData) {
      triggerWishlist({});
    }
  }, [RemoveProductFromWishlistIsSuccess, RemoveProductFromWishlistData]);

  return (
    <div className="p-2 md:px-10 flex flex-col gap-4 md:gap-6">
      <p className="font-semibold md:text-2xl w-fit">New Arrivals</p>
      <Swiper
        slidesPerView={slidesperview}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Navigation]}
        className="swiper_container px-6 md:px-10 relative w-full h-fit"
      >
        {data?.map((product, i) => (
          <SwiperSlide key={i} className="slide p-1 lg:p-4">
            <div className="group relative">
              <Link to={`${product?.path}`}>
                <div className="border-[1.5px] p-2 hover:border-black lg:p-3 cursor-pointer">
                  <img
                    src={product?.images[0]}
                    alt=""
                    className="w-full aspect-[1/1.4] object-cover"
                  />
                  <p className="text-md font-semibold leading-1 overflow-hidden whitespace-nowrap text-ellipsis">
                    {product?.brand}
                  </p>
                  <p className="text-md overflow-hidden whitespace-nowrap text-ellipsis">
                    {product?.name}
                  </p>
                  <p className="text-sm font-semibold  overflow-hidden whitespace-nowrap text-ellipsis">
                    ₹ {product?.price}
                  </p>
                </div>
              </Link>

              <button
                onClick={
                  Authuser
                    ? wishlistItemsIds?.includes(product?.id)
                      ? () => handleRemoveFromWishlist(product?.id)
                      : () => handleAddToWishlist(product?.id)
                    : () => Navigate("/login")
                }
                className=" text-lg p-2 md:text-xl lg:text-2xl  transition-all duration-100 ease-[cubic-bezier(0.22, 1, 0.36, 1)] md:opacity-0 md:group-hover:opacity-100 rounded-sm absolute top-1 right-1 lg:top-4 lg:right-4"
              >
                <LuHeart
                  className={`${
                    wishlistItemsIds?.includes(product.id) ? "fill-red-400" : ""
                  }`}
                />
              </button>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-prev hidden sm:flex absolute top-1/2 -translate-y-1/2 bg-black text-white text-xl border-[1.5px] border-white shadow-slate-100 font-semibold p-5 rounded-full">
          <IoIosArrowBack className="" />
        </div>
        <div className="swiper-button-next hidden sm:flex absolute top-1/2 -translate-y-1/2 bg-black text-white text-xl border-[1.5px] border-white shadow-lg font-semibold p-5 rounded-full">
          <IoIosArrowForward />
        </div>
      </Swiper>
    </div>
  );
};

export default NewArrivals;
