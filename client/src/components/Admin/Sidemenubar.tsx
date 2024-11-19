import { LuLayoutDashboard } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { CiCreditCard1 } from "react-icons/ci";
import { ReactElement, useEffect } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import {
  UpdateActiveField,
  UpdateAdminMenuOpen,
} from "../../store/slices/adminSlice";
import { Link, useLocation } from "react-router-dom";
import { CiBoxes } from "react-icons/ci";
import { BiCategory } from "react-icons/bi";
import { RiHome2Line } from "react-icons/ri";
interface MenuItem {
  icon: ReactElement;
  name: String;
}
const Sidemenubar = () => {
  const General: MenuItem[] = [
    {
      icon: <LuLayoutDashboard className="text-[20px]" />,
      name: "Dashboard",
    },
    {
      icon: <HiOutlineShoppingBag className="text-[20px]" />,
      name: "Products",
    },
    {
      icon: <CiBoxes className="text-[20px]" />,
      name: "Orders",
    },
    {
      icon: <CiCreditCard1 className="text-[20px]" />,
      name: "Payments",
    },
  ];
  const Account: MenuItem[] = [
    {
      icon: <CiSettings className="text-[20px]" />,
      name: "Settings",
    },
    {
      icon: <LuUsers className="text-[20px]" />,
      name: "Manage_Users",
    },
    {
      icon: <BiCategory className="text-[20px]" />,
      name: "Manage_Categories",
    },
  ];
  const activeIndex = useSelector(
    (state: RootState) => state.admin.ActiveField
  );
  const dispatch = useDispatch();
  const handleActiveField = (name: String) => {
    dispatch(UpdateActiveField(name));
  };

  const location = useLocation();

  useEffect(() => {
    const name = location.pathname.split("/").reverse()[0].toString();
    handleActiveField(name);
  }, [location]);
  const { isAdminMenuOpen } = useSelector((state: RootState) => state.admin);

  const handleAdminMenu = () => {
    dispatch(UpdateAdminMenuOpen(!isAdminMenuOpen));
  };

  return (
    <div
      className={`w-fit  transition-all z-20 duration-300 ease-[cubic-bezier(0.22, 1, 0.36, 1] fixed ${
        !isAdminMenuOpen ? "-translate-x-full" : ""
      } lg:z-0  lg:-translate-x-0 lg:relative flex flex-col gap-6 p-4  h-screen bg-black text-white`}
    >
      <div className="flex flex-col gap-4 mt-14 lg:mt-0">
        <p className="text-gray-400">General</p>
        <ul className="w-full flex flex-col">
          {General.map(({ icon, name }, i) => {
            return (
              <Link key={i} to={`/admin/${name}`}>
                <li
                  onClick={() => {
                    handleActiveField(name);
                    isAdminMenuOpen && handleAdminMenu();
                  }}
                  className={`flex items-center gap-4  p-3  px-4 rounded-sm cursor-pointer ${
                    name !== activeIndex && "hover:bg-slate-900"
                  } ${name == activeIndex && "bg-slate-800"}`}
                >
                  {icon}
                  {name}
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-gray-400">Account</p>
        <ul className="w-full flex flex-col">
          {Account.map(({ icon, name }, i) => {
            return (
              <Link key={i} to={`/admin/${name}`}>
                <li
                  onClick={() => {
                    handleActiveField(name);
                    isAdminMenuOpen && handleAdminMenu();
                  }}
                  className={`flex items-center  gap-4  p-3  px-4 rounded-sm cursor-pointer ${
                    name !== activeIndex && "hover:bg-slate-900"
                  } ${name == activeIndex && "bg-slate-800"}`}
                >
                  {icon}
                  <p className="break-words">{name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
      <div className="w-full mt-auto flex  justify-between text-sm">
        <Link to={"/"}>
          <button className="flex gap-2 w-fit p-2 px-2  hover:bg-slate-800  rounded-sm">
            <RiHome2Line className="text-lg" />
            Home
          </button>
        </Link>
        <button className=" flex gap-2 w-fit  p-2 px-2   hover:bg-slate-800  rounded-sm">
          {<IoLogOutOutline className="text-lg" />}
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidemenubar;
