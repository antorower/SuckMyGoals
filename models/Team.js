import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: String,
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    inspectors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

TeamSchema.methods.updateName = async function (name) {
  this.name = name;
  return await this.save();
};

TeamSchema.methods.addMember = async function (userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user");
  }

  if (!this.members.includes(userId)) {
    this.members.push(userId);
    this.markModified("members");
    return await this.save();
  } else {
    throw new Error("User is already a member of this team");
  }
};

TeamSchema.methods.addInspector = async function (userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user");
  }

  if (!this.inspectors.includes(userId)) {
    this.inspectors.push(userId);
    this.markModified("inspectors");
    return await this.save();
  } else {
    throw new Error("User is already a member of this team");
  }
};

TeamSchema.methods.isUserInspectorOrLeader = function (userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user");
  }

  return this.inspectors.includes(userId) || this.leader.toString() === userId;
};

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
