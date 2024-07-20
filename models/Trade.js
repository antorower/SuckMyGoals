import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    openBalance: String,
    closeBalance: String,
    pair: String,
    lots: Number,
    position: {
      type: String,
      enum: ["Buy", "Sell"],
    },
    status: {
      type: String,
      enum: ["Open", "Close"],
      default: "Open",
    },
    closeDate: Date,
    stopLoss: Number,
    takeProfit: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Trade || mongoose.model("Trade", TradeSchema);
