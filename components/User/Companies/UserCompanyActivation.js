"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ActivateCompany } from "@/lib/UserActions";
import { DeactivateCompany } from "@/lib/UserActions";

const UserCompanyActivation = ({ state, companyName, userId }) => {
  const [isCompanyActive, setIsCompanyActive] = useState(state);
  const router = useRouter();

  const AddCompany = async () => {
    const currentState = isCompanyActive;
    setIsCompanyActive(!currentState);
    const response = await ActivateCompany(userId, companyName);
    if (response.error) {
      setIsCompanyActive(currentState);
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  const RemoveCompany = async () => {
    const currentState = isCompanyActive;
    setIsCompanyActive(!currentState);
    const response = await DeactivateCompany(userId, companyName);
    if (response.error) {
      setIsCompanyActive(currentState);
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <motion.button onClick={isCompanyActive ? () => RemoveCompany() : () => AddCompany()} className={`rounded-full transition-all duration-300 w-[35px] h-[18px] flex items-center ${isCompanyActive ? "bg-green-500" : "bg-red-500"}`} initial={{ backgroundColor: isCompanyActive ? "bg-green-500" : "bg-red-500" }} animate={{ backgroundColor: isCompanyActive ? "bg-green-500" : "bg-red-500" }} transition={{ duration: 0.3 }}>
      <motion.div className="rounded-full w-[12px] h-[12px] bg-white" initial={{ x: isCompanyActive ? 19 : 4 }} animate={{ x: isCompanyActive ? 19 : 4 }} transition={{ duration: 0.3 }}></motion.div>
    </motion.button>
  );
};

export default UserCompanyActivation;
