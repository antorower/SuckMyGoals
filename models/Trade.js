import mongoose from "mongoose";
import { ReviewSettings, Pairs, Companies } from "@/lib/AppData";
import dbConnect from "@/dbConnect";

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
    company: String,
    capital: Number,
    trade: {
      openBalance: Number,
      closeBalance: Number,
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
    matched: Boolean,
    matchingTime: Date,
    matchingTrade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade",
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
    balanceCategory: Number,
    normalLossAmount: Number,
    normalLossPercentage: Number,
    actualLossAmount: Number,
    actualLossPercentage: Number,
  },
  { timestamps: true }
);

export default mongoose.models.Trade || mongoose.model("Trade", TradeSchema);

TradeSchema.methods.CloseTrade = async function (closeBalance) {
  const pairObj = Pairs.find((pair) => pair.pair === this.trade.pair);

  await this.populate("account");
  const companyObj = Companies.find((company) => company.name === this.account.company);

  let actualLoss;
  if (closeBalance > openBalance) {
    actualLoss = 0;
  } else {
    actualLoss = (openBalance - closeBalance) / this.account.capital;
  }
  this.trade.closeBalance = closeBalance;
  this.trade.closeTime = new Date();
  this.status = "Close";
  this.actualLoss = actualLoss;
  const acceptableLoss = (this.trade.stopLoss + company.commissionFactor * this.trade.lots + pairObj.spread * this.trade.lots + this.capital * ReviewSettings.reviewIfMorePercentageLost) / this.capital;
  if (actualLoss > acceptableLoss) {
    this.reviewData.name = "Big loss detected";
    this.reviewData.details = `This trade lose ${((actualLoss - acceptableLoss) * 100).toFixed(2)}% more than acceptable loss. It should lose $${stopLoss}. We could accept $${(acceptableLoss * this.capital).toFixed(0)}. And it lose $${(actualLoss * this.capital).toFixed(0)}`;
    this.status = "Review";
  }
  await this.save();
  return;
};
