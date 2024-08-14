"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { RemoveBeneficiary } from "@/lib/UserActions";
import { useRouter } from "next/navigation";

const BeneficiaryCard = ({ userId, beneficiaryId, firstName, lastName, percentage }) => {
  const [isButtonActive, setIsButtonActive] = useState(true);
  const router = useRouter();

  const Remove = async () => {
    setIsButtonActive(false);
    const response = await RemoveBeneficiary(userId, beneficiaryId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
    setIsButtonActive(true);
  };

  return (
    <div className="flex justify-between w-[300px] text-gray-400">
      <div>
        {firstName} {lastName}
      </div>
      <div>{percentage}%</div>
      <button disabled={!isButtonActive} onClick={Remove} className="text-xs bg-red-600 px-2 rounded text-white hover:bg-red-700">
        Remove
      </button>
    </div>
  );
};

export default BeneficiaryCard;
