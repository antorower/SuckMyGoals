"use server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";
import { revalidatePath } from "next/cache";

export const CreateNewAccount = async (userId, companyId, capital, cost) => {
  try {
    revalidatePath("/", "layout");
    await dbConnect();
    const account = new Account();
    await account.save();
    account.sendMoneyForPurchase(userId, companyId, capital, cost);
    return { error: false, message: "Account created successfully", accountId: account._id.toString() };
  } catch (error) {
    console.log("Error creating new account: ", error);
    return { error: true, message: "Internal error occured, please try again" };
  }
};

export const RegisterAccountNumber = async (accountId, accountNumber) => {
  try {
    revalidatePath("/", "layout");
    await dbConnect();
    const account = await Account.findById(accountId);
    console.log(account);
    if (!account) return { error: true, message: "Account not found" };
    await account.registerAccountNumber(accountNumber);
    return { error: false, message: "Account number saved successfully" };
  } catch (error) {
    console.log("Error registering account number: ", error);
    return { error: true, message: "Internal error occured, please try again" };
  }
};
