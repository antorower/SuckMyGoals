import Image from "next/image";
import Link from "next/link";
import { GetPendingPayouts } from "@/lib/PayoutActions";
import AcceptPayoutButton from "@/components/AcceptPayoutButton";
import { auth } from "@clerk/nextjs/server";

const Bank = async () => {
  const payouts = await GetPendingPayouts();

  const { userId, sessionClaims } = auth();
  if (!userId || !sessionClaims.metadata.owner) notFound();

  return (
    <div className="p-8 flex justify-center m-auto w-full">
      {payouts.map((payout) => (
        <div key={payout._id.toString()} className="flex flex-col w-full gap-4 max-w-[280px] border border-gray-700 rounded  p-4">
          <div className="text-center text-gray-500 text-lg">
            {payout.user.firstName} {payout.user.lastName}
          </div>
          <div className="flex justify-between">
            <div>Account Balance:</div>
            <div> ${payout.accountBalance}</div>
          </div>
          <div className="flex justify-between">
            <div>Account Profit:</div>
            <div> ${payout.accountProfit}</div>
          </div>
          <div className="flex justify-between text-green-600">
            <div>Payout Amount:</div>
            <div>${payout.payoutAmount}</div>
          </div>
          <div className="flex justify-between">
            <div>User Profit:</div>
            <div>${payout.userProfit}</div>
          </div>
          <div className="flex justify-between">
            <div>Refund</div>
            <div>${payout.refund}</div>
          </div>
          <div className="flex justify-between text-red-600">
            <div>Total User Share</div>
            <div>${payout.totalUserShare}</div>
          </div>
          <div className="flex justify-between text-red-600">
            <div>Leaders Profit:</div>
            <div>${payout.leadersProfit}</div>
          </div>
          <div className="flex justify-between">
            <div>Wallet Money:</div>
            <div>${payout.netProfit + payout.leadersProfit}</div>
          </div>
          <div className="flex justify-between text-blue-400">
            <div>Net Profit:</div>
            <div>${payout.netProfit}</div>
          </div>
          <AcceptPayoutButton id={payout._id.toString()} />
        </div>
      ))}
    </div>
  );
};

export default Bank;
