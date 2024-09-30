import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GetUserById } from "@/lib/UserActions";
import AddBeneficiaryForm from "@/components/User/AddBeneficiaryForm";
import BeneficiaryCard from "@/components/User/BeneficiaryCard";
import { auth } from "@clerk/nextjs/server";

const Beneficiaries = async ({ searchParams }) => {
  const { userId, sessionClaims } = auth();
  if (!userId || !sessionClaims.metadata.owner) notFound();

  const userIdParam = searchParams.user;
  if (!userIdParam) notFound();

  const user = await GetUserById(userIdParam);
  if (!user || user.error) notFound();

  return (
    <div className="flex flex-col w-full items-center gap-8">
      <div className="border border-b w-full border-gray-800 p-4 text-xl flex justify-center text-gray-400">
        {user.firstName} {user.lastName} - Beneficiaries
      </div>
      {user.beneficiaries && user.beneficiaries.length > 0 && user.beneficiaries.map((beneficiary) => <BeneficiaryCard key={beneficiary._id.toString()} userId={user._id.toString()} beneficiaryId={beneficiary.user._id.toString()} firstName={beneficiary.user.firstName} lastName={beneficiary.user.lastName} percentage={beneficiary.percentage} />)}
      {sessionClaims.metadata.owner && <AddBeneficiaryForm userId={user._id.toString()} />}
    </div>
  );
};

export default Beneficiaries;
