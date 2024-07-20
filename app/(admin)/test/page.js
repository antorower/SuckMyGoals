import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import PlusButton from "@/components/General/PlusButton";
import Link from "next/link";
import { GetAllCompanies } from "@/lib/CompanyActions";

const Companies = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser.publicMetadata.owner) notFound();
  const companies = await GetAllCompanies();
  console.log(companies);
  return (
    <div className="">
      <Link href="/companies/update?company=6694e560b68efe7dfc8f1172">safkjsdk</Link>
      <PlusButton link="/companies/update-company" />
    </div>
  );
};

export default Companies;
