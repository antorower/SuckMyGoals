"use server";
import dbConnect from "@/dbConnect";
import User from "@/models/User";
import Company from "@/models/Company";
import Account from "@/models/Account";
import Trade from "@/models/Trade";
import { revalidatePath } from "next/cache";
import { GetDaySettings } from "./SettingsActions";
import { GetAccountById } from "./AccountActions";

export const OpenTrade = async (accountId) => {
  // account should populate the company
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    // Παίρνω τα settings της ημέρας
    console.log(GetDay());

    const daySettings = await GetDaySettings(GetDay());
    if (!daySettings || !daySettings.schedule) throw new Error("Day settings not found while opening a trade");

    // Ελέγχω αν είναι active η ημέρα
    if (!daySettings.active) throw new Error("We're not placing trades today");

    // Ελέγχω αν είναι σωστές οι ώρες
    const nowDate = new Date();
    const hour = nowDate.getHours();
    if (hour < daySettings.schedule.startingHour || hour >= daySettings.schedule.endingHour) throw new Error(`You are not allowed to open a trade at this time. The allowed hours are from ${daySettings.schedule.startingHour}:00 to ${daySettings.schedule.endingHour}:00`);

    // Αποθηκεύω τα pairs της ημέρας
    const dayPairs = daySettings?.schedule?.pairs;
    if (!dayPairs || dayPairs.length === 0) throw new Error("Day does not contain pairs");

    // Το ολοκληρωμένο Object του account μαζί με το user object και company object
    const account = await GetAccountById(accountId);

    // Δεδομένα του account που θα χρειαστούν
    const accountUserId = account.user._id.toString();
    const relatedUserId = account.user.relatedUser._id.toString();
    const companyId = account.company._id.toString();

    // Τραβάω τα ανοιχτά trades του user και του related user
    const openTrades = await GetOpenTrades(accountUserId, relatedUserId, companyId);

    // Από τα dayPairs αφαιρώ τα pairs τα οποία χρησιμοποιούνται σε trades που είναι ακόμα ανοιχτά
    const unusedPairs = dayPairs.filter((pair) => {
      return !openTrades.some((trade) => trade.pair === pair);
    });
    if (!unusedPairs || unusedPairs.length === 0) throw new Error("No trading pairs are available at the moment. Please close your open trades from yesterday and try again");

    // Τα trades που δεν έχουν κάνει match με άλλο trade
    const unmatchedTrades = await GetUnmatchedTrades(account.capital, accountUserId, relatedUserId);

    const sameCategory = unmatchedTrades.filter((trade) => trade.metadata.category === account.category);
    const similarCategory = unmatchedTrades.filter((trade) => {
      return trade.metadata.category === account.category - 1 || trade.metadata.category === account.category + 1;
    });
    const differentCompanySameCategory = sameCategory.filter((trade) => trade.metadata.companyId !== account.company._id.toString());
    const differentCompanyDifferentCategory = similarCategory.filter((trade) => trade.metadata.companyId !== account.company._id.toString());
    const sameCompanySameCategory = sameCategory.filter((trade) => trade.metadata.companyId === account.company._id.toString());
    const sameCompanyDifferentCategory = similarCategory.filter((trade) => trade.metadata.companyId === account.company._id.toString());

    if (differentCompanySameCategory.length > 0) {
      differentCompanySameCategory.sort((a, b) => new Date(b.openDate) - new Date(a.openDate));
    }

    // Sort differentCompanyDifferentCategory by openDate, most recent first
    if (differentCompanyDifferentCategory.length > 0) {
      differentCompanyDifferentCategory.sort((a, b) => new Date(b.openDate) - new Date(a.openDate));
    }

    // Sort sameCompanySameCategory by openDate, most recent last
    if (sameCompanySameCategory.length > 0) {
      sameCompanySameCategory.sort((a, b) => new Date(a.openDate) - new Date(b.openDate));
    }

    // Sort sameCompanyDifferentCategory by openDate, most recent last
    if (sameCompanyDifferentCategory.length > 0) {
      sameCompanyDifferentCategory.sort((a, b) => new Date(a.openDate) - new Date(b.openDate));
    }

    return;
  } catch (error) {
    console.error("Error opening a trade. File: TradeActions - Function: OpenTrade", error);
    return { error: true, message: error.message };
  }
};

const GetDay = () => {
  const currentDate = new Date();
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const day = daysOfWeek[currentDate.getDay()];
  return "monday"; // <-- Remove this line
  return day;
};

const GetOpenTrades = async (accountUserId, relatedUserId, companyId) => {
  try {
    const trades = await Trade.find({
      status: "open",
      "metadata.companyId": companyId,
      user: { $in: [accountUserId, relatedUserId] },
    });
    return trades;
  } catch (error) {
    throw new Error("Failed to fetch open trades for user and related user");
  }
};

const GetUnmatchedTrades = async (capital, accountUserId, relatedUserId) => {
  try {
    // Get the start and end of today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set time to 00:00:00 for tomorrow

    const trades = await Trade.find({
      status: "open",
      matched: false,
      "metadata.relatedCapitals": { $in: [capital] },
      openTime: {
        $gte: today, // Greater than or equal to today's start
        $lt: tomorrow, // Less than tomorrow's start
      },
      user: { $nin: [accountUserId, relatedUserId] }, // Exclude trades by these users
    });

    return trades;
  } catch (error) {
    throw new Error("Failed to fetch unmatched trades for the specified capital");
  }
};

const ExecuteOppositeTrade = async (account, pair, position) => {
  try {
    const newTrade = new Trade({
      user: account.user._id,
      account: account._id,
      openBalance: account.balance,
      pair: pair,
      lots: 0, //find
      position: position,
      status: "Open",
      stopLoss: 0, //find
      takeProfit: 0, //find
      matched: true,
      openTime: new Date(),
      matchTime: new Date(),
      metadata: {
        category: account.category,
        relatedCapitals: account.relatedCapitals,
        companyId: account.company._id.toString(),
        companyName: account.company.name,
        order: 2,
      },
    });
  } catch (error) {
    throw new Error("Failed to fetch unmatched trades for the specified capital");
  }
};
