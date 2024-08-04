import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CreateNewAccountForm from "@/components/User/Accounts/CreateNewAccountForm";
import { Companies } from "@/lib/AppData";

const Accounts = async ({ searchParams }) => {
  const allCompanies = Companies || [];
  
  const userId = searchParams.user;
  if (!userId) notFound();
  
  const urlCompanyName = searchParams.company;  
  const selectedCompany = allCompanies.find(company => company.name === urlCompanyName);

  return (
    <div className="flex gap-4 items-center justify-center flex-grow h-full p-4">
      {selectedCompany && <CreateNewAccountForm userId={userId} companyName={selectedCompany.name} />}
      {!selectedCompany &&
        allCompanies &&
        allCompanies.length > 0 &&
        allCompanies.map((company) => (
          <Link className="flex items-center gap-2 py-2 px-4 border border-gray-800" key={company.name} href={`/accounts/add?user=${userId}&company=${company.name}`}>
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
