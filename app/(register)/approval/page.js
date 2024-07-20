import React from "react";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Approval = async () => {
  const clerkUser = await currentUser();
  if (clerkUser?.publicMetadata.owner) redirect("/");
  if (clerkUser?.publicMetadata.accepted) redirect("/");
  return <div className="flex justify-center items-center text-white animate-pulse">Please wait for approval</div>;
};

export default Approval;
