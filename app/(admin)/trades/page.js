import { GetTradesByDay } from "@/lib/TradeActions";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const Trades = async ({ searchParams }) => {
  const clerkUser = await currentUser();

  if (!clerkUser || (!clerkUser.publicMetadata.owner && clerkUser.id !== "user_2kuThd9M40qCdvbHSbFY0sd8AlS")) notFound();

  const today = new Date();
  const day = searchParams.day || today.getDate();
  const month = searchParams.month || today.getMonth() + 1;
  const year = searchParams.year || today.getFullYear();

  const trades = await GetTradesByDay(day, month, year);

  if (!trades || trades.length === 0) {
    return <div className="flex justify-center p-4 font-bold">No trades found for the selected date.</div>;
  }

  let totalBalanceDifference = 0;

  trades.forEach((trade) => {
    if (trade.status === "Close" || trade.status === "Review") {
      if (trade.trade?.closeBalance && trade.trade?.openBalance) {
        const balanceDifference = trade.trade.closeBalance - trade.trade.openBalance;
        totalBalanceDifference += balanceDifference;
        console.log(balanceDifference);
      }
    }
  });

  // Group trades by their pair
  const groupedTrades = trades.reduce((acc, trade) => {
    const pair = trade.trade.pair;

    if (!acc[pair]) {
      acc[pair] = []; // Create a new array for this pair if it doesn't exist
    }

    acc[pair].push(trade); // Add the trade to the appropriate array
    return acc;
  }, {});

  // Convert the grouped trades object into an array of arrays
  const arrayOfArrays = Object.values(groupedTrades);

  return (
    <div className="w-full">
      <h1 className="flex justify-center p-4 font-semibold text-lg">
        <Link href="/user">Back</Link> | Trades for {day}/{month}/{year} | {parseInt(totalBalanceDifference)}$
      </h1>
      {arrayOfArrays.map((tradesArray, index) => (
        <div key={index} className="border border-gray-800 flex flex-col gap-4 p-4">
          <div className="font-bold text-2xl">{tradesArray[0].trade.pair}</div>
          <div className="flex flex-wrap gap-4">
            {tradesArray.map((trade) => {
              let borderColor = "border-gray-800";
              let tradeWin;
              if (trade.status === "Close") {
                borderColor = trade.trade.closeBalance >= trade.trade.openBalance ? "border-green-500" : "border-red-500";
                tradeWin = trade.trade.closeBalance >= trade.trade.openBalance;
              }
              const rrr = (trade.trade.takeProfit / trade.trade.stopLoss).toFixed(2);

              return (
                <div key={trade._id.toString()} className={`flex flex-col gap-2 border ${borderColor} px-3 py-3 rounded`}>
                  <div className="text-sm m-auto text-gray-400">
                    {trade.user.firstName} {trade.user.lastName}
                  </div>
                  <div className="flex gap-4 text-sm m-auto">
                    <div className="text-gray-400">{trade.account.number}</div>
                    <div>{trade.company}</div>
                    <div className="text-gray-400">{trade.capital}</div>
                  </div>
                  <div className="flex gap-4 m-auto">
                    <div className="">{trade.trade.pair}</div>
                    <div className={`${trade.trade.position === "Buy" ? "text-green-500" : "text-red-500"}`}>{trade.trade.position}</div>
                    <div className="text-gray-400">{trade.trade.lots}</div>
                  </div>
                  <div className="flex gap-4 m-auto">
                    <div className={`${tradeWin ? "text-green-500" : "text-gray-400"}`}>{trade.trade.takeProfit}</div>
                    <div className={`${tradeWin ? "text-gray-400" : "text-red-500"}`}>{trade.trade.stopLoss}</div>
                  </div>
                  <hr className="border-none h-[1px] bg-gray-800" />
                  <div className="flex flex-col gap-2 text-sm text-gray-400">
                    <div className="flex gap-4 justify-between">
                      <div>Open Balance:</div>
                      <div>{trade.trade.openBalance}</div>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <div>Close Balance:</div>
                      <div>{trade.trade?.closeBalance ? trade.trade.closeBalance : "-"}</div>
                    </div>
                  </div>
                  <hr className="border-none h-[1px] bg-gray-800" />
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <div>Risk/Reward Ratio:</div>
                      <div>{rrr}</div>
                    </div>
                    <div className={`flex justify-between ${trade.actualLossAmount > trade.normalLossAmount ? "text-red-300" : "text-gray-400"}`}>
                      <div>LsPr: {trade.normalLossAmount ? `$${trade.normalLossAmount}` : "-"} </div>
                      <div>AcLs: {trade.actualLossAmount ? `$${trade.actualLossAmount}` : "-"} </div>
                    </div>
                  </div>
                  <hr className="border-none h-[1px] bg-gray-800" />
                  <div className="flex flex-col gap-2 text-sm text-gray-400">
                    <div className="flex gap-4 justify-between">
                      <div>Open Time:</div>
                      <div>{new Date(trade.trade.openTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Athens" })}</div>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <div>Close Time:</div>
                      <div>{trade.trade?.closeTime ? new Date(trade.trade.closeTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Athens" }) : "-"}</div>
                    </div>
                  </div>
                  <hr className="border-none h-[1px] bg-gray-800" />
                  <div className="flex flex-col gap-2 text-sm text-gray-400">
                    <div className="flex justify-between gap-4">
                      <div>Matched:</div>
                      <div>{trade.matched ? "Yes" : "No"}</div>
                    </div>
                    {trade.matched && (
                      <div className="flex justify-between">
                        <div>{trade?.matchingTrade?.pair}</div>
                        <div>{trade?.matchingTrade?.position}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trades;
