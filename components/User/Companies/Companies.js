import CompanyCard from "./CompanyCard";

const Companies = ({ companies, activeCompanies, owner, userId }) => {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {companies.map((company) => (
        <CompanyCard key={company._id.toString()} userId={userId} name={company.name} companyId={company._id.toString()} owner={owner} state={activeCompanies.some((activeCompany) => activeCompany._id.toString() === company._id.toString())} />
      ))}
    </div>
  );
};

export default Companies;
