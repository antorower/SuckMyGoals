import { Companies } from "@/lib/AppData";
import Link from "next/link";

const WaitingPayoutAccountCard = async ({ account }) => {
  const company = Companies.find((company) => company.name === account.company);
  const day = account?.payoutRequestDate?.day;
  const month = account?.payoutRequestDate?.month;

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;

  const isPayoutDay = day === todayDay && month === todayMonth;

  return (
    <Link href={`/account?account=${account._id.toString()}`} className={`${isPayoutDay ? "animate-pulse" : null} border border-orange-500 shadow-2xl shadow-orange-950 rounded p-4 flex flex-col items-center justify-center gap-2 max-w-[250px]`}>
      <div className="text-gray-500">Payout Account</div>
      <div className="">{company.name}</div>
      <div className="flex items-center justify-between">Profit: ${account.balance - account.capital}</div>
      <div className="text-xs text-center m-auto text-gray-500">{company.phases[account.phase].instructions}</div>
    </Link>
  );
};

export default WaitingPayoutAccountCard;
