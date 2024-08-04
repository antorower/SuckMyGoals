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
      enum: ["Open", "Close", "Review"],
      default: "Open",
    },
    reviewData: {
      name: String,
      details: String,
    },
    closeDate: Date,
    stopLoss: Number,
    takeProfit: Number,
    matched: Boolean,
    openTime: {
      type: Date,
      default: () => Date.now(),
    },
    matchTime: Date,
    closeTime: Date,
    metadata: {
      category: Number,
      relatedCapitals: [Number],
      companyId: String,
      companyName: String,
      order: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Trade || mongoose.model("Trade", TradeSchema);
