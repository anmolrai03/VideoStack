import { useState } from "react";

import InputField from "../InputField/InputField";
import ActionButton from "../ActionButton/ActionButton";

import { Eye, EyeOff, LogIn } from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("login in");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* USERNAME */}
      <InputField
        htmlFor="email"
        labelName="EMAIL"
        fieldName="email"
        inputType="email"
        placeholder="Enter your email"
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
          placeholder="Enter your password"
          required
        />

        {/* TOGGLE PASSWORD VISIBILITY */}
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
        buttonName="Login"
        type="submit"
        icon={<LogIn />}
        iconPosition="right"
      />

    </form>
  );
}

export default Login;