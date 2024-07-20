import { currentUser } from "@clerk/nextjs/server";
import UpdateDetails from "@/components/Company/UpdateDetails";
import UpdatePhase from "@/components/Company/UpdatePhase";
import { GetCompany } from "@/lib/CompanyActions";
import { notFound } from "next/navigation";

const Update = async ({ searchParams }) => {
  const clerkUser = await currentUser();
  if (!clerkUser.publicMetadata.owner) notFound();

  const companyId = searchParams.company;

  let company;
  if (companyId) {
    company = await GetCompany(companyId);
    if (!company) notFound();
  }

  const phase = Number(searchParams.phase);
  const phaseObject = phase ? company[`phase${phase}`] : null;

  return (
    <div className="flex flex-col items-center justify-center flex-grow h-full px-4">
      {!phase && <UpdateDetails _id={company?._id.toString()} _name={company?.name} _link={company?.link} _numberOfPhases={company?.numberOfPhases} _maxAccounts={company?.maxAccounts} _maxCapital={company?.maxCapital} _companyPhase1Name={company?.phase1?.name} _companyPhase2Name={company?.phase2?.name} _companyPhase3Name={company?.phase3?.name} />}
      {phase && <UpdatePhase companyId={company?._id.toString()} phase={phase} name={phaseObject?.name} target={phaseObject?.target} dailyDrawdown={phaseObject?.dailyDrawdown} maxDrawdown={phaseObject?.maxDrawdown} maxRiskPerTradeFastStrategy={phaseObject?.maxRiskPerTradeFastStrategy} maxRiskPerTradeSlowStrategy={phaseObject?.maxRiskPerTradeSlowStrategy} note={phaseObject?.note} minimumProfit={phaseObject?.minimumProfit} />}
    </div>
  );
};

export default Update;
