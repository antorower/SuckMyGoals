import mongoose from "mongoose";
import User from "./User";

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
    accountBalance: Number,
    accountProfit: Number,
    payoutAmount: Number,
    userProfit: Number,
    refund: {
      type: Number,
      default: 0,
    },
    totalUserShare: Number,
    leadersProfit: Number,
    netProfit: Number,
    status: {
      type: String,
      enum: ["Pending", "Accepted"],
    },
    acceptedDate: Date,
    rejectedUserPayments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        profit: Number,
        reason: String,
      },
    ],
  },
  { timestamps: true }
);

PayoutSchema.methods.createNewPayout = async function (mongoId, accountId, accountBalance, payoutAmount, profitShare, refund, finalAmount) {
  this.user = mongoId;
  this.account = accountId;
  await this.save();

  await this.populate(["user", "account"]);

  const beneficiaries = this.user.beneficiaries || [];
  const leadersSplit = beneficiaries.reduce((total, beneficiary) => {
    return total + beneficiary.percentage;
  }, 0);

  this.accountBalance = accountBalance;
  this.accountProfit = accountBalance - this.account.capital;
  this.payoutAmount = payoutAmount;
  this.userProfit = profitShare;
  this.refund = refund;
  this.totalUserShare = finalAmount;
  this.leadersProfit = (payoutAmount * leadersSplit) / 100;
  this.netProfit = payoutAmount - this.totalUserShare - (payoutAmount * leadersSplit) / 100;
  this.status = "Pending";
  await this.save();

  await this.user.addProfits(profitShare * -1, mongoId, accountId);
  return;
};

PayoutSchema.methods.acceptPayout = async function () {
  await this.populate(["user", "account"]);

  console.log(this);

  if (!this.account || !this.user) {
    throw new Error("Account or User not found.");
  }

  try {
    await this.account.resetAfterPayoutSended();
  } catch (error) {
    throw new Error(`Failed to reset account: ${error.message}`);
  }

  this.status = "Accepted";
  this.acceptedDate = new Date();

  const payoutAmount = this.payoutAmount;
  console.log(payoutAmount);
  const beneficiaries = this.user.beneficiaries || [];
  console.log(beneficiaries);

  const profitPromises = beneficiaries.map(async (beneficiary) => {
    const percentage = beneficiary.percentage || 0;
    const profit = payoutAmount * (percentage / 100);

    if (isNaN(profit)) {
      this.rejectedUserPayments.push({
        user: beneficiary.user,
        profit: profit,
        reason: "Invalid percentage for beneficiary.",
      });
      return;
    }

    try {
      const user = await User.findById(beneficiary.user);
      if (!user) {
        throw new Error("User not found.");
      }
      await user.addProfits(profit, this.user._id, this.account._id);
    } catch (error) {
      console.error(`Failed to update profits for beneficiary ${beneficiary.user}:`, error);
      this.rejectedUserPayments.push({
        user: beneficiary.user,
        profit: profit,
        reason: error.message,
      });
    }
  });

  await Promise.allSettled(profitPromises);
  await this.save();
  return;
};

export default mongoose.models.Payout || mongoose.model("Payout", PayoutSchema);
