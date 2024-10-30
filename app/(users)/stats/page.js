import { GetDonePayouts } from "@/lib/PayoutActions";

const Stats = async () => {
  const payouts = await GetDonePayouts();
  console.log(payouts);

  return (
    <div className="flex flex-col gap-4 p-8 w-full">
      <div className="flex flex-col gap-2">
        <div className="w-full text-sm p-2 text-gray-500">Most Recent Payouts</div>
        <div className="flex gap-4 flex-wrap">
          {payouts &&
            payouts.map((payout) => (
              <div className="flex gap-2 border border-gray-900 px-4 py-2">
                <div>
                  {payout.user.firstName} {payout.user.lastName}
                </div>
                <div>${payout.payoutAmount}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
