"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { ToggleDayActivation } from "@/lib/SettingsActions";

const DayActivation = ({ isActive, day }) => {
  const [isDayActive, setIsDayActive] = useState(isActive);

  const ToggleActivation = async () => {
    const response = await ToggleDayActivation(day);
    if (response.error) {
      toast.error(response.message);
    } else {
      setIsDayActive(response.result);
      toast.success(response.message);
    }
  };

  return (
    <motion.button onClick={ToggleActivation} className={`rounded-full transition-all duration-300 w-[35px] h-[18px] flex items-center ${isDayActive ? "bg-green-500" : "bg-red-500"}`} initial={{ backgroundColor: isDayActive ? "bg-green-500" : "bg-red-500" }} animate={{ backgroundColor: isDayActive ? "bg-green-500" : "bg-red-500" }} transition={{ duration: 0.3 }}>
      <motion.div className="rounded-full w-[12px] h-[12px] bg-white" initial={{ x: isDayActive ? 19 : 4 }} animate={{ x: isDayActive ? 19 : 4 }} transition={{ duration: 0.3 }}></motion.div>
    </motion.button>
  );
};

export default DayActivation;
