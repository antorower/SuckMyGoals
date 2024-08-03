import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GetAllLeaderUsers } from "@/lib/UserActions";
import { GetAllFullUsers } from "@/lib/UserActions";
import { currentUser } from "@clerk/nextjs/server";
import CopyText from "@/components/CopyText";

const Team = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) notFound();

  if (!clerkUser.publicMetadata.owner && !clerkUser.publicMetadata.leader) notFound();

  let users;
  if (clerkUser.publicMetadata.owner) {
    users = await GetAllFullUsers();
  } else {
    users = await GetAllLeaderUsers(clerkUser.publicMetadata.mongoId);
  }
  if (!users || users.length === 0) return <div className="animate-pulse p-4">Users not found...</div>;

  return (
    <div className="flex flex-col w-full gap-4 pb-[60px] text-gray-400">
      <div className="flex justify-center p-4 text-2xl border-b border-gray-800 sticky top-0">Your Team</div>
      <div className="flex gap-4 flex-wrap justify-center w-full p-4">
        {users.map((user) => (
          <div key={user._id.toString()} className="border border-gray-800 px-4 py-2 flex flex-col items-center gap-2 max-w-[280px] rounded">
            <div className="flex gap-2 items-center text-gray-200">
              <CopyText text={user._id.toString()} message="User copied successfully" />
              <Link href={`/user?user=${user._id.toString()}`}>
                {user.firstName} {user.lastName}
              </Link>
            </div>
            {user.note && (
              <>
                <hr className="border-none h-[1px] bg-gray-800 w-full" />
                <div className="text-xs text-center">{user.note}</div>
                <hr className="border-none h-[1px] bg-gray-800 w-full" />
              </>
            )}
            <div className="flex justify-between w-full">
              <div>Last Trade</div>
              <div>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
            </div>
            <div className="flex justify-between w-full">
              <div>Accounts</div>
              <div>
                {user.numberOfAccounts} / {user.maxActiveAccounts}
              </div>
              <div>{((user.numberOfAccounts * 100) / user.maxActiveAccounts).toFixed(0)}%</div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs w-full">
              <div>Leaders:</div>
              {user.leaders.map((leader) => (
                <div className="border border-gray-800 px-2 py-1 rounded">
                  {leader.firstName.slice(0, 3)}. {leader.lastName.slice(0, 3)}.
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs w-full">
              <div>Active Companies:</div>
              {user.activeCompanies.map((company) => (
                <div className="border border-gray-800 px-2 py-1 rounded">{company.name}</div>
              ))}
            </div>
            {user.telephone && (
              <a href={`tel:${user.telephone}`} className="hover:underline">
                {user.telephone}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
