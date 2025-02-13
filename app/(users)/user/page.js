import { GetUserById } from "@/lib/UserActions";
import { notFound } from "next/navigation";
import Name from "@/components/User/Name";
import RelatedUser from "@/components/User/RelatedUser";
import Accounts from "@/components/User/Accounts/Accounts";
import ManageCompanies from "@/components/User/Companies/ManageCompanies";
import AddLeader from "@/components/User/AddLeader";
import UserNote from "@/components/User/UserNote";
import PlusButton from "@/components/General/PlusButton";
import { GetDaySchedule } from "@/lib/AppData";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

const User = async ({ searchParams }) => {
  const daySchedule = GetDaySchedule();
  const dayNote = daySchedule?.note;

  const { userId, sessionClaims } = auth();

  if (!userId) notFound();

  const admin = sessionClaims.metadata.owner;
  const owner = !searchParams.user || searchParams.user === sessionClaims.metadata.mongoId;

  const user = await GetUserById(searchParams.user ? searchParams.user : sessionClaims.metadata.mongoId);
  if (!user || user.error) notFound();

  const isLeader = user.leaders.some((leaderId) => leaderId._id.toString() === sessionClaims.metadata.mongoId);

  if (!admin && !owner && !isLeader) notFound();

  return (
    <div className="flex w-full flex-col gap-4">
      <Name firstName={user.firstName} lastName={user.lastName} userId={user._id.toString()} />
      {user.profits > 0 && (
        <div className="pb-4 text-lg font-bold border-b border-gray-800 w-full flex justify-center items-center">
          <Image src="/dollar.svg" width={24} height={24} />
          <div>{Math.floor(user.profits)}</div>
        </div>
      )}
      {admin && <AddLeader userId={user._id.toString()} leaders={JSON.stringify(user.leaders)} />}
      {admin && (
        <Link className="flex justify-end px-4 text-xs" href={`/user/beneficiaries?user=${user._id.toString()}`}>
          Beneficiaries
        </Link>
      )}
      {(admin || owner) && <RelatedUser userId={user._id.toString()} relatedUserFirstName={user.relatedUser?.firstName} />}
      <UserNote userId={user._id.toString()} note={user.note} />
      <div className="w-full text-center text-blue-500">
        <Link href="/stats"> Click here to see our stats </Link>
      </div>
      {dayNote && dayNote !== "" && <div className="text-2xl flex justify-center animate-pulse bg-red-600 w-full p-4 font-semibold">{dayNote}</div>}
      {(admin || owner) && <ManageCompanies userId={user._id.toString()} activeCompanies={user.activeCompanies} admin={admin} owner={owner} />}
      <Accounts accounts={user.accounts} selectedAccounts={searchParams.accounts?.toLowerCase()} userId={user._id.toString()} admin={admin} owner={owner} />
      <PlusButton link={`/accounts/add?user=${user._id.toString()}`} />
    </div>
  );
};

export default User;

/*
{!admin && user.telephone && (
        <div className="absolute left-0 bottom-20 z-50">
          <CallButton telephone={user.telephone} />
        </div>
      )}
      
      */
