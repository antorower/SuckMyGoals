"use server";
import dbConnect from "@/dbConnect";
import User from "@/models/User";
import Company from "@/models/Company";
import Account from "@/models/Account";
import Team from "@/models/Team";

export const GetUserById = async (userId) => {
  try {
    await dbConnect();
    return await User.findById(userId)
      .populate("leaders")
      .populate("activeCompanies")
      .populate("relatedUser")
      .populate({ path: "accounts", populate: { path: "company" } });
  } catch (error) {
    console.log("Error getting teams by user: ", error);
    return JSON.stringify({ error: true, message: "Internal error occured, please try again" });
  }
};

export const GetUserAccounts = async (userId) => {
  try {
    await dbConnect();
    const user = User.findById(userId).populate({ path: "accounts", populate: { path: "company" } });
    return user.accounts;
  } catch (error) {
    console.log("Error getting user accounts: ", error);
    return JSON.stringify({ error: true, message: "Internal error occured, please try again" });
  }
};

export const GetUserRoles = async (userId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId).select("roles");
    return user.roles;
  } catch (error) {
    console.log("Error getting teams by user: ", error);
    return { error: true, message: "Internal error occured, please try again" };
  }
};

export const AddRelatedUser = async (userId, relatedUserId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return { error: true, message: "User not found" };
    await user.addRelatedUser(relatedUserId);
    return { error: false, message: "Related user added successfully" };
  } catch (error) {
    console.log("Error adding related user: ", error);
    return JSON.stringify({ error: true, message: error.message });
  }
};

export const RemoveRelatedUser = async (userId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return { error: true, message: "User not found" };
    await user.removeRelatedUser();
    return { error: false, message: "Related user removed successfully" };
  } catch (error) {
    console.log("Error adding related user: ", error);
    return JSON.stringify({ error: true, message: error.message });
  }
};

export const RemoveUserCompany = async (userId, companyId) => {
  try {
    await dbConnect();
    let user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    await user.removeCompany(companyId);
    return { error: false, message: "Company removed successfully" };
  } catch (error) {
    console.log("Error searching users: ", error);
    return { error: true, message: "Internal error occurred, please try again" };
  }
};

export const AddUserCompany = async (userId, companyId) => {
  try {
    await dbConnect();
    let user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    await user.addCompany(companyId);
    return { error: false, message: "Company added successfully" };
  } catch (error) {
    console.log("Error searching users: ", error);
    return { error: true, message: "Internal error occurred, please try again" };
  }
};
// panw - katw
export const IsUserInspector = async (userId) => {
  try {
    await dbConnect();
    const result = await Team.findOne({ inspectors: { $in: [userId] } });
    return result !== null;
  } catch (error) {
    console.log("Error getting teams by user: ", error);
    return { error: true, message: "Internal error occured, please try again" };
  }
};

export const GetSearchedUsers = async (phrase, leaderId, needAccounts, haveProfits) => {
  try {
    await dbConnect();

    // Τραβάω όλους τους users
    let users = await User.find().populate("activeCompanies").populate("leaders").populate("accounts");

    // Ελέγχω αν οποιαδήποτε λέξη του search ταιριάζει με (σχεδόν) οποιοδήποτε property του user
    if (phrase) {
      const words = phrase.split(" ").map((word) => new RegExp(word));
      users = users.filter((user) => words.some((word) => word.test(user.firstName)) || words.some((word) => word.test(user.lastName)) || words.some((word) => word.test(user.telephone)) || words.some((word) => word.test(user.bybitEmail)) || words.some((word) => word.test(user.bybitUid)) || words.some((word) => word.test(user.nickname)));
    }

    // Ελέγχω το filter για τον leader
    if (leaderId) {
      users = users.filter((user) => user.leaders.includes(leaderId));
    }

    // Ελέγχω το filter για τους χρήστες που έχουν profits
    if (haveProfits) {
      users = users.filter((user) => user.profits > 0);
    }

    // Ελέγχω το filter για όσους χρειάζονται accounts
    if (needAccounts) {
      users = users.filter((user) => {
        const totalMaxAccounts = user.activeCompanies.reduce((sum, company) => sum + company.maxAccounts, 0);
        return user.accounts.length < totalMaxAccounts;
      });
    }

    users = users.map((user) => {
      return user.toObject();
    });

    users = users.map((user) => {
      const totalMaxAccounts = user.activeCompanies.reduce((sum, company) => sum + company.maxAccounts, 0);
      user.totalCapital = user.accounts.reduce((sum, account) => sum + account.capital, 0);
      user.accountsRatio = totalMaxAccounts === 0 ? 0 : (user.accounts.length / totalMaxAccounts).toFixed(2);
      user.maxAccounts = totalMaxAccounts;
      user.totalAccounts = user.accounts.length;
      return user;
    });

    users.sort((a, b) => a.totalCapital - b.totalCapital);
    console.log(users);
    return users;
  } catch (error) {
    console.log("Error searching users: ", error);
    return { error: true, message: "Internal error occurred, please try again" };
  }
};

export const GetAllLeadersNameClient = async () => {
  try {
    await dbConnect();
    const users = await User.find({ "roles.leader": true }).select("firstName lastName");
    return JSON.stringify(users);
  } catch (error) {
    console.log("Error getting teams by user: ", error);
    return JSON.stringify({ error: true, message: "Internal error occured, please try again" });
  }
};

export const AddLeaderToUser = async (userId, leaderId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) return { error: true, message: "User not found" };

    await user.addLeader(leaderId);

    return { error: false, message: "Leader added successfully" };
  } catch (error) {
    console.log("Error getting teams by user: ", error);
    return JSON.stringify({ error: true, message: "Internal error occured, please try again" });
  }
};

export const RemoveLeaderFromUser = async (userId, leaderId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) return { error: true, message: "User not found" };

    await user.removeLeader(leaderId);

    return { error: false, message: "Leader removed successfully" };
  } catch (error) {
    console.log("Error getting teams by user: ", error);
    return JSON.stringify({ error: true, message: "Internal error occured, please try again" });
  }
};

export const UpdateUserNote = async (userId, note) => {
  try {
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) return { error: true, message: "User not found" };

    await user.updateNote(note);

    return { error: false, message: "Note updated successfully" };
  } catch (error) {
    console.log("Error getting teams by user: ", error);
    return JSON.stringify({ error: true, message: "Internal error occured, please try again" });
  }
};

export const IsLeader = async (userId, leaderId) => {
  try {
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) return { error: true, message: "User not found" };

    const response = await user.isLeader(leaderId);
    return response;
  } catch (error) {
    console.log("Error getting teams by user: ", error);
    return JSON.stringify({ error: true, message: "Internal error occured, please try again" });
  }
};

export const UserAccountsNeeds = async (userId) => {
  try {
    await dbConnect();

    let user = await User.findById(userId).populate("activeCompanies").populate("accounts");

    const maxAccounts = user.activeCompanies.reduce((sum, company) => sum + company.maxAccounts, 0);
    const activeCapital = user.accounts.reduce((sum, account) => sum + account.capital, 0);
    const accountsCover = maxAccounts === 0 ? 0 : (user.accounts.length / maxAccounts).toFixed(2);
    const activeAccounts = user.accounts.length;

    return { activeAccounts, maxAccounts, accountsCover, activeCapital };
  } catch (error) {
    console.log("Error searching users: ", error);
    return { error: true, message: "Internal error occurred, please try again" };
  }
};
