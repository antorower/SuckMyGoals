import CompanyCard from "./CompanyCard";
import { Companies } from "@/lib/AppData";

const ManageCompanies = ({activeCompanies, admin, owner, userId }) => {  
  const allCompanies = Companies || [];
  return (
    <div className="flex gap-4 justify-center flex-wrap m-4">
      {allCompanies.map((company) => (
        <CompanyCard key={company.name} />
      ))}
    </div>
  );
};

export default ManageCompanies;

/*

 key={company._id.toString()} userId={userId} name={company.name} companyId={company._id.toString()} admin={admin} owner={owner} state={activeCompanies.some((activeCompany) => activeCompany._id.toString() === company._id.toString())} 
 */