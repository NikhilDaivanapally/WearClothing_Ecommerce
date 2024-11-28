import { LuHeart } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddProductToWishlistMutation,
  useLazyGetWishlistQuery,
  useRemoveProductFromWishlistMutation,
} from "../../store/slices/apiSlice";
import { useEffect } from "react";
import { RootState } from "../../store/Store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UpdateWishlist } from "../../store/slices/wishlistSlice";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import Popbox from "../Admin/PopBox/Popbox";
import { FaXmark } from "react-icons/fa6";
import {
  UpdateDeleteProductInfo,
  UpdateDeleteProductIsActive,
} from "../../store/slices/adminSlice";
import Loader from "../Loaders/Loader";
import NoProductsFound from "../NoProductsFound/NoProductsFound";

interface product {
  id: string;
  name: string;
  brand: string;
  images: string[];
  price: string;
  sizes: any;
  path: string;
}

interface ProductDisplay {
  gridview: number;
  productsData: product[];
  triggerdeleteProduct?: any;
  deleteProductIsLoading?: boolean;
}

const ProductsDisplay: React.FC<ProductDisplay> = ({
  gridview = 4,
  productsData = [],
  triggerdeleteProduct = () => {},
  deleteProductIsLoading = false,
}) => {
  const { isActive, ProductInfo } = useSelector(
    (state: RootState) => state.admin.DeleteProduct
  );
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const page = searchParams.get("page");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, page]);

  // If user is authenticated get the user wishlistItems from the store
  const Authuser: any = useSelector((state: RootState) => state.auth);
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

  const handleDeleteProduct = (product: product) => {
    dispatch(UpdateDeleteProductIsActive(true));
    dispatch(UpdateDeleteProductInfo(product));
  };
  const setDeleteProductStat = (val: boolean) => {
    dispatch(UpdateDeleteProductIsActive(val));
    dispatch(UpdateDeleteProductInfo(null));
  };

  const sizesOrder = ["XS", "S", "M", "L", "XL", "XXL"];
  return (
    <>
      {productsData?.length ? (
        <div
          className={`w-full mt-2 md:mt-0 cursor-pointer grid ${
            productsData.length
              ? "grid-cols-2"
              : "place-content-center h-[60vh]"
          } ${gridview ? `md:grid-cols-${gridview}` : `md:grid-cols-4`} 
     md:gap-4 md:border-[1px] gap-1 md:p-2`}
        >
          {productsData?.map((product: product) => {
            return (
              <div className="group relative" key={product?.id}>
                <Link to={`${product.path}`}>
                  <div
                    key={product.id}
                    className="border-[1.5px] hover:border-black h-fit p-1 md:p-2 "
                  >
                    <div className="relative w-full aspect-[1/1.4] overflow-hidden ">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-md font-semibold leading-1 md:mt-1 text-ellipsis overflow-hidden whitespace-nowrap">
                      {product.brand}
                    </p>
                    <p className="text-md overflow-hidden whitespace-nowrap text-ellipsis">
                      {product.name}
                    </p>
                    <p className="text-sm font-semibold md:mt-2">
                      ₹ {product.price}
                    </p>
                    <div className="hidden md:flex flex-wrap mt-2 gap-3">
                      {sizesOrder.map((key: string, i) =>
                        Number(product?.sizes[key]) &&
                        Object.keys(product?.sizes).includes(key) ? (
                          <span key={i}>{key}</span>
                        ) : (
                          <span key={i} className="line-through text-gray-400">
                            {key}
                          </span>
                        )
                      )}
                    </div>
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
                  className=" text-lg p-2 md:text-xl lg:text-2xl  transition-all duration-100 ease-[cubic-bezier(0.22, 1, 0.36, 1)] md:opacity-0 md:group-hover:opacity-100 rounded-sm absolute top-2 right-2"
                >
                  <LuHeart
                    className={`${
                      wishlistItemsIds?.includes(product.id)
                        ? "fill-red-400"
                        : ""
                    }`}
                  />
                </button>

                {Authuser && Authuser?.role == "Admin" && (
                  <div className="w-full grid grid-cols-2 py-1 gap-2">
                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="border-[1.5px] hover:border-black p-1 flex justify-center items-center gap-1"
                    >
                      <CiEdit className="text-xl cursor-pointer" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="border-[1.5px] hover:border-black p-1 flex justify-center items-center gap-1"
                    >
                      <MdDelete className="text-lg" /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {isActive && (
            <Popbox
              isPopupOpen={isActive}
              setIsPopupOpen={setDeleteProductStat}
            >
              <div className="w-[35%] min-w-[300px] p-4 lg:p-6 bg-white rounded-md leading-tight  flex flex-col gap-2 lg:gap-4">
                <div className="flex justify-between">
                  <p className=" text-lg lg:text-2xl font-semibold">
                    Delete Product
                  </p>
                  <FaXmark
                    className="cursor-pointer"
                    onClick={() => {
                      setDeleteProductStat(false);
                    }}
                  />
                </div>
                <span className="text-md">
                  The Product will be permanantly from the database and can't be
                  recovered
                </span>
                <div className="flex flex-wrap items-center gap-4">
                  <img
                    src={ProductInfo?.images[0]}
                    alt=""
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div>
                    {ProductInfo?.name && <p>product : {ProductInfo?.name}</p>}
                    {ProductInfo?.brand && <p>brand : {ProductInfo?.brand}</p>}
                    {ProductInfo?.price && (
                      <p>price : ₹ {ProductInfo?.price}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 lg:mt-8">
                  <button className="h-10 px-3 bg-gray-300 rounded-md">
                    Cancel
                  </button>
                  <button
                    className={`h-10 px-3 bg-orange-400 rounded-md `}
                    onClick={() =>
                      triggerdeleteProduct({ id: ProductInfo?.id })
                    }
                  >
                    {" "}
                    {deleteProductIsLoading ? <Loader /> : "Delete"}
                  </button>
                </div>
              </div>
            </Popbox>
          )}
        </div>
      ) : (
        <NoProductsFound />
      )}
    </>
  );
};

export default ProductsDisplay;
