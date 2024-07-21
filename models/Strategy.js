import mongoose from "mongoose";

const StrategySchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

export default mongoose.models.Strategy || mongoose.model("Strategy", StrategySchema);
