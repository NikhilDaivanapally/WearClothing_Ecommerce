import { useEffect, useRef } from "react";
import {
  useLazyGetCartQuery,
  useRemoveProductFromBagMutation,
  useUpdateCartitemMutation,
} from "../store/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { UpdateCartItems } from "../store/slices/cartItemSlice";
import { RootState } from "../store/Store";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import PageLoader from "../components/Loaders/PageLoader";
import FilterLoader from "../components/Loaders/FilterLoader";

const Cart = () => {
  const dispatch = useDispatch();
  const cartRef = useRef<HTMLDivElement | null>(null);
  const Authuser = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartId = Authuser
    ? useSelector((state: RootState) => state.auth.user.cartId)
    : "";
  const { cartItems } = useSelector((state: RootState) => state.cartItems);
  const [triggerBag, { isSuccess: getBagIsSuccess, data: BagData }] =
    useLazyGetCartQuery();

  const [
    triggerRemoveProduct,
    {
      isSuccess: RemoveProductIsSuceess,
      isLoading: RemoveProductIsLoading,
      data: RemoveProductData,
    },
  ] = useRemoveProductFromBagMutation();
  const handleRemoveFromCart = async (id: string) => {
    await triggerRemoveProduct({ id, cartId });
    if (RemoveProductIsSuceess) {
      triggerBag({});
    }
  };

  const sizesOrder = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    if (cartRef.current) {
      cartRef.current.scrollTo(0, 0);
    }
  }, [cartRef.current]);

  const [
    UpdateCartItem,
    {
      isSuccess: cartItemUpdateIsSuccess,
      isLoading: cartItemUpdateIsLoading,
      data: UpdateCartData,
    },
  ] = useUpdateCartitemMutation();

  const handleUpdateSize = (
    e: React.ChangeEvent<HTMLOptionElement | HTMLSelectElement>,
    cartItemId: string,
    currentSize: string
  ) => {
    if (e.target.value !== currentSize) {
      // update the size
      UpdateCartItem({ cartItemId, size: e.target.value });
    }
  };
  useEffect(() => {
    if (getBagIsSuccess && BagData?.data) {
      dispatch(UpdateCartItems(BagData?.data?.products));
    }
  }, [
    getBagIsSuccess,
    BagData,
    RemoveProductIsSuceess,
    RemoveProductData,
    cartItemUpdateIsSuccess,
    UpdateCartData,
  ]);

  const handleUpdateQty = (
    e: React.ChangeEvent<HTMLOptionElement | HTMLSelectElement>,
    cartItemId: string,
    currentQty: number
  ) => {
    if (Number(e.target.value) !== Number(currentQty)) {
      // update the Qty
      UpdateCartItem({ cartItemId, quantity: Number(e.target.value) });
    }
  };
  useEffect(() => {
    triggerBag({});
  }, [
    RemoveProductIsSuceess,
    RemoveProductData,
    cartItemUpdateIsSuccess,
    UpdateCartData,
  ]);
  return (
    <>
      {Authuser ? (
        cartItems ? (
          cartItems?.length ? (
            <div
              ref={cartRef}
              className="min-h-[90.3vh]  flex flex-col md:flex-row w-full p-4 lg:w-[70%]  gap-6 relative  mx-auto"
            >
              {(cartItemUpdateIsLoading || RemoveProductIsLoading) && (
                <FilterLoader />
              )}

              <div className="w-full md:w-2/3  h-full">
                {cartItems?.map((item: any, i: number) => {
                  return (
                    <div
                      key={i}
                      className="h-[200px] relative my-4 border-2 p-2 flex gap-4"
                    >
                      <div
                        onClick={() => handleRemoveFromCart(item?.cartitem?.id)}
                        className="removeFromwishlist cursor-pointer bg-gray-50 rounded-full p-1 absolute top-3 right-3"
                      >
                        <RxCross2 className="text-xl" />
                      </div>
                      <img className="h-full" src={item?.images[0]} alt="" />
                      <div className="leading-1 overflow-hidden flex flex-col gap-2">
                        <p className="font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                          {item.brand}
                        </p>
                        <p className="overflow-hidden whitespace-nowrap text-ellipsis">
                          {item.name}
                        </p>
                        {/* size */}
                        <div className="flex bg-gray-100 w-fit p-1 rounded-md">
                          <p className="w-10">Size</p>
                          <select
                            name="size"
                            className="bg-gray-200 rounded-md cursor-pointer outline-none text-sm"
                            defaultValue={item.cartitem.size}
                            id=""
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) =>
                              handleUpdateSize(
                                e,
                                item?.cartitem?.id,
                                item?.cartitem?.size
                              )
                            }
                          >
                            {sizesOrder.map((size, i) => {
                              if (Object.keys(item.sizes).includes(size)) {
                                return (
                                  <option key={i} value={size}>
                                    {size}
                                  </option>
                                );
                              }
                            })}
                          </select>
                        </div>
                        {/* qty */}
                        <div className="flex bg-gray-100 w-fit p-1 rounded-md">
                          <p className="w-10">Qty</p>
                          <select
                            name="quantity"
                            className=" bg-gray-200 rounded-md cursor-pointer outline-none text-sm"
                            id=""
                            defaultValue={item?.cartitem?.quantity}
                            onChange={(e) =>
                              handleUpdateQty(
                                e,
                                item.cartitem.id,
                                item?.cartitem?.quantity
                              )
                            }
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, i) => (
                              <option value={val} key={i}>
                                {val}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* price */}
                        <p>₹ {item.cartitem.quantity * item.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="md:sticky md:top-28 flex-1 flex flex-col gap-2  md:h-full">
                <p className="text-lg font-semibold">
                  Product Details ({cartItems.length} items)
                </p>
                <div className="flex justify-between">
                  <span>Total MRP</span>
                  <span>
                    ₹{" "}
                    {cartItems.reduce(
                      (acc: number, item: any) =>
                        acc + Number(item?.cartitem?.quantity * item?.price),
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shippin Fee</span>
                  <p>
                    <span className="line-through">100</span> Free
                  </p>
                </div>

                <div className="flex justify-between">
                  <span>Total Price</span>
                  <span>
                    ₹{" "}
                    {cartItems.reduce(
                      (acc: number, item: any) =>
                        acc + Number(item.cartitem?.quantity * item?.price),
                      0
                    )}
                  </span>
                </div>

                <button className="w-full p-2 bg-black text-white mt-6">
                  Place Order
                </button>
              </div>
            </div>
          ) : (
            <div className=" w-full h-[90.3vh] flex items-center justify-center">
              <div className="w-[300px]   flex items-center justify-center flex-col gap-4">
                <svg
                  className="w-28"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 28.004 32"
                >
                  <path fill="#605EED" d="M2.003 0h24v9h-24V0z" />
                  <path
                    fill="#C7C7ED"
                    d="M28.004 7v23a2 2 0 0 1-2 2h-24a2 2 0 0 1-2-2V7h28z"
                  />
                  <path
                    fill="#C7C7ED"
                    d="M2.003 7.969H4.99l.002-4.949L2.002 0l.001 7.969zm21.026-4.995L22.998 8h3.006V0l-2.975 2.974z"
                  />
                  <path
                    fill="#605EED"
                    d="M5.003 6.999V3L0 7.003l5.003-.004zM23.004 3v3.984l4.98-.003L23.004 3z"
                  />
                  <path
                    fill="#605EED"
                    d="M6.003 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm16.001 0a1 1 0 1 0-.002 1.998A1 1 0 0 0 22.004 12z"
                  />
                  <path
                    fill="#605EED"
                    d="M5.669 13.999c.58 0 .703.684.703.684.002 4.378 3.288 7.929 7.622 7.929 4.33 0 7.642-3.551 7.644-7.929 0 0 .062-.684.66-.684.577 0 .707.684.707.684 0 5.146-3.912 9.316-9 9.316s-9-4.17-9-9.316c-.002.001.067-.684.664-.684z"
                  />
                  <path
                    fill="#FDFBF7"
                    d="M5.669 12.999c.58 0 .703.684.703.684.002 4.378 3.288 7.929 7.622 7.929 4.33 0 7.642-3.551 7.644-7.929 0 0 .062-.684.66-.684.577 0 .707.684.707.684 0 5.146-3.912 9.316-9 9.316s-9-4.17-9-9.316c-.002.001.067-.684.664-.684z"
                  />
                </svg>
                <p className="text-2xl">Your bag is empty</p>
                <span className="text-center">
                  There is nothing is your bag, Let's add some items
                </span>

                {/* <img src={""} className="w-[100px] m-auto" alt="" /> */}
                <Link to={"/wishlist"}>
                  <button className="p-3 w-full border-2 border-[#C7C7ED] rounded-md text-sm">
                    ADD ITEMS FROM WISHLIST
                  </button>
                </Link>
              </div>
            </div>
          )
        ) : (
          <PageLoader />
        )
      ) : (
        <div className="w-full h-[87vh] grid place-content-center">
          <p className="text-lg font-semibold">Please Login to view cart</p>
        </div>
      )}
    </>
  );
};

export default Cart;
