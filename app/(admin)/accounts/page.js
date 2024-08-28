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
      if (b.phaseWeight !== a.phaseWeight) {
        return b.phaseWeight - a.phaseWeight; // Sort by phaseWeight, higher first
      }
      return b.balance - a.balance; // If phaseWeight is equal, sort by balance, higher first
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
        <div className="border border-gray-800 px-3 py-2" key={account._id}>
          <div>{account.number}</div>
          <div>{account.balance}</div>
        </div>
      ))}
    </div>
  );
};

export default Accounts;
