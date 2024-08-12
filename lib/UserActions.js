"use server";
import dbConnect from "@/dbConnect";
import User from "@/models/User";
import Account from "@/models/Account";
import Trade from "@/models/Trade";
import { revalidatePath } from "next/cache";
import { Companies } from "./AppData";

// GET METHODS
export const GetUserById = async (userId) => {
  try {
    await dbConnect();
    return await User.findById(userId)
      .populate("leaders")
      .populate("relatedUser")
      .populate({ path: "accounts", populate: { path: "lastTrade" } })
      .populate({ path: "beneficiaries.user" });
  } catch (error) {
    console.error("Error getting user by id. File: UserActions - Function: GetUserById ", error);
    return { error: true, message: error.message };
  }
};

export const GetUserActiveCompanies = async (userId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId).select("activeCompanies");
    if (!user) throw new Error("User not found");
    return user.activeCompanies;
  } catch (error) {
    console.error("Error getting user active companies. File: UserActions - Function: GetUserActiveCompanies ", error);
    return { error: true, message: error.message };
  }
};

export const GetAllUsers = async () => {
  try {
    await dbConnect();
    return await User.find().select("firstName lastName nickname");
  } catch (error) {
    console.error("Error getting all users. File: UserActions - Function: GetAllUsers", error);
    return { error: true, message: error.message };
  }
};
export const GetAllFullUsers = async (sortBy) => {
  try {
    await dbConnect();
    const users = await User.find().populate("leaders").populate("relatedUser").populate("accounts").populate("beneficiaries.user");

    const richUsers = users.map((user) => {
      let maxActiveAccounts = 0;
      const activeCompanies = Companies.filter((company) => user.activeCompanies.includes(company.name));
      activeCompanies.forEach((company) => {
        maxActiveAccounts = maxActiveAccounts + company.maxAccounts;
      });

      const numberOfAccounts = user.accounts.length;
      const ratio = maxActiveAccounts > 0 ? numberOfAccounts / maxActiveAccounts : 1;

      return {
        ...user.toObject(),
        numberOfAccounts: numberOfAccounts,
        maxActiveAccounts: maxActiveAccounts,
        accountRatio: ratio, // Store the ratio for sorting
      };
    });

    if (sortBy === "lastTrade") {
      richUsers.sort((a, b) => new Date(a.lastTradeOpened) - new Date(b.lastTradeOpened));
    } else if (sortBy === "accounts") {
      richUsers.sort((a, b) => a.accountRatio - b.accountRatio);
    }

    return richUsers;
  } catch (error) {
    console.error("Error getting all full users. File: UserActions - Function: GetAllFullUsers", error);
    return { error: true, message: error.message };
  }
};

export const GetAllLeaderUsers = async (leaderId) => {
  try {
    await dbConnect();
    const users = await User.find({ leaders: { $in: [leaderId] } })
      .populate("leaders")
      .populate("relatedUser")
      .populate("accounts")
      .populate("beneficiaries.user");

    const richUsers = users.map((user) => {
      let maxActiveAccounts = 0;
      const activeCompanies = Companies.filter((company) => user.activeCompanies.includes(company.name));
      activeCompanies.forEach((company) => {
        maxActiveAccounts = maxActiveAccounts + company.maxAccounts;
      });

      return {
        ...user.toObject(),
        numberOfAccounts: user.accounts.length,
        maxActiveAccounts: maxActiveAccounts,
      };
    });

    richUsers.sort((a, b) => new Date(a.lastTradeOpened) - new Date(b.lastTradeOpened));

    return richUsers;
  } catch (error) {
    console.error("Error getting all leader users. File: UserActions - Function: GetAllLeaderUsers", error);
    return { error: true, message: error.message };
  }
};
export const GetUsersWithNote = async () => {
  try {
    await dbConnect();
    return await User.find({
      note: { $exists: true, $ne: null, $ne: "" },
    }).select("firstName lastName nickname note");
  } catch (error) {
    console.error("Error getting users with notes. File: UserActions - Function: GetUsersWithNote", error);
    return { error: true, message: error.message };
  }
};
export const GetUsersWithProfits = async () => {
  try {
    await dbConnect();
    return await User.find({
      profits: { $ne: 0 },
    })
      .select("firstName lastName nickname profits")
      .sort({ profits: -1 });
  } catch (error) {
    console.error("Error getting users with profits. File: UserActions - Function: GetUsersWithProfits", error);
    return { error: true, message: error.message };
  }
};

// UPDATE METHODS
export const AddRelatedUser = async (userId, relatedUserId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await user.addRelatedUser(relatedUserId);

    return { message: "Related user added successfully" };
  } catch (error) {
    console.error("Error adding related user. File: UserActions - Function: AddRelatedUser", error);
    return { error: true, message: error.message };
  }
};
export const RemoveRelatedUser = async (userId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await user.removeRelatedUser();

    await user.save();
    return { message: "Related user removed successfully" };
  } catch (error) {
    console.error("Error removing related user. File: UserActions - Function: RemoveRelatedUser", error);
    return { error: true, message: error.message };
  }
};

export const ActivateCompany = async (userId, companyName) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await user.addActiveCompany(companyName);

    return { message: "Company added successfully" };
  } catch (error) {
    console.error("Error activating company. File: UserActions - Function: ActivateCompany", error);
    return { error: true, message: error.message };
  }
};
export const DeactivateCompany = async (userId, companyName) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await user.removeActiveCompany(companyName);

    return { message: "Company removed successfully" };
  } catch (error) {
    console.error("Error deactivating company. File: UserActions - Function: DeactivateCompany", error);
    return { error: true, message: error.message };
  }
};

export const AddLeaderToUser = async (userId, leaderId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await user.addLeader(leaderId);

    return { message: "Leader added successfully" };
  } catch (error) {
    console.error("Error adding leader to user. File: UserActions - Function: AddLeaderToUser", error);
    return { error: true, message: error.message };
  }
};
export const RemoveLeaderFromUser = async (userId, leaderId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    await user.removeLeader(leaderId);

    return { message: "Leader removed successfully" };
  } catch (error) {
    console.error("Error removing leader from user. File: UserActions - Function: RemoveLeaderFromUser", error);
    return { error: true, message: error.message };
  }
};

export const AddAccountToUser = async (userId, accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    let user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.addAccount(accountId);

    return { message: "Account added successfully" };
  } catch (error) {
    console.error("Error adding account to user. File: UserActions - Function: AddAccountToUser ", error);
    return { error: true, message: error.message };
  }
};
export const RemoveAccountFromUser = async (userId, accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    let user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await user.removeAccount(accountId);

    return { message: "Account removed successfully" };
  } catch (error) {
    console.error("Error removing account from user. File: UserActions - Function: RemoveAccountFromUser ", error);
    return { error: true, message: error.message };
  }
};

export const UpdateUserNote = async (userId, note) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    await user.updateNote(note);

    return { message: "Note updated successfully" };
  } catch (error) {
    console.error("Error updating user note. File: UserActions - Function: UpdateUserNote", error);
    return { error: true, message: error.message };
  }
};
