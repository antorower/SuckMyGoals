"use server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";
import { AddAccountToUser } from "./UserActions";
import { RemoveAccountFromUser } from "./UserActions";
import { revalidatePath } from "next/cache";

export const AccountInitialization = async (userId, companyName, capital) => {
  try {
    
    return { message: "New account created successfully", newAccountId: account._id.toString() };
  } catch (error) {
    console.error("Error creating new account. File: AccountActions - Function: CreateNewAccount", error);
    return { error: true, message: error.message };
  }
};

export const CreateInvestmentAccount = async (userId, companyId, capital, cost, number) => {
  try {
    const company = await Company.findById(companyId);
    if (!company) throw new Error("Company not found");
    let phase;
    if (company.numberOfPhases === 1) phase = 3;
    if (company.numberOfPhases === 2) phase = 2;
    if (company.numberOfPhases === 3) phase = 1;

    await dbConnect();
    revalidatePath("/", "layout");
    const account = new Account();
    await account.save();
    account.user = userId;
    account.number = number;
    account.company = companyId;
    account.capital = capital;
    account.phase = phase;
    account.balance = capital;
    account.cost = cost;
    account.status = "Live";
    account.purchaseDate = new Date();
    account.note = "Your new account is ready for trading.";
    await account.save();
    return { message: "New account created successfully", newAccountId: account._id.toString() };
  } catch (error) {
    console.error("Error creating new account. File: AccountActions - Function: CreateNewAccount", error);
    return { error: true, message: error.message };
  }
};

export const RegisterAccountNumber = async (accountId, accountNumber) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");
    account.number = accountNumber;
    account.purchaseDate = new Date();
    account.status = "Live";
    account.note = "Your new account is ready for trading.";
    await account.save();
    return { message: "Account number saved successfully" };
  } catch (error) {
    console.error("Error saving account number. File: AccountActions - Function: RegisterAccountNumber", error);
    return { error: true, message: error.message };
  }
};

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

export const GetAccountById = async (accountId) => {
  try {
    await dbConnect();
    const account = await Account.findById(accountId).populate("user company");
    if (!account) throw new Error("Account not found");
    return account;
  } catch (error) {
    console.error("Error upgrading account. File: AccountActions - Function: GetAccountById ", error);
    return { error: true, message: error.message };
  }
};
