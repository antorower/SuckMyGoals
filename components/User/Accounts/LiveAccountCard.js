import Link from "next/link";
const LiveAccountCard = async ({ account, admin, owner }) => {
  console.log("Last Trade", account.lastTrade);
  const lastTradeExist = Boolean(account.lastTrade);

  // Έλεγχος αν το account.lastTrade έχει openTime σήμερα
  const openTradeToday = account?.lastTrade?.trade?.openTime ? new Date(account.lastTrade.trade.openTime).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0) : false;

  const closeTradeToday = account?.lastTrade?.status === "Close";

  return (
    <Link href={`/account?account=${account._id.toString()}`} className={`border ${openTradeToday ? (closeTradeToday ? "border-purple-500" : "border-green-500") : "border-gray-800"} rounded p-4 flex flex-col items-center justify-center gap-2 max-w-[250px]`}>
      <div className={`${account.phaseWeight === 1 ? "text-blue-400" : null} ${account.phaseWeight === 2 ? "text-purple-400" : null} ${account.phaseWeight === 3 ? "text-orange-400" : null}`}>Live Account</div>
      <div className="flex w-full justify-between">
        <div className="">{account.company}</div>
        <div>${(account.capital / 1000).toFixed(1)}K</div>
      </div>
      <div className="text-xs text-center m-auto text-gray-500">{account.note}</div>
      <div className="font-semibold text-xl">{account.number}</div>
      <div className="font-semibold text-gray-400">${Intl.NumberFormat("de-DE").format(account.balance)}</div>
    </Link>
  );
};

export default LiveAccountCard;
