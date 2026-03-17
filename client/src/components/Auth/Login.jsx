import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import InputField from "../InputField/InputField";
import ActionButton from "../ActionButton/ActionButton";

import { Eye, EyeOff, LogIn } from "lucide-react";
import { useLogin } from "../../hooks/auth/auth.hooks"; // Assuming you have a useLogin hook
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext/AuthContext";

function Login() {
  const { execute: login, loading: apiLoading } = useLogin();
  const {refetchUser} = useAuthContext();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [apiFieldErrors, setApiFieldErrors] = useState({}); // Store API field errors

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setError: setFormError,
    reset
  } = useForm();

  const onSubmit = async (data) => {

    const result = await login(data);

    // console.log("login.jsx",result);

    if (result.success) {
      toast.success(result?.message, {duration: 800});
      reset();
      await refetchUser();
      navigate("/feed")
    } else {
      toast.error(result?.message, {duration: 1000});
      // Set API field errors in state
      setApiFieldErrors(
        result?.errors?.reduce((acc, err) => {
          acc[err.field] = err.message;
          return acc;
        }, {}) || {}
      );
      // Optionally: Set form errors for react-hook-form
      if (result.errors) {
        result?.errors?.forEach((err) => {
          setFormError(err.field, { type: "server", message: err.message });
        });
      }
    }
  };

  // Merge form errors and API errors for each field
  const getErrorForField = (fieldName) => {
    return formErrors[fieldName]?.message || apiFieldErrors[fieldName] || "";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* EMAIL */}
      <InputField
        htmlFor="email"
        labelName="EMAIL"
        inputType="email"
        placeholder="Enter your email"
        {...register("email", {required: "email is required."})}
        error={getErrorForField("email")}
      />

      {/* PASSWORD */}
      <div className="relative">
        <InputField
          htmlFor="password"
          labelName="PASSWORD"
          inputType="password"
          showPassword={showPassword}
          placeholder="Enter your password"
          {...register("password", { required: "Password is required" })}
          error={getErrorForField("password")}
        />

        {/* TOGGLE PASSWORD VISIBILITY */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-9 text-white/40 hover:text-white transition cursor-pointer"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* SUBMIT BUTTON */}
      <ActionButton
        buttonName="Login"
        type="submit"
        icon={<LogIn />}
        iconPosition="right"
        loading={apiLoading}
      />
    </form>
  );
}

export default Login;
