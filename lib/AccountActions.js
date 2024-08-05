"use server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";
import { AddAccountToUser } from "./UserActions";
import { RemoveAccountFromUser } from "./UserActions";
import { revalidatePath } from "next/cache";

export const AccountInitialization = async (userId, companyName, capital) => {
  try {
    await dbConnect();
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
    const account = Account.findById(accountId);
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

//--------------------------

export const UpgradeAccount = async (oldAccountId, newAccountNumber) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const account = await Account.findById(oldAccountId);
    if (!account) throw new Error("Account not found");

    const newAccount = new Account({
      user: account.user,
      number: newAccountNumber,
      company: account.company,
      capital: account.capital,
      phase: account.phase + 1,
      balance: account.capital,
      status: "Live",
      previousAccount: account._id,
      note: "Your new account is ready for trading",
    });
    await newAccount.save();

    account.status = "UpgradeDone";
    account.note = `Account successfully upgraded to ${newAccountNumber}`;
    account.nextAccount = newAccount._id;
    account.upgradedDate = new Date();
    await account.save();

    const addResponse = await AddAccountToUser(account.user, newAccount._id);
    if (addResponse.error) throw new Error("New account not added to user");
    const removeResponse = await RemoveAccountFromUser(account.user, oldAccountId);
    if (removeResponse.error) throw new Error("Upgraded account did not removed from user");
    return { message: "Account upgraded successfully" };
  } catch (error) {
    console.error("Error upgrading account. File: AccountActions - Function: UpgradeAccount ", error);
    return { error: true, message: error.message };
  }
};
