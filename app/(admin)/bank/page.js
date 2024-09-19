import Image from "next/image";
import Link from "next/link";
import { GetPendingPayouts } from "@/lib/PayoutActions";

const Bank = async () => {
  const payouts = await GetPendingPayouts();
  console.log(payouts);

  return (
    <div className="p-8 flex justify-center m-auto w-full">
      {payouts.map((payout) => (
        <div className="flex flex-col w-full gap-4 max-w-[250px] border border-gray-700 rounded  p-4">
          <div className="flex justify-between">
            <div>Account Balance:</div>
            <div> ${payout.accountBalance}</div>
          </div>
          <div className="flex justify-between">
            <div>Account Profit:</div>
            <div> ${payout.accountProfit}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bank;
