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
    relatedCapitals: [Number],
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
    trades: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade",
    },
    openTrade: {
      tradeId: String,
      pair: String,
      lots: Number,
      position: {
        type: String,
        enum: ["Buy", "Sell"],
      },
      stopLoss: Number,
      takeProfit: Number,
      openTime: Date,
      result: {
        type: String,
        enum: ["Win", "Lose", "None"],
        default: "None",
      },
    },
    reviewTrade: {
      trade: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trade",
      },
      reason: {
        type: String,
        enum: ["Wrong result", "Large Profit", "Large Loss"],
      },
    },
    balanceCategory: Number,
    eventsTimestamp: {
      purchaseDate: Date,
      firstTradeDate: Date,
      targetReachedDate: Date,
      upgradedDate: Date,
      payoutRequestDate: Date,
      payoutRequestDoneDate: Date,
      profitsSended: Date,
      lostDate: Date,
    },
  },
  { timestamps: true }
);

AccountSchema.pre("save", async function (next) {
  if (this.isModified("balance") || this.isNew) {
    // Φέρνουμε την εταιρεία που συνδέεται με τον λογαριασμό
    const company = await Company.findById(this.company);

    if (!company) {
      return next(new Error("Company not found"));
    }

    // Παίρνουμε τα δεδομένα για το τρέχον στάδιο
    const phaseData = company[`phase${this.phase}`];

    if (!phaseData) {
      return next(new Error("Phase data not found"));
    }

    // Υπολογισμός στόχου και μέγιστης απώλειας
    const targetBalance = (1 + phaseData.target / 100) * this.capital;
    const drawdownBalance = (1 - phaseData.maxDrawdown / 100) * this.capital;
    const targetDollars = (phaseData.target / 100) * this.capital;
    const drawdownDollars = (phaseData.maxDrawdown / 100) * this.capital;

    const step = (targetDollars + drawdownDollars) / 10;
    // Create an array to hold the categories
    const categories = [];

    // Populate the array using a loop for steps 1 through 10
    for (let i = 1; i <= 10; i++) {
      categories.push(drawdownBalance + i * step);
    }

    for (let i = 0; i < categories.length - 1; i++) {
      if (this.balance > categories[i] && this.balance <= categories[i + 1]) {
        this.balanceCategory = i + 1;
        break;
      }
    }
  }

  if (this.isModified("capital") || this.isNew) {
    if (this.capital === 5000 || this.capital === 6000) {
      relatedCapitals = [5000, 6000];
    }
    if (this.capital === 10000 || this.capital === 15000) {
      relatedCapitals = [10000, 15000];
    }
    if (this.capital === 20000 || this.capital === 25000) {
      relatedCapitals = [20000, 25000];
    }
    if (this.capital === 50000 || this.capital === 60000) {
      relatedCapitals = [50000, 60000];
    }
    if (this.capital === 100000) {
      relatedCapitals = [100000];
    }
    if (this.capital === 200000) {
      relatedCapitals = [200000];
    }
  }
  next();
});

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

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
