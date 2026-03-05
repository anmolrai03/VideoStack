import { useState } from "react";

import InputField from "../InputField/InputField";
import ActionButton from "../ActionButton/ActionButton";

import { Eye, EyeOff, UserPlus } from "lucide-react";

function Signup() {

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("signing up");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >

      {/* FULL NAME */}
      <InputField
        htmlFor="fullname"
        labelName="FULL NAME"
        fieldName="fullname"
        inputType="text"
        placeholder="Enter your full name"
        required
      />

      {/* EMAIL */}
      <InputField
        htmlFor="email"
        labelName="EMAIL"
        fieldName="email"
        inputType="email"
        placeholder="Enter your email"
        required
      />

      {/* USERNAME */}
      <InputField
        htmlFor="username"
        labelName="USERNAME"
        fieldName="username"
        inputType="text"
        placeholder="Choose a username"
        required
      />

      {/* PASSWORD */}
      <div className="relative">

        <InputField
          htmlFor="password"
          labelName="PASSWORD"
          fieldName="password"
          inputType="password"
          showPassword={showPassword}
          placeholder="Create a password"
          required
        />

        {/* SHOW/HIDE PASSWORD */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[36px] text-white/40 hover:text-white transition"
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
      />

    </form>
  );
}

export default Signup;