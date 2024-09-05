import Image from "next/image";
import Link from "next/link";
import { GetAccountById } from "@/lib/AccountActions";
import { notFound } from "next/navigation";
import { Companies } from "@/lib/AppData";
import AccountNumberForm from "@/components/User/Accounts/AccountNumberForm";
import NewAccountNumberForm from "@/components/User/Accounts/NewAccountNumberForm";
import LiveAccountDetails from "@/components/User/Accounts/LiveAccountDetails";
import { GetDaySchedule } from "@/lib/AppData";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import PayoutPhase from "@/components/User/Accounts/PayoutPhase";

const Account = async ({ searchParams }) => {
  const clerkUser = await currentUser();

  const daySchedule = GetDaySchedule();
  const dayNote = daySchedule?.note;

  const urlAccountId = searchParams.account;
  const accountCorrect = searchParams.accountcorrect === "true";
  if (!urlAccountId) notFound();
  const account = await GetAccountById(urlAccountId);
  if (!account || account.error) notFound();
  const admin = clerkUser.publicMetadata.owner;
  const owner = clerkUser.publicMetadata.mongoId === account.user._id.toString();

  const company = Companies.find((company) => company.name === account.company);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 justify-center w-full p-4 text-xl border-b border-gray-800">
        <div>
          <UserButton />
        </div>
        <Link href={`/user?user=${account.user._id.toString()}`}>
          {account.user.firstName} {account.user.lastName}
        </Link>
      </div>
      {account.number && <div className="flex justify-center items-center w-full p-2 text-3xl font-bold gap-4">{account.number}</div>}
      {/*<div className="flex justify-center text-gray-400 text-sm border-y border-gray-800 p-3 text-center">{account.note}</div>*/}
      <div className={`flex justify-center px-4 gap-2 items-center ${account.status === "WaitingPurchase" && "text-2xl font-semibold"}`}>
        <div>{account.company}</div>
        <div>-</div>
        <div>{company.phases[account.phase].name}</div>
        <div>-</div>
        <div>${account.balance.toLocaleString("de-DE")}</div>
      </div>
      {/* INSTRUCTIONS */}
      {account.status == "Live" && (
        <div className="w-full m-auto flex flex-col gap-2 justify-center border-y border-gray-800 p-4">
          <div className="font-semibold m-auto">Instructions</div>
          <div className="text-sm text-gray-400 text-center">{company.phases[account.phase].instructions}</div>
        </div>
      )}
      {account.status == "WaitingPurchase" && (
        <div className="w-full m-auto flex flex-col gap-2 justify-center border-y border-gray-800 p-4">
          <div className="font-semibold m-auto">Instructions</div>
          <div className="text-sm text-gray-400 text-center">
            {new Date(account.createdAt).toLocaleDateString("el-GR", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </div>

          <div className="text-sm text-gray-400 text-center">{company.waitingPurchaseInstructions}</div>
        </div>
      )}
      {account.status == "NeedUpgrade" && (
        <div className="w-full m-auto flex flex-col gap-2 justify-center border-y border-gray-800 p-4">
          <div className="font-semibold m-auto">Instructions</div>
          <div className="text-sm text-gray-400 text-center">{company.needUpgradeInstructions}</div>
        </div>
      )}
      {account.status == "WaitingPayout" && (
        <div className="w-full m-auto flex flex-col gap-2 justify-center border-y border-gray-800 p-4">
          <div className="font-semibold m-auto">Instructions</div>
          <div className="text-sm text-gray-400 text-center">{company.waitingPayoutInstructions}</div>
        </div>
      )}
      {account.status == "PayoutRequestDone" && (
        <div className="w-full m-auto flex flex-col gap-2 justify-center border-y border-gray-800 p-4">
          <div className="font-semibold m-auto">Instructions</div>
          <div className="text-sm text-gray-400 text-center">{company.payoutRequestDoneInstructions}</div>
        </div>
      )}
      {account.status == "MoneySended" && (
        <div className="w-full m-auto flex flex-col gap-2 justify-center border-y border-gray-800 p-4">
          <div className="font-semibold m-auto">Instructions</div>
          <div className="text-sm text-gray-400 text-center">{company.moneySendedInstructions}</div>
        </div>
      )}
      {/* INSTRUCTIONS */}
      {dayNote && dayNote !== "" && <div className="text-2xl flex justify-center animate-pulse bg-red-600 w-full p-4 font-semibold">{dayNote}</div>}
      {account.status === "WaitingPurchase" && (admin || owner) && <AccountNumberForm accountId={account._id.toString()} admin={admin} owner={owner} />}
      {account.status === "Live" && <LiveAccountDetails account={account} admin={admin} owner={owner} accountCorrect={accountCorrect} />}
      {account.status === "NeedUpgrade" && <NewAccountNumberForm oldAccountId={account._id.toString()} />}
      {(account.status === "WaitingPayout" || account.status === "PayoutRequestDone" || account.status === "MoneySended") && <PayoutPhase account={account} admin={admin} owner={owner} />}
      {(account.status === "Review" || account.status === "Lost") && <div className="m-auto font-bold animate-pulse text-red-600">Your account {account.number} lost</div>}
    </div>
  );
};

export default Account;
