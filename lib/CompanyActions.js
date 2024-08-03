"use server";
import dbConnect from "@/dbConnect";
import Company from "@/models/Company";
import { revalidatePath } from "next/cache";

// Fixed
export const GetCompanyById = async (companyId) => {
  try {
    await dbConnect();
    return await Company.findById(companyId);
  } catch (error) {
    console.error("Error getting company by id. File: CompanyActions - Function: GetCompanyById", error);
    return { error: true, message: error.message };
  }
};

// Fixed
export const GetAllCompanies = async () => {
  try {
    await dbConnect();
    return await Company.find();
  } catch (error) {
    console.error("Error getting all companies. File: CompanyActions - Function: GetAllCompanies", error);
    return { error: true, message: error.message };
  }
};

// Fixed
export const CreateCompany = async (companyObj) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    const company = new Company(companyObj);
    await company.save();
    return { message: "Company created successfully" };
  } catch (error) {
    console.error("Error creating the company. File: CompanyActions - Function: CreateCompany", error);
    return { error: true, message: error.message };
  }
};

// Fixed
export const UpdateCompany = async (companyObj) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    await Company.findByIdAndUpdate(companyObj._id, companyObj);
    return { message: "Company updated successfully" };
  } catch (error) {
    console.error("Error updating the company. File: CompanyActions - Function: UpdateCompany", error);
    return { error: true, message: error.message };
  }
};

// Fixed
export const UpdateActivation = async (companyId, isActive) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    await Company.findByIdAndUpdate(companyId, { active: isActive });
    return { message: isActive ? "Company is active" : "Company is not active" };
  } catch (error) {
    console.error("Error toggle company active status. File: CompanyActions - Function: UpdateActivation", error);
    return { error: true, message: error.message };
  }
};

// Fixed
export const UpdatePhaseProperties = async (companyId, phase) => {
  try {
    await dbConnect();
    revalidatePath("/", "layout");
    await Company.findByIdAndUpdate(companyId, phase);
    return { message: "Company updated successfully" };
  } catch (error) {
    console.error("Error updating company phase. File: CompanyActions - Function: UpdatePhaseProperties", error);
    return { error: true, message: error.message };
  }
};
