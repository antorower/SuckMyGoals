"use server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";
import Trade from "@/models/Trade";
import { revalidatePath } from "next/cache";
import * as Settings from "@/lib/AppData";
import { GetTeamOpenTrades } from "./TradeActions";
import { GetUnmatchedTrades } from "./TradeActions";

export const AccountInitialization = async (userId, companyName, capital) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const newAccount = new Account();
    await newAccount.accountInitialization(userId, companyName, capital);
    return { message: "New account created successfully" };
  } catch (error) {
    console.error("Error creating new account. File: AccountActions - Function: AccountInitialization", error);
    return { error: true, message: error.message };
  }
};

export const RegisterAccountNumber = async (accountId, accountNumber) => {
  try {
    await dbConnect();
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");
    await account.accountPurchased(accountNumber);
    return { message: "Account number saved successfully" };
  } catch (error) {
    console.error("Error creating new account. File: AccountActions - Function: AccountInitialization", error);
    return { error: true, message: error.message };
  }
};

export const GetAccountById = async (accountId) => {
  try {
    await dbConnect();
    const account = await Account.findById(accountId).populate("user").populate("lastTrade");
    if (!account) throw new Error("Account not found");
    return account;
  } catch (error) {
    console.error("Error upgrading account. File: AccountActions - Function: GetAccountById ", error);
    return { error: true, message: error.message };
  }
};

export const UpgradeAccount = async (oldAccountId, newAccountNumber) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const account = await Account.findById(oldAccountId);
    if (!account) throw new Error("Account not found");

    const newAccount = new Account();
    await newAccount.createUpgradedAccount(account, newAccountNumber);
    await account.upgradeAccount(newAccount._id);
    return { message: "Account upgraded successfully" };
  } catch (error) {
    console.error("Error upgrading account. File: AccountActions - Function: UpgradeAccount ", error);
    return { error: true, message: error.message };
  }
};

export const OpenTrade = async (accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    // Βρίσκω το account
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");

    // Δεδομένα του account που θα χρειαστούν
    const accountUserId = account.user;
    const relatedUserId = account.user;
    const company = account.company;

    // Τραβάω τα day settings
    const daySchedule = Settings.GetDaySchedule();
    if (!daySchedule || !daySchedule.schedule) throw new Error("Day settings not found");
    // Ελέγχω αν είναι active η μέρα
    if (!daySchedule.active) throw new Error("Opening trades is not permitted today");
    // Ελέγχω αν είναι σωστές οι ώρες
    const nowDate = new Date();
    const greeceTimeString = nowDate.toLocaleString("en-US", { timeZone: "Europe/Athens" });
    const greeceDate = new Date(greeceTimeString);
    const hour = greeceDate.getHours();
    if (hour < daySchedule.schedule.startingHour || hour >= daySchedule.schedule.endingHour) {
      throw new Error(`You are not allowed to open a trade at this time. The allowed hours are from ${daySchedule.schedule.startingHour}:00 to ${daySchedule.schedule.endingHour}:00`);
    }
    // Αποθηκεύω τα available pairs της ημέρας
    const dayPairs = daySchedule.schedule.pairs;
    if (!dayPairs || dayPairs.length === 0) throw new Error("Day does not contain pairs");

    // Παίρνω τα trades που έχει ανοιχτά η ομάδα με σκοπό να αφαιρέσω τα pairs από τα διαθέσιμα
    const teamOpenTrades = await GetTeamOpenTrades(accountUserId, relatedUserId, company);

    // Από τα dayPairs αφαιρώ τα pairs τα οποία χρησιμοποιούνται σε trades που είναι ακόμα ανοιχτά
    const unusedPairs = dayPairs.filter((pair) => {
      return !teamOpenTrades.some((trade) => trade.pair === pair);
    });
    if (!unusedPairs || unusedPairs.length === 0) throw new Error("No trading pairs are available at the moment. Please close your open trades from yesterday and try again");

    // Βρίσκω τα trades που δεν έχουν ζευγαρώσει, είναι στα relatedCapitals, δεν είναι του χρήστη ή του related account και παίζουν στα unusedPairs του χρήστη
    const unmatchedTrades = await GetUnmatchedTrades(account.capital, accountUserId, relatedUserId, unusedPairs);

    // Φτιάχνω κατηγορίες
    const sameCategory = unmatchedTrades.filter((trade) => trade.balanceCategory === account.metadata.balanceCategory);
    const similarCategory = unmatchedTrades.filter((trade) => {
      return trade.balanceCategory === account.metadata.balanceCategory - 1 || trade.balanceCategory === account.metadata.balanceCategory + 1;
    });
    const differentCompanySameCategory = sameCategory.filter((trade) => trade.company !== account.company);
    const differentCompanyDifferentCategory = similarCategory.filter((trade) => trade.company !== account.company);
    const sameCompanySameCategory = sameCategory.filter((trade) => trade.company === account.company);
    const sameCompanyDifferentCategory = similarCategory.filter((trade) => trade.company === account.company);

    // Κάνω sort, most recent first
    if (differentCompanySameCategory.length > 0) differentCompanySameCategory.sort((a, b) => new Date(b.openDate) - new Date(a.openDate));
    if (differentCompanyDifferentCategory.length > 0) differentCompanyDifferentCategory.sort((a, b) => new Date(b.openDate) - new Date(a.openDate));
    if (sameCompanySameCategory.length > 0) sameCompanySameCategory.sort((a, b) => new Date(a.openDate) - new Date(b.openDate));
    if (sameCompanyDifferentCategory.length > 0) sameCompanyDifferentCategory.sort((a, b) => new Date(a.openDate) - new Date(b.openDate));

    let matchingTrade;
    if (differentCompanySameCategory && differentCompanySameCategory.length > 0) {
      matchingTrade = differentCompanySameCategory[0];
    } else if (differentCompanyDifferentCategory && differentCompanyDifferentCategory.length > 0) {
      matchingTrade = differentCompanyDifferentCategory[0];
    } else if (sameCompanySameCategory && sameCompanySameCategory.length > 0) {
      matchingTrade = sameCompanySameCategory[0];
    } else if (sameCompanyDifferentCategory && sameCompanyDifferentCategory.length > 0) {
      matchingTrade = sameCompanyDifferentCategory[0];
    }

    if (matchingTrade) {
      const stopLossPoints = account.getStopLossPoints(matchingTrade.trader.pair);
      const riskAmount = account.getStopLossAmount();
      const lots = account.getLots(matchingTrade.trade.pair, stopLossPoints, riskAmount);
      const takeProfitPoints = account.getTakeProfit(matchingTrade.trade.pair, stopLossPoints, lots);

      const newTrade = new Trade({});
      newTrade.user = account.user;
      newTrade.account = account._id;
      newTrade.company = account.company;
      newTrade.capital = account.capital;
      newTrade.matched = true;
      newTrade.matchingTime = new Date();
      newTrade.status = "Open";
      newTrade.balanceCategory = account.metadata.balanceCategory;
      newTrade.normalLossAmount = parseInt((riskAmount + pairObj.spread * lots + company.commissionFactor * lots * Settings.Strategy.extraTakeProfitPoints * lots).toFixed(0));
      newTrade.normalLossPercentage = parseFloat((((riskAmount + pairObj.spread * lots + company.commissionFactor * lots * Settings.Strategy.extraTakeProfitPoints * lots) / account.capital) * 100).toFixed(2));

      newTrade.trade.openBalance = account.balance;
      newTrade.trade.pair = matchingTrade.trader.pair;
      newTrade.trade.position = matchingTrade.trade.position === "Buy" ? "Sell" : "Buy";
      newTrade.trade.openTime = new Date();
      newTrade.trade.lots = lots;
      newTrade.trade.stopLoss = riskAmount;
      newTrade.trade.takeProfit = takeProfitPoints;
      await newTrade.save();
      account.lastTrade = newTrade._id;
      account.addActivity("A new trade has opened", `A new ${newTrade.trade.position} position opened on ${newTrade.trade.pair} with take profit ${newTrade.trade.takeProfit} and stop loss ${newTrade.trade.stopLoss}`);
      account.note = "There is an open trade in this account";
      await account.save();
    } else {
      const selectedPair = Math.floor(Math.random() * unusedPairs.arr.length);
      const stopLossPoints = account.getStopLossPoints(selectedPair);
      const riskAmount = account.getStopLossAmount();
      const lots = account.getLots(selectedPair, stopLossPoints, riskAmount);
      const takeProfitPoints = account.getTakeProfit(selectedPair, stopLossPoints, lots);

      const newTrade = new Trade({});
      newTrade.user = account.user;
      newTrade.account = account._id;
      newTrade.company = account.company;
      newTrade.capital = account.capital;
      newTrade.matched = false;
      newTrade.status = "Open";
      newTrade.balanceCategory = account.metadata.balanceCategory;
      newTrade.normalLossAmount = parseInt((riskAmount + pairObj.spread * lots + company.commissionFactor * lots * Settings.Strategy.extraTakeProfitPoints * lots).toFixed(0));
      newTrade.normalLossPercentage = parseFloat((((riskAmount + pairObj.spread * lots + company.commissionFactor * lots * Settings.Strategy.extraTakeProfitPoints * lots) / account.capital) * 100).toFixed(2));

      newTrade.trade.openBalance = account.balance;
      newTrade.trade.pair = selectedPair;
      newTrade.trade.position = Math.random() > 0.5 ? "Buy" : "Sell";
      newTrade.trade.openTime = new Date();
      newTrade.trade.lots = lots;
      newTrade.trade.stopLoss = riskAmount;
      newTrade.trade.takeProfit = takeProfitPoints;
      await newTrade.save();
      account.lastTrade = newTrade._id;
      account.addActivity("A new trade has opened", `A new ${newTrade.trade.position} position opened on ${newTrade.trade.pair} with take profit ${newTrade.trade.takeProfit} and stop loss ${newTrade.trade.stopLoss}`);
      account.note = "There is an open trade in this account";
      await account.save();
    }
    return { message: `Good` };

    const newAccount = new Account();
    await newAccount.createUpgradedAccount(account, newAccountNumber);
    await account.upgradeAccount(newAccount._id);
    return { message: "Account upgraded successfully" };
  } catch (error) {
    console.error("Error upgrading account. File: AccountActions - Function: OpenTrade ", error);
    return { error: true, message: error.message };
  }
};
