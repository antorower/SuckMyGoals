"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const PlusButton = ({ link }) => {
  return (
    <Link href={link}>
      <motion.div whileHover={{ scale: 1.2 }} className="fixed bottom-[85px] right-[25px] rounded-full bg-blue-600 p-3">
        <Image src="/plus.svg" width={20} height={20} alt="plus-icon" />
      </motion.div>
    </Link>
  );
};

export default PlusButton;
