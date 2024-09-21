import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CreateNewAccountForm from "@/components/User/Accounts/CreateNewAccountForm";
import { GetUserActiveCompanies } from "@/lib/UserActions";
import { auth } from "@clerk/nextjs/server";

const AddAccount = async ({ searchParams }) => {
  const userId = searchParams.user;
  if (!userId) notFound();
  const { sessionClaims } = auth();
  const isAdmin = sessionClaims.metadata.owner;
  const investor = sessionClaims.metadata.mongoId;

  const allActiveCompanies = await GetUserActiveCompanies(userId);

  const urlCompanyName = searchParams.company;
  const selectedCompany = allActiveCompanies.find((company) => company === urlCompanyName);

  return (
    <div className="flex gap-4 items-center justify-center flex-grow h-full p-4">
      {selectedCompany && <CreateNewAccountForm userIdAccountOwner={userId} companyName={selectedCompany} isAdmin={isAdmin} investor={investor} />}
      {!selectedCompany &&
        allActiveCompanies &&
        allActiveCompanies.length > 0 &&
        allActiveCompanies.map((company) => (
          <Link className="flex items-center gap-2 py-2 px-4 border border-gray-800" key={company} href={`/accounts/add?user=${userId}&company=${company}`}>
            <div>
              <Image src="/plus.svg" width={13} height={13} alt="plus-icon" />
            </div>
            <div>{company}</div>
          </Link>
        ))}
    </div>
  );
};

export default AddAccount;
