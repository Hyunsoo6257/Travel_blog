function Input({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent border-b border-gray-200 pb-2 focus:outline-none focus:border-gray-400 text-sm font-light"
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
    />
  );
}

export default Input;
