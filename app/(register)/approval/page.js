import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const Approval = async () => {
  const { userId, sessionClaims } = auth();
  if (sessionClaims.metadata.owner) redirect("/");
  if (sessionClaims.metadata.accepted) redirect("/");
  return <div className="flex justify-center items-center text-white animate-pulse">Please wait for approval</div>;
};

export default Approval;
