import { GetTradesByDay } from "@/lib/TradeActions";

const Trades = async () => {
  const trades = await GetTradesByDay(22, 8, 2024);

  if (!trades || trades.length === 0) {
    return <div>No trades found for the selected date.</div>;
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

  return (
    <div>
      <h1>Trades for 22 August 2024</h1>
      {arrayOfArrays.map((tradesArray, index) => (
        <div key={index}>
          <h2>{tradesArray[0].trade.pair}</h2> {/* Display the pair name */}
          <ul>
            {tradesArray.map((trade) => (
              <li key={trade._id}>
                <p>Open Time: {new Date(trade.trade.openTime).toLocaleString()}</p>
                <p>Lots: {trade.trade.lots}</p>
                <p>Open Balance: {trade.trade.openBalance}</p>
                <p>Close Balance: {trade.trade.closeBalance}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Trades;
