import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { GetAllPairs } from "@/lib/PairActions";

const Pairs = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser || !clerkUser.publicMetadata.owner) notFound();

  const allPairs = [
    { pair: "EURUSD", rank: 1 },
    { pair: "USDJPY", rank: 2 },
    { pair: "GBPUSD", rank: 3 },
    { pair: "USDCHF", rank: 4 },
    { pair: "AUDUSD", rank: 5 },
    { pair: "USDCAD", rank: 6 },
    { pair: "NZDUSD", rank: 7 },
    { pair: "EURGBP", rank: 8 },
    { pair: "EURJPY", rank: 9 },
    { pair: "GBPJPY", rank: 10 },
    { pair: "EURCHF", rank: 11 },
    { pair: "GBPCHF", rank: 12 },
    { pair: "AUDJPY", rank: 13 },
    { pair: "AUDNZD", rank: 14 },
    { pair: "CADJPY", rank: 15 },
    { pair: "CHFJPY", rank: 16 },
    { pair: "EURAUD", rank: 17 },
    { pair: "EURCAD", rank: 18 },
    { pair: "EURNZD", rank: 19 },
    { pair: "GBPAUD", rank: 20 },
    { pair: "GBPCAD", rank: 21 },
    { pair: "GBPNZD", rank: 22 },
    { pair: "NZDJPY", rank: 23 },
    { pair: "NZDCAD", rank: 24 },
    { pair: "NZDCHF", rank: 25 },
    { pair: "AUDCAD", rank: 26 },
    { pair: "AUDCHF", rank: 27 },
    { pair: "CADCHF", rank: 28 },
  ];

  const fetchedPairs = await GetAllPairs();
  if (fetchedPairs?.error) notFound();

  // Create a set of fetched pair names for quick lookup
  const fetchedPairNames = new Set(fetchedPairs.map((pair) => pair.pair));

  return (
    <div className="flex gap-4 flex-wrap max-w-[600px] m-auto justify-center p-4">
      {allPairs.map((pair) => (
        <Link key={pair.pair} href={`/pair?pair=${pair.pair}`} className={`border border-gray-800 rounded px-3 py-1 ${!fetchedPairNames.has(pair.pair) ? "text-red-500" : ""}`}>
          {pair.pair}
        </Link>
      ))}
    </div>
  );
};

export default Pairs;
