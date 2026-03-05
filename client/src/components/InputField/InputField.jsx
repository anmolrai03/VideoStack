function InputField({
  htmlFor,
  labelName,
  inputType = "text",
  fieldName,
  showPassword = false,
  className = "",
  ...rest
}) {
  const type =
    inputType === "password"
      ? showPassword
        ? "text"
        : "password"
      : inputType;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-xs tracking-wide text-white/60"
      >
        {labelName}
      </label>

      <input
        id={htmlFor}
        name={fieldName}
        type={type}
        className={`vs-input ${className}`}
        {...rest}
      />
    </div>
  );
}

export default InputField;