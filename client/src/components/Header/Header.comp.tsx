import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuHeart, LuUser } from "react-icons/lu";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RootState } from "../../store/Store";

const UserControlls: React.FC = () => {
  const Authuser: any = useSelector((state: RootState) => state.auth.user);
  const { products: cartItems } = useSelector(
    (state: RootState) => state.cart.cart
  );

  const userIcon = Authuser?.profileimage ? (
    <img
      className="w-8 h-8 rounded-full"
      src={Authuser.profileimage}
      alt="User Profile"
    />
  ) : (
    <LuUser />
  );

  const userControlls = [
    {
      icon: userIcon,
      path: Authuser ? "/profile" : "/login",
      count: null,
    },
    { icon: <LuHeart />, path: "/wishlist", count: null },
    { icon: <HiOutlineShoppingBag />, path: "/cart", count: cartItems?.length },
  ];

  return (
    <ul className="flex h-full gap-6 text-2xl items-center">
      {userControlls.map(({ icon, path, count }, i) => (
        <li key={i} className="cursor-pointer relative">
          <Link
            to={Authuser ? path : "/login"}
            className="group flex items-center"
          >
            {icon}
            {count ? (
              <span className="absolute text-sm right-0 w-[18px] h-[18px] grid place-content-center -translate-y-2/3 translate-x-2/3 rounded-full leading-none bg-red-400">
                {count < 10 ? count : "9+"}
              </span>
            ) : (
              ""
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export { UserControlls };
