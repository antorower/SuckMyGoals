import { GetDonePayouts } from "@/lib/PayoutActions";

const Stats = async () => {
  const payouts = await GetDonePayouts();

  // Ομαδοποίηση και υπολογισμός συνολικών κερδών ανά χρήστη
  const userEarnings = payouts.reduce((acc, payout) => {
    const userId = payout.user._id;
    const userName = `${payout.user.firstName} ${payout.user.lastName}`;

    if (!acc[userId]) {
      acc[userId] = { name: userName, totalEarnings: 0 };
    }
    acc[userId].totalEarnings += payout.payoutAmount;

    return acc;
  }, {});

  // Μετατροπή σε πίνακα, ταξινόμηση και επιλογή των τριών πρώτων
  const topEarners = Object.values(userEarnings)
    .sort((a, b) => b.totalEarnings - a.totalEarnings)
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-4 p-8 w-full">
      <div className="flex flex-col gap-2 mt-8">
        <div className="w-full text-sm p-2 text-gray-500">Top Earners (MVP)</div>
        <div className="flex gap-4 flex-wrap">
          {topEarners.map((earner, index) => (
            <div key={index} className={`flex gap-2 border border-gray-900 px-4 py-2 ${index === 0 ? "text-amber-500" : null} ${index === 1 ? "text-slate-300" : null} ${index === 2 ? "text-stone-300" : null}`}>
              <div>{earner.name}</div>
              <div>${(earner.totalEarnings * 0.15).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full text-sm p-2 text-gray-500">Most Recent Payouts</div>
        <div className="flex gap-4 flex-wrap">
          {payouts &&
            payouts.map((payout) => (
              <div key={payout._id} className="flex gap-2 border border-gray-900 px-4 py-2">
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
