"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AddBeneficiary } from "@/lib/UserActions";

const AddBeneficiaryForm = ({ userId }) => {
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [beneficiarySplit, setBeneficiarySplit] = useState("");
  const router = useRouter();

  const Add = async () => {
    if (!beneficiaryId || beneficiaryId === "" || !beneficiarySplit || beneficiarySplit === "") {
      toast.warn("Please fill all fields");
      return;
    }
    setIsButtonActive(false);
    const response = await AddBeneficiary(userId, beneficiaryId, beneficiarySplit);
    if (response.error) {
      toast.error(reponse.message);
    } else {
      toast.success(response.message);
      setBeneficiaryId("");
      setBeneficiarySplit("");
      router.refresh();
    }
    setIsButtonActive(true);
  };

  return (
    <div className="w-full max-w-[250px] flex flex-col gap-2">
      <input value={beneficiaryId} onChange={(e) => setBeneficiaryId(e.target.value)} type="text" className="input" placeholder="Beneficiary ID" />
      <input value={beneficiarySplit} onChange={(e) => setBeneficiarySplit(e.target.value)} type="number" className="input" placeholder="Beneficiary Percentage" />
      <button onClick={Add} className="submitButton">
        Update Beneficiary
      </button>
    </div>
  );
};

export default AddBeneficiaryForm;
