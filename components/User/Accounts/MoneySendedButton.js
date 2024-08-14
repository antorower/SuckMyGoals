"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { MoneySended } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";

const MoneySendedButton = ({ accountId }) => {
  const [isButtonActive, setIsButtonActive] = useState(true);
  const router = useRouter();

  const SendMoney = async () => {
    setIsButtonActive(false);
    const response = await MoneySended(accountId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
    setIsButtonActive(true);
  };

  return (
    <button className="bg-blue-600 w-full max-w-[350px] m-auto p-4 rounded hover:bg-blue-700" onClick={SendMoney} disable={!isButtonActive}>
      I keep my profits and send the rest
    </button>
  );
};

export default MoneySendedButton;
