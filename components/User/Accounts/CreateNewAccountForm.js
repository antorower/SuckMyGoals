"use client";
import React, { useState } from "react";
import { AccountInitialization } from "@/lib/AccountActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateNewAccountForm = ({ userId, companyName }) => {
  const router = useRouter();
  const [capital, setCapital] = useState("");

  const CreateAccount = async () => {
    if (!capital || capital === "") {
      toast.warn("Please set capital");
      return;
    }

    const response = await AccountInitialization(userId, companyName, capital);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success("Account created successfully");
      router.push(`/user?user=${userId}`);
    }
  };

  return (
    <div className="form form-small">
      <input autoFocus value={capital} onChange={(e) => setCapital(e.target.value)} type="number" placeholder="Capital" className="input" />
      <button onClick={CreateAccount} className="submitButton">
        Create
      </button>
    </div>
  );
};

export default CreateNewAccountForm;
