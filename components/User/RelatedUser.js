"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { AddRelatedUser } from "@/lib/UserActions";
import { RemoveRelatedUser } from "@/lib/UserActions";
import { useRouter } from "next/navigation";

const RelatedUser = ({ userId, relatedUserFirstName, relatedUserLastName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [relatedUserId, setRelatedUserId] = useState("");
  const router = useRouter();

  const AddUser = async () => {
    const response = await AddRelatedUser(userId, relatedUserId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
    setRelatedUserId("");
    setIsExpanded(false);
  };

  const RemoveUser = async () => {
    const response = await RemoveRelatedUser(userId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
    setRelatedUserId("");
    setIsExpanded(false);
  };

  return (
    <div className="flex flex-col gap-2 items-end justify-center px-4 py-2 relative">
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsExpanded(!isExpanded)} className="text-xs select-none">
        Do you use {relatedUserFirstName ? relatedUserFirstName : "second"} account?
      </motion.button>
      {isExpanded && !relatedUserFirstName && (
        <div className="border border-gray-700 py-2 px-2 rounded gap-2 flex flex-col absolute top-[35px] right-[15px] z-50">
          <input autoFocus value={relatedUserId} onChange={(e) => setRelatedUserId(e.target.value)} type="text" placeholder="User ID" className="input outline-none focus:outline-none" />
          <button onClick={AddUser} className="submitButton">
            Add
          </button>
        </div>
      )}
      {isExpanded && relatedUserFirstName && (
        <div className="border border-gray-700 py-2 px-2 rounded gap-2 flex flex-col absolute top-[35px] right-[15px] z-50">
          <motion.button whileHover={{ scale: 0.95 }} autoFocus onClick={RemoveUser} className="submitButton">
            Remove {relatedUserFirstName}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default RelatedUser;
