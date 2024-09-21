"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { PayoutRequestDone } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";

const PayoutRequestDoneButton = ({ accountId }) => {
  const [isButtonActive, setIsButtonActive] = useState(true);
  const router = useRouter();

  const RequestDone = async () => {
    setIsButtonActive(false);
    const response = await PayoutRequestDone(accountId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
    setIsButtonActive(true);
  };

  return (
    <button onClick={RequestDone} disabled={!isButtonActive} className="bg-red-600 p-4 m-auto rounded font-semibold text-wrap">
      ΜΗΝ ΜΕ ΠΑΤΗΣΕΙΣ ΤΩΡΑ! ΠΑΤΗΣΕ ΜΕ ΤΗΝ ΗΜΕΡΑ ΠΟΥ ΘΑ ΚΑΝΕΙΣ PAYOUT REQUEST ΣΤΗΝ ΕΤΑΙΡΙΑ!
    </button>
  );
};

export default PayoutRequestDoneButton;
