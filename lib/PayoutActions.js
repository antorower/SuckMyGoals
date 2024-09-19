"use server";
import dbConnect from "@/dbConnect";
import Payout from "@/models/Payout";
import { revalidatePath } from "next/cache";

export const GetPendingPayouts = async () => {
  try {
    await dbConnect();
    const payouts = await Payout.find({ status: "Pending" }).populate("user").populate("account").populate("rejectedUserPayments.user");

    return payouts;
  } catch (error) {
    console.error("Error getting pending payouts. File: PayoutActions - Function: GetPendingPayouts ", error);
    return { error: true, message: error.message };
  }
};
