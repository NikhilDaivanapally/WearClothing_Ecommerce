import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  useLazySuccessQuery,
  useLoginMutation,
} from "../../store/slices/apiSlice";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Loader from "../../components/Loaders/Loader";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { UpdateAuthState } from "../../store/slices/authSlice";
import { UpdateCart } from "../../store/slices/cartItemSlice";
import { UpdateWishlist } from "../../store/slices/wishlistSlice";

const Signin = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [
    login,
    {
      isSuccess: loginisSuccess,
      isLoading: loginisLoading,
      isError: loginisError,
      error: loginerror,
      data: logindata,
    },
  ] = useLoginMutation();

  const [
    triggerLoginUser,
    { data: LoginUserData, isSuccess: LoginUserIsSuccess },
  ] = useLazySuccessQuery();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (loginisSuccess && logindata?.data) {
      Navigate("/login?success=true");
    } else if (loginisError && loginerror) {
      Navigate("/login?success=false");
    }
  }, [loginisSuccess, logindata?.data]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");

    if (success === "true") {
      triggerLoginUser({});
    } else if (success === "false") {
      toast.error("Login Failed");
      Navigate("/login");
    }
  }, [Navigate, loginisSuccess, logindata?.data]);

  useEffect(() => {
    if (LoginUserIsSuccess && LoginUserData) {
      dispatch(UpdateAuthState(LoginUserData?.data?.user));
      dispatch(UpdateCart(LoginUserData?.data?.cart));
      dispatch(UpdateWishlist(LoginUserData?.data?.wishlist));
      toast.success("Login success");
      Navigate("/");
    }
  }, [LoginUserIsSuccess, LoginUserData]);

  const handleLocalSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(formData);
  };

  const handleGoogleLogin = () => {
    try {
      // Open Google OAuth in a new window
      window.open(
        "https://wearclothing.vercel.app/api/v1/auth/google",
        "_self"
      );
    } catch (error) {
      console.error("Error opening Google OAuth window:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="p-10 w-full h-[80vh] flex justify-center
    "
    >
      {/* <h2>Login</h2> */}
      <div className="w-[300px] sm:w-[300px] flex flex-col gap-6">
        {/* Local login */}
        <p className="text-2xl m-auto font-semibold">Login</p>
        <form
          onSubmit={handleLocalSignup}
          className="flex flex-col gap-4 leading-none"
        >
          <div className="flex flex-col gap-2">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
              placeholder="Enter UserName"
              className="border-[1.5px] h-10 outline-none  border-black rounded-sm p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Password</label>
            <div className="w-full h-10 flex items-center border-[1.5px] p-2 border-black rounded-sm">
              <input
                type={viewPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                placeholder="Enter Password"
                className="flex-1 outline-none"
              />
              <div onClick={() => setViewPassword(!viewPassword)}>
                {viewPassword ? (
                  <IoMdEyeOff className="cursor-pointer text-lg md:text-xl" />
                ) : (
                  <IoMdEye className="cursor-pointer text-lg md:text-xl" />
                )}
              </div>
            </div>
            <Link
              to="/forgotpassword"
              className="self-end text-sm text-blue-800 underline"
            >
              <span>Forgot password ?</span>
            </Link>
          </div>

          <button
            type="submit"
            className="w-full h-10 flex items-center justify-center border-[1.5px] border-black rounded-sm bg-black text-white"
          >
            {loginisLoading ? <Loader /> : "Login"}
          </button>
        </form>
        {/* Google login */}
        <div className="w-full h-[1.5px] relative rounded-full bg-gray-200 flex items-center justify-center leading-none">
          <span className="bg-white">or sign in with</span>
        </div>

        <button
          className="flex items-center h-10 justify-center border-[1.5px] border-black w-full rounded-sm"
          onClick={handleGoogleLogin}
        >
          <svg width="30" height="30" role="img">
            <g id="Google-Button" stroke="none" fill="none">
              <rect x="0" y="0" width="30" height="30" rx="1"></rect>
              <g id="logo_googleg_48dp" transform="translate(5,5) scale(1.2)">
                <path
                  d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
                  id="Shape"
                  fill="#4285F4"
                ></path>
                <path
                  d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
                  id="Shape"
                  fill="#34A853"
                ></path>
                <path
                  d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
                  id="Shape"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
                  id="Shape"
                  fill="#EA4335"
                ></path>
              </g>
            </g>
          </svg>
          <p>Google</p>
        </button>

        <Link to={"/register"} className="m-auto underline text-blue-800">
          Don't hvae an Account (Sign up)
        </Link>
      </div>
    </div>
  );
};

export default Signin;
