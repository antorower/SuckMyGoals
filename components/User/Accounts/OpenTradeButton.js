"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { OpenTrade } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const OpenTradeButton = ({ accountId }) => {
  const router = useRouter();
  const [isButtonActive, setIsButtonActive] = useState(true);
  const { isSignedIn, user, isLoaded } = useUser();

  const Open = async () => {
    setIsButtonActive(false);
    const response = await OpenTrade(accountId, user.id);
    if (response.error) {
      toast.error(response.message);
      setIsButtonActive(true);
    } else {
      toast.success(response.message);
      router.push(`/account?account=${accountId}`);
    }
  };

  return (
    <button disabled={!isButtonActive && isLoaded} onClick={Open} className="submitButton">
      Open Trade
    </button>
  );
};

export default OpenTradeButton;
