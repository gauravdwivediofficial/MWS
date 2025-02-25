import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function EmailVerify() {
  axios.defaults.withCredentials = true;
  const inputField = React.useRef([]);
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);
  const navigate = useNavigate();

  const inputHandle = (e, index) => {
    if (e.target.value.length > 0 && index < inputField.current.length - 1) {
      inputField.current[index + 1].focus();
    }
  };

  const inputDelete = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputField.current[index - 1].focus();
    }
  };

  const inputPaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputField.current[index]) {
        inputField.current[index].value = char;
      }
    });
  };

  const onSubmitForm = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputField.current.map((e) => e.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <img
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32"
      />
      <form
        onSubmit={onSubmitForm}
        className="bg-orange-600 rounded-lg shadow-lg w-96 pr-8 pl-8 pb-8 pt-8 text-sm"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className=" text-gray-200 text-xl text-center mb-6">
          Enter the 6 digit code sent to your email
        </p>
        <div className="flex justify-between mb-8 " onPaste={inputPaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-orange-200 text-gray-700 text-center text-xl rounded-md"
                ref={(e) => (inputField.current[index] = e)}
                onInput={(e) => inputHandle(e, index)}
                onKeyDown={(e) => inputDelete(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify Email
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;
