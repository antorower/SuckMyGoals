import Image from "next/image";
import Link from "next/link";
import { GetAllAccountsLight } from "@/lib/AccountActions";

const Accounts = async ({ searchParams }) => {
  const accounts = await GetAllAccountsLight();

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

  return (
    <div className="flex flex-wrap gap-4 p-8 items-start">
      {accounts.map((account) => (
        <div className={`border px-3 py-2 ${account.balance > account.capital ? "border-green-600" : null} ${account.balance < account.capital ? "border-red-600" : null} ${account.balance === account.capital ? "border-gray-800" : null}`} key={account._id}>
          <div>{account.number}</div>
          <div>{account.balance}</div>
        </div>
      ))}
    </div>
  );
};

export default Accounts;
