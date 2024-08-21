"use server";
import dbConnect from "@/dbConnect";
import User from "@/models/User";
import Account from "@/models/Account";
import Trade from "@/models/Trade";
import { revalidatePath } from "next/cache";
import { GetAccountById } from "./AccountActions";
import { GetRelatedCapitals } from "./AppData";

export const GetTeamOpenTrades = async (accountUserId, relatedUserId, company) => {
  try {
    const trades = await Trade.find({
      status: "Open",
      company: company,
      user: { $in: [accountUserId, relatedUserId] },
    });
    return trades;
  } catch (error) {
    console.error("Error gettings team open trades. File: TradeActions - Function: GetTeamOpenTrades", error);
    return { error: true, message: error.message };
  }
};

export const GetUnmatchedTrades = async (capital, accountUserId, relatedUserId, unusedPairs) => {
  const relatedCapitals = GetRelatedCapitals(capital);
  try {
    // Get the start and end of today's date
    const today = new Date();
    today.setHours(4, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const trades = await Trade.find({
      status: "Open",
      matched: false,
      "trade.pair": { $in: unusedPairs },
      capital: { $in: relatedCapitals },
      "trade.openTime": {
        $gte: today, // Greater than or equal to today's start
        $lt: tomorrow, // Less than tomorrow's start
      },
      user: { $nin: [accountUserId, relatedUserId] }, // Exclude trades by these users
    });
    if (!trades || trades.length === 0) return [];

    return trades;
  } catch (error) {
    console.error("Error gettings unmatched trades. File: TradeActions - Function: GetUnmatchedTrades", error);
    return { error: true, message: error.message };
  }
};

export const GetOpenTradeOfAccount = async (accountId) => {
  try {
    const trade = await Trade.findOne({ account: accountId, status: "Open" });
    return trade;
  } catch (error) {
    console.error("Error getting open trade of account. File: TradeActions - Function: GetOpenTradeOfAccount ", error);
    return { error: true, message: error.message };
  }
};

export const GetTradesOfAccount = async (accountId) => {
  try {
    const trades = await Trade.find({ account: accountId });
    return trades;
  } catch (error) {
    console.error("Error getting trades of account. File: TradeActions - Function: GetTradesOfAccount ", error);
    return { error: true, message: error.message };
  }
};

export const CloseTrade = async (tradeId, newBalance) => {
  try {
    const trade = await Trade.findById(tradeId).populate("account");
    if (!trade) throw new Error("Trade not found");
    trade.trade.closeBalance = newBalance;
    trade.trade.closeTime = new Date();
    trade.status = "Close";
    if (newBalance < trade.trade.openBalance) {
      trade.actualLossAmount = trade.trade.openBalance - newBalance;
      trade.actualLossPercentage = ((trade.trade.openBalance - newBalance) * 100) / trade.capital;
      const loseDifference = trade.actualLossPercentage - trade.normalLossPercentage;
      if (loseDifference > 0.25) {
        trade.reviewData.name = "Big loss detected";
        trade.reviewData.details = `Trade ${trade._id.toStriing()} lose ${loseDifference}% more than the expected`;
      }
    }
    await trade.account.updateBalance(newBalance);
    await trade.save();
    return { message: "Balance updated successfully" };
  } catch (error) {
    console.error("Error closing trade. File: TradeActions - Function: CloseTrade", error);
    return { error: true, message: error.message };
  }
};

export const HasAccountLostTradeToday = async (accountId) => {
  try {
    const today = new Date();
    today.setHours(4, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const trades = await Trade.find({
      account: accountId,
      status: "Close",
      "trade.openTime": {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (!trades || trades.length === 0) return false;
    for (let trade of trades) {
      if (trade.trade.openBalance > trade.trade.closeBalance) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error getting if account has lost trade today. File: TradeActions - Function: HasAccountLostTradeToday", error);
    return { error: true, message: error.message };
  }
};
