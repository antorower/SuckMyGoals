"use server";
import dbConnect from "@/dbConnect";
import Payout from "@/models/Payout";
import { revalidatePath } from "next/cache";

export const GetDonePayouts = async () => {
  try {
    await dbConnect();
    const payouts = await Payout.find({ status: "Accepted" }).populate("user").populate("account").limit(50).sort({ acceptedDate: -1 });
    return payouts;
  } catch (error) {
    console.error("Error getting accepted payouts. File: PayoutActions - Function: GetDonePayouts ", error);
    return { error: true, message: error.message };
  }
};

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

export const AcceptPayout = async (id) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const payout = await Payout.findById({ _id: id });
    await payout.acceptPayout();
    return { message: "Payout accepted" };
  } catch (error) {
    console.error("Error accept payout. File: PayoutActions - Function: GetPendingPayouts ", error);
    return { error: true, message: error.message };
  }
};
