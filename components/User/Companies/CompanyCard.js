import UserCompanyActivation from "./UserCompanyActivation";

const CompanyCard = ({ companyName, state, owner, admin, userId }) => {
  return (
    <div className="border border-gray-700 px-4 py-2 flex gap-8 items-center rounded shadow-md shadow-black">
      <div>{companyName}</div>
      {(owner || admin) && <UserCompanyActivation userId={userId} state={state} companyName={companyName} />}
    </div>
  );
};

export default CompanyCard;
