"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import UserCompanyActivation from "./UserCompanyActivation";
import { motion } from "framer-motion";

const CompanyCard = ({ name, companyId, state, admin, owner, userId }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="border border-gray-700 px-4 py-2 flex gap-8 items-center rounded shadow-md shadow-black">
      <div>{name}</div>
      {(owner || admin) && <UserCompanyActivation userId={userId} state={state} companyId={companyId} />}
    </motion.div>
  );
};

export default CompanyCard;
