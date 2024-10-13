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
    await dbConnect();

    // Αν η εταιρία είναι "Funded Next" ή "Funded Next Stellar"
    const companyQuery = (company === "Funded Next" || company === "Funded Next Stellar") 
      ? { $in: ["Funded Next", "Funded Next Stellar"] } 
      : company;

    const trades = await Trade.find({
      status: "Open",
      company: companyQuery, // Χρησιμοποιεί το companyQuery
      user: { $in: [accountUserId, relatedUserId] },
    });
    
    return trades;
  } catch (error) {
    console.error("Error getting team open trades. File: TradeActions - Function: GetTeamOpenTrades", error);
    return { error: true, message: error.message };
  }
};


/*
export const GetTeamOpenTrades = async (accountUserId, relatedUserId, company) => {
  try {
    await dbConnect();

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
*/

export const GetUnmatchedTrades = async (capital, accountUserId, relatedUserId, unusedPairs) => {
  try {
    await dbConnect();

    const relatedCapitals = GetRelatedCapitals(capital);

    // Get the start and end of today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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

/*
      "trade.openTime": {
        $gte: today, // Greater than or equal to today's start
        $lt: tomorrow, // Less than tomorrow's start
      },
      */

export const GetOpenTradeOfAccount = async (accountId) => {
  try {
    await dbConnect();

    const trade = await Trade.findOne({ account: accountId, status: "Open" });
    return trade;
  } catch (error) {
    console.error("Error getting open trade of account. File: TradeActions - Function: GetOpenTradeOfAccount ", error);
    return { error: true, message: error.message };
  }
};

export const GetTradesOfAccount = async (accountId) => {
  try {
    await dbConnect();

    const trades = await Trade.find({ account: accountId });
    return trades;
  } catch (error) {
    console.error("Error getting trades of account. File: TradeActions - Function: GetTradesOfAccount ", error);
    return { error: true, message: error.message };
  }
};

export const CloseTrade = async (tradeId, newBalance) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

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
        trade.reviewData.details = `Trade ${trade._id.toString()} lose ${loseDifference}% more than the expected`;
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
    await dbConnect();

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

export const GetTradesByDay = async (day, month, year) => {
  try {
    await dbConnect();

    // Δημιουργία των χρονικών ορίων για το εύρος της ημέρας
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0); // Αρχή ημέρας
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59); // Τέλος ημέρας

    // Αναζήτηση των trades με βάση το openTime και ταξινόμηση κατά descending ώρα ανοίγματος
    const trades = await Trade.find({
      "trade.openTime": {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .sort({ "trade.openTime": -1 })
      .populate("user", "firstName lastName")
      .populate("matchingTrade")
      .populate("account", "number");

    return trades;
  } catch (error) {
    console.error("Error getting trades for the day. File: TradeActions - Function: GetTradesByDay", error);
    return { error: true, message: error.message };
  }
};
