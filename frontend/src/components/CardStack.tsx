import React from "react";

const CardStack = ({ items, children, className } : { items: number, children: React.ReactNode, className?: string }) => {
  return (
    <div className={`grid grid-cols-${items} gap-3 ${className}`}>
      {children}
    </div>
  );
};
export default CardStack;