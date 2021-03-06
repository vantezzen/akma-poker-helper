import React from "react";

const SectionHeading = ({ children, className } : { children: React.ReactNode, className?: string }) => {
  return (
    <h1 className={"text-lg font-bold " + className}>
      {children}
    </h1>
  );
};
export default SectionHeading;