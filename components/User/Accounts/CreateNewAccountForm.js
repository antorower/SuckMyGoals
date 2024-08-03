"use client";
import React, { useState } from "react";
import { CreateNewAccount } from "@/lib/AccountActions";
import { AddAccountToUser } from "@/lib/UserActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateNewAccountForm = ({ userId, companyId }) => {
  const router = useRouter();
  const [capital, setCapital] = useState("");
  const [cost, setCost] = useState("");

  const CreateAccount = async () => {
    const responseCreatingAccount = await CreateNewAccount(userId, companyId, capital, cost);

    if (responseCreatingAccount.error) {
      toast.error(responseCreatingAccount.message);
    } else {
      const responseAddingUserAccount = await AddAccountToUser(userId, responseCreatingAccount.newAccountId);
      if (responseAddingUserAccount.error) {
        toast.error(responseAddingUserAccount.message);
      } else {
        toast.success("Account created successfully");
        router.push(`/user?user=${userId}`);
      }
    }
  };

  return (
    <div className="form form-small">
      <input value={capital} onChange={(e) => setCapital(Number(e.target.value))} type="number" placeholder="Capital" className="input" />
      <input value={cost} onChange={(e) => setCost(Number(e.target.value))} type="number" placeholder="Cost" className="input" />
      <button onClick={CreateAccount} className="submitButton">
        Create
      </button>
    </div>
  );
};

export default CreateNewAccountForm;
