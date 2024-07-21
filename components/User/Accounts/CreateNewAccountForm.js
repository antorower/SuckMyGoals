"use client";
import React, { useState } from "react";
import { CreateNewAccount } from "@/lib/AccountActions";
import { AddUserAccount } from "@/lib/UserActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateNewAccountForm = ({ userId, companyId }) => {
  const [capital, setCapital] = useState("");
  const [cost, setCost] = useState("");
  const router = useRouter();

  const CreateAccount = async () => {
    const responseCreatingAccount = await CreateNewAccount(userId, companyId, capital, cost);

    if (responseCreatingAccount.error) {
      toast.error(responseCreatingAccount.message);
    } else {
      const responseAddingUserAccount = await AddUserAccount(userId, responseCreatingAccount.accountId);
      if (responseAddingUserAccount.error) {
        toast.error(responseAddingUserAccount.message);
      } else {
        toast.success(responseAddingUserAccount.message);
        router.push(`/user?user=${userId}`);
      }
    }
  };

  return (
    <div className="form form-small">
      <input value={capital} onChange={(e) => setCapital(e.target.value)} type="number" placeholder="Capital" className="input" />
      <input value={cost} onChange={(e) => setCost(e.target.value)} type="number" placeholder="Cost" className="input" />
      <button onClick={CreateAccount} className="submitButton">
        Create
      </button>
    </div>
  );
};

export default CreateNewAccountForm;
