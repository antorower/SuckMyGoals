import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  leaders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  activeCompanies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: [],
    },
  ],
  roles: {
    owner: {
      type: Boolean,
      default: false,
    },
    leader: {
      type: Boolean,
      default: false,
    },
  },
  note: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  nickname: {
    type: String,
    default: "",
  },
  telephone: {
    type: String,
    trim: true,
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bybitEmail: {
    type: String,
    trim: true,
  },
  bybitUid: {
    type: String,
    trim: true,
  },
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  profits: {
    type: Number,
    default: 0,
  },
  lastTradeOpened: {
    type: Date,
    default: () => new Date(),
  },
});

UserSchema.pre("save", function (next) {
  if (this.isModified("firstName") && this.firstName) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
  }

  if (this.isModified("lastName") && this.lastName) {
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();
  }

  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
