import NewAccountNumberForm from "./NewAccountNumberForm";

const NeedUpgradeCard = async ({ account, admin, owner }) => {
  const currentPhase = `phase${account.phase}`;
  const nextPhase = `phase${account.phase + 1}`;
  return (
    <div className="border border-gray-800 rounded p-4 flex flex-col items-center justify-center gap-2 max-w-[250px]">
      <div className="text-gray-500">Upgrade Account</div>
      <div className="">{account.company.name}</div>
      <div className="flex items-center justify-between">
        {account.company[currentPhase].name} to {account.company[nextPhase].name}
      </div>
      <div className="text-xs text-center m-auto text-gray-500">{account.company[currentPhase].note}</div>
      {(admin || owner) && <NewAccountNumberForm key={account._id.toString() + account.status} oldAccountId={account._id.toString()} />}
    </div>
  );
};

export default NeedUpgradeCard;
