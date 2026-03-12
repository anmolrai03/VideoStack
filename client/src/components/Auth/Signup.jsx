import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField/InputField";
import ActionButton from "../ActionButton/ActionButton";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useRegister } from "../../hooks/auth/auth.hooks.js";

function Signup() {
  const {
    execute: signup,
    loading: apiLoading,
  } = useRegister();
  
  const [showPassword, setShowPassword] = useState(false);
  const [apiFieldErrors, setApiFieldErrors] = useState({}); 

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setError: setFormError,
    reset
  } = useForm();

  const onSubmit = async (data) => {
    const result = await signup(data);
    if (result.success) {
      toast.success(result.message, {duration: 1500});
      reset();
    } else {
      toast.error(result.message, {duration: 1500});

      // Set API field errors in state
      setApiFieldErrors(
        result.errors?.reduce((acc, err) => {
          acc[err.field] = err.message;
          return acc;
        }, {}) || {},
      );

      //Set form errors for react-hook-form
      if (result.errors) {
        result.errors.forEach((err) => {
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
      {/* FULL NAME */}
      <InputField
        htmlFor="fullname"
        labelName="FULL NAME"
        inputType="text"
        placeholder="Enter your full name"
        {...register("fullname", { required: "Full name is required." })}
        error={getErrorForField("fullname")}
      />

      {/* EMAIL */}
      <InputField
        htmlFor="email"
        labelName="EMAIL"
        inputType="email"
        placeholder="Enter your email"
        {...register("email", { required: "Email is required" })}
        error={getErrorForField("email")}
      />

      {/* USERNAME */}
      <InputField
        htmlFor="username"
        labelName="USERNAME"
        inputType="text"
        placeholder="Choose a username"
        {...register("username", { required: "Username is required" })}
        error={getErrorForField("username")}
      />

      {/* PASSWORD */}
      <div className="relative">
        <InputField
          htmlFor="password"
          labelName="PASSWORD"
          inputType="password"
          showPassword={showPassword}
          placeholder="Create a password"
          {...register("password", { required: "This field cannot be empty." })}
          error={getErrorForField("password")}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-9 text-white/40 hover:text-white transition"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* SUBMIT BUTTON */}
      <ActionButton
        buttonName="Create Account"
        icon={<UserPlus size={18} />}
        iconPosition="right"
        type="submit"
        loading={apiLoading}
      />
    </form>
  );
}

export default Signup;
