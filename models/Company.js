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
      maxRiskPerTradeFastStrategy: Number,
      maxRiskPerTradeSlowStrategy: Number,
      note: String,
    },
    phase2: {
      name: String,
      target: Number,
      dailyDrawdown: Number,
      maxDrawdown: Number,
      maxRiskPerTradeFastStrategy: Number,
      maxRiskPerTradeSlowStrategy: Number,
      note: String,
    },
    phase3: {
      name: String,
      target: Number,
      minimumProfit: Number,
      dailyDrawdown: Number,
      maxDrawdown: Number,
      maxRiskPerTradeFastStrategy: Number,
      maxRiskPerTradeSlowStrategy: Number,
      note: String,
    },
    startingHour: Number,
    endingHour: Number,
  },
  { timestamps: true }
);

// Update Drawdown Details
CompanySchema.methods.updateDrawdownDetails = function (type, reset) {
  this.drawdownDetails.format = type;
  this.drawdownDetails.reset = reset;
  return this.save();
};

// Update name
CompanySchema.methods.updateName = function (name) {
  this.name = name;
  return this.save();
};

// Update icon
CompanySchema.methods.updateIcon = function (icon) {
  this.icon = icon;
  return this.save();
};

// Update link
CompanySchema.methods.updateLink = function (link) {
  this.link = link;
  return this.save();
};

// Update maxLots
CompanySchema.methods.updateMaxLots = function (maxLots) {
  this.maxLots = maxLots;
  return this.save();
};

// Update phase1
CompanySchema.methods.updatePhase1 = function (phase1) {
  this.phase1 = phase1;
  return this.save();
};

// Update phase2
CompanySchema.methods.updatePhase2 = function (phase2) {
  this.phase2 = phase2;
  return this.save();
};

// Update phase3
CompanySchema.methods.updatePhase3 = function (phase3) {
  this.phase3 = phase3;
  return this.save();
};

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
