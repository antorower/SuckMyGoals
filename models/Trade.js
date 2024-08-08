import mongoose from "mongoose";
import { ReviewSettings, Pairs, Companies } from "@/lib/AppData";

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
    matched: Boolean,
    matchingTime: Date,
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

TradeSchema.methods.OpenTrade = async function (userId, accountId, openBalance, pair, position, lots, stopLoss, takeProfit, matched) {
  this.user = userId;
  this.account = accountId;
  await this.save();
  await this.populate("account");
  this.company = account.company;
  this.capital = account.capital;
  this.trade.openBalance = openBalance;
  this.trade.pair = pair;
  this.trade.position = position;
  this.trade.lots = lots;
  this.trade.stopLoss = stopLoss;
  this.trade.takeProfit = takeProfit;
  this.trade.openTime = new Date();
  this.matched = matched;
  this.normalLoss = stopLoss / this.account.capital;
  if (matched) this.matchingTime = new Date();
  this.status = "Open";
  this.balanceCategory = account.metadata.balanceCategory;
  this.account.lastTrade = this._id;
  await this.save();
};

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
