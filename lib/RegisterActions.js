"use server";
import dbConnect from "@/dbConnect";
import User from "@/models/User";
import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const RegisterUser = async (formData) => {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const telephone = formData.get("telephone");
  const bybitEmail = formData.get("bybitEmail");
  const bybitUid = formData.get("bybitUid");

  const { userId } = auth();
  let success = false;
  try {
    await dbConnect();
    const newUser = new User({
      clerkId: userId,
      firstName: firstName,
      lastName: lastName,
      telephone: telephone,
      bybitEmail: bybitEmail,
      bybitUid: bybitUid,
    });
    await newUser.save();

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        owner: false,
        leader: false,
        registered: true,
        accepted: false,
        ban: false,
        rejected: false,
        mongoId: newUser._id.toString(),
      },
    });
    success = true;
  } catch (error) {
    console.log("Error from lib/RegisterActions/RegisterUser: ", error);
  } finally {
    if (success) redirect("/approval");
    if (!success) redirect("/register");
  }
};

export const RegisterOwner = async () => {
  const { userId } = auth();
  let success = false;
  try {
    await dbConnect();
    const newUser = new User({
      clerkId: userId,
      firstName: "Antonis",
      lastName: "Mastorakis",
      telephone: "97849792",
      bybitEmail: "antonis.mastorakis@gmail.com",
      bybitUid: "155315263",
      roles: {
        owner: true,
        leader: true,
      },
    });
    await newUser.save();

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        owner: true,
        leader: true,
        registered: true,
        accepted: true,
        ban: false,
        rejected: false,
        mongoId: newUser._id.toString(),
      },
    });
    success = true;
  } catch (error) {
    console.log("Error from lib/RegisterActions/RegisterOwner: ", error);
  } finally {
    if (success) redirect("/approval");
    if (!success) redirect("/register");
  }
};
