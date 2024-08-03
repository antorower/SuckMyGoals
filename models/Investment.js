import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    amount: Number,
    interest: Number,
    paidUntil: {
      type: Date,
      default: () => new Date(),
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

InvestmentSchema.pre("save", function (next) {
  next();
});

export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
