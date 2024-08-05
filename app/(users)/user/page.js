import { GetUserById } from "@/lib/UserActions";
import { notFound } from "next/navigation";
import Name from "@/components/User/Name";
import { currentUser } from "@clerk/nextjs/server";
import RelatedUser from "@/components/User/RelatedUser";
import Accounts from "@/components/User/Accounts/Accounts";
import ManageCompanies from "@/components/User/Companies/ManageCompanies";
import AddLeader from "@/components/User/AddLeader";
import CallButton from "@/components/General/CallButton";
import UserNote from "@/components/User/UserNote";
import PlusButton from "@/components/General/PlusButton";

const User = async ({ searchParams }) => {
  const clerkUser = await currentUser();
  if (!clerkUser) notFound();
  const user = await GetUserById(searchParams.user ? searchParams.user : clerkUser.publicMetadata.mongoId);
  if (!user) notFound();

  const admin = clerkUser.publicMetadata.owner;
  const owner = !searchParams.user || searchParams.user === clerkUser.publicMetadata.mongoId;

  return (
    <div className="flex w-full flex-col gap-4 pb-[60px]">
      <Name firstName={user.firstName} lastName={user.lastName} userId={user._id.toString()} />
      {admin && <AddLeader userId={user._id.toString()} leaders={JSON.stringify(user.leaders)} />}
      {(admin || owner) && <RelatedUser userId={user._id.toString()} relatedUserFirstName={user.relatedUser?.firstName} />}
      <UserNote userId={user._id.toString()} note={user.note} />
      {(admin || owner) && <ManageCompanies userId={user._id.toString()} activeCompanies={user.activeCompanies} admin={admin} owner={owner} />}
      <Accounts accounts={user.accounts} selectedAccounts={searchParams.accounts?.toLowerCase()} userId={user._id.toString()} admin={admin} owner={owner} />
      {admin && <PlusButton link={`/accounts/add?user=${user._id.toString()}`} />}
      {!admin && user.telephone && (
        <div className="absolute left-0 bottom-20 z-50">
          <CallButton telephone={user.telephone} />
        </div>
      )}
    </div>
  );
};

export default User;
