"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { OpenTrade } from "@/lib/AccountActions";

const OpenTradeButton = ({ accountId }) => {
  const Open = async () => {
    const response = await OpenTrade(accountId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <button onClick={Open} className="submitButton">
      Open Trade
    </button>
  );
};

export default OpenTradeButton;
