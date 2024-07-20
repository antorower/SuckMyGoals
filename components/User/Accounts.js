"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const Accounts = ({ userId, accounts }) => {
  const { user, isLoaded } = useUser();
  return <div className="flex flex-col">asldfj</div>;
};

export default Accounts;
