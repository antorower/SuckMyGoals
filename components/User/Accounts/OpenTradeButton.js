"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { OpenTrade } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";

const OpenTradeButton = ({ accountId }) => {
  const router = useRouter();
  const [isButtonActive, setIsButtonActive] = useState(true);

  const Open = async () => {
    setIsButtonActive(false);
    const response = await OpenTrade(accountId);
    if (response.error) {
      toast.error(response.message);
      setIsButtonActive(true);
    } else {
      toast.success(response.message);
      router.push(`/account?account=${accountId}`);
    }
  };

  return (
    <button disabled={!isButtonActive} onClick={Open} className="submitButton">
      Open Trade
    </button>
  );
};

export default OpenTradeButton;
