import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SearchBar from "@/components/Users/SearchBar";
import { GetAllUsers } from "@/lib/UserActions";
import { GetUsersWithNote } from "@/lib/UserActions";
import { GetUsersWithProfits } from "@/lib/UserActions";
import { GetUsersByAccounts } from "@/lib/UserActions";

const Users = async ({ searchParams }) => {
  const searchString = searchParams.search;
  const mode = searchParams.mode;
  let users;

  if (!mode) {
    users = await GetAllUsers();
    if (users?.error) {
      toast.error(users.message);
      notFound();
    }
    if (!users || users.length === 0) notFound();
    if (searchString) {
      const regex = new RegExp(searchString, "i"); // 'i' for case-insensitive
      users = users.filter((user) => regex.test(user.firstName) || regex.test(user.lastName) || regex.test(user.nickname));
    }
  }

  if (mode) {
    if (mode === "notes") {
      users = await GetUsersWithNote();
    }
    if (mode === "profits") {
      users = await GetUsersWithProfits();
    }
    if (mode === "accounts") {
      users = await GetUsersByAccounts();
    }
  }
  if (users?.error) {
    toast.error(users.message);
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-[800px] m-auto">
      <div className="flex flex-wrap justify-center gap-4 sm:justify-between items-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/users" className="hover:text-blue-400">
            All
          </Link>
          <Link href="/users?mode=accounts" className="hover:text-blue-400">
            Accounts
          </Link>
          <Link href="/users?mode=profits" className="hover:text-blue-400">
            Profits
          </Link>
          <Link href="/users?mode=notes" className="hover:text-blue-400">
            Notes
          </Link>
        </div>
        <SearchBar />
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {users &&
          users.length > 0 &&
          users.map((user) => (
            <Link href={`/user?user=${user._id.toString()}`} key={user._id.toString()} className="flex flex-col items-center border border-gray-800 px-3 py-2 rounded max-w-[200px]">
              <div className="flex gap-2 text-gray-300">
                <div>{user.firstName}</div>
                <div>{user.lastName}</div>
              </div>
              {!mode && <div className="text-sm text-gray-500">{user.nickname ? user.nickname : "user"}</div>}
              {mode === "notes" && <div className="flex justify-center text-center text-xs text-gray-500">{user.note}</div>}
              {mode === "profits" && <div className="flex justify-center text-center text-gray-500">{user.profits}$</div>}
              {mode === "accounts" && (
                <div className="flex justify-center text-center text-gray-500">
                  {user.numberOfAccounts}/{user.maxActiveAccounts}
                </div>
              )}
            </Link>
          ))}
        {(!users || users.length === 0) && <div className="animate-pulse">No users found</div>}
      </div>
    </div>
  );
};

export default Users;
