import React from "react";

const Section = ({ children, className } : { children: React.ReactNode, className?: string }) => {
  return (
    <section className={"bg-brand-1 p-3 flex flex-col justify-center w-full " + className}>
      {children}
    </section>
  );
};
export default Section;