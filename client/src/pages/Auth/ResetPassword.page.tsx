import React, { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loaders/Loader";
import { useResetpassMutation } from "../../store/slices/apiSlice";

const ResetPassword = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const token = searchParams.get("token");
  console.log(token);
  const [resetFormData, setResetFormData] = useState({
    NewPassword: "",
    confirmNewPassword: "",
  });
  const [showpassword, setShowpassword] = useState({
    NewPassword: false,
    confirmNewPassword: false,
  });
  const [
    resetpass,
    {
      isLoading: resetpassisLoading,
      isError: resetpassisError,
      isSuccess: resetpassisSuccess,
      error: resetpasserror,
      data: resetpassdata,
    },
  ] = useResetpassMutation();

  const handleInputChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetFormData({ ...resetFormData, [name]: value });
  };

  useEffect(() => {
    resetpassisSuccess && toast.success(resetpassdata.message);

    if (resetpassisError) {
      if ("message" in resetpasserror) {
        toast.error(resetpasserror.message || "");
      } else if (
        "data" in resetpasserror &&
        typeof resetpasserror.data === "object" &&
        resetpasserror.data !== null &&
        "message" in resetpasserror.data
      ) {
        toast.error((resetpasserror.data as { message: string }).message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }, [resetpassisSuccess, resetpassisError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Object.values(resetFormData).some((val) => val == "")) {
      await resetpass({ body: resetFormData, params: { token } });
    } else {
      toast.error("All Fields are Required");
    }
  };
  return (
    <div className="resetPassword h-[100vh] grid place-content-center">
      {/* Toaster */}
      <div className="resetPassword_Container w-[30%] min-w-[350px] ">
        {!resetpassisSuccess ? (
          <>
            <p className="resetPassword_title text-xl font-semibold">
              Reset password
            </p>
            <p className="info mb-2">Set your New Password below</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex w-full h-10 px-2 py-3 rounded-md items-center border-[1.5px] border-black">
                <input
                  className="w-full flex-1 outline-none"
                  type={showpassword.NewPassword ? "text" : "password"}
                  name="NewPassword"
                  placeholder="New Password"
                  onChange={handleInputChnage}
                />
                <div
                  className="showpassword_toggle"
                  onClick={() =>
                    setShowpassword({
                      ...showpassword,
                      NewPassword: !showpassword.NewPassword,
                    })
                  }
                >
                  {showpassword.NewPassword ? (
                    <IoMdEyeOff className="showicon cursor-pointer text-lg md:text-xl" />
                  ) : (
                    <IoMdEye className="showicon cursor-pointer text-lg md:text-xl " />
                  )}
                </div>
              </div>
              <div className="flex w-full h-10 px-2 py-3 rounded-md items-center border-[1.5px] border-black">
                <input
                  className="w-full flex-1 outline-none"
                  type={showpassword.confirmNewPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  placeholder="Confirm New Password"
                  onChange={handleInputChnage}
                />
                <div
                  className="showpassword_toggle"
                  onClick={() =>
                    setShowpassword({
                      ...showpassword,
                      confirmNewPassword: !showpassword.confirmNewPassword,
                    })
                  }
                >
                  {showpassword.confirmNewPassword ? (
                    <IoMdEyeOff className="showicon cursor-pointer text-lg md:text-xl" />
                  ) : (
                    <IoMdEye className="showicon cursor-pointer text-lg md:text-xl " />
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="forgotpassword_btn w-full h-10 bg-black text-white rounded-md"
              >
                {resetpassisLoading ? <Loader /> : "Reset password"}
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center flex-col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="80px"
              height="80px"
            >
              <linearGradient
                id="IMoH7gpu5un5Dx2vID39Ra"
                x1="9.858"
                x2="38.142"
                y1="9.858"
                y2="38.142"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#9dffce" />
                <stop offset="1" stop-color="#50d18d" />
              </linearGradient>
              <path
                fill="url(#IMoH7gpu5un5Dx2vID39Ra)"
                d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
              />
              <linearGradient
                id="IMoH7gpu5un5Dx2vID39Rb"
                x1="13"
                x2="36"
                y1="24.793"
                y2="24.793"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset=".824" stop-color="#135d36" />
                <stop offset=".931" stop-color="#125933" />
                <stop offset="1" stop-color="#11522f" />
              </linearGradient>
              <path
                fill="url(#IMoH7gpu5un5Dx2vID39Rb)"
                d="M21.293,32.707l-8-8c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414	c0.391-0.391,1.024-0.391,1.414,0L22,27.758l10.879-10.879c0.391-0.391,1.024-0.391,1.414,0l1.414,1.414	c0.391,0.391,0.391,1.024,0,1.414l-13,13C22.317,33.098,21.683,33.098,21.293,32.707z"
              />
            </svg>
            <p className="info text-lg ">
              Password Reset Successfull <br />{" "}
            </p>
            <Link to={"/account/login"} className="underline text-blue-800">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
