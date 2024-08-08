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
  await this.populate("user").populate("account");
  await this.account.resetAfterPayoutSended();
  this.status = "Accepted";
  this.acceptedDate = new Date();

  const payoutAmount = this.payoutAmount;
  const beneficiaries = this.user.beneficiaries || [];

  const profitPromises = beneficiaries.map(async (beneficiary) => {
    const profit = payoutAmount * (beneficiary.percentage / 100);
    try {
      const user = await User.findById(beneficiary.user);
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
