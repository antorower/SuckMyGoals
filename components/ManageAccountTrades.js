"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { DisableTrades } from "@/lib/AccountActions";
import { EnableTrades } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";

const ManageAccountTrades = ({ accountId, disabled}) => {
    const router = useRouter();

  const disableTrades = async () => {
    const response = await DisableTrades(accountId);
    if(response.error) {
        toast.error(response.message);
    } else {
        toast.success(response.message);
        router.refresh();
    }
  }

  const enableTrades = async () => {
    const response = await EnableTrades(accountId);
    if(response.error) {
        toast.error(response.message);
    } else {
        toast.success(response.message);
        router.refresh();
    }
  }

  return (
<div className={`flex flex-col w-full ${disabled ? "text-red-500" : "text-green-500"}`}>
                  <button onClick={disableTrades}> Disable </button>
                  <button onClick={enableTrades}> Enable </button>
                </div>
  );
};

export default ManageAccountTrades;



