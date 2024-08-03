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
    const openTrades = await Trade.find({
      status: "open",
      "metadata.companyId": companyId,
      user: { $in: [accountUserId, relatedUserId] },
    });
    return openTrades;
  } catch (error) {
    throw new Error("Failed to fetch open trades for user and related user");
  }
};
