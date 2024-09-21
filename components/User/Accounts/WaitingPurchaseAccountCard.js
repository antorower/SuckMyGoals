import AccountNumberForm from "./AccountNumberForm";
import Link from "next/link";

const WaitingPurchaseAccountCard = async ({ account, admin, owner }) => {
  return (
    <Link href={`/account?account=${account._id.toString()}`} className="border border-gray-800 rounded p-4 flex flex-col items-center justify-center gap-2 max-w-[250px]">
      <div className="text-gray-500">Waiting Purchase</div>
      <div className="text-sm text-gray-400 text-center">
        {new Date(account.createdAt).toLocaleDateString("el-GR", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })}
      </div>
      <div className="flex w-full justify-between">
        <div className="">{account.company}</div>
        <div>${account.capital / 1000}K</div>
      </div>
      {!account.investment && <div className="text-xs text-center m-auto text-gray-500">{account.note}</div>}
      {account.investment && <div className="text-sm text-center m-auto text-gray-500">Βuy your account with your own money and declare the number on our page</div>}
    </Link>
  );
};

export default WaitingPurchaseAccountCard;
//{(admin || owner) && <AccountNumberForm key={account._id.toString() + account.status} accountId={account._id.toString()} />}
