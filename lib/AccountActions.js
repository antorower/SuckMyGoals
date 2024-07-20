"use server";
import dbConnect from "@/dbConnect";
import Account from "@/models/Account";

export const CreateNewAccount = async (userId, companyId, capital, cost) => {
    try {
      await dbConnect();
      const account = new Account();
      await account.save();
      account.sendMoneyForPurchase(userId, companyId, capital, cost);
      return {error: false, message: "Account created successfully", accountId: account._id.toString()};
    } catch (error) {
      console.log("Error creating new account: ", error);
      return { error: true, message: "Internal error occured, please try again" };
    }
  };