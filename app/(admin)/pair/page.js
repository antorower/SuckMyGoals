import { currentUser } from "@clerk/nextjs/server";
import { GetPair } from "@/lib/PairActions";
import { notFound } from "next/navigation";
import UpdatePair from "@/components/Pair/UpdatePair";

const Pair = async ({ searchParams }) => {
  const clerkUser = await currentUser();
  if (!clerkUser || !clerkUser.publicMetadata.owner) notFound();

  const pair = searchParams.pair;
  if (!pair) notFound();

  const pairObj = await GetPair(pair);

  return <UpdatePair pair={pair} minimumPoints={pairObj?.minimumPoints} maximumPoints={pairObj?.maximumPoints} pointValue={pairObj?.pointValue} />;
};

export default Pair;
