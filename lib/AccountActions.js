"use server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";
import Trade from "@/models/Trade";
import { revalidatePath } from "next/cache";
import * as Settings from "@/lib/AppData";
import { GetTeamOpenTrades } from "./TradeActions";
import { GetUnmatchedTrades } from "./TradeActions";
import { HasAccountLostTradeToday } from "./TradeActions";
import { GetTradesOfAccount } from "./TradeActions";

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
    revalidatePath("/", "layout");
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
    return account;
  } catch (error) {
    console.error("Error upgrading account. File: AccountActions - Function: GetAccountById ", error);
    return { error: true, message: error.message };
  }
};

export const GetAllAccountsLight = async () => {
  try {
    await dbConnect();
    const accounts = await Account.find({ status: { $in: ["Live", "NeedUpgrade", "WaitingPayout", "PayoutRequestDone", "MoneySended", "Review"] } }).select("company number _id phaseWeight balance status payoutRequestDate capital eventsTimestamp");
    return accounts;
  } catch (error) {
    console.error("Error getting all accounts. File: AccountActions - Function: GetAllAccountsLight ", error);
    return { error: true, message: error.message };
  }
};

export const GetWaitingPurchaseAccounts = async () => {
  try {
    await dbConnect();
    const accounts = await Account.find({ status: "WaitingPurchase" }).populate("user");
    return accounts;
  } catch (error) {
    console.error("Error getting all accounts. File: AccountActions - Function: GetAllAccountsLight ", error);
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

export const UpdatePayoutRequestDate = async (accountId, day, month) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");

    await account.updatePayoutRequestDate(day, month);
    return { message: "Payout request date updated successfully" };
  } catch (error) {
    console.error("Error set payout request date. File: AccountActions - Function: UpdatePayoutRequestDate", error);
    return { error: true, message: error.message };
  }
};

export const PayoutRequestDone = async (accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");

    await account.payoutRequestDone();
    return { message: "Account status updated successfully" };
  } catch (error) {
    console.error("Error updating account status. File: AccountActions - Function: PayoutRequestDone", error);
    return { error: true, message: error.message };
  }
};

export const DisableTrades = async (accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    // Βρίσκω το account
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");
    await account.disableTrades();
    return { message: "Trades disabled for this account" };
  } catch (error) {
    console.error("Error disabling trades. File: AccountActions - Function: DisableTrade", error);
    return { error: true, message: error.message };
  }
};

export const EnableTrades = async (accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    // Βρίσκω το account
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");
    await account.enableTrades();
    return { message: "Trades enabled for this account" };
  } catch (error) {
    console.error("Error enabling trades. File: AccountActions - Function: EnableTrade", error);
    return { error: true, message: error.message };
  }
};

export const OpenTrade = async (accountId, user) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    // Βρίσκω το account
    const account = await Account.findById(accountId).populate("user").populate("lastTrade");
    if (!account) throw new Error("Account not found");
    const tradesOfAccount = await GetTradesOfAccount(account._id.toString());

    if (account.tradesDisabled) throw new Error("Do not open trade on this account");

    // Ελέγχω το τελευταίο trade του account είναι ανοιχτό
    if (account.lastTrade && account.lastTrade?.status === "Open") throw new Error("You already have an open trade in our database");

    if (account.company === "The5ers") {
      // #SPECIALRULETHE5ERS
      // Στους the5ers δεν μπορούν τις πρώτες 2 trading μέρες να ανοίξουν δεύτερο trade
      if (tradesOfAccount.length < 3) {
        // Σημερινή ημερομηνία χωρίς την ώρα
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Έλεγχος αν υπάρχει κάποιο trade που άνοιξε σήμερα
        const hasTradeOpenedToday = tradesOfAccount.some((trade) => {
          const openTimeDate = new Date(trade.trade.openTime);
          openTimeDate.setHours(0, 0, 0, 0); // Αφαιρούμε την ώρα
          return openTimeDate.getTime() === today.getTime();
        });

        if (hasTradeOpenedToday) {
          throw new Error("You are not allowed to open a second trade on the same day during the first two trading days on the5ers accounts");
        }
      }
    }

    if (user !== "user_2kkBtP3cBeQx6lbecqNUm3CgNlP") {
      const hasAccountLostTradeToday = await HasAccountLostTradeToday(accountId);
      if (hasAccountLostTradeToday.error) throw new Error(error.message);
      if (hasAccountLostTradeToday) throw new Error("You have already lost a trade today");
    }

    // Δεδομένα του account που θα χρειαστούν
    const accountUserId = account.user._id.toString();
    const relatedUserId = account.user.relatedUser?.toString() || accountUserId;
    const company = account.company;

    // Τραβάω τα day settings
    const daySchedule = Settings.GetDaySchedule();
    if (!daySchedule || !daySchedule.schedule) throw new Error("Day settings not found");

    // Ελέγχω αν είναι active η μέρα
    if (user !== "user_2kkBtP3cBeQx6lbecqNUm3CgNlP") {
      if (!daySchedule.active) throw new Error("Opening trades is not permitted today");
      // Ελέγχω αν είναι σωστές οι ώρες
      const nowDate = new Date();
      const greeceTimeString = nowDate.toLocaleString("en-US", { timeZone: "Europe/Athens" });
      const greeceDate = new Date(greeceTimeString);
      const hour = greeceDate.getHours();

      if (user !== "user_2kkBtP3cBeQx6lbecqNUm3CgNlP") {
        if (hour < daySchedule.schedule.startingHour || hour >= daySchedule.schedule.endingHour) throw new Error(`You are not allowed to open a trade at this time. The allowed hours are from ${daySchedule.schedule.startingHour}:00 to ${daySchedule.schedule.endingHour}:00`);
      }
    }

    // Αποθηκεύω τα available pairs της ημέρας
    const dayPairs = daySchedule.schedule.pairs;
    if (!dayPairs || dayPairs.length === 0) throw new Error("Day does not contain pairs");

    // Παίρνω τα trades που έχει ανοιχτά η ομάδα με σκοπό να αφαιρέσω τα pairs από τα διαθέσιμα
    const teamOpenTrades = await GetTeamOpenTrades(accountUserId, relatedUserId, company);
    console.log("Team Trades: ", teamOpenTrades);
    // Από τα dayPairs αφαιρώ τα pairs τα οποία χρησιμοποιούνται σε trades που είναι ακόμα ανοιχτά
    const unusedPairs = dayPairs.filter((pair) => {
      return !teamOpenTrades.some((trade) => trade.trade.pair === pair);
    });
    console.log("Unused Pairs: ", unusedPairs);
    if (!unusedPairs || unusedPairs.length === 0) throw new Error("No trading pairs are available at the moment. Please close your open trades from yesterday and try again");
    console.log("Unused Pairs", unusedPairs);

    // Βρίσκω τα trades που δεν έχουν ζευγαρώσει, είναι στα relatedCapitals, δεν είναι του χρήστη ή του related account και παίζουν στα unusedPairs του χρήστη
    const unmatchedTrades = await GetUnmatchedTrades(account.capital, accountUserId, relatedUserId, unusedPairs);

    /*
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

    // Η μεταβλητή matchingTrade θα κρατάει το βέλτιστο δυνατό trade για να μπει αντίθετο... αν υπάρχει
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
    */

    let matchingTrade;
    if (unmatchedTrades && unmatchedTrades.length > 0) {
      const randomIndex = Math.floor(Math.random() * unmatchedTrades.length);
      matchingTrade = unmatchedTrades[randomIndex];
    }
    console.log("MTTTT", matchingTrade);

    if (matchingTrade) {
      const selectedPair = matchingTrade.trade.pair;
      const stopLossPoints = account.getStopLossPoints(selectedPair);
      const riskAmount = account.getStopLossAmount();
      let lots = account.getLots(selectedPair, stopLossPoints, riskAmount);
      const takeProfitAmount = account.getTakeProfit(selectedPair, stopLossPoints, lots);
      if (takeProfitAmount.lowTp) {
        lots = parseFloat((lots / 3).toFixed(2));
      }
      const pairObj = Settings.GetPairDetails(selectedPair);
      const companyObj = Settings.GetCompany(company);
      const newTrade = new Trade({});
      newTrade.user = account.user;
      newTrade.account = account._id;
      newTrade.company = account.company;
      newTrade.capital = account.capital;
      newTrade.status = "Open";
      newTrade.balanceCategory = account.metadata.balanceCategory;
      newTrade.normalLossAmount = parseInt((riskAmount + (pairObj.spread * lots + companyObj.commissionFactor * lots + Settings.Strategy.extraTakeProfitPoints * lots) * pairObj.pointValue).toFixed(0));
      newTrade.normalLossPercentage = parseFloat((((riskAmount + (pairObj.spread * lots + companyObj.commissionFactor * lots + Settings.Strategy.extraTakeProfitPoints * lots) * pairObj.pointValue) / account.capital) * 100).toFixed(2));
      newTrade.trade.openBalance = account.balance;
      newTrade.trade.pair = selectedPair;
      newTrade.trade.position = matchingTrade.trade.position === "Buy" ? "Sell" : "Buy";
      newTrade.trade.openTime = new Date();
      newTrade.trade.lots = lots;
      newTrade.trade.stopLoss = riskAmount;
      newTrade.trade.takeProfit = takeProfitAmount.amount;
      newTrade.matched = true;
      newTrade.matchingTime = new Date();
      newTrade.matchingTrade = matchingTrade._id;

      if (account.company === "The5ers" && account.phaseWeight !== 3) {
        // #SPECIALRULE
        // Αν έχουν μπεί λιγότερα από 3 trades τότε δίνει μικρό take profit για να συμπληρώσει 3 μέρες με profit > 0.5%
        if (tradesOfAccount.length < 3) {
          const min = account.phaseWeight === 1 ? Math.ceil(account.capital * 0.02) : Math.ceil(account.capital * 0.011); // Στρογγυλοποίηση προς τα πάνω
          const max = account.phaseWeight === 1 ? Math.floor(account.capital * 0.025) : Math.floor(account.capital * 0.015); // Στρογγυλοποίηση προς τα κάτω
          const reducedTakeProfit = Math.floor(Math.random() * (max - min + 1)) + min;
          const reducedLots = account.phaseWeight === 1 ? parseFloat((lots * 0.9).toFixed(2)) : parseFloat((lots * 0.7).toFixed(2));
          newTrade.trade.takeProfit = reducedTakeProfit;
          newTrade.trade.lots = reducedLots;
          newTrade.normalLossAmount = parseInt((riskAmount + (pairObj.spread * reducedLots + companyObj.commissionFactor * reducedLots + Settings.Strategy.extraTakeProfitPoints * reducedLots) * pairObj.pointValue).toFixed(0));
          newTrade.normalLossPercentage = parseFloat((((riskAmount + (pairObj.spread * reducedLots + companyObj.commissionFactor * reducedLots + Settings.Strategy.extraTakeProfitPoints * reducedLots) * pairObj.pointValue) / account.capital) * 100).toFixed(2));
        }
      }

      await newTrade.save();

      if (!takeProfitAmount.lowTp) {
        matchingTrade.matched = true;
        matchingTrade.matchingTime = new Date();
        matchingTrade.matchingTrade = newTrade._id;
        await matchingTrade.save();
      }

      account.user.lastTradeOpened = new Date();
      await account.user.save();
      account.lastTrade = newTrade._id;
      account.addActivity("A new trade has opened", `A new ${newTrade.trade.position} position opened on ${newTrade.trade.pair} with take profit ${newTrade.trade.takeProfit} and stop loss ${newTrade.trade.stopLoss}`);
      account.note = "There is an open trade in this account";
      if (!account.eventsTimestamp?.firstTradeDate) {
        account.eventsTimestamp.firstTradeDate = new Date();
      }
      await account.save();
      return { message: "Your trade is ready!" };
    } else {
      console.log("Matching trade not found");
      const selectedPair = unusedPairs[Math.floor(Math.random() * unusedPairs.length)];
      const stopLossPoints = account.getStopLossPoints(selectedPair);
      const riskAmount = account.getStopLossAmount();
      const lots = account.getLots(selectedPair, stopLossPoints, riskAmount);
      const takeProfitAmount = account.getTakeProfit(selectedPair, stopLossPoints, lots);
      console.log("Let's see");
      if (takeProfitAmount.lowTp) {
        console.log("OLD LOTS", lots);
        lots = parseFloat((lots / 3).toFixed(2));
        console.log("NEW LOTS", lots);
      }
      console.log("It ends");
      const pairObj = Settings.GetPairDetails(selectedPair);
      const companyObj = Settings.GetCompany(company);
      const newTrade = new Trade({});
      newTrade.user = account.user;
      newTrade.account = account._id;
      newTrade.company = account.company;
      newTrade.capital = account.capital;
      newTrade.matched = false;
      newTrade.status = "Open";
      newTrade.balanceCategory = account.metadata.balanceCategory;
      newTrade.normalLossAmount = parseInt((riskAmount + pairObj.spread * lots + companyObj.commissionFactor * lots + Settings.Strategy.extraTakeProfitPoints * lots).toFixed(0));
      newTrade.normalLossPercentage = parseFloat((((riskAmount + pairObj.spread * lots + companyObj.commissionFactor * lots + Settings.Strategy.extraTakeProfitPoints * lots) / account.capital) * 100).toFixed(2));
      newTrade.trade.openBalance = account.balance;
      newTrade.trade.pair = selectedPair;
      newTrade.trade.position = Math.random() > 0.5 ? "Buy" : "Sell";
      newTrade.trade.openTime = new Date();
      newTrade.trade.lots = lots;
      newTrade.trade.stopLoss = riskAmount;
      newTrade.trade.takeProfit = takeProfitAmount;

      if (account.company === "The5ers") {
        // #SPECIALRULETHE5ERS
        // Αν έχουν μπεί λιγότερα από 3 trades τότε δίνει μικρό take profit για να συμπληρώσει 3 μέρες με profit > 0.5%
        if (tradesOfAccount.length < 3) {
          const min = account.phaseWeight === 1 ? Math.ceil(account.capital * 0.02) : Math.ceil(account.capital * 0.011); // Στρογγυλοποίηση προς τα πάνω
          const max = account.phaseWeight === 1 ? Math.floor(account.capital * 0.025) : Math.floor(account.capital * 0.015); // Στρογγυλοποίηση προς τα κάτω
          const reducedTakeProfit = Math.floor(Math.random() * (max - min + 1)) + min;
          const reducedLots = account.phaseWeight === 1 ? parseFloat((lots * 0.9).toFixed(2)) : parseFloat((lots * 0.7).toFixed(2));
          newTrade.trade.takeProfit = reducedTakeProfit;
          newTrade.trade.lots = reducedLots;
          newTrade.normalLossAmount = parseInt((riskAmount + (pairObj.spread * reducedLots + companyObj.commissionFactor * reducedLots + Settings.Strategy.extraTakeProfitPoints * reducedLots) * pairObj.pointValue).toFixed(0));
          newTrade.normalLossPercentage = parseFloat((((riskAmount + (pairObj.spread * reducedLots + companyObj.commissionFactor * reducedLots + Settings.Strategy.extraTakeProfitPoints * reducedLots) * pairObj.pointValue) / account.capital) * 100).toFixed(2));
        }
      }

      await newTrade.save();

      account.user.lastTradeOpened = new Date();
      await account.user.save();
      account.lastTrade = newTrade._id;
      account.addActivity("A new trade has opened", `A new ${newTrade.trade.position} position opened on ${newTrade.trade.pair} with take profit ${newTrade.trade.takeProfit} and stop loss ${newTrade.trade.stopLoss}`);
      account.note = "There is an open trade in this account";
      if (!account.eventsTimestamp?.firstTradeDate) {
        account.eventsTimestamp.firstTradeDate = new Date();
      }
      await account.save();

      return { message: "Your trade is ready!" };
    }
  } catch (error) {
    console.error("Error openning a trade. File: AccountActions - Function: OpenTrade ", error);
    return { error: true, message: error.message };
  }
};

export const MoneySended = async (accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");

    await account.moneySended();
    return { message: "Account status updated successfully" };
  } catch (error) {
    console.error("Error updating account status. File: AccountActions - Function: MoneySended", error);
    return { error: true, message: error.message };
  }
};

export const ReviewFinished = async (accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const account = await Account.findById(accountId).populate("user");
    if (!account) throw new Error("Account not found");

    await account.user.removeAccount(account._id.toString());
    await Account.findByIdAndDelete(accountId);

    return { message: "Account lost successfully" };
  } catch (error) {
    console.error("Error finish review. File: AccountActions - Function: ReviewFinished", error);
    return { error: true, message: error.message };
  }
};
