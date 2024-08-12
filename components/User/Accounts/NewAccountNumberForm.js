"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UpgradeAccount } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";

const NewAccountNumberForm = ({ oldAccountId }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const router = useRouter();

  const UpdateAccountNumber = async () => {
    if (!accountNumber || accountNumber === "") {
      toast.warn("Please set the new account number");
      return;
    }
    const response = await UpgradeAccount(oldAccountId, accountNumber);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.push(`account?account=${accountNumber}`);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-[300px] m-auto">
      <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} type="text" placeholder="New account number" className="input" />
      <button onClick={UpdateAccountNumber} className="submitButton">
        Upgrade
      </button>
    </div>
  );
};

export default NewAccountNumberForm;
