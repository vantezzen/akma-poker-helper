import React from "react";

const Button = ({ color = "brand-2", children, className, ...props } : { color?: string, children: React.ReactNode, className?: string, [key: string]: any }) => {
  return (
    <button className={className + ` bg-${color ?? 'brand-2'} p-5 rounded text-brand-1`} {...props}>
      {children}
    </button>
  );
};
export default Button;