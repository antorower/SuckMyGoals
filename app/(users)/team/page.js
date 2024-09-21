import Link from "next/link";
import { notFound } from "next/navigation";
import { GetAllLeaderUsers } from "@/lib/UserActions";
import { GetAllFullUsers } from "@/lib/UserActions";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const Team = async () => {
  const { userId, sessionClaims } = auth();
  if (!userId) notFound();

  if (!sessionClaims.metadata.owner && !sessionClaims.metadata.leader) notFound();

  let users;
  if (sessionClaims.metadata.owner) {
    users = await GetAllFullUsers();
  } else {
    users = await GetAllLeaderUsers(sessionClaims.metadata.mongoId);
  }
  if (!users || users.length === 0) return <div className="animate-pulse p-4">Team members not found...</div>;

  return (
    <div className="flex flex-col w-full gap-4 pb-[60px] text-gray-400">
      <div className="flex gap-4 justify-center p-4 text-2xl border-b border-gray-800 sticky top-0">
        <UserButton />
        <div>Your Team</div>
      </div>
      <div className="flex gap-4 flex-wrap justify-center w-full p-4">
        {users.map((user) => (
          <Link href={`/user?user=${user._id.toString()}`} key={user._id.toString()} className="border border-gray-800 px-4 py-2 flex flex-wrap justify-center gap-4 w-[260px] rounded">
            <div className="text-gray-200">
              {user.firstName} {user.lastName}
            </div>
            {user.note && (
              <>
                <hr className="border-none h-[1px] bg-gray-800 w-full" />
                <div className="text-xs text-center">{user.note}</div>
                <hr className="border-none h-[1px] bg-gray-800 w-full" />
              </>
            )}
            <div className="flex justify-between w-full items-center">
              <div>Last Trade</div>
              <div>{new Date(user.lastTradeOpened).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
            </div>
            <div className="flex justify-between w-full items-center">
              <div>Accounts</div>
              <div className="flex gap-2 items-center">
                <div>
                  {user.numberOfAccounts} / {user.maxActiveAccounts}
                </div>
                <div>({((user.numberOfAccounts * 100) / user.maxActiveAccounts).toFixed(0)}%)</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs w-full">
              <div>Leaders:</div>
              {user.leaders.map((leader) => (
                <div key={leader._id.toString()} className="border border-gray-800 px-2 py-1 rounded">
                  {leader.firstName.slice(0, 3)}. {leader.lastName.slice(0, 3)}.
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1 text-xs w-full">
              <div>Active Companies:</div>
              {user.activeCompanies.map((company) => (
                <div key={company} className="border border-gray-800 px-2 py-1 rounded">
                  {company}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Team;
