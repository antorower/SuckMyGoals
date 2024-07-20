"use server";
import dbConnect from "@/dbConnect";
import Company from "@/models/Company";
import { revalidatePath } from "next/cache";

export const GetCompany = async (companyId) => {
  try {
    await dbConnect();
    const company = await Company.findById(companyId);
    return company;
  } catch (error) {
    console.log("Error getting company from CompanyActions -> GetCompany:", error);
    return null;
  }
};

export const GetAllCompanies = async () => {
  try {
    await dbConnect();
    const companies = await Company.find();
    return companies;
  } catch (error) {
    console.log("Error getting companies from CompanyActions -> GetAllCompanies:", error);
    return null;
  }
};

export const CreateCompany = async (companyObj) => {
  try {
    revalidatePath("/", "layout");
    await dbConnect();
    const company = new Company(companyObj);
    await company.save();
    return { error: false, message: "Company created successfully" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error.message };
  }
};

export const UpdateCompany = async (companyObj) => {
  try {
    revalidatePath("/", "layout");
    await dbConnect();
    await Company.findByIdAndUpdate(companyObj._id, companyObj);
    return { error: false, message: "Company updated successfully" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error.message };
  }
};

export const UpdateActivation = async (companyId, isActive) => {
  revalidatePath("/", "layout");
  try {
    await dbConnect();
    await Company.findByIdAndUpdate(companyId, { active: isActive });
    return { error: false, message: isActive ? "Company is active" : "Company is not active" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error.message };
  }
};

export const UpdatePhaseProperties = async (companyId, phase) => {
  revalidatePath("/", "layout");
  try {
    await dbConnect();
    await Company.findByIdAndUpdate(companyId, phase);
    return { error: false, message: "Company updated successfully" };
  } catch (error) {
    console.log(error);
    return { error: true, message: error.message };
  }
};
