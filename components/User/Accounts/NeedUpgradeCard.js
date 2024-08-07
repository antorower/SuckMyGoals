import { Companies } from "@/lib/AppData";
import Link from "next/link";

const NeedUpgradeCard = async ({ account }) => {
  const company = Companies.find((company) => company.name === account.company);

  return (
    <Link href={`/account?account=${account._id.toString()}`} className="border border-gray-800 rounded p-4 flex flex-col items-center justify-center gap-2 max-w-[250px]">
      <div className="text-gray-500">Upgrade Account</div>
      <div className="">{company.name}</div>
      <div className="flex items-center justify-between">
        {company.phases[account.phase].name} to {company.phases[account.phase + +1].name}
      </div>
      <div className="text-xs text-center m-auto text-gray-500">{company.phases[account.phase].instructions}</div>
    </Link>
  );
};

export default NeedUpgradeCard;
