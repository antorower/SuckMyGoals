"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const CopyText = ({ text, message }) => {
  const [copyState, setCopyState] = useState(false);

  const Copy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyState(true);
        setTimeout(() => {
          setCopyState(false);
        }, 3000);
        toast.success(message);
      })
      .catch((error) => {
        toast.warn("Something went wrong. Please try again");
        setErrorCopy(true);
      });
  };

  return (
    <button className="flex items-center" disabled={copyState} onClick={Copy}>
      {!copyState && (
        <div className="flex justify-center items-center">
          <Image alt="copy-image" src="/copy.svg" width={14} height={14} />
        </div>
      )}
      {copyState && (
        <div className="flex justify-center items-center">
          <Image alt="wallet-tick" src="/tick.svg" width={15} height={15} />
        </div>
      )}
    </button>
  );
};

export default CopyText;
