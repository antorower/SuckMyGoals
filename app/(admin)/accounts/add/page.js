import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AddUserAccount } from "@/lib/UserActions";
import { CreateNewAccount } from "@/lib/AccountActions";
import CreateNewAccountForm from "@/components/User/Accounts/CreateNewAccountForm";
import { GetAllCompanies } from "@/lib/CompanyActions";

const Accounts = async ({ searchParams }) => {
  const userId = searchParams.user;
  if (!userId) notFound();

  const companyId = searchParams.company;
  let allCompanies;
  if (!companyId) {
    allCompanies = await GetAllCompanies();
  }
  if (!companyId && (!allCompanies || allCompanies.length) === 0) notFound();
  return (
    <div className="flex gap-4 items-center justify-center flex-grow h-full p-4">
      {companyId && <CreateNewAccountForm userId={userId} companyId={companyId} />}
      {!companyId &&
        allCompanies &&
        allCompanies.length > 0 &&
        allCompanies.map((company) => (
          <Link className="flex items-center gap-2 py-2 px-4 border border-gray-800" key={company.id} href={`/accounts/add?user=${userId}&company=${company._id.toString()}`}>
            <div>
              <Image src="/plus.svg" width={13} height={13} alt="plus-icon" />
            </div>
            <div>{company.name}</div>
          </Link>
        ))}
    </div>
  );
};

export default Accounts;
