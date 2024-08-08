"use server";
import dbConnect from "@/dbConnect";
import Payout from "@/models/Settings";
import { revalidatePath } from "next/cache";

export const ExampleFunction = async (accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    return;
  } catch (error) {
    console.error("Error gettings payouts by date. File: PayoutActions - Function: ExampleFunction", error);
    return { error: true, message: error.message };
  }
};
