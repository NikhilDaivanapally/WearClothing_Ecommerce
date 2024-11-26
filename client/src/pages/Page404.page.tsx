import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";
const Page404 = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
      <Link to={"/"}>
        <img className="top-5 left-5 absolute w-20" src={Logo} alt="" />
      </Link>
      <p className="text-8xl">404</p>

      <p>Page Not found</p>
      <Link to={"/"}>
        <button className="bg-black text-white p-1 px-2 rounded-sm">
          Go Home
        </button>
      </Link>
    </div>
  );
};

export default Page404;
