import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  capital: Number,
  cost: Number,
  interest: Number,
  note: String,
});

const SettingsSchema = new mongoose.Schema({
  monday: {
    active: Boolean,
    mode: {
      type: String,
      enum: ["slow", "fast"],
    },
    schedule: {
      startingHour: Number,
      endingHour: Number,
      pairs: [String],
    },
    note: String,
  },
  tuesday: {
    active: Boolean,
    mode: {
      type: String,
      enum: ["slow", "fast"],
    },
    schedule: {
      startingHour: Number,
      endingHour: Number,
      pairs: [String],
    },
    note: String,
  },
  wednesday: {
    active: Boolean,
    mode: {
      type: String,
      enum: ["slow", "fast"],
    },
    schedule: {
      startingHour: Number,
      endingHour: Number,
      pairs: [String],
    },
    note: String,
  },
  thursday: {
    active: Boolean,
    mode: {
      type: String,
      enum: ["slow", "fast"],
    },
    schedule: {
      startingHour: Number,
      endingHour: Number,
      pairs: [String],
    },
    note: String,
  },
  friday: {
    active: Boolean,
    mode: {
      type: String,
      enum: ["slow", "fast"],
    },
    schedule: {
      startingHour: Number,
      endingHour: Number,
      pairs: [String],
    },
    note: String,
  },
  investments: [InvestmentSchema],
});

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
