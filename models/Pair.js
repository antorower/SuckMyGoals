import mongoose from "mongoose";

const PairSchema = new mongoose.Schema({
  pair: {
    type: String,
    unique: true,
  },
  slowMode: {
    minimumPoints: Number,
    maximumPoints: Number,
  },
  fastMode: {
    minimumPoints: Number,
    maximumPoints: Number,
  },
  pointValue: Number,
  spread: {
    votes: {
      type: Number,
      default: 0,
    },
    sum: {
      type: Number,
      default: 0,
    },
    average: {
      type: Number,
      default: 0,
    },
  },
});

PairSchema.pre("save", function (next) {
  if (this.spread.votes !== 0) {
    this.spread.average = this.spread.sum / this.spread.votes;
  } else {
    this.spread.average = 0;
  }
  next();
});

export default mongoose.models.Pair || mongoose.model("Pair", PairSchema);
