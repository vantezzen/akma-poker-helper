import React, { useEffect, useState } from "react";
import { RotateCw, Smartphone } from "react-feather";

const RotationInfo = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerHeight > window.innerWidth && window.innerWidth < 600) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }
    checkOrientation();

    window.addEventListener("resize", checkOrientation);
  }, []);

  if (showWarning) {
    return (
      <div className="fixed w-screen h-screen bg-brand-1-dark bg-opacity-80 flex flex-col items-center justify-center text-brand-2">
        <div className="flex">
          <Smartphone size={60} />
          <RotateCw size={60} />
        </div>
        <h2 className="text-2xl font-black text-center mt-6">
          Please rotate<br />your device.
        </h2>
      </div>
    )
  }

  return (
    <></>
  );
};
export default RotationInfo;