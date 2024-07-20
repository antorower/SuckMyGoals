import React from "react";
import Image from "next/image";
import Link from "next/link";
import CompanyActivation from "./CompanyActivation";

const CompanyCard = ({ company }) => {
  return (
    <div className="flex w-full items-center justify-between bg-black px-4 py-2 rounded border border-gray-900 shadow-md shadow-black">
      <Link href={company.link} target="_blank">
        <Image src="/link.svg" width={22} height={22} alt="link-icon" />
      </Link>
      <div className="w-[120px] text-center">{company.name}</div>
      <div className="hidden sm:block">{company.maxCapital / 1000}K</div>
      <div className="hidden sm:block">{company.maxAccounts}</div>
      <Link href={`/companies/update?company=${company._id.toString()}`}>
        <Image src="/edit.svg" width={18} height={18} alt="edit-icon" />
      </Link>
      <CompanyActivation isActive={company.active} companyId={company._id.toString()} />
    </div>
  );
};

export default CompanyCard;
