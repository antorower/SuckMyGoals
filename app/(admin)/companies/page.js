import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import PlusButton from "@/components/General/PlusButton";
import Link from "next/link";
import { GetAllCompanies } from "@/lib/CompanyActions";
import CompanyCard from "@/components/Company/CompanyCard";

const Companies = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser.publicMetadata.owner) notFound();

  const companies = await GetAllCompanies();

  return (
    <div className="flex flex-col gap-6 h-full w-full max-w-[600px] justify-center items-center p-6 m-auto">
      {companies && companies.length > 0 && companies.map((company) => <CompanyCard key={company._id} company={company} />)}
      {(!companies || companies.length === 0) && (
        <Link href="/companies/update" className="flex justify-center text-blue-300 animate-pulse">
          Click here to create the first company
        </Link>
      )}
      <PlusButton link="/companies/update" />
    </div>
  );
};

export default Companies;
