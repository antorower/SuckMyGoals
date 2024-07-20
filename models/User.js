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
    },
  ],
  activeCompanies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
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
});

UserSchema.pre("save", function (next) {
  if (this.firstName) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
  }

  if (this.lastName) {
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();
  }

  next();
});

// Add an account to the accounts array
UserSchema.methods.addAccount = function (accountId) {
  if(!this.accounts.includes(accountId)) {
    this.accounts.push(accountId);
  }
  return this.save();
};

// Remove an account from the accounts array
UserSchema.methods.removeAccount = function (accountId) {
  if(this.accounts.includes(accountId)) {
    this.accounts.pull(accountId);
  }
  return this.save();
};

// Add an account to the accounts array
UserSchema.methods.addCompany = function (companyId) {
  if (!this.activeCompanies.includes(companyId)) {
    this.activeCompanies.push(companyId);
    return this.save();
  }
  return this;
};

// Remove an account from the accounts array
UserSchema.methods.removeCompany = function (companyId) {
  if (this.activeCompanies.includes(companyId)) {
    this.activeCompanies.pull(companyId);
    return this.save();
  }
  return this;
};

// Add profits to the user
UserSchema.methods.addProfits = function (amount) {
  this.profits += amount;
  return this.save();
};

// Add roles
UserSchema.methods.addLeaderRole = function () {
  this.roles.leader = true;
  this.save();
};

// Remove roles
UserSchema.methods.removeLeaderRole = function () {
  this.roles.leader = false;
  this.save();
};

// Update note
UserSchema.methods.updateNote = function (newNote) {
  this.note = newNote.trim();
  return this.save();
};

// Add a related user
UserSchema.methods.addRelatedUser = function (relatedUserId) {
  this.relatedUser = relatedUserId;
  return this.save();
};

// Remove related user
UserSchema.methods.removeRelatedUser = function () {
  this.relatedUser = null;
  return this.save();
};

// Add leader
UserSchema.methods.addLeader = async function (leaderId) {
  if (!this.leaders.includes(leaderId)) {
    this.leaders.push(leaderId);
    return this.save();
  }
  return this;
};

// Remove leader
UserSchema.methods.removeLeader = async function (leaderId) {
  if (this.leaders.includes(leaderId)) {
    this.leaders.pull(leaderId);
    return this.save();
  }
  return this;
};

// Check if is leader
UserSchema.methods.isLeader = async function (leaderId) {
  return this.leaders.includes(leaderId);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
