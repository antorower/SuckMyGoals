"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { OpenTrade } from "@/lib/TradeActions";

const TradeSection = ({ openTradeExist, accountId }) => {
  const [isThereOpenTrade, setIsThereOpenTrade] = useState(openTradeExist);

  const OpenNewTrade = async () => {
    const response = OpenTrade(accountId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  console.log(isThereOpenTrade);
  return (
    <>
      {isThereOpenTrade ? (
        <button className="submitButton">Close Trade</button>
      ) : (
        <button onClick={OpenNewTrade} className="submitButton">
          Open Trade
        </button>
      )}
    </>
  );
};

export default TradeSection;
