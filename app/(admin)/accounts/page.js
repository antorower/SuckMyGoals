import Image from "next/image";
import Link from "next/link";
import { GetAllAccountsLight } from "@/lib/AccountActions";
import { GetWaitingPurchaseAccounts } from "@/lib/AccountActions";

const Accounts = async ({ searchParams }) => {
  const accounts = await GetAllAccountsLight();
  const waitingPurchaseAccounts = await GetWaitingPurchaseAccounts();
  console.log(waitingPurchaseAccounts.length);

  const sort = searchParams.sort || "default";

  if (sort === "trade") {
    accounts.sort((a, b) => {
      const dateA = new Date(a.eventsTimestamp.firstTradeDate);
      const dateB = new Date(b.eventsTimestamp.firstTradeDate);
      return dateA - dateB; // Ascending order
    });
  }

  if (sort === "balance") {
    accounts.sort((a, b) => {
      const aProfitPercentage = ((a.balance - a.capital) * 100) / a.capital;
      const bProfitPercentage = ((b.balance - b.capital) * 100) / b.capital;

      return bProfitPercentage - aProfitPercentage; // Sort by profit percentage, higher first
    });
  }

  if (sort === "company") {
    accounts.sort((a, b) => {
      if (a.company < b.company) return -1;
      if (a.company > b.company) return 1;
      return 0;
    });
  }

  const profitAccountsNumber = accounts.filter((account) => account.balance > account.capital).length;
  const neutralAccountsNumber = accounts.filter((account) => account.balance === account.capital).length;
  const lossAccountsNumber = accounts.filter((account) => account.balance < account.capital).length;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3 mx-auto p-8">
        <Link href="/accounts?sort=balance" className="border border-gray-800 px-3 py-2">
          Sort by Balance
        </Link>
        <Link href="/accounts?sort=trade" className="border border-gray-800 px-3 py-2">
          Sort by Trade
        </Link>
        <Link href="/accounts?sort=company" className="border border-gray-800 px-3 py-2">
          Sort by Company
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 mx-auto p-8">
        <div className="border border-gray-800 px-3 py-2">Winning Accounts: {profitAccountsNumber}</div>
        <div className="border border-gray-800 px-3 py-2">New Accounts: {neutralAccountsNumber}</div>
        <div className="border border-gray-800 px-3 py-2">Lossing Accounts: {lossAccountsNumber}</div>
      </div>
      <div className="flex flex-wrap gap-4 p-8 items-start">
        {waitingPurchaseAccounts.map((account) => (
          <div className={`border text-center px-3 py-2 ${account.balance > account.capital ? "border-green-600" : null} ${account.balance < account.capital ? "border-red-600" : null} ${account.balance === account.capital ? "border-gray-800" : null}`} key={account._id}>
            <Link href={`/user?user=${account.user._id.toString()}`}>
              {account.user.firstName} {account.user.lastName}
            </Link>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 p-8 items-start">
        {accounts.map((account) => (
          <div className={`${account.status === "Review" ? "animate-pulse" : null} border text-center px-3 py-2 ${account.balance > account.capital ? "border-green-600" : null} ${account.balance < account.capital ? "border-red-600" : null} ${account.balance === account.capital ? "border-gray-800" : null}`} key={account._id}>
            <div className={`${account.phaseWeight === 1 ? "text-blue-500" : null} ${account.phaseWeight === 2 ? "text-violet-500" : null} ${account.phaseWeight === 3 ? "text-orange-500" : null}`}>{account.company}</div>
            <div className="text-gray-600">{account.number}</div>
            {account.status !== "Review" && <div className="text-gray-600">{account.status}</div>}
            {account.status === "Review" && <button className="text-gray-600">Remove</button>}
            <div>{account.balance}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
