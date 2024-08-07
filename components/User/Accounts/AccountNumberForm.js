"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RegisterAccountNumber } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";

const AccountNumberForm = ({ accountId }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const router = useRouter();

  const UpdateAccountNumber = async () => {
    if (!accountNumber || accountNumber === "") {
      toast.warn("Please set the new account number");
      return;
    }
    const response = await RegisterAccountNumber(accountId, accountNumber);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-[400px] m-auto">
      <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} type="text" placeholder="Account number" className="input" />
      <button onClick={UpdateAccountNumber} className="submitButton">
        Save
      </button>
    </div>
  );
};

export default AccountNumberForm;
