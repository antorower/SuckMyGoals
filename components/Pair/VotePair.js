import { GetPairsByVotes } from "@/lib/PairActions";
import VoteForm from "./VoteForm";
import Link from "next/link";

const VotePair = async ({ userId, help }) => {
  const pairs = await GetPairsByVotes();
  if (!pairs || pairs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-4 max-w-[300px] m-auto">
      <div className="text-center text-sm text-blue-400">
        {help === "no" ? "Yes dude... you can! Don't be lazy! 😜" : "Can you help by reporting the spread for these pairs?"}
        {help !== "no" && (
          <span className="ml-2">
            <Link href={`/user?user=${userId}&vote=no`} className="hover:underline">
              No
            </Link>
          </span>
        )}
      </div>

      <div className="flex gap-2 justify-center">
        {pairs.map((pair) => (
          <VoteForm key={pair._id.toString() + Math.random() * 5} pair={pair.pair} />
        ))}
      </div>
    </div>
  );
};

export default VotePair;
