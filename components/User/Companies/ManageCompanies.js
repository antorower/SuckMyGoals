import CompanyCard from "./CompanyCard";
import { Companies } from "@/lib/AppData";

const ManageCompanies = ({ activeCompanies = [], admin, owner, userId }) => {
  const allCompanies = (Companies || []).filter((company) => company.active);

  return (
    <div className="flex gap-4 justify-center flex-wrap m-4">
      {allCompanies.map((company) => (
        <CompanyCard key={company.name} companyName={company.name} state={activeCompanies.includes(company.name)} owner={owner} admin={admin} userId={userId} />
      ))}
    </div>
  );
};

export default ManageCompanies;
