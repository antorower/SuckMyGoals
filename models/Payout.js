import mongoose from "mongoose";

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
    netProfit: Number,
    status: {
      type: String,
      enum: ["Pending", "Accepted"],
      default: "Pending",
    },
    acceptedDate: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Payout || mongoose.model("Payout", PayoutSchema);
