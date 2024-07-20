import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    title: String,
    description: String,
  },
  { timestamps: true }
);

AccountSchema.pre("save", function (next) {
  next();
});

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
