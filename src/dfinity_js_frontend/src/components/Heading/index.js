import React from "react";

const sizes = {
  "3xl": "text-[40px] font-bold md:text-[38px] sm:text-4xl",
  "2xl": "text-2xl font-bold md:text-[22px]",
  xl: "text-xl font-bold",
  "4xl": "text-5xl font-bold md:text-[44px] sm:text-[38px]",
  s: "text-sm font-bold",
  md: "text-base font-bold",
  xs: "text-xs font-bold",
  lg: "text-lg font-bold",
};

const Heading = ({ children, className = "", size = "s", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-gray-900 font-inter ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
