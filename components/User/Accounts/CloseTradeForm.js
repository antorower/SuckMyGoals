"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CloseTrade } from "@/lib/TradeActions";

const CloseTradeForm = ({ tradeId }) => {
  const router = useRouter();
  const [newBalance, setNewBalance] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(true);

  const UpdateBalance = async () => {
    setIsButtonActive(false);
    if (!newBalance) {
      toast.warn("Please enter a valid integer for the balance");
      return;
    }
    if (newBalance < 4300 || newBalance > 600000) {
      toast.warn("Please enter a valid balance");
      return;
    }
    const parsedBalance = parseInt(newBalance, 10);
    const response = await CloseTrade(tradeId, parsedBalance);
    if (response.error) {
      toast.error(response.message);
      setIsButtonActive(true);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="number" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} placeholder="New Balance" className="input" />
      <button disabled={!isButtonActive} onClick={UpdateBalance} className="submitButton">
        Close Trade
      </button>
    </div>
  );
};

export default CloseTradeForm;
