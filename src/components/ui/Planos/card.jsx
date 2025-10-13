// @ts-nocheck
import React from "react";

const Card = React.forwardRef(function Card(props, ref) {
  const { className = "", children, ...restProps } = props;

  return (
    <div
      ref={ref}
      className={
        "rounded-lg border bg-card text-card-foreground shadow-sm " + className
      }
      {...restProps}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export { Card };
