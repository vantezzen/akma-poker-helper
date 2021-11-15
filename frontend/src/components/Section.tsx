import React from "react";

const Section = ({ children, className } : { children: React.ReactNode, className?: string }) => {
  return (
    <section className={"bg-brand-1 p-3 " + className}>
      <div className="container">{children}</div>
    </section>
  );
};
export default Section;