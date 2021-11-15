import React from "react";

const Button = ({ children, className, ...props } : { children: React.ReactNode, className?: string, [key: string]: any }) => {
  return (
    <button className={"bg-brand-2 p-5 rounded text-brand-1 " + className} {...props}>
      {children}
    </button>
  );
};
export default Button;