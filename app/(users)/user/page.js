import Image from "next/image";
import Link from "next/link";
import { GetUserById } from "@/lib/UserActions";
import { notFound } from "next/navigation";
import Name from "@/components/User/Name";
import { currentUser } from "@clerk/nextjs/server";
import RelatedUser from "@/components/User/RelatedUser";
import Accounts from "@/components/User/Accounts/Accounts";
import { GetAllCompanies } from "@/lib/CompanyActions";
import Companies from "@/components/User/Companies/Companies";
import AddLeader from "@/components/User/AddLeader";
import CallButton from "@/components/General/CallButton";
import UserNote from "@/components/User/UserNote";
import VotePair from "@/components/Pair/VotePair";

const User = async ({ searchParams }) => {
  const clerkUser = await currentUser();
  if (!clerkUser) notFound();

  const selectedAccount = searchParams.account;
  const vote = searchParams.vote;

  let profileUserId;
  let user;
  profileUserId = searchParams.user;
  if (profileUserId) {
    user = await GetUserById(profileUserId);
  } else {
    user = await GetUserById(clerkUser.publicMetadata.mongoId);
  }
  if (!user) notFound();

  let allCompanies = await GetAllCompanies();
  allCompanies = allCompanies.filter((company) => company.active);

  return (
    <div className="flex w-full flex-col gap-4 pb-[60px]">
      <Name firstName={user.firstName} lastName={user.lastName} userId={user._id.toString()} />
      {clerkUser.publicMetadata.owner && <AddLeader userId={user._id.toString()} leaders={JSON.stringify(user.leaders)} />}
      {(!profileUserId || profileUserId === clerkUser.publicMetadata.mongoId || clerkUser.publicMetadata.owner) && <RelatedUser userId={user._id.toString()} relatedUserFirstName={user.relatedUser?.firstName} />}
      <UserNote userId={user._id.toString()} note={user.note} />
      {(!vote || vote === "yes" || vote === "no") && (!profileUserId || profileUserId === clerkUser.publicMetadata.mongoId) && <VotePair userId={user._id.toString()} help={vote} />}
      <Accounts selectedAccount={selectedAccount} userId={user._id.toString()} admin={clerkUser.publicMetadata.owner} owner={!profileUserId || profileUserId === clerkUser.publicMetadata.mongoId} />
      <Companies companies={allCompanies} userId={user._id.toString()} activeCompanies={user.activeCompanies} admin={clerkUser.publicMetadata.owner} owner={!profileUserId || profileUserId === clerkUser.publicMetadata.mongoId} />
      {!clerkUser.publicMetadata.owner && (
        <div className="absolute left-0 bottom-20 z-50">
          <CallButton telephone={user.telephone} />
        </div>
      )}
    </div>
  );
};

export default User;
