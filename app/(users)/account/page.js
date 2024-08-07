import Image from "next/image";
import Link from "next/link";
import { GetAccountById } from "@/lib/AccountActions";
import { notFound } from "next/navigation";
import { Companies } from "@/lib/AppData";
import AccountNumberForm from "@/components/User/Accounts/AccountNumberForm";
import NewAccountNumberForm from "@/components/User/Accounts/NewAccountNumberForm";
import LiveAccountDetails from "@/components/User/Accounts/LiveAccountDetails";
import { GetDaySchedule } from "@/lib/AppData";

const Account = async ({ searchParams }) => {
  const daySchedule = GetDaySchedule();
  const dayNote = daySchedule?.note;

  const urlAccountId = searchParams.account;
  if (!urlAccountId) notFound();

  const account = await GetAccountById(urlAccountId);
  if (!account) notFound();
  const company = Companies.find((company) => company.name === account.company);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-center w-full p-4 text-xl border-b border-gray-800">
        {account.user.firstName} {account.user.lastName}
      </div>
      {account.number && <div className="flex justify-center items-center w-full p-2 text-3xl font-bold gap-4">{account.number}</div>}
      <div className="flex justify-center text-gray-400 text-sm border-y border-gray-800 p-3 text-center">{account.note}</div>
      <div className={`flex justify-center px-4 gap-2 items-center ${account.status === "WaitingPurchase" && "text-2xl font-semibold"}`}>
        <div>{account.company}</div>
        <div>-</div>
        <div>{company.phases[account.phase].name}</div>
        <div>-</div>
        <div>${account.balance.toLocaleString("de-DE")}</div>
      </div>
      {account.status !== "WaitingPurchase" && (
        <div className="w-full m-auto flex flex-col gap-2 justify-center border-y border-gray-800 p-4">
          <div className="font-semibold m-auto">Instructions</div>
          <div className="text-sm text-gray-400 text-center">{company.phases[account.phase].instructions}</div>
        </div>
      )}
      {dayNote && dayNote !== "" && <div className="text-2xl flex justify-center animate-pulse bg-red-600 w-full p-4 font-semibold">{dayNote}</div>}
      {account.status === "WaitingPurchase" && <AccountNumberForm accountId={account._id.toString()} />}
      {account.status === "NeedUpgrade" && <NewAccountNumberForm oldAccountId={account._id.toString()} />}
      {account.status === "Live" && <LiveAccountDetails account={account} />}
    </div>
  );
};

export default Account;
