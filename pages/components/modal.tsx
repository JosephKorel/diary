import React from "react";

function MyModal({
  children,
  setShow,
}: {
  children: JSX.Element;
  setShow: (data: boolean) => void;
}) {
  return (
    <div
      className="absolute top-0 w-full h-screen flex flex-col justify-center backdrop-blur-md z-10"
      onClick={() => setShow(false)}
    >
      {children}
    </div>
  );
}

export default MyModal;
