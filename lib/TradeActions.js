"use server";
import dbConnect from "@/dbConnect";
import User from "@/models/User";
import Account from "@/models/Account";
import Trade from "@/models/Trade";
import { revalidatePath } from "next/cache";
import { GetAccountById } from "./AccountActions";
import { GetRelatedCapitals } from "./AppData";

// Needed
export const GetTeamOpenTrades = async (accountUserId, relatedUserId, company) => {
  try {
    const trades = await Trade.find({
      status: "Open",
      company: company,
      user: { $in: [accountUserId, relatedUserId] },
    });
    return trades;
  } catch (error) {
    throw new Error("Failed to fetch open trades for user and related user");
  }
};

// Needed
export const GetUnmatchedTrades = async (capital, accountUserId, relatedUserId, unusedPairs) => {
  const relatedCapitals = GetRelatedCapitals(capital);
  try {
    // Get the start and end of today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set time to 00:00:00 for tomorrow

    const trades = await Trade.find({
      status: "Open",
      matched: false,
      "trade.pair": { $in: unusedPairs },
      capital: { $in: relatedCapitals },
      openTime: {
        $gte: today, // Greater than or equal to today's start
        $lt: tomorrow, // Less than tomorrow's start
      },
      user: { $nin: [accountUserId, relatedUserId] }, // Exclude trades by these users
    });
    if (!trades || trades.length === 0) return [];

    return trades;
  } catch (error) {
    throw new Error("Failed to fetch unmatched trades for the specified capital");
  }
};
