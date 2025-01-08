"use client";
import React, { useState } from "react";
import { AccountInitialization } from "@/lib/AccountActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CreateNewAccountForm = ({ userIdAccountOwner, companyName, isAdmin, investor }) => {
  const router = useRouter();
  const [capital, setCapital] = useState("");

  const CreateAccount = async () => {
    if (!capital || capital === "") {
      toast.warn("Please set capital");
      return;
    }

    if (companyName === "Funded Next Stellar") {
      if (parseFloat(capital) !== 6000) {
        toast.warn("Capital is wrong");
        return;
      }
    }
    if (companyName === "The5ers") {
      if (parseFloat(capital) !== 5000) {
        toast.warn("Capital is wrong");
        return;
      }
    }
    if (companyName === "Funding Pips") {
      if (parseFloat(capital) !== 5000 && parseFloat(capital) !== 25000) {
        toast.warn("Capital is wrong");
        return;
      }
    }
    if (companyName === "Maven") {
      if (parseFloat(capital) !== 5000) {
        toast.warn("Capital is wrong");
        return;
      }
    }
    if (companyName === "Funded Next") {
      toast.warn("Company is wrong, choose Funded Next Stellar instead");
      return;
    }

    const response = await AccountInitialization(userIdAccountOwner, companyName, capital, !isAdmin, investor);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success("Account created successfully");
      router.push(`/user?user=${userIdAccountOwner}`);
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
