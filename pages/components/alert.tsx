import React from "react";
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";

function Alert({
  msg,
  errorMsg,
}: {
  msg: string;
  errorMsg: string;
}): JSX.Element {
  return (
    <div
      className={
        msg || errorMsg ? "absolute bottom-[15%] w-full text-center" : "hidden"
      }
    >
      <div
        className={`xl:w-1/4 fade py-4 px-10 ${errorMsg && "bg-amaranth-600"} ${
          msg && "bg-greeny-400"
        } text-gray-100 shadow-xl rounded-md m-auto flex justify-center items-center gap-2`}
      >
        {msg && (
          <>
            <IoMdCheckmarkCircle size={25} />
            <p className="font-semibold text-lg">{msg}</p>
          </>
        )}
        {errorMsg && (
          <>
            <IoMdCloseCircle size={25} />
            <p className="font-semibold text-lg">{errorMsg}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Alert;
