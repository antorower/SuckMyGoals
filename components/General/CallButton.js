"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const CallButton = ({ telephone }) => {
  return (
    <Link href={`tel:${telephone}`} className="z-50">
      <motion.div whileHover={{ scale: 1.2 }} className="fixed bottom-[85px] right-[25px] rounded-full bg-blue-600 p-3">
        <Image src="/telephone.svg" width={25} height={25} alt="plus-icon" style={{ transform: "scaleX(-1)" }} />
      </motion.div>
    </Link>
  );
};

export default CallButton;
