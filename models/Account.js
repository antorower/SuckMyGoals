import mongoose from "mongoose";
import * as Settings from "@/lib/AppData";
import User from "./User";

const AccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    company: String,
    number: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    capital: Number,
    phase: Number,
    phaseWeight: Number,
    balance: Number,
    activities: [
      {
        title: String,
        description: String,
        dateTime: { type: Date, default: () => new Date() },
      },
    ],
    status: {
      type: String,
      enum: ["WaitingPurchase", "Live", "NeedUpgrade", "UpgradeDone", "WaitingPayout", "PayoutRequestDone", "MoneySended", "Lost", "Review"],
    },
    note: {
      type: String,
      trim: true,
    },
    lastTrade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade",
    },
    eventsTimestamp: {
      targetReachedDate: Date,
      lostDate: Date,
      purchaseDate: Date,
      firstTradeDate: Date,
      upgradedDate: Date,
      payoutRequestDate: Date,
      payoutRequestDoneDate: Date,
      profitsSendedDate: Date,
    },
    metadata: {
      timesPaid: {
        type: Number,
        default: 0,
      },
      balanceCategory: Number,
      relatedAccounts: {
        previousAccount: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
        nextAccount: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
        },
      },
    },
  },
  { timestamps: true }
);

AccountSchema.pre("save", async function (next) {
  if (this.isModified("balance") || this.isNew) {
    const company = GetCompany(this.company);
    const phase = company.phases[this.phase];

    const targetBalance = (1 + phase.target / 100) * this.capital;
    const drawdownBalance = (1 - phase.maxDrawdown / 100) * this.capital;
    const targetDollars = (phase.target / 100) * this.capital;
    const drawdownDollars = (phase.maxDrawdown / 100) * this.capital;

    // Κάθε φορά που αλλάζει το balance ενημερώνεται η κατηγορία του account
    const step = (targetDollars + drawdownDollars) / 10;
    const categories = [];
    for (let i = 1; i <= 10; i++) {
      categories.push(drawdownBalance + i * step);
    }
    for (let i = 0; i < categories.length - 1; i++) {
      if (this.balance > categories[i] && this.balance <= categories[i + 1]) {
        this.metadata.balanceCategory = i + 1;
        break;
      }
    }

    // Κάθε φορά που αλλάζει το balance ελέγχεται αν το account πρέπει να αλλάξει status
    if (this.balance > targetBalance) {
      this.targetReached();
    }
    if (this.balance < drawdownBalance) {
      this.accountLost();
    }
  }

  if (this.isModified("phase") || this.isNew) {
    const company = GetCompany(this.company);
    this.instructions = company.phases[this.phase].instructions;
    this.phaseWeight = company.phases[this.phase].weight;
  }
  next();
});

// PROGRESS METHODS
AccountSchema.methods.accountInitialization = async function (userId, companyName, capital) {
  const company = GetCompany(companyName);
  this.user = userId;
  this.company = companyName;
  this.capital = capital;
  this.phase = 0;
  this.phaseWeight = company.phases[0].weight;
  this.balance = capital;
  this.status = "WaitingPurchase";
  this.note = `Funds has been sent to your wallet. Purchase your ${companyName} account of $${capital.toLocaleString("de-DE")} and save your account number`;
  this.addActivity("Funds sent", "Funds send for buying new account");
  await this.save();

  await this.populate("user");
  await this.user.addAccount(this._id);
  return;
};

AccountSchema.methods.createUpgradedAccount = async function (oldAccount, newNumber) {
  this.user = oldAccount.user;

  this.company = oldAccount.company;
  this.number = newNumber;
  this.capital = oldAccount.capital;
  this.phase = oldAccount.phase + 1;
  this.balance = oldAccount.capital;
  this.status = "Live";
  this.note = `Your upgraded account ${newNumber} is ready for trading`;
  this.metadata.relatedAccounts.previousAccount = oldAccount._id;
  this.addActivity("Upgraded account created", "Upgraded account created");
  await this.save();

  await this.populate("user");
  await this.user.addAccount(this._id);
  return;
};

AccountSchema.methods.upgradeAccount = async function (nextAccountId) {
  await this.populate("user");
  await this.user.removeAccount(this._id);
  this.eventsTimestamp.upgradedDate = new Date();
  this.status = "UpgradeDone";
  this.note = "Account has been upgraded";
  this.addActivity("Account upgraded", "Account has been upgraded");
  this.metadata.relatedAccounts.nextAccount = nextAccountId;
  await this.save();
  return;
};

AccountSchema.methods.accountPurchased = async function (number) {
  this.number = number;
  this.status = "Live";
  this.eventsTimestamp.purchaseDate = new Date();
  this.note = "Your account is ready for trading";
  this.addActivity("Account purchased", "The user purchase the account and set the account number");
  await this.save();
  return;
};

AccountSchema.methods.targetReached = function () {
  const company = GetCompany(this.company);
  if (company.phases.length === this.phase + 1) {
    this.status = "WaitingPayout";
    this.addActivity("Profits gained", "A funded account gain profits");
  } else {
    this.status = "NeedUpgrade";
    this.addActivity("Phase passed", "The account reach the target");
  }
  this.eventsTimestamp.targetReachedDate = new Date();
};

AccountSchema.methods.reviewFinished = async function () {
  this.status = "Lost";
  this.addActivity("Review finished", "Review finished");
  await this.save();
  return;
};

AccountSchema.methods.payoutRequestDone = async function () {
  this.status = "PayoutRequestDone";
  this.addActivity("Payout request done", "Payout request done");
  await this.save();
  return;
};

AccountSchema.methods.resetAfterPayoutSended = async function () {
  this.balance = this.capital;
  this.status = "Live";
  this.note = "Your account is ready for trading. Happy profits again!";
  this.eventsTimestamp.payoutRequestDate = null;
  this.eventsTimestamp.payoutRequestDoneDate = null;
  this.eventsTimestamp.profitsSendedDate = null;
  this.addActivity("Payout accepted", "Payout accepted and account is reseted");
  await this.save();
  return;
};

AccountSchema.methods.moneySended = async function (payoutAmount) {
  this.status = "PayoutRequestDone";
  this.addActivity("Payout request done", "Payout request done");
  await this.save();
  return;
};

AccountSchema.methods.accountLost = function () {
  this.status = "Review";
  this.addActivity("Account lost", "Account lost");
  this.eventsTimestamp.lostDate = new Date();
};

// GET METHODS
AccountSchema.methods.getStopLossPoints = function (pair) {
  const daySchedule = Settings.GetDaySchedule();
  const pairObj = Settings.GetPairDetails(pair);

  const minimumPoints = daySchedule.mode === "slow" ? pairObj.slowMode.minimumPoints : pairObj.fastMode.minimumPoints;
  return Math.round(minimumPoints + minimumPoints * Math.random() * 0.2);
};
AccountSchema.methods.getStopLossAmount = function () {
  const company = Settings.GetCompany(this.company);
  const maxRiskPerTradePercentage = company.phases[this.phase].maxRiskPerTrade;
  const randomRiskPercentage = maxRiskPerTradePercentage * Settings.GetRandomFactor();
  const riskAmount = Math.round(this.capital * randomRiskPercentage);
  return riskAmount;
};
AccountSchema.methods.getLots = function (pair, stopLossPoints, riskAmount) {
  const pairObj = Settings.GetPairDetails(pair);
  const pointValue = pairObj.pointValue;
  const lots = parseFloat(riskAmount / (stopLossPoints * pointValue).toFixed(2));
  return lots;
};
AccountSchema.methods.getTakeProfit = function (pair, stopLossPoints, lots) {
  const daySchedule = Settings.GetDaySchedule();
  const pairObj = Settings.GetPairDetails(pair);
  const maximumSettingsTakeProfitPoints = daySchedule.mode === "slow" ? pairObj.slowMode.maximumPoints : pairObj.fastMode.maximumPoints;
  const maxStopLossTakeProfitPoints = stopLossPoints * Settings.Strategy.maxRiskToRewardRatio;
  const maxTakeProfitPoints = Math.min(maximumSettingsTakeProfitPoints, maxStopLossTakeProfitPoints);
  const maxTakeProfitAmount = maxTakeProfitPoints * pairObj.pointValue;

  const company = Settings.GetCompany(this.company);
  const targetBalance = this.capital * (1 + company.phases[this.phase].target);
  const remainingBalance = targetBalance - this.balance;
  let takeProfit;
  if (remainingBalance < maxTakeProfitAmount) {
    takeProfit = parseFloat((remainingBalance + pairObj.spread * lots + company.commissionFactor * lots * Settings.Strategy.extraTakeProfitPoints * lots).toFixed(2));
  } else {
    takeProfit = parseFloat((maxTakeProfitAmount * Settings.GetRandomFactor()).toFixed(2));
  }
  return takeProfit;
};

// UPDATE METHODS
AccountSchema.methods.updateBalance = async function (newBalance) {
  this.addActivity("Balance updated", `Balance updated from ${this.balance} to ${newBalance}`);
  this.balance = newBalance;
  await this.save();
  return;
};

AccountSchema.methods.addActivity = function (title, description) {
  this.activities.push({
    title: title,
    description: description,
  });
};

const GetCompany = (name) => {
  const company = Companies.find((company) => company.name === name);
  if (!company) throw new Error(`Company ${name} not found. Account Model -> GetCompany`);
  return company;
};

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
