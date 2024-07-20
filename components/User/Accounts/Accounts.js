import React from "react";
import UserAccountCard from "./UserAccountCard";
import PlusButton from "@/components/General/PlusButton";

const Accounts = ({selectedAccount}) => {
  return <div className="flex flex-col">
    <UserAccountCard/>
    <PlusButton link="/"/>
  </div>;
};

export default Accounts;
