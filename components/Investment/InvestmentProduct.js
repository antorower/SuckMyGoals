import Image from "next/image";
import Link from "next/link";
import CalculateInvestment from "./CalculateInvestment";
import DeleteInvestment from "./DeleteInvestment";

const InvestmentProduct = ({ investment, userId, admin }) => {
  return (
    <div className="flex flex-col gap-2 border-2 border-gray-800 px-4 py-4 max-w-[500px] items-center w-full rounded">
      <div className="flex gap-2 justify-between w-full">
        <div>{investment.company.name}</div>
        <div> ${investment.capital.toLocaleString("de-DE")}</div>
        {admin && <DeleteInvestment investmentId={investment._id} />}
      </div>
      <hr className="border-none bg-gray-800 h-[1px] w-full" />
      <CalculateInvestment amount={investment.cost} interest={investment.interest} capital={investment.capital} userId={userId} companyId={investment.company._id} companyName={investment.company.name} />
    </div>
  );
};

export default InvestmentProduct;
