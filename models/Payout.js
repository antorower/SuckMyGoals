import mongoose from "mongoose";
import User from "./User";
import Account from "./Account";
import { Payments } from "@/lib/AppData";

const PayoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    accountProfit: Number,
    payoutAmount: Number,
    userProfit: Number,
    leadersProfit: Number,
    netProfit: Number,
    status: {
      type: String,
      enum: ["Pending", "Accepted"],
    },
    acceptedDate: Date,
  },
  { timestamps: true }
);

PayoutSchema.methods.createNewPayout = async function (userId, accountId, payoutAmount) {
  this.user = userId;
  this.account = accountId;
  await this.save();

  await this.populate("user").populate("account");

  const beneficiaries = this.user.beneficiaries || [];
  const leadersSplit = beneficiaries.reduce((total, beneficiary) => {
    return total + beneficiary.percentage;
  }, 0);

  this.accountProfit = this.account.balance - this.account.capital;
  this.payoutAmount = payoutAmount;
  this.userProfit = payoutAmount * Payments.userSplit;
  this.leadersProfit = payoutAmount * leadersSplit;
  this.netProfit = payoutAmount - payoutAmount * Payments.userSplit - payoutAmount * leadersSplit;
  this.status = "Pending";
  await this.save();
  return;
};

PayoutSchema.methods.acceptPayout = async function () {
  await this.populate("account");
  await this.account.resetAfterPayoutSended();
  this.status = "Accepted";
  this.acceptedDate = new Date();
  await this.save();
  return;
};

export default mongoose.models.Payout || mongoose.model("Payout", PayoutSchema);
