"use server";
import dbConnect from "@/dbConnect";
import User from "@/models/User";
import Account from "@/models/Account";
import { revalidatePath } from "next/cache";

export const GetUserById = async (userId) => {
  try {
    await dbConnect();
    return await User.findById(userId)
      .populate("leaders")
      .populate("relatedUser")
      .populate({ path: "accounts", populate: { path: "lastTrade" } });
  } catch (error) {
    console.error("Error getting user by id. File: UserActions - Function: GetUserById ", error);
    return { error: true, message: error.message };
  }
};

export const AddRelatedUser = async (userId, relatedUserId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    user.relatedUser = relatedUserId;
    await user.save();
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
    user.relatedUser = null;
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

export const GetUserActiveCompanies = async (userId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId).select("activeCompanies");
    if (!user) throw new Error("User not found");
    return user.activeCompanies;
  } catch (error) {
    console.error("Error getting user by id. File: UserActions - Function: GetUserById ", error);
    return { error: true, message: error.message };
  }
};

// -----------------------------------------------------------------

export const GetAllUsers = async () => {
  try {
    await dbConnect();
    return await User.find().select("firstName lastName nickname");
  } catch (error) {
    console.error("Error getting all users. File: UserActions - Function: GetAllUsers", error);
    return { error: true, message: error.message };
  }
};

export const GetAllFullUsers = async () => {
  try {
    await dbConnect();
    const users = await User.find().populate("leaders").populate("activeCompanies").populate("relatedUser").populate("accounts");

    const transformedUsers = users.map((user) => {
      const activeCompaniesMaxAccounts = user.activeCompanies.reduce((sum, company) => {
        return company.active ? sum + company.maxAccounts : sum;
      }, 0);

      return {
        ...user.toObject(),
        numberOfAccounts: user.accounts.length,
        maxActiveAccounts: activeCompaniesMaxAccounts,
      };
    });

    transformedUsers.sort((a, b) => new Date(a.lastTradeOpened) - new Date(b.lastTradeOpened));

    return transformedUsers;
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
      .populate("activeCompanies")
      .populate("relatedUser")
      .populate("accounts");

    const transformedUsers = users.map((user) => {
      const activeCompaniesMaxAccounts = user.activeCompanies.reduce((sum, company) => {
        return company.active ? sum + company.maxAccounts : sum;
      }, 0);

      return {
        ...user.toObject(),
        numberOfAccounts: user.accounts.length,
        maxActiveAccounts: activeCompaniesMaxAccounts,
      };
    });

    transformedUsers.sort((a, b) => new Date(a.lastTradeOpened) - new Date(b.lastTradeOpened));

    return transformedUsers;
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

export const GetUsersByAccounts = async () => {
  try {
    await dbConnect();
    const users = await User.find().select("firstName lastName nickname accounts activeCompanies").populate("activeCompanies");
    if (!users || users.length === 0) throw new Error("Users not found");
    const filteredUsers = users
      .map((user) => {
        const activeCompaniesMaxAccounts = user.activeCompanies.reduce((sum, company) => {
          return company.active ? sum + company.maxAccounts : sum;
        }, 0);

        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          nickname: user.nickname,
          numberOfAccounts: user.accounts.length,
          maxActiveAccounts: activeCompaniesMaxAccounts,
        };
      })
      .filter((user) => user.numberOfAccounts < user.maxActiveAccounts)
      .sort((a, b) => a.numberOfAccounts - b.numberOfAccounts);

    return filteredUsers;
  } catch (error) {
    console.error("Error getting users by accounts. File: UserActions - Function: GetUsersByAccounts", error);
    return { error: true, message: error.message };
  }
};

export const GetUserProfits = async (userId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId).select("profits");
    return user.profits;
  } catch (error) {
    console.error("Error getting user by id. File: UserActions - Function: GetUserById ", error);
    return { error: true, message: error.message };
  }
};

export const GetUserRoles = async (userId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId).select("roles");
    return user?.roles;
  } catch (error) {
    console.error("Error getting roles of the user. File: UserActions - Function: GetUserRoles", error);
    return { error: true, message: error.message };
  }
};

export const AddAccountToUser = async (userId, accountId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    let user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.accounts.includes(accountId)) {
      user.accounts.push(accountId);
      await user.save();
    } else {
      return { message: "Account is already included" };
    }
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
    if (user.accounts.includes(accountId)) {
      user.accounts.pull(accountId);
      await user.save();
    } else {
      return { message: "Account has already removed" };
    }
    return { message: "Account removed successfully" };
  } catch (error) {
    console.error("Error removing account from user. File: UserActions - Function: RemoveAccountFromUser ", error);
    return { error: true, message: error.message };
  }
};

export const GetAllUserAccounts = async (userId) => {
  try {
    await dbConnect();
    let user = await User.findById(userId).populate({
      path: "accounts",
      populate: {
        path: "company",
        model: "Company",
      },
    });
    if (!user) throw new Error("User not found");
    return user.accounts;
  } catch (error) {
    console.error("Error getting user accounts. File: UserActions - Function: GetAllUserAccounts", error);
    return { error: true, message: error.message };
  }
};

export const AddLeaderToUser = async (userId, leaderId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.leaders.includes(leaderId)) {
      user.leaders.push(leaderId);
      await user.save();
      return { message: "Leader added successfully" };
    }
    return { message: "Leader is already included" };
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
    if (user.leaders.includes(leaderId)) {
      user.leaders.pull(leaderId);
      await user.save();
      return { message: "Leader removed successfully" };
    }
    return { message: "Leader is already removed" };
  } catch (error) {
    console.error("Error removing leader from user. File: UserActions - Function: RemoveLeaderFromUser", error);
    return { error: true, message: error.message };
  }
};

export const UpdateUserNote = async (userId, note) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    user.note = note;
    await user.save();
    return { message: "Note updated successfully" };
  } catch (error) {
    console.error("Error updating user note. File: UserActions - Function: UpdateUserNote", error);
    return { error: true, message: error.message };
  }
};
