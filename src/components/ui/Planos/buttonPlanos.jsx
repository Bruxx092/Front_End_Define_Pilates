// @ts-nocheck
import React from "react";

const ButtonPlanos = React.forwardRef(function ButtonPlanos(props, ref) {
  const {
    className = "",
    variant = "default",
    size = "default",
    asChild = false,
    disabled = false,
    children,
    ...restProps
  } = props;

  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;

  const buttonClasses =
    baseStyles + " " + variantClass + " " + sizeClass + " " + className;

  if (asChild) {
    return React.cloneElement(children, {
      ref,
      className: buttonClasses,
      disabled,
      ...restProps,
    });
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
});

ButtonPlanos.displayName = "ButtonPlanos";

export { ButtonPlanos };
