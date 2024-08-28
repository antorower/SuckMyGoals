import React from "react";
import PlusButton from "@/components/General/PlusButton";
import WaitingPurchaseAccountCard from "./WaitingPurchaseAccountCard";
import LiveAccountCard from "./LiveAccountCard";
import NeedUpgradeCard from "./NeedUpgradeCard";
import WaitingPayoutAccountCard from "./WaitingPayoutAccountCard";
import Link from "next/link";

const Accounts = async ({ accounts, selectedAccounts, userId, admin, owner }) => {
  const allAccounts = accounts || [];

  const waitingPurchaseAccounts = allAccounts.filter((account) => account.status === "WaitingPurchase");
  const liveAccounts = allAccounts.filter((account) => account.status === "Live");
  const needUpgradeAccounts = allAccounts.filter((account) => account.status === "NeedUpgrade");
  const waitingPayoutAccounts = allAccounts.filter((account) => account.status === "WaitingPayout" || account.status === "PayoutRequestDone");

  const menu = (
    <div className="flex flex-wrap justify-center items-center gap-8">
      <Link className="border border-gray-800 rounded px-4 py-2" href={`/user?user=${userId}&accounts=waitingpurchaseaccounts`}>
        Purchase Accounts ({waitingPurchaseAccounts.length})
      </Link>
      <Link className="border border-gray-800 rounded px-4 py-2" href={`/user?user=${userId}&accounts=liveaccounts`}>
        Live Accounts ({liveAccounts.length})
      </Link>
      <Link className="border border-gray-800 rounded px-4 py-2" href={`/user?user=${userId}&accounts=needupgradeaccounts`}>
        Upgrade Accounts ({needUpgradeAccounts.length})
      </Link>
      <Link className="border border-gray-800 rounded px-4 py-2" href={`/user?user=${userId}&accounts=waitingpayoutaccounts`}>
        Waiting Payout Accounts ({waitingPayoutAccounts.length})
      </Link>
    </div>
  );

  if (!selectedAccounts) {
    return menu;
  }

  if (selectedAccounts === "waitingpurchaseaccounts") {
    return (
      <>
        {menu}
        {waitingPurchaseAccounts && waitingPurchaseAccounts.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 px-4">
            {waitingPurchaseAccounts.map((account) => (
              <WaitingPurchaseAccountCard account={account} key={account._id.toString()} admin={admin} owner={owner} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-4 animate-pulse">There are no account for purchase</div>
        )}
      </>
    );
  }

  if (selectedAccounts === "liveaccounts") {
    return (
      <>
        {menu}
        {liveAccounts && liveAccounts.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 px-4">
            {liveAccounts.map((account) => (
              <LiveAccountCard account={account} key={account._id.toString()} admin={admin} owner={owner} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-4 animate-pulse">There are no live accounts</div>
        )}
      </>
    );
  }

  if (selectedAccounts === "needupgradeaccounts") {
    return (
      <>
        {menu}
        {needUpgradeAccounts && needUpgradeAccounts.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 px-4">
            {needUpgradeAccounts.map((account) => (
              <NeedUpgradeCard account={account} key={account._id.toString()} admin={admin} owner={owner} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-4 animate-pulse">There are no accounts for upgrade</div>
        )}
      </>
    );
  }

  if (selectedAccounts === "waitingpayoutaccounts") {
    return (
      <>
        {menu}
        {waitingPayoutAccounts && waitingPayoutAccounts.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 px-4">
            {waitingPayoutAccounts.map((account) => (
              <WaitingPayoutAccountCard account={account} key={account._id.toString()} admin={admin} owner={owner} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-4 animate-pulse">There are no accounts waiting for payout</div>
        )}
      </>
    );
  }
};

export default Accounts;
