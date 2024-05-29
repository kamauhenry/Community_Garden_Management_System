import React from "react";

const sizes = {
  xs: "text-[11px] font-normal",
  lg: "text-base font-normal",
  s: "text-xs font-normal",
  "2xl": "text-xl font-normal",
  xl: "text-lg font-normal",
  md: "text-sm font-normal",
};

const Text = ({ children, className = "", as, size = "lg", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-gray-500 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
