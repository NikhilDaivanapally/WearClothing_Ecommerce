import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useSignupMutation } from "../../store/slices/apiSlice";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loaders/Loader";

const Singin = () => {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });
  const [viewPassword, setViewPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [
    Signup,
    {
      isSuccess: signupisSucess,
      isLoading: signupisLoading,
      // error: singuperror,
      data: signupdata,
    },
  ] = useSignupMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name == "phonenumber") {
      value = value.replace(/\D/g, "");
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleLocalSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      await Signup({
        username: formData.username,
        email: formData.email,
        phonenumber: formData.password,
        password: formData.confirmPassword,
      });
    } else {
      toast("password & confirmPassword must be same", {
        icon: "⚠️",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoogleLogin = () => {
    try {
      // Open Google OAuth in a new window
      window.open("https://wearclothing.vercel.app/api/v1/auth/google", "_self");
    } catch (error) {
      console.error("Error opening Google OAuth window:", error);
    }
  };

  useEffect(() => {
    if (signupisSucess && signupdata) {
      toast.success("User Registered Successfully Please try to login");
      Navigate("/account/login");
    }
  }, [signupisSucess, signupdata]);

  return (
    <div
      className="p-3 w-full flex justify-center
    "
    >
      {/* <h2>Login</h2> */}
      <div className="w-[300px] md:w-[350px] flex flex-col gap-5">
        {/* Local login */}
        <p className="text-2xl m-auto font-semibold">Signup</p>
        <form
          onSubmit={handleLocalSignup}
          className="flex flex-col gap-4 leading-none"
        >
          {/* userName */}
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
              className="border-[1.5px] h-10  border-black rounded-sm p-2"
            />
          </div>
          {/* email */}
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              placeholder="Enter UserName"
              className="border-[1.5px] h-10  border-black rounded-sm p-2"
            />
          </div>

          {/* phonenumber */}
          <div className="flex flex-col gap-2">
            <label>phone Number</label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              autoComplete="phonenumber"
              required
              placeholder="Enter Phone number"
              className="border-[1.5px] h-10  border-black rounded-sm p-2"
            />
          </div>
          {/* password */}
          <div className="flex flex-col gap-2">
            <label>Password</label>
            <div className="w-full h-10 flex items-center border-[1.5px] p-2 border-black rounded-sm">
              <input
                type={viewPassword.password ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                placeholder="Enter Password"
                className="flex-1 outline-none"
              />
              <div
                onClick={() =>
                  setViewPassword((prev) => ({
                    ...prev,
                    password: !viewPassword.password,
                  }))
                }
              >
                {viewPassword.password ? (
                  <IoMdEyeOff className="cursor-pointer text-lg md:text-xl" />
                ) : (
                  <IoMdEye className="cursor-pointer text-lg md:text-xl" />
                )}
              </div>
            </div>
          </div>

          {/* ConfirmPassword */}

          <div className="flex flex-col gap-2">
            <label>Confirm Password</label>
            <div className="w-full h-10 flex items-center border-[1.5px] p-2 border-black rounded-sm">
              <input
                type={viewPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="current-password"
                required
                placeholder="Enter Password"
                className="flex-1 outline-none"
              />
              <div
                onClick={() =>
                  setViewPassword((prev) => ({
                    ...prev,
                    confirmPassword: !viewPassword.confirmPassword,
                  }))
                }
              >
                {viewPassword.confirmPassword ? (
                  <IoMdEyeOff className="cursor-pointer text-lg md:text-xl" />
                ) : (
                  <IoMdEye className="cursor-pointer text-lg md:text-xl" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-10 mt-2 flex items-center justify-center border-[1.5px] border-black rounded-sm bg-black text-white"
          >
            {signupisLoading ? <Loader /> : "Signup"}
          </button>
        </form>
        {/* Google login */}
        <div className="w-full h-[1.5px] relative rounded-full bg-gray-200 flex items-center justify-center leading-none">
          <span className="bg-white">or sign up with</span>
        </div>

        <button
          className="flex items-center h-10 justify-center gap-2 border-[1.5px] border-black w-full rounded-sm"
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
          <p>Sign up with Google</p>
        </button>
        <Link to={"/account/login"} className="m-auto underline text-blue-800">
          Already have an Account (Login)
        </Link>
      </div>
    </div>
  );
};

export default Singin;
