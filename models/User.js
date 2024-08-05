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
  beneficiaries: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        percentage: Number,
      },
    ],
    default: [],
  },
  activeCompanies: {
    type: [String],
    default: [],
  },
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
  lastTradeOpened: Date,
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

UserSchema.methods.addAccount = async function (accountId) {
  if (this.accounts.includes(accountId)) return;
  this.accounts.push(accountId);
  await this.save();
  return;
};

UserSchema.methods.removeAccount = async function (accountId) {
  if (!this.accounts.includes(accountId)) return;
  this.accounts.pull(accountId);
  await this.save();
  return;
};

UserSchema.methods.addLeader = async function (userId) {
  if (this.leaders.includes(userId)) return;
  this.leaders.push(userId);
  await this.save();
  return;
};

UserSchema.methods.removeLeader = async function (userId) {
  if (!this.leaders.includes(userId)) return;
  this.leaders.pull(userId);
  await this.save();
  return;
};

UserSchema.methods.addBeneficiary = async function (userId, percentage) {
  if (this.beneficiaries.includes(userId)) return;
  this.leaders.push(userId);
  await this.save();
  return;
};

UserSchema.methods.removeBeneficiary = async function (userId) {
  if (!this.leaders.includes(userId)) return;
  this.leaders.pull(userId);
  await this.save();
  return;
};

UserSchema.methods.addActiveCompany = async function (companyName) {
  if (this.activeCompanies.includes(companyName)) return;
  this.activeCompanies.push(companyName);
  await this.save();
  return;
};

UserSchema.methods.removeActiveCompany = async function (companyName) {
  if (!this.activeCompanies.includes(companyName)) return;
  this.activeCompanies.pull(companyName);
  await this.save();
  return;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
