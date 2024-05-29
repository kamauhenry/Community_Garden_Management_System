import React from "react";
import PropTypes from "prop-types";

const shapes = {
  circle: "rounded-[50%]",
  round: "rounded",
};
const variants = {
  fill: {
    cyan_500: "bg-cyan-500 text-white-A700",
    light_blue_50: "bg-light_blue-50 text-cyan-500",
    white_A700: "bg-white-A700 text-deep_purple-A200",
    deep_purple_A200: "bg-deep_purple-A200 text-white-A700",
    cyan_50: "bg-cyan-50 text-teal-700",
    gray_100_01: "bg-gray-100_01 text-deep_purple-A200",
    gray_100: "bg-gray-100 text-blue_gray-900",
  },
  outline: {
    cyan_500: "border-cyan-500 border border-solid text-cyan-500",
    gray_500: "border-gray-500 border border-solid text-gray-500",
  },
};
const sizes = {
  "5xl": "h-[64px] px-3",
  "4xl": "h-[52px] px-[35px] text-lg",
  "3xl": "h-[44px] px-3.5",
  lg: "h-[36px] px-[9px]",
  "2xl": "h-[44px] px-3.5 text-base",
  md: "h-[32px] px-2 text-xs",
  xs: "h-[24px] px-1.5 text-[11px]",
  xl: "h-[36px] px-[23px] text-sm",
  sm: "h-[28px] px-[7px] text-xs",
};

const Button = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "sm",
  color = "cyan_500",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex items-center justify-center text-center cursor-pointer ${(shape && shapes[shape]) || ""} ${(size && sizes[size]) || ""} ${(variant && variants[variant]?.[color]) || ""}`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  shape: PropTypes.oneOf(["circle", "round"]),
  size: PropTypes.oneOf(["5xl", "4xl", "3xl", "lg", "2xl", "md", "xs", "xl", "sm"]),
  variant: PropTypes.oneOf(["fill", "outline"]),
  color: PropTypes.oneOf([
    "cyan_500",
    "light_blue_50",
    "white_A700",
    "deep_purple_A200",
    "cyan_50",
    "gray_100_01",
    "gray_100",
    "gray_500",
  ]),
};

export { Button };
