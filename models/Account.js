import mongoose from "mongoose";
import Payout from "./Payout";

const AccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    number: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    capital: Number,
    phase: Number,
    balance: Number,
    cost: Number,
    unorthodoxBreach: Boolean,
    timesPaid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["WaitingPurchase", "Live", "NeedUpgrade", "UpgradeDone", "WaitingPayout", "PayoutRequestDone", "MoneySended", "Lost", "Review"],
    },
    previousAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    nextAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    note: {
      type: String,
      trim: true,
    },
    currentPayout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payout",
    },
    purchaseDate: Date,
    firstTradeDate: Date,
    targetReachedDate: Date,
    upgradedDate: Date,
    payoutRequestDate: Date,
    payoutRequestDoneDate: Date,
    profitsSended: Date,
    lostDate: Date,
  },
  { timestamps: true }
);

AccountSchema.pre("save", function (next) {
  next();
});

// Send money for purchase
AccountSchema.methods.sendMoneyForPurchase = async function (userId, companyId, capital, cost) {
  this.user = userId;
  this.company = companyId;
  this.capital = capital;
  this.phase = 1;
  this.balance = capital;
  this.cost = cost;
  this.status = "WaitingPurchase";
  this.note = "Funds has been sent to your wallet. Purchase your account and enter your account number.";
  return await this.save();
};

// Register account number after purchase
AccountSchema.methods.registerAccountNumber = async function (newAccountNumber) {
  this.number = newAccountNumber;
  this.purchaseDate = new Date();
  this.status = "Live";
  this.note = "Your new account is ready for trading.";
  return await this.save();
};

// Open trade
AccountSchema.methods.openTrade = async function () {
  // Waiting for development
};

// Update balance
AccountSchema.methods.updateBalance = async function (newBalance, canLose) {
  await this.populate("company");
  if (!this.company) {
    throw new Error("Error updating balance. No associated company found for the account.");
  }
  const phaseString = `phase${this.phase}`;

  // Υπολογίζω τα dd και το target
  const balanceTarget = this.capital + this.capital * this.company[phaseString].target;
  let balanceDailyDrawdown;
  if (this.company.drawdownType === "initialBalance") {
    balanceDailyDrawdown = this.capital - this.capital * this.company[phaseString].dailyDrawdown;
  } else {
    balanceDailyDrawdown = this.balance - this.balance * this.company[phaseString].dailyDrawdown;
  }
  const balanceMaxDrawdown = this.capital - this.capital * this.company[phaseString].maxDrawdown;
  const balanceOneTradeDrawdown = this.balance - this.balance * this.company[phaseString].oneTradeRisk;

  // Ελέγχω αν έχει ξεπεράσει το μέγιστο επιτρεπόμενο ρίσκο σε ένα trade
  if (canLose) {
    if (this.company.oneTradeLose) {
      if (newBalance < balanceOneTradeDrawdown) {
        this.status = "Review";
        this.lostDate = new Date();
        this.unorthodoxBreach = true;
        this.note = "Account lost because exceeded the one trade allowed drawdown";
        this.balance = newBalance;
        return await this.save();
      }
    }

    if (newBalance < balanceDailyDrawdown) {
      this.status = "Review";
      this.lostDate = new Date();
      this.unorthodoxBreach = true;
      this.note = "Account lost because exceeded the maximum daily drawdown";
      this.balance = newBalance;
      return await this.save();
    }
  }

  // Ελέγχω αν έχει ξεπεράσει το max drawdown
  if (newBalance < balanceMaxDrawdown) {
    this.status = "Review";
    this.lostDate = new Date();
    this.note = "Account lost because exceeded the maximum drawdown";
    this.balance = newBalance;
    return await this.save();
  }

  if (newBalance > balanceTarget) {
    if (this.phase === 1 || this.phase === 2) {
      this.status = "NeedUpgrade";
      this.targetReachedDate = new Date();
      this.note = "Target reached. Complete the minimum trading or waiting days to upgrade your account.";
      this.balance = newBalance;
      return await this.save();
    } else if (this.phase === 3) {
      this.status = "WaitingPayout";
      this.targetReachedDate = new Date();
      this.note = "Target reached. Complete the minimum trading or waiting days for payout request.";
      this.balance = newBalance;
      return await this.save();
    }
  }
  this.balance = newBalance;
  return await this.save();
};

// Upgrade account
AccountSchema.methods.upgradeAccount = async function (newAccountNumber) {
  const newAccount = new this.constructor({
    user: this.user,
    number: newAccountNumber,
    company: this.company,
    capital: this.capital,
    phase: this.phase + 1,
    balance: this.capital,
    status: "Live",
    previousAccount: this._id,
    note: "Your new account is ready for trading.",
  });
  await newAccount.save();

  this.status = "UpgradeDone";
  this.note = `Account successfully upgraded to ${newAccountNumber}`;
  this.nextAccount = newAccount._id;
  this.upgradedDate = new Date();
  return await this.save();
};

// Initialize upgraded account
AccountSchema.methods.initializeUpgradedAccount = async function (oldAccountObj, newAccountNumber) {
  this.user = oldAccountObj.user;
  this.number = newAccountNumber;
  this.company = oldAccountObj.company;
  this.capital = oldAccountObj.capital;
  this.phase = oldAccountObj.phase + 1;
  this.balance = this.capital;
  this.status = "Live";
  this.previousAccount = oldAccountObj._id;
  this.note = "Account is ready for trading";
  return await this.save();
};

// Payout request done
AccountSchema.methods.payoutRequestDone = async function () {
  this.status = "PayoutRequestDone";
  this.payoutRequestDoneDate = new Date();
  return await this.save();
};

// Send profits
AccountSchema.methods.sendProfits = async function (payoutAmount, userProfit) {
  const mentorsPercent = 0.15; //InputVariable
  const newPayout = new Payout({
    user: this.user,
    account: this._id,
    accountProfit: this.balance - this.capital,
    payoutAmount: payoutAmount,
    userProfit: userProfit,
    mentorsProfit: payoutAmount * mentorsPercent,
    netProfit: payoutAmount - userProfit - payoutAmount * mentorsPercent,
  });
  await newPayout.save();

  this.currentPayout = newPayout._id;
  this.status = "MoneySended";
  this.note = "Profits sended. Please wait for reset.";
  return await this.save();
};

// Accept profits
AccountSchema.methods.acceptProfits = async function (payoutAmount, userProfit, mentorsProfit) {
  await this.populate("currentPayout");
  if (!this.currentPayout) {
    throw new Error("Error accept profits. No associated payout found.");
  }
  this.currentPayout.acceptedDate = new Date();
  this.currentPayout.status = "Accepted";
  this.currentPayout.accountProfit = this.balance - this.capital;
  this.currentPayout.payoutAmount = payoutAmount;
  this.currentPayout.userProfit = userProfit;
  this.currentPayout.netProfit = payoutAmount - userProfit - mentorsProfit;
  await this.currentPayout.save();

  this.balance = this.capital;
  this.status = "Live";
  this.note = "Your account is ready for trading.";
  this.currentPayout = null;
  this.timesPaid = this.timesPaid + 1;
  return await this.save();
};

// Review pass
AccountSchema.methods.reviewPass = async function () {
  this.status = "Lost";
  return await this.save();
};

// Update note
AccountSchema.methods.updateNote = async function (note) {
  this.note = note;
  return await this.save();
};

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
