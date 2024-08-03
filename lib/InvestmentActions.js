"use server";
import dbConnect from "@/dbConnect";
import Investment from "@/models/Investment";
import { revalidatePath } from "next/cache";

export const CreateInvestment = async (userId, accountId, amount, interest) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const newInvestment = new Investment({
      user: userId,
      account: accountId,
      amount: amount,
      interest: interest,
    });
    await newInvestment.save();
    return { message: "Investment created successfully" };
  } catch (error) {
    console.error("Error creating investment. File: InvestmentActions - Function: CreateInvestment", error);
    return { error: true, message: error.message };
  }
};

export const GetActiveUserInvestments = async (userId) => {
  try {
    await dbConnect();
    const investments = await Investment.find({
      user: userId,
      active: true,
    }).populate("account");
    return investments;
  } catch (error) {
    console.error("Error getting user investments. File: InvestmentActions - Function: GetUserInvestments", error);
    return { error: true, message: error.message };
  }
};

export const CalculateInvestmentProfits = async (userId) => {
  try {
    await dbConnect(); // Ensure the database is connected

    // Fetch active investments for the user
    const activeInvestments = await GetActiveUserInvestments(userId);

    // Current date in milliseconds
    const now = new Date().getTime();

    // Calculate the total profits
    const totalProfits = activeInvestments.reduce((total, investment) => {
      const { amount, interest, createdAt, paidUntil } = investment;

      const createdAtMilliseconds = createdAt.getTime();
      const paidUntilMilliseconds = paidUntil.getTime();

      // Calculate the full amount the user should receive in 60 days
      const fullAmount = amount + (amount * interest) / 100;

      // Calculate the number of milliseconds in 60 days
      const millisecondsIn60Days = 60 * 24 * 60 * 60 * 1000;

      // Calculate the amount accrued per millisecond
      const ratePerMillisecond = fullAmount / millisecondsIn60Days;

      // Calculate how many payment milliseconds are remaining
      const elapsedMilliseconds = paidUntilMilliseconds - createdAtMilliseconds;
      const payableMilliseconds = Math.max(millisecondsIn60Days - elapsedMilliseconds, 0);

      // Calculate milliseconds from the last payment until now
      const millisecondsFromLastPaymentUntilNow = Math.max(now - paidUntilMilliseconds, 0);

      // Determine the effective elapsed time within the 60-day limit
      const correctPayablePeriod = Math.min(payableMilliseconds, millisecondsFromLastPaymentUntilNow);

      // Calculate the profits based on the correct payable period
      const profits = ratePerMillisecond * correctPayablePeriod;

      return total + profits;
    }, 0);

    return totalProfits;
  } catch (error) {
    console.error("Error calculating investment profits. File: InvestmentActions - Function: CalculateInvestmentProfits", error);
    return { error: true, message: error.message };
  }
};
