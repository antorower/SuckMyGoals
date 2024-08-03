"use server";
import dbConnect from "@/dbConnect";
import Settings from "@/models/Settings";
import { revalidatePath } from "next/cache";

export const UpdateDaySettings = async (day, data) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const settings = await Settings.findOne();
    if (!settings || !settings[day]) throw new Error("Settings not found");
    settings[day] = data;
    await settings.save();
    return { message: "Settings updated successfully" };
  } catch (error) {
    console.error("Error updating day settings. File: SettingsActions - Function: UpdateDaySettings", error);
    return { error: true, message: error.message };
  }
};

export const AddInvestment = async (data) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ investments: [] });
    }
    settings.investments.push(data);
    await settings.save();
    return { message: "Investment schema added successfully" };
  } catch (error) {
    console.error("Error updating day settings. File: SettingsActions - Function: AddInvestment", error);
    return { error: true, message: error.message };
  }
};

export const RemoveInvestment = async (investmentId) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");

    let settings = await Settings.findOne();
    if (!settings) throw new Error("Settings not found");
    settings.investments = settings.investments.filter((investment) => investment._id.toString() !== investmentId.toString());
    await settings.save();
    return { message: "Investment removed successfully" };
  } catch (error) {
    console.error("Error removing investment. File: SettingsActions - Function: RemoveInvestment", error);
    return { error: true, message: error.message };
  }
};

export const ClearDay = async (day) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const settings = await Settings.findOne();
    if (!settings) throw new Error("Settings not found");
    settings[day] = { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" };
    await settings.save();
    return { message: "Settings clear successfully" };
  } catch (error) {
    console.error("Error clear day settings. File: SettingsActions - Function: ClearDay", error);
    return { error: true, message: error.message };
  }
};

export const GetDaySettings = async (day) => {
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    if (!settings || !settings[day]) {
      const newSettings = new Settings({
        monday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        tuesday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        wednesday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        thursday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        friday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        investments: [],
      });
      await newSettings.save();
      return newSettings[day];
    }
    return settings[day];
  } catch (error) {
    console.error("Error getting day settings. File: SettingsActions - Function: GetDaySettings", error);
    return { error: true, message: error.message };
  }
};

export const GetSettings = async () => {
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    if (!settings) {
      const newSettings = new Settings({
        monday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        tuesday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        wednesday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        thursday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        friday: { active: false, schedule: { startingHour: null, endingHour: null, pairs: [] }, note: "" },
        investments: [],
      });
      await newSettings.save();
      return newSettings;
    }
    return settings;
  } catch (error) {
    console.error("Error getting settings. File: SettingsActions - Function: GetSettings", error);
    return { error: true, message: error.message };
  }
};

export const GetInvestmentSettings = async () => {
  try {
    await dbConnect();
    const settings = await Settings.findOne().select("investments").populate({
      path: "investments.company",
      select: "_id name",
      model: "Company",
    });

    let investmentSettings;
    if (settings) {
      investmentSettings = settings.investments.map((investment) => ({
        _id: investment._id.toString(),
        capital: investment.capital,
        cost: investment.cost,
        interest: investment.interest,
        note: investment.note,
        company: {
          _id: investment.company._id.toString(),
          name: investment.company.name,
        },
      }));
    }

    return investmentSettings;
  } catch (error) {
    console.error("Error getting settings. File: SettingsActions - Function: GetInvestmentSettings", error);
    return { error: true, message: error.message };
  }
};

export const ToggleDayActivation = async (day) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const settings = await Settings.findOne();
    if (!settings) throw new Error("Settings not found");
    if (!settings[day]) throw new Error("Day settings not found");
    settings[day].active = !settings[day].active;
    await settings.save();
    return { message: `Day ${settings[day].active ? "activated" : "deactivated"} successfully`, result: settings[day].active };
  } catch (error) {
    console.error("Error toggle day activation. File: SettingsActions - Function: ToggleDayActivation", error);
    return { error: true, message: error.message };
  }
};

export const UpdateDayNote = async (day, note) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const settings = await Settings.findOne();
    if (!settings || !settings[day]) throw new Error("Settings not found");
    settings[day].note = note;
    await settings.save();
    return { message: "Note updated successfully", note: settings[day].note };
  } catch (error) {
    console.error("Error updating day note. File: SettingsActions - Function: UpdateNote", error);
    return { error: true, message: error.message };
  }
};

export const SaveSchedule = async (day, data) => {
  try {
    console.log(data);
    await dbConnect();
    revalidatePath("/", "layout");
    const settings = await Settings.findOne();
    if (!settings || !settings[day]) throw new Error("Settings not found");
    settings[day].mode = data.mode;
    settings[day].schedule = data.schedule;
    await settings.save();
    return { message: "Schedule saved successfully" };
  } catch (error) {
    console.error("Error saving schedule. File: SettingsActions - Function: SaveSchedule", error);
    return { error: true, message: error.message };
  }
};
