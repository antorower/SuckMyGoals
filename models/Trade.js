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
    trade: {
      openBalance: String,
      closeBalance: String,
      pair: String,
      position: {
        type: String,
        enum: ["Buy", "Sell"],
      },
      lots: Number,
      stopLoss: Number,
      takeProfit: Number,
      openTime: Date,
      closeTime: Date,
    },
    matching: {
      matched: Boolean,
      matchingTime: Date,
    },
    status: {
      type: String,
      enum: ["Open", "Close", "Review"],
      default: "Open",
    },
    reviewData: {
      name: String,
      details: String,
      note: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Trade || mongoose.model("Trade", TradeSchema);

TradeSchema.methods.OpenTrade = async function (userId, accountId, openBalance, pair, position, lots, stopLoss, takeProfit, matched) {
  this.user = userId;
  this.account = accountId;
  this.trade.openBalance = openBalance;
  this.trade.pair = pair;
  this.trade.position = position;
  this.trade.lots = lots;
  this.trade.stopLoss = stopLoss;
  this.trade.takeProfit = takeProfit;
  this.mathcing.matched = matched;
  if (matched) this.matching.matchingTime = new Date();
  this.status = "Open";
  return await this.save();
};

TradeSchema.methods.CloseTrade = async function (closeBalance) {
  this.user = userId;
  this.account = accountId;
  this.trade.openBalance = openBalance;
  this.trade.pair = pair;
  this.trade.position = position;
  this.trade.lots = lots;
  this.trade.stopLoss = stopLoss;
  this.trade.takeProfit = takeProfit;
  this.mathcing.matched = matched;
  if (matched) this.matching.matchingTime = new Date();
  this.status = "Open";
  return await this.save();
};
