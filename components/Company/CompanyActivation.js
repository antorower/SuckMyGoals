"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UpdateActivation } from "@/lib/CompanyActions";
import { toast } from "react-toastify";

const CompanyActivation = ({ isActive, companyId }) => {
  const [isCompanyActive, setIsCompanyActive] = useState(isActive);

  const ToggleActivation = async () => {
    const currentState = isCompanyActive;
    setIsCompanyActive(!currentState);
    const response = await UpdateActivation(companyId, !currentState);
    if (response.error) {
      setIsCompanyActive(currentState);
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <motion.button onClick={ToggleActivation} className={`rounded-full transition-all duration-300 w-[35px] h-[18px] flex items-center ${isCompanyActive ? "bg-green-500" : "bg-red-500"}`} initial={{ backgroundColor: isCompanyActive ? "bg-green-500" : "bg-red-500" }} animate={{ backgroundColor: isCompanyActive ? "bg-green-500" : "bg-red-500" }} transition={{ duration: 0.3 }}>
      <motion.div className="rounded-full w-[12px] h-[12px] bg-white" initial={{ x: isCompanyActive ? 19 : 4 }} animate={{ x: isCompanyActive ? 19 : 4 }} transition={{ duration: 0.3 }}></motion.div>
    </motion.button>
  );
};

export default CompanyActivation;
