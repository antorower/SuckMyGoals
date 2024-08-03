import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    link: String,
    maxCapital: Number,
    maxAccounts: Number,
    numberOfPhases: Number,
    phase1: {
      name: String,
      target: Number,
      dailyDrawdown: Number,
      maxDrawdown: Number,
      maxRiskPerTrade: Number,
      note: String,
    },
    phase2: {
      name: String,
      target: Number,
      dailyDrawdown: Number,
      maxDrawdown: Number,
      maxRiskPerTrade: Number,
      note: String,
    },
    phase3: {
      name: String,
      target: Number,
      minimumProfit: Number,
      dailyDrawdown: Number,
      maxDrawdown: Number,
      maxRiskPerTrade: Number,
      note: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
