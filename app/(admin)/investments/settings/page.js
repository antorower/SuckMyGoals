import Image from "next/image";
import Link from "next/link";
import { GetInvestmentSettings } from "@/lib/SettingsActions";
import { GetAllCompanies } from "@/lib/CompanyActions";
import { notFound } from "next/navigation";
import AddInvestmentProduct from "@/components/Investment/AddInvestmentProduct";
import { currentUser } from "@clerk/nextjs/server";
import InvestmentProduct from "@/components/Investment/InvestmentProduct";

const InvestmentsSettings = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) notFound();

  let settings = await GetInvestmentSettings();

  let allCompanies = await GetAllCompanies();
  if (!allCompanies || allCompanies.length === 0) notFound();

  const companiesData = allCompanies.map((company) => ({
    _id: company._id.toString(),
    name: company.name,
  }));

  return (
    <div className="flex flex-col p-4 gap-8">
      {clerkUser.publicMetadata.owner && <AddInvestmentProduct companies={companiesData} />}
      {settings && settings.length > 0 && (
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {settings.map((investment) => (
            <InvestmentProduct key={investment._id} investment={investment} userId={clerkUser.publicMetadata.mongoId} admin={clerkUser.publicMetadata.owner} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestmentsSettings;
