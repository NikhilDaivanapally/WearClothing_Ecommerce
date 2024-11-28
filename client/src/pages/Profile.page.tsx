import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { CiBoxes } from "react-icons/ci";
import { SlLocationPin } from "react-icons/sl";
import { LiaUserEditSolid } from "react-icons/lia";
import {
  MdOutlineArrowForwardIos,
  MdOutlineCollectionsBookmark,
} from "react-icons/md";
import { LuUser } from "react-icons/lu";
import { useLazyLogoutQuery } from "../store/slices/apiSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { UpdateAuthState } from "../store/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loaders/Loader";

const Profile = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const Authuser:any = useSelector((state: RootState) => state.auth.user);
  const [triggerLogout, { isSuccess, isLoading, data }] = useLazyLogoutQuery();

  const handleLogout = async () => {
    try {
      await triggerLogout({}).unwrap();
      localStorage.removeItem("authUser");
    } catch (error) {
      console.log("Failed to logout", error);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success("Logout Successfull");
      localStorage.removeItem("authUser");
      dispatch(UpdateAuthState(null));
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (!Authuser) {
      Navigate("/");
    }
  }, [Authuser]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 min-h-[90.3vh]">
      {/* user details */}
      {Authuser ? (
        <div className="flex mt-2 flex-col items-center justify-center">
          <img
            className="w-20 rounded-full"
            src={Authuser?.profileimage}
            alt=""
          />
          <p className="">{Authuser?.username}</p>
          <p className="">{Authuser?.email}</p>

          {Authuser?.role === "Admin" && (
            <Link to={"/admin/Dashboard"} className="w-fit">
              <button className=" w-fit h-10 mt-4 border-b-[1.5px] border-black rounded-sm">
                Admin pannel
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="">
          <LuUser className="text-7xl mx-auto bg-gray-200 rounded-full p-2" />
        </div>
      )}
      <div className="mt-10">
        {[
          {
            name: "Orders",
            desc: "Check your Orders",
            icon: <CiBoxes />,
            path: "",
          },
          {
            name: "Wishlist",
            desc: "All Your wishlist collections",
            icon: <MdOutlineCollectionsBookmark />,
            path: "/wishlist",
          },
          {
            name: "Address",
            desc: "save address for a hassle-free checkout",
            icon: <SlLocationPin />,
            path: "",
          },
          {
            name: "Profile Details",
            desc: "Change your profile details",
            icon: <LiaUserEditSolid />,
            path: "",
          },
        ].map((el, i) => (
          <Link key={i} to={el.path}>
            <div className="p-2 mt-2 border-y-[1px] text-lg gap-4 flex items-center">
              {el?.icon}
              <div className="leading-tight">
                <p className="font-semibold">{el?.name}</p>
                <span className="text-sm">{el?.desc}</span>
              </div>
              <MdOutlineArrowForwardIos className="text-sm ml-auto" />
            </div>
          </Link>
        ))}
      </div>
      <button
        className="w-full grid place-content-center h-10 mt-10 bg-red-100"
        onClick={handleLogout}
      >
        {isLoading ? <Loader color="black" /> : "Logout"}
      </button>
    </div>
  );
};

export default Profile;
