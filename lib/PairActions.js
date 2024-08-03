"use server";
import dbConnect from "@/dbConnect";
import Pair from "@/models/Pair";
import { revalidatePath } from "next/cache";

export const GetAllPairs = async () => {
  try {
    await dbConnect();
    const pairs = await Pair.find().sort({ "spread.average": 1 });
    return pairs;
  } catch (error) {
    console.error("Error getting all pairs. File: PairActions - Function: GetAllPairs", error);
    return { error: true, message: error.message };
  }
};

export const GetAllPairsClient = async () => {
  try {
    await dbConnect();
    const pairs = await Pair.find().sort({ "spread.average": 1 });
    return JSON.stringify(pairs);
  } catch (error) {
    console.error("Error getting all pairs. File: PairActions - Function: GetAllPairs", error);
    return JSON.stringify({ error: true, message: error.message });
  }
};

export const GetPair = async (pair) => {
  try {
    await dbConnect();
    const pairObj = await Pair.findOne({ pair: pair });
    return pairObj;
  } catch (error) {
    console.error("Error getting pair. File: PairActions - Function: GetPair", error);
    return { error: true, message: error.message };
  }
};

export const GetPairsByVotes = async () => {
  try {
    await dbConnect();
    const pairs = await Pair.find({}).sort({ "spread.votes": 1 }).limit(3);
    return pairs;
  } catch (error) {
    console.error("Error getting pairs. File: PairActions - Function: GetTopPairsByVotes", error);
    return { error: true, message: error.message };
  }
};

export const UpdatePairData = async (pair, slowMinimumPoints, slowMaximumPoints, fastMinimumPoints, fastMaximumPoints, pointValue) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    let pairObj = await Pair.findOne({ pair: pair });
    if (!pairObj) {
      pairObj = new Pair({ pair: pair });
    }
    pairObj.slowMode.minimumPoints = slowMinimumPoints;
    pairObj.slowMode.maximumPoints = slowMaximumPoints;
    pairObj.fastMode.minimumPoints = fastMinimumPoints;
    pairObj.fastMode.maximumPoints = fastMaximumPoints;
    pairObj.pointValue = pointValue;
    await pairObj.save();
    return { message: `${pair} updated successfully` };
  } catch (error) {
    console.error("Error updating pair. File: PairActions - Function: UpdatePair", error);
    return { error: true, message: error.message };
  }
};

export const VotePair = async (pair, spread) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    let pairObj = await Pair.findOne({ pair: pair });
    if (!pairObj) throw new Error("Pair not found");

    pairObj.spread.votes += 1;
    pairObj.spread.sum = pairObj.spread.sum + spread;
    await pairObj.save();
    return { message: `We appreciate your help! ${pair} updated successfully` };
  } catch (error) {
    console.error("Error updating pair. File: PairActions - Function: VotePair", error);
    return { error: true, message: error.message };
  }
};
