import React, { useEffect, useState } from "react";
import { useForgotpassMutation } from "../../store/slices/apiSlice";
import toast from "react-hot-toast";
import Loader from "../../components/Loaders/Loader";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [forgotpass, { isLoading, isError, isSuccess, error, data }] =
    useForgotpassMutation();
  useEffect(() => {
    if (isSuccess && data?.message) {
      toast.success(data.message);
    }

    if (isError) {
      if ("message" in error) {
        toast.error(error.message || "");
      } else if (
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
      ) {
        toast.error((error.data as { message: string }).message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }, [isError, isSuccess, data, error]);

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      await forgotpass({ email });
    }
  };
  return (
    <div className="w-full h-[80vh] grid place-content-center">
      <div className="w-[30%] min-w-[350px] bg-white">
        <p className="font-semibold text-lg">Forgot password</p>
        {!isSuccess ? (
          <>
            <p className="info text-sm">
              We'll email you a password reset link.
            </p>
            <form
              onSubmit={handlesubmit}
              className=" w-full flex flex-col gap-5 mt-2"
            >
              <div className="inpt_tag">
                <input
                  className="w-full rounded-md border-[1.5px] border-black outline-none py-3 px-2"
                  type="text"
                  name="email"
                  autoComplete="email"
                  placeholder="Email *"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="forgotpassword_btn w-full h-10 grid place-content-center bg-black text-white rounded-md"
              >
                {isLoading ? <Loader /> : "send password reset link"}
              </button>
            </form>
          </>
        ) : (
          <p className="info">
            password reset link has been sent to <br /> <b>{email}</b>
          </p>
        )}
      </div>
    </div>
  );
};

export default Forgotpassword;
