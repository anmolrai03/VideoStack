function InputField({
  htmlFor,
  labelName,
  inputType = "text",
  fieldName,
  showPassword = false,
  className = "",
  error = "",
  ...rest
}) {

  const type =
    inputType === "password"
      ? showPassword
        ? "text"
        : "password"
      : inputType;

  return (
    <div className="flex flex-col gap-2 w-full">

      <label
        htmlFor={htmlFor}
        className={`text-xs tracking-wide transition ${
          error ? "text-red-400" : "text-white/60"
        }`}
      >
        {labelName}
      </label>

      <input
        id={htmlFor}
        name={fieldName}
        type={type}
        aria-invalid={!!error}
        aria-describedby={`${htmlFor}-error`}
        className={`
          vs-input
          transition-all
          ${error ? "border-red-500 focus:border-red-400" : ""}
          ${className}
        `}
        {...rest}
      />

      <div className="min-h-4.5">
        {error && (
          <p
            id={`${htmlFor}-error`}
            className="text-base text-red-400 font-light tracking-wide"
          >
            {error}
          </p>
        )}
      </div>

    </div>
  );
}

export default InputField;