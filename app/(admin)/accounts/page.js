import Image from "next/image";
import Link from "next/link";
import { GetAllAccountsLight } from "@/lib/AccountActions";
import { GetWaitingPurchaseAccounts } from "@/lib/AccountActions";
import AccountLostButton from "@/components/User/Accounts/AccountLostButton";
import ManageAccountTrades from "@/components/ManageAccountTrades";
import { auth } from "@clerk/nextjs/server";

const Accounts = async ({ searchParams }) => {
  const accounts = await GetAllAccountsLight();
  const numberOfLiveAccounts = accounts.filter((account) => account.status === "Live");
  const waitingPurchaseAccounts = await GetWaitingPurchaseAccounts();
  const { sessionClaims } = auth();

  const sort = searchParams.sort || "default";
  const manageAccountActivation = searchParams.manager;

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

      return bProfitPercentage - aProfitPercentage;
    });
  }

  if (sort === "company") {
    accounts.sort((a, b) => {
      // Πρώτη ταξινόμηση βάσει εταιρείας
      if (a.company < b.company) return -1;
      if (a.company > b.company) return 1;

      // Δεύτερη ταξινόμηση βάσει balance (μεγαλύτερο balance πάνω)
      return b.balance - a.balance;
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
  const maven = accounts.filter((account) => account.company === "Maven");

  return (
    <div className="flex flex-col gap-2">
      {sessionClaims.metadata.owner && (
        <>
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
            <div className="border border-gray-800 px-3 py-2">Live: {numberOfLiveAccounts.length}</div>
          </div>
          <div className="flex flex-wrap gap-3 mx-auto p-2">
            <div className="border border-gray-800 px-3 py-2">Funding Pips: {fundingPipsAccounts.length}</div>
            <div className="border border-gray-800 px-3 py-2">Funded Next: {fundedNextAccounts.length}</div>
            <div className="border border-gray-800 px-3 py-2">Funded Next Stellar: {fundedNextStellarAccounts.length}</div>
            <div className="border border-gray-800 px-3 py-2">The5ers: {the5ersAccounts.length}</div>
            <div className="border border-gray-800 px-3 py-2">Maven: {maven.length}</div>
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
                {account.status !== "Review" && !manageAccountActivation && (
                  <Link href={`/account?account=${account._id.toString()}`} className={`border text-center px-3 py-2 ${account.balance > account.capital ? "border-green-600" : null} ${account.balance < account.capital ? "border-red-600" : null} ${account.balance === account.capital ? "border-gray-800" : null}`} key={account._id}>
                    <div className={`${account.phaseWeight === 1 ? "text-blue-500" : null} ${account.phaseWeight === 2 ? "text-violet-500" : null} ${account.phaseWeight === 3 ? "text-orange-500" : null}`}>{account.company}</div>
                    <div className="text-gray-600">{account.number}</div>
                    {account.status !== "Review" && <div className="text-gray-600">{account.status}</div>}
                    {account.status === "Review" && sessionClaims.metadata.owner && <AccountLostButton accountId={account._id.toString()} />}
                    <div>FiTr: {new Date(account.eventsTimestamp.firstTradeDate).toLocaleDateString("el-GR")}</div>
                    {account.eventsTimestamp.targetReachedDate && account.phaseWeight !== 3 && <div>TaRe: {new Date(account.eventsTimestamp.targetReachedDate).toLocaleDateString("el-GR")}</div>}
                    {account.phaseWeight === 3 && account?.payoutRequestDate?.day && (
                      <div>
                        PaDa: {account?.payoutRequestDate?.day} / {account?.payoutRequestDate?.month} / 2025
                      </div>
                    )}
                    {account.phaseWeight === 3 && <div>TiPa: {account.metadata.timesPaid}</div>}
                    <div>{account.balance}</div>
                  </Link>
                )}
                {account.status !== "Review" && manageAccountActivation && account.phaseWeight === 1 && account.company === "Funded Next" && (
                  <div className={`border ${account.tradesDisabled ? "animate-pulse" : null} text-center px-3 py-2 ${account.balance > account.capital ? "border-green-600" : null} ${account.balance < account.capital ? "border-red-600" : null} ${account.balance === account.capital ? "border-gray-800" : null}`} key={account._id}>
                    <div className={`${account.phaseWeight === 1 ? "text-blue-500" : null} ${account.phaseWeight === 2 ? "text-violet-500" : null} ${account.phaseWeight === 3 ? "text-orange-500" : null}`}>{account.company}</div>
                    <Link href={`/account?account=${account._id.toString()}`} className="text-gray-600">
                      {account.number}
                    </Link>
                    {account.status !== "Review" && <div className="text-gray-600">{account.status}</div>}
                    {account.status === "Review" && sessionClaims.metadata.owner && <AccountLostButton accountId={account._id.toString()} />}
                    <div>{new Date(account.eventsTimestamp.firstTradeDate).toLocaleDateString("el-GR")}</div>
                    {account.eventsTimestamp.targetReachedDate && <div>{new Date(account.eventsTimestamp.targetReachedDate).toLocaleDateString("el-GR")}</div>}
                    <div>{account.balance}</div>
                    <ManageAccountTrades accountId={account._id.toString()} disabled={account.tradesDisabled} />
                  </div>
                )}
                {account.status === "Review" && (
                  <div className={`animate-pulse border text-center px-3 py-2 border-yellow-400`} key={account._id}>
                    <div className={`${account.phaseWeight === 1 ? "text-blue-500" : null} ${account.phaseWeight === 2 ? "text-violet-500" : null} ${account.phaseWeight === 3 ? "text-orange-500" : null}`}>{account.company}</div>
                    <Link href={`/account?account=${account._id.toString()}`} className="text-gray-600">
                      {account.number}
                    </Link>
                    {account.status !== "Review" && <div className="text-gray-600">{account.status}</div>}
                    {account.status === "Review" && sessionClaims.metadata.owner && <AccountLostButton accountId={account._id.toString()} />}
                    <div>{new Date(account.eventsTimestamp.firstTradeDate).toLocaleDateString("el-GR")}</div>
                    <div>{account.balance}</div>
                  </div>
                )}
              </>
            ))}
          </div>
        </>
      )}
      {!sessionClaims.metadata.owner && (
        <>
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
            <div className="border border-gray-800 px-3 py-2">Live: {numberOfLiveAccounts.length}</div>
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
                <div>
                  {account.user.firstName} {account.user.lastName}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 p-8 justify-center items-start">
            {accounts.map((account) => (
              <>
                {account.status !== "Review" && !manageAccountActivation && (
                  <div className={`border text-center px-3 py-2 ${account.balance > account.capital ? "border-green-600" : null} ${account.balance < account.capital ? "border-red-600" : null} ${account.balance === account.capital ? "border-gray-800" : null}`} key={account._id}>
                    <div className={`${account.phaseWeight === 1 ? "text-blue-500" : null} ${account.phaseWeight === 2 ? "text-violet-500" : null} ${account.phaseWeight === 3 ? "text-orange-500" : null}`}>{account.company}</div>
                    {account.status !== "Review" && <div className="text-gray-600">{account.status}</div>}
                    {account.status === "Review" && sessionClaims.metadata.owner && <AccountLostButton accountId={account._id.toString()} />}
                    <div>{new Date(account.eventsTimestamp.firstTradeDate).toLocaleDateString("el-GR")}</div>
                    {account.eventsTimestamp.targetReachedDate && <div>{new Date(account.eventsTimestamp.targetReachedDate).toLocaleDateString("el-GR")}</div>}
                    <div>{account.balance}</div>
                  </div>
                )}
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Accounts;
