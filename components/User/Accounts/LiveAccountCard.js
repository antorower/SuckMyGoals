import Link from "next/link";
import TradeSection from "./TradeSction";

const LiveAccountCard = async ({ account, admin, owner }) => {
  return (
    <div className="border border-gray-800 rounded p-4 flex flex-col items-center justify-center gap-2 max-w-[250px]">
      <div className="text-gray-500">Live Account</div>
      <div className="flex w-full justify-between">
        <div className="">{account.company.name}</div>
        <div>${account.capital / 1000}K</div>
      </div>
      <div className="text-xs text-center m-auto text-gray-500">{account.note}</div>
      <Link href={`/account/${account.number}`} className="font-semibold text-xl">
        {account.number}
      </Link>
      <div className="font-semibold text-gray-400">${Intl.NumberFormat("de-DE").format(account.balance)}</div>
      {(admin || owner) && <TradeSection openTradeExist={false} accountId={account._id.toString()} />}
    </div>
  );
};

export default LiveAccountCard;
