function Button({ children, type = "button", onClick, fullWidth = true }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${fullWidth ? "w-full" : "px-8"} 
        bg-black text-white py-3 
        text-xs tracking-[0.2em] 
        hover:bg-gray-900 
        transition-colors
      `}
    >
      {children}
    </button>
  );
}

export default Button;
