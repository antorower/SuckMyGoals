import mongoose from "mongoose";
import { clerkClient } from "@clerk/nextjs/server";
import Account from "./Account";

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
  profitsProgress: [
    {
      amount: Number,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    },
  ],
  accepted: {
    type: Boolean,
    default: false,
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

UserSchema.methods.addRelatedUser = async function (userId) {
  this.relatedUser = userId;
  await this.save();
  return;
};
UserSchema.methods.removeRelatedUser = async function () {
  this.relatedUser = null;
  await this.save();
  return;
};

UserSchema.methods.addBeneficiary = async function (beneficiaryId, percentage) {
  const existingBeneficiary = this.beneficiaries.find((beneficiary) => beneficiary.user.equals(beneficiaryId));
  if (existingBeneficiary) {
    existingBeneficiary.percentage = percentage;
  } else {
    this.beneficiaries.push({ user: beneficiaryId, percentage });
  }
  await this.save();
  return;
};
UserSchema.methods.removeBeneficiary = async function (beneficiaryId) {
  this.beneficiaries.pull({ user: beneficiaryId });
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

UserSchema.methods.addProfits = async function (profit, userId, accountId) {
  this.profits = this.profits + profit;
  this.profitsProgress.push({ amount: profit, user: userId, account: accountId });
  await this.save();
  return;
};

UserSchema.methods.updateNote = async function (note) {
  this.note = note;
  await this.save();
  return;
};

UserSchema.methods.acceptUser = async function (clerkId) {
  await clerkClient.users.updateUserMetadata(clerkId, {
    publicMetadata: {
      accepted: true,
    },
  });
  this.accepted = true;
  await this.save();
  return;
};

UserSchema.methods.isLeader = function (leaderId) {
  return this.leaders.includes(leaderId);
};
UserSchema.methods.isBeneficiary = function (leaderId) {
  return this.beneficiaries.some((beneficiary) => beneficiary.user.equals(leaderId));
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
