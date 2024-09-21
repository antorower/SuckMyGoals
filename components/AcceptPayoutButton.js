"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { AcceptPayout } from "@/lib/PayoutActions";

const AcceptPayoutButton = ({ id }) => {
  const [isActive, setIsActive] = useState(true);

  const Accept = async () => {
    setIsActive(false);
    const response = await AcceptPayout(id);
    if (response.error) {
      toast.error(response.message);
      setIsActive(true);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <button onClick={Accept} disabled={!isActive} className="submitButton">
      Accept
    </button>
  );
};

export default AcceptPayoutButton;
