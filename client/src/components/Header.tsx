import Logo from "../assets/Logo.png";
import { CiSearch } from "react-icons/ci";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { menuSlide } from "../animation/Menu.anim";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import {
  useGetCategoriesQuery,
  useLazyGetCartQuery,
  useLazyGetWishlistQuery,
  useLazyLogoutQuery,
} from "../store/slices/apiSlice";
import {
  getCategories,
  UpdateCategoryState,
} from "../store/slices/categorySlice.ts";
import CategoryList from "./CategoryList.tsx";
import { UserControlls } from "./Header/Header.comp.tsx";
import { RootState } from "../store/Store.ts";
import { UpdatewishlitItems } from "../store/slices/wishlistSlice.ts";
import { UpdateCartItems } from "../store/slices/cartItemSlice.ts";
import { GoArrowLeft } from "react-icons/go";
import { LuUser } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import CategoriesListdisplay from "./Header/CategoriesListdisplay.tsx";
import toast from "react-hot-toast";
import { UpdateAuthState } from "../store/slices/authSlice.ts";
import Loader from "./Loaders/Loader.tsx";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  let Categories = useSelector(getCategories);

  const Authuser = useSelector((state: RootState) => state.auth.user);
  const [search, setSearch] = useState("");

  const handleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const { data: CategoriesData, isSuccess: isCategoriesSuccess } =
    useGetCategoriesQuery({});

  const [
    triggerWishlist,
    { isSuccess: getWishlistIsSuccess, data: WishlistData },
  ] = useLazyGetWishlistQuery();

  const [triggerBag, { isSuccess: getBagIsSuccess, data: BagData }] =
    useLazyGetCartQuery();

  useEffect(() => {
    if (Authuser) {
      triggerWishlist({});
      triggerBag({});
    }
  }, [Authuser]);

  useEffect(() => {
    if (isCategoriesSuccess && CategoriesData) {
      dispatch(UpdateCategoryState(CategoriesData?.data));
    }
  }, [isCategoriesSuccess,CategoriesData]);

  useEffect(() => {
    if (getWishlistIsSuccess && WishlistData) {
      dispatch(UpdatewishlitItems(WishlistData?.data?.products));
    }
  }, [getWishlistIsSuccess,WishlistData]);

  useEffect(() => {
    if (getBagIsSuccess && BagData) {
      dispatch(UpdateCartItems(BagData?.data?.cart?.products));
    }
  }, [getBagIsSuccess,BagData]);

  const { pathname } = useLocation();
  const Navigate = useNavigate();
  const ArrayOfPath = pathname.split("/").filter((el) => el.trim() !== "");
  const lastValue = ArrayOfPath.slice(-1).join("").split("%20").join("_");
  const title =
    lastValue.slice(0, 1).toString().toUpperCase() + lastValue.slice(1);
  const { totalProductsCount, currentBuyProduct } = useSelector(
    (state: RootState) => state.currentPageProducts
  );

  const [triggerLogout, { isSuccess, isLoading }] = useLazyLogoutQuery();

  const handleLogout = async () => {
    try {
      await triggerLogout({}).unwrap();
      localStorage.removeItem("authUser");
    } catch (error) {
      console.log("Failed to logout", error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Navigate(`/search/${search}?query=${search}`);
  };
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logout Successfull");
      localStorage.removeItem("authUser");
      dispatch(UpdateAuthState(null));
      Navigate("/");
      handleCloseMenu();
    }
  }, [isSuccess]);

  const renderTitleItems = (ArrayOfPath: string[]) => {
    switch (true) {
      //home render logo
      case ArrayOfPath.length === 0:
        return (
          <Link to={"/"} className="h-full">
            <img
              className="w-16 h-10 object-contain rounded-sm"
              src={Logo}
              alt=""
            />
          </Link>
        );
      case ArrayOfPath.length === 1 ||
        ArrayOfPath[ArrayOfPath.length - 1] === "register" ||
        ArrayOfPath[ArrayOfPath.length - 1] === "login":
        return <p className="font-semibold text-lg">{title}</p>;
      case ArrayOfPath.length === 2:
        return (
          <div className="leading-none">
            <p className="font-semibold text-md overflow-hidden text-ellipsis whitespace-nowrap">
              {title}
            </p>
            {totalProductsCount ? (
              <p className="text-sm">{totalProductsCount} items</p>
            ) : (
              ""
            )}
          </div>
        );
      default:
        return (
          <p className="font-semibold w-24 overflow-hidden whitespace-nowrap text-ellipsis">
            {currentBuyProduct?.brand}
          </p>
        ); // Always return something, even for the default case
    }
  };

  return (
    <>
      <div className="Navbar sticky z-10 top-[0px] w-full h-[70px] md:h-[75px] bg-white flex justify-between items-center px-5 md:px-8">
        <div className="Logo w-fit h-10 z-[999] md:h-12 transition-all  flex items-center gap-2 lg:gap-0">
          {/*Menu Icon for small screens*/}
          <div className="flex md:hidden">
            {ArrayOfPath && !ArrayOfPath.length ? (
              <div
                className={`relative w-[1.6rem] md:w-8 h-11 cursor-pointer flex lg:w-0  transition-all
              after:transition-all after:duration-200 after:ease-[cubic-bezier(0.22, 1, 0.36, 1)] after:content-[''] after:w-full after:h-[2px] after:rounded-full after:bg-black after:absolute after:left-1/2 after:-translate-x-1/2 
              ${isMenuOpen ? "after:top-1/2 after:rotate-45" : "after:top-1/3"}
              before:transition-all before:duration-200 before:ease-[cubic-bezier(0.22, 1, 0.36, 1)] before:content-[''] before:w-full before:h-[1.5px] before:rounded-full before:bg-black before:absolute before:left-1/2 before:-translate-x-1/2
              ${
                isMenuOpen
                  ? "before:top-1/2 before:-rotate-45"
                  : "before:top-2/3"
              }
            `}
                onClick={handleMenu}
              ></div>
            ) : (
              <div
                onClick={() => {
                  const navigateTo = ArrayOfPath.slice(
                    0,
                    ArrayOfPath.length - 1
                  ).join("/");
                  Navigate(`/${navigateTo}`);
                }}
              >
                <GoArrowLeft className="w-[1.6rem] h-full text-2xl cursor-pointer" />
              </div>
            )}
          </div>

          {/* Logo for small screens */}
          <div className="flex md:hidden items-center">
            {/* logo */}
            {renderTitleItems(ArrayOfPath)}
          </div>

          {/*Menu Icon for medium and large screens */}
          <div
            className={`hidden relative w-[1.6rem] md:w-8 h-11 cursor-pointer md:flex lg:w-0  transition-all
              after:transition-all after:duration-200 after:ease-[cubic-bezier(0.22, 1, 0.36, 1)] after:content-[''] after:w-full after:h-[2px] after:rounded-full after:bg-black after:absolute after:left-1/2 after:-translate-x-1/2 
              ${isMenuOpen ? "after:top-1/2 after:rotate-45" : "after:top-1/3"}
              before:transition-all before:duration-200 before:ease-[cubic-bezier(0.22, 1, 0.36, 1)] before:content-[''] before:w-full before:h-[1.5px] before:rounded-full before:bg-black before:absolute before:left-1/2 before:-translate-x-1/2
              ${
                isMenuOpen
                  ? "before:top-1/2 before:-rotate-45"
                  : "before:top-2/3"
              }
            `}
            onClick={handleMenu}
          ></div>

          {/* Logo for medium and large screens */}
          <Link to={"/"} className="h-full hidden md:flex">
            <img
              className="md:w-fit h-[90%] md:h-full object-contain rounded-sm"
              src={Logo}
              alt=""
            />
          </Link>
        </div>

        {/* categories */}
        <ul className="Categories hidden lg:flex lg:gap-2 lg:items-center text-xl h-[80px] ">
          <CategoryList categories={Categories} />
        </ul>
        {/* controls */}
        <div className="Search_UserControlls h-full  flex items-center gap-6 ">
          {/* search */}
          <div className="flex items-center">
            <form
              className="p-0 md:p-2 w-0 flex items-center md:gap-2 overflow-hidden md:w-[18rem] transition-all bg-gray-100 rounded-full"
              onSubmit={handleSearch}
            >
              <span className="text-xl">
                <CiSearch />
              </span>
              <input
                type="text"
                placeholder="Search for brands & products"
                className=" flex-1 text-[14.5px] bg-transparent text-md outline-none"
                name=""
                id=""
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <Link to={"/search"}>
              <div className="text-2xl cursor-pointer flex md:w-0 transition-all">
                <CiSearch />
              </div>
            </Link>
          </div>

          {/* user controlls */}
          <UserControlls />
        </div>
      </div>

      <hr className="w-[96%] m-auto" />
      {/* mobile menu */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <div
            className="fixed inset-0 parentContainer z-40  bg-[rgba(0,0,0,0.5)]"
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              (e.target as HTMLDivElement)?.classList.contains(
                "parentContainer"
              ) && handleCloseMenu()
            }
          >
            <motion.div
              variants={menuSlide}
              initial="initial"
              animate="enter"
              exit="exit"
              className="absolute left-0 top-0 w-[250px] md:w-[350px] h-full overflow-y-auto bg-white  text-black p-4"
            >
              <RxCross2
                className="absolute text-2xl right-0 m-2 mx-3 cursor-pointer"
                onClick={handleCloseMenu}
              />

              {/* user Profile */}
              <div className=" border-b-2 pb-4">
                {Authuser ? (
                  <img
                    className="w-12 rounded-full"
                    src={Authuser?.user?.profileimage}
                    alt=""
                  />
                ) : (
                  <div>
                    <LuUser className="text-5xl bg-gray-200 rounded-full p-2" />
                    <button
                      onClick={() => {
                        handleCloseMenu();
                        Navigate("/login");
                      }}
                      className="block w-fit ml-auto text-md border-2 p-1 px-2 rounded-md border-black"
                    >
                      Login
                    </button>
                  </div>
                )}
                {Authuser ? (
                  <>
                    <Link to={"/profile"}>
                      <ul
                        onClick={handleCloseMenu}
                        className="flex mt-2 items-center leading-tight font-semibold justify-between text-lg"
                      >
                        <p>{Authuser?.user?.username}</p>
                        <MdOutlineArrowForwardIos className="text-lg" />
                      </ul>
                    </Link>

                    {Authuser.user.role === "Admin" && (
                      <Link to={"/admin/Dashboard"} className="w-full">
                        <button className=" w-full h-10 mt-4 border-[1.5px] border-black rounded-sm">
                          Admin pannel
                        </button>
                      </Link>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
              {/* Categories */}
              <div className="mt-4 px-2 w-full flex flex-col border-b-2 pb-2 gap-4 text-lg font-semibold">
                <CategoriesListdisplay setIsMenuOpen={setIsMenuOpen} />
              </div>

              <div className={`${Authuser ? "flex" : "hidden"} flex-col`}>
                {[
                  {
                    name: "Orders",
                  },
                  {
                    name: "Wishlist",
                    path: "/wishlist",
                  },
                  {
                    name: "Address",
                  },
                  {
                    name: "Profile Details",
                    path: "/profile",
                  },
                ].map((el, i) => (
                  <Link
                    to={el.path || ""}
                    key={i}
                    className="p-1 mt-2  text-md gap-4 flex items-center"
                  >
                    <div onClick={handleCloseMenu}>
                      <p className="">{el?.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
              {Authuser && (
                <button
                  className="block ml-auto text-md bg-red-100 h-10 px-2 rounded-md"
                  onClick={handleLogout}
                >
                  {isLoading ? <Loader color="black" /> : "Logout"}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
