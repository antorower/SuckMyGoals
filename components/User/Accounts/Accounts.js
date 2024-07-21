import React from "react";
import PlusButton from "@/components/General/PlusButton";
import { GetAllUserAccounts } from "@/lib/UserActions";
import WaitingPurchaseAccountCard from "./WaitingPurchaseAccountCard";
import LiveAccountCard from "./LiveAccountCard";

const Accounts = async ({ userId }) => {
  const allAccounts = await GetAllUserAccounts(userId);

  let waitingPurchaseAccounts;
  let liveAccounts;
  let needUpgradeAccounts;
  let waitingPayoutAccounts;
  let payoutRequestDoneAccounts;
  let moneySendedAccounts;

  if (allAccounts && allAccounts.length > 0) {
    waitingPurchaseAccounts = allAccounts.filter((account) => account.status === "WaitingPurchase");
    liveAccounts = allAccounts.filter((account) => account.status === "Live");
    needUpgradeAccounts = allAccounts.filter((account) => account.status === "NeedUpgrade");
    waitingPayoutAccounts = allAccounts.filter((account) => account.status === "WaitingPayout");
    payoutRequestDoneAccounts = allAccounts.filter((account) => account.status === "PayoutRequestDone");
    moneySendedAccounts = allAccounts.filter((account) => account.status === "MoneySended");
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-center gap-4 px-4">{waitingPurchaseAccounts && waitingPurchaseAccounts.length > 0 && waitingPurchaseAccounts.map((account) => <WaitingPurchaseAccountCard account={account} key={account._id.toString()} />)}</div>
      <div className="flex flex-wrap justify-center gap-4 px-4">{liveAccounts && liveAccounts.length > 0 && liveAccounts.map((account) => <LiveAccountCard account={account} key={account._id.toString()} />)}</div>
      <PlusButton link={`/accounts/add?user=${userId}`} />
    </div>
  );
};

export default Accounts;
