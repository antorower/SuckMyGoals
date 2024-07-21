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

const User = async ({ searchParams }) => {
  const clerkUser = await currentUser();
  if (!clerkUser) notFound();

  const selectedAccount = searchParams.account;

  let profileUserId;
  let user;
  profileUserId = searchParams.userid;
  if (profileUserId) {
    user = await GetUserById(profileUserId);
  } else {
    user = await GetUserById(clerkUser.publicMetadata.mongoId);
  }
  if (!user) notFound();

  let allCompanies = await GetAllCompanies();
  allCompanies = allCompanies.filter((company) => company.active);

  return (
    <div className="flex w-full flex-col gap-2">
      <Name firstName={user.firstName} lastName={user.lastName} userId={user._id.toString()} />
      {(!profileUserId || profileUserId === clerkUser.publicMetadata.mongoId) && <RelatedUser userId={user._id.toString()} relatedUserFirstName={user.relatedUser?.firstName} relatedUserLastName={user.relatedUser?.lastName} />}
      <Companies companies={allCompanies} userId={user._id.toString()} activeCompanies={user.activeCompanies} owner={!profileUserId || profileUserId === clerkUser.publicMetadata.mongoid} />
      <Accounts selectedAccount={selectedAccount} userId={user._id.toString()} />
    </div>
  );
};

export default User;
