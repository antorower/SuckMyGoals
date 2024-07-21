import AccountNumberForm from "./AccountNumberForm";

const WaitingPurchaseAccountCard = async ({ account }) => {
  return (
    <div className="border border-gray-800 rounded p-4 flex flex-col items-center justify-center gap-2 max-w-[250px]">
      <div className="text-gray-500">Waiting Purchase</div>
      <div className="flex w-full justify-between">
        <div className="">{account.company.name}</div>
        <div>${account.capital / 1000}K</div>
      </div>
      <div className="text-xs text-center m-auto text-gray-500">{account.note}</div>
      <AccountNumberForm key={account._id.toString() + account.status} accountId={account._id.toString()} />
    </div>
  );
};

export default WaitingPurchaseAccountCard;
