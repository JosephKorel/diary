import React from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";

function Alert({ msg }: { msg: string }): JSX.Element {
  return (
    <div
      className={msg ? "absolute bottom-[15%] w-full text-center" : "hidden"}
    >
      <div className="xl:w-1/4 py-4 px-10 bg-greeny-400 text-gray-100 shadow-xl rounded-md m-auto flex justify-center items-center gap-2">
        <IoMdCheckmarkCircle size={25} />
        <p className="font-semibold text-lg">{msg}</p>
      </div>
    </div>
  );
}

export default Alert;
