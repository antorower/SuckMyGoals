import Image from "next/image";
import Link from "next/link";
import { GetAllAccountsLight } from "@/lib/AccountActions";
import { GetWaitingPurchaseAccounts } from "@/lib/AccountActions";
import AccountLostButton from "@/components/User/Accounts/AccountLostButton";
import { currentUser } from "@clerk/nextjs/server";

const Accounts = async ({ searchParams }) => {
  const clerkUser = await currentUser();
  const accounts = await GetAllAccountsLight();
  const waitingPurchaseAccounts = await GetWaitingPurchaseAccounts();
  console.log(waitingPurchaseAccounts.length);

  const sort = searchParams.sort || "default";

  if (sort === "trade") {
    accounts.sort((a, b) => {
      console.log(a);
      const dateA = new Date(a.eventsTimestamp.firstTradeDate);
      const dateB = new Date(b.eventsTimestamp.firstTradeDate);
      return dateA - dateB; // Ascending order
    });
  }

  if (sort === "balance") {
    accounts.sort((a, b) => {
      const aProfitPercentage = ((a.balance - a.capital) * 100) / a.capital;
      const bProfitPercentage = ((b.balance - b.capital) * 100) / b.capital;

      return bProfitPercentage - aProfitPercentage;
    });
  }

  if (sort === "company") {
    accounts.sort((a, b) => {
      if (a.company < b.company) return -1;
      if (a.company > b.company) return 1;
      return 0;
    });
  }

  if (sort === "default") {
    accounts.sort((a, b) => b.phaseWeight - a.phaseWeight);
  }

  const phase1 = accounts.filter((account) => account.phaseWeight === 1);
  const phase2 = accounts.filter((account) => account.phaseWeight === 2);
  const phase3 = accounts.filter((account) => account.phaseWeight === 3);

  const profitAccountsNumber = accounts.filter((account) => account.balance > account.capital).length;
  const neutralAccountsNumber = accounts.filter((account) => account.balance === account.capital).length;
  const lossAccountsNumber = accounts.filter((account) => account.balance < account.capital).length;

  const fundingPipsAccounts = accounts.filter((account) => account.company === "Funding Pips");
  const fundedNextAccounts = accounts.filter((account) => account.company === "Funded Next");
  const the5ersAccounts = accounts.filter((account) => account.company === "The5ers");
  const fundedNextStellarAccounts = accounts.filter((account) => account.company === "Funded Next Stellar");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3 mx-auto p-4">
        <Link href="/accounts?sort=balance" className="border border-gray-800 px-3 py-2">
          Sort by Balance
        </Link>
        <Link href="/accounts?sort=trade" className="border border-gray-800 px-3 py-2">
          Sort by Trade
        </Link>
        <Link href="/accounts?sort=company" className="border border-gray-800 px-3 py-2">
          Sort by Company
        </Link>
        <Link href="/accounts?sort=default" className="border border-gray-800 px-3 py-2">
          Sort by Phase
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 mx-auto p-2">
        <div className="border border-gray-800 px-3 py-2">Winning Accounts: {profitAccountsNumber}</div>
        <div className="border border-gray-800 px-3 py-2">New Accounts: {neutralAccountsNumber}</div>
        <div className="border border-gray-800 px-3 py-2">Lossing Accounts: {lossAccountsNumber}</div>
      </div>
      <div className="flex flex-wrap gap-3 mx-auto p-2">
        <div className="border border-gray-800 px-3 py-2">Challenge: {phase1.length}</div>
        <div className="border border-gray-800 px-3 py-2">Verification: {phase2.length}</div>
        <div className="border border-gray-800 px-3 py-2">Funded: {phase3.length}</div>
      </div>
      <div className="flex flex-wrap gap-3 mx-auto p-2">
        <div className="border border-gray-800 px-3 py-2">Funding Pips: {fundingPipsAccounts.length}</div>
        <div className="border border-gray-800 px-3 py-2">Funded Next: {fundedNextAccounts.length}</div>
        <div className="border border-gray-800 px-3 py-2">Funded Next Stellar: {fundedNextStellarAccounts.length}</div>
        <div className="border border-gray-800 px-3 py-2">The5ers: {the5ersAccounts.length}</div>
      </div>
      <div className="flex flex-wrap gap-4 p-8 justify-center items-start">
        {waitingPurchaseAccounts.map((account) => (
          <div className={`border text-center px-3 py-2 ${account.balance > account.capital ? "border-green-600" : null} ${account.balance < account.capital ? "border-red-600" : null} ${account.balance === account.capital ? "border-gray-800" : null}`} key={account._id}>
            <Link href={`/user?user=${account.user._id.toString()}`}>
              {account.user.firstName} {account.user.lastName}
            </Link>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 p-8 justify-center items-start">
        {accounts.map((account) => (
          <>
            {account.status !== "Review" && (
              <Link href={`/account?account=${account._id.toString()}`} className={`${account.status === "Review" ? "animate-pulse" : null} border text-center px-3 py-2 ${account.balance > account.capital ? "border-green-600" : null} ${account.balance < account.capital ? "border-red-600" : null} ${account.balance === account.capital ? "border-gray-800" : null}`} key={account._id}>
                <div className={`${account.phaseWeight === 1 ? "text-blue-500" : null} ${account.phaseWeight === 2 ? "text-violet-500" : null} ${account.phaseWeight === 3 ? "text-orange-500" : null}`}>{account.company}</div>
                <div className="text-gray-600">{account.number}</div>
                {account.status !== "Review" && <div className="text-gray-600">{account.status}</div>}
                {account.status === "Review" && clerkUser.publicMetadata.owner && <AccountLostButton accountId={account._id.toString()} />}
                <div>{new Date(account.eventsTimestamp.firstTradeDate).toLocaleDateString("el-GR")}</div>
                <div>{account.balance}</div>
              </Link>
            )}
            {account.status === "Review" && (
              <div className="animate-pulse border text-center px-3 py-2 border-yellow-400" key={account._id}>
                <div className={`${account.phaseWeight === 1 ? "text-blue-500" : null} ${account.phaseWeight === 2 ? "text-violet-500" : null} ${account.phaseWeight === 3 ? "text-orange-500" : null}`}>{account.company}</div>
                <Link href={`/account?account=${account._id.toString()}`} className="text-gray-600">
                  {account.number}
                </Link>
                {account.status !== "Review" && <div className="text-gray-600">{account.status}</div>}
                {account.status === "Review" && clerkUser.publicMetadata.owner && <AccountLostButton accountId={account._id.toString()} />}
                <div>{new Date(account.eventsTimestamp.firstTradeDate).toLocaleDateString("el-GR")}</div>
                <div>{account.balance}</div>
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
