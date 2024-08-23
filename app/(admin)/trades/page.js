import { GetTradesByDay } from "@/lib/TradeActions";
import { notFound } from "next/navigation";

const Trades = async ({ searchParams }) => {
  const day = searchParams.day;
  const month = searchParams.month;
  const year = searchParams.year;

  if (!day || !month || !year) notFound();

  const trades = await GetTradesByDay(day, month, year);

  if (!trades || trades.length === 0) {
    return <div className="flex justify-center p-4 font-bold">No trades found for the selected date.</div>;
  }

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
  console.log(arrayOfArrays);
  return (
    <div className="w-full">
      <h1 className="flex justify-center p-4 font-semibold text-lg">
        Trades for {day}/{month}/{year}
      </h1>
      {arrayOfArrays.map((tradesArray, index) => (
        <div key={index} className="border border-gray-800 flex flex-col gap-4 p-4">
          <div className="font-bold text-2xl">{tradesArray[0].trade.pair}</div>
          <div className="flex gap-4">
            {tradesArray.map((trade) => {
              let borderColor = "border-gray-800";
              if (trade.status === "Close") {
                borderColor = trade.trade.closeBalance >= trade.trade.openBalance ? "border-green-500" : "border-red-500";
              }

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
                    <div className="">{trade.trade.lots}</div>
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
