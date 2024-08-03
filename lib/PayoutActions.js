"use server";
import dbConnect from "@/dbConnect";
import Payout from "@/models/Settings";
import { revalidatePath } from "next/cache";

export const GetAccountPayoutsAmount = async (accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const payouts = await Payout.find({ account: accountId });

    const totalAmount = payouts.reduce((sum, payout) => {
      return sum + payout.payoutAmount * 0.15;
    }, 0);

    return totalAmount;
  } catch (error) {
    console.error("Error gettings payouts by date. File: PayoutActions - Function: GetAccountPayoutsAmount", error);
    return { error: true, message: error.message };
  }
};
