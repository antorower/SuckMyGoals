import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SearchBar from "@/components/Users/SearchBar";
import { GetAllUsers } from "@/lib/UserActions";
import { GetUsersWithNote } from "@/lib/UserActions";
import { GetUsersWithProfits } from "@/lib/UserActions";
import { GetAllFullUsers } from "@/lib/UserActions";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

const Users = async ({ searchParams }) => {
  const { userId, sessionClaims } = auth();
  if (!userId || !sessionClaims.metadata.owner) notFound();

  const searchString = searchParams.search;
  const mode = searchParams.mode;
  let users;

  if (!mode) {
    users = await GetAllUsers();
    if (users?.error) {
      toast.error(users.message);
      notFound();
    }
  }

  if (mode) {
    if (mode === "consistency") {
      users = await GetAllFullUsers("lastTrade");
    }
    if (mode === "accounts") {
      users = await GetAllFullUsers("accounts");
    }
    if (mode === "notes") {
      users = await GetUsersWithNote();
    }
    if (mode === "profits") {
      users = await GetUsersWithProfits();
    }
  }

  if (users?.error) {
    toast.error(users.message);
    notFound();
  }

  if (searchString) {
    const regex = new RegExp(searchString, "i"); // 'i' for case-insensitive
    users = users.filter((user) => regex.test(user.firstName) || regex.test(user.lastName) || regex.test(user.nickname));
  }

  const menu = (
    <div className="flex flex-col justify-center gap-4 items-center">
      <div className="flex flex-wrap justify-center gap-4">
        <Link href={`/users?mode=consistency${searchString ? `&search=${searchString}` : ""}`} className="hover:text-blue-400">
          Consistency
        </Link>
        <Link href={`/users?mode=accounts${searchString ? `&search=${searchString}` : ""}`} className="hover:text-blue-400">
          Accounts
        </Link>
        <Link href={`/users?mode=profits${searchString ? `&search=${searchString}` : ""}`} className="hover:text-blue-400">
          Profits
        </Link>
        <Link href={`/users?mode=notes${searchString ? `&search=${searchString}` : ""}`} className="hover:text-blue-400">
          Notes
        </Link>
      </div>
      <SearchBar mode={mode} />
    </div>
  );
  const teams = (
    <div className="flex flex-col gap-4 p-4">
      <div className="font-bold">Ανδρέας Φέσσας</div>
      <div className="flex flex-wrap gap-2">
        <div className="border border-gray-800 px-3 py-2 rounded">Μαρίνα Παναγιώτου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Μόνικα Ελία</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Νέαρχος</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Μωυσής Παπακυριάκου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Αριστοδήμου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Κωνσταντίνος Ονησιφόρου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Κωνσταντίνος Ονουφρίου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Φάνος Παπακυρικάνου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Ευριπίδης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Χαράλαμπος Ρόζου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Κουλουτσίδης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Αντιγόνη Κορνηλίου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Βανέσσα</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Μιχάλης Σεργίδης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Στυλιανός Θεοδώρου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Στέφανι Φελλά</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Καραπάνος</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Χριστίνα Μιχαήλ</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Χρήστος Αριστείδου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Άντρη Ιακώβου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Χρήστος Σκουφάρης</div>
      </div>
      <div className="font-bold">Θάνος Σουβλέρης</div>
      <div className="flex flex-wrap gap-2">
        <div className="border border-gray-800 px-3 py-2 rounded">Λάζαρος Χαλκίδης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Γεωργία Πέτρου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Μιχάλης Ζεερής</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Δημήτρης Ζερζής</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Πάνος Πάγας</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Ευαγγελία Καλλούδα</div>
      </div>
      <hr className="border-none h-[1px] bg-gray-800" />
      <div className="font-bold">Αντώνης Μαστοράκης</div>
      <div className="flex flex-wrap gap-2">
        <div className="border border-gray-800 px-3 py-2 rounded">Δημήτρης Παπαδάκης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Χριστίνα Μαϊφόσιη</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Θανάσης Αδαμίδης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Αβραάμ Αβραάμ</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Ναυσικά Μαστραντωνάκη</div>
      </div>
      <div className="font-bold">Αβαάμ Κωνσταντίνου</div>
      <div className="flex flex-wrap gap-2">
        <div className="border border-gray-800 px-3 py-2 rounded">Χρυσοβαλάντης Δημοσθένους</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Ανδρέας Αδαμίδης</div>
      </div>
      <div className="font-bold">Θάνος Χατζηνικολάου</div>
      <div className="flex flex-wrap gap-2">
        <div className="border border-gray-800 px-3 py-2 rounded">Θάνος Σουβλέρης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Παναγιώτης Ρετζέπης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Δημήτρης Τέρπος</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Δήμος Ναλμπάντης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Φάνης Ταουκίδης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Μάρκος Καρασαββίδης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Στέλιος Κουρτίδης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Γιαλαντζής</div>
      </div>
      <div className="font-bold">Θανάσης Αδαμίδης</div>
      <div className="flex flex-wrap gap-2">
        <div className="border border-gray-800 px-3 py-2 rounded">Ανδρέας Παπαδόπουλος</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Ειρήνη Αδαμίδου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Αθηνά Μιχαελία</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Γιώργος Σωματάκης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Ανδρεάδης</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Κυριάκος Χαλκίδης</div>
      </div>
      <div className="font-bold">Χριστίνα Μαϊφόσιη</div>
      <div className="flex flex-wrap gap-2">
        <div className="border border-gray-800 px-3 py-2 rounded">Δημήτρης Ξενοφώντος</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Στέλλα Κόκκινου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Ελένη Τονγκίδου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Γεωργία Αναγνώστου</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Αλεξάνδρα Κρητικού</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Πάνος Κρητικός</div>
        <div className="border border-gray-800 px-3 py-2 rounded">Μιχάλης Θεμιστός</div>
      </div>
    </div>
  );

  if (!mode) {
    return (
      <div className="flex w-full flex-col gap-6">
        <div className="flex gap-4 items-center justify-center border-b border-gray-800 p-4">
          <UserButton />
          <div className="text-gray-400">Users</div>
        </div>
        {menu}
        <div className="flex flex-wrap gap-4 justify-center">
          {users &&
            users.length > 0 &&
            users.map((user) => (
              <Link href={`/user?user=${user._id.toString()}`} key={user._id.toString()} className="flex flex-col items-center border border-gray-800 px-3 py-2 rounded max-w-[200px]">
                <div className="flex gap-2 text-gray-300">
                  <div>{user.firstName}</div>
                  <div>{user.lastName}</div>
                </div>
                <div className="text-sm text-gray-500">{user.nickname ? user.nickname : "user"}</div>
              </Link>
            ))}
          {(!users || users.length === 0) && <div className="animate-pulse">No users found</div>}
        </div>
        {teams}
      </div>
    );
  }

  if (mode === "accounts") {
    return (
      <div className="flex flex-col w-full gap-4 pb-[60px] text-gray-400">
        <div className="flex gap-4 justify-center p-4 text-2xl border-b border-gray-800 sticky top-0">
          <UserButton />
          <div>Users</div>
        </div>
        {menu}
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
                <div>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
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
        {teams}
      </div>
    );
  }

  if (mode === "consistency") {
    return (
      <div className="flex flex-col w-full gap-4 pb-[60px] text-gray-400">
        <div className="flex gap-4 justify-center p-4 text-2xl border-b border-gray-800 sticky top-0">
          <UserButton />
          <div>Users</div>
        </div>
        {menu}
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
            </Link>
          ))}
        </div>
        {teams}
      </div>
    );
  }

  if (mode === "notes") {
    return (
      <div className="flex flex-col w-full gap-4 pb-[60px] text-gray-400">
        <div className="flex gap-4 justify-center p-4 text-2xl border-b border-gray-800 sticky top-0">
          <UserButton />
          <div>Users</div>
        </div>
        {menu}
        <div className="flex gap-4 flex-wrap justify-center w-full p-4">
          {users.map((user) => (
            <Link href={`/user?user=${user._id.toString()}`} key={user._id.toString()} className="border border-gray-800 px-4 py-2 flex flex-wrap justify-center gap-4 w-[260px] rounded">
              <div className="text-gray-200">
                {user.firstName} {user.lastName}
              </div>
              {user.note && (
                <>
                  <hr className="border-none h-[1px] bg-gray-800 w-full" />
                  <div className="text-xs text-center">{user?.note ? user.note : "-"}</div>
                  <hr className="border-none h-[1px] bg-gray-800 w-full" />
                </>
              )}
              <div className="flex justify-between w-full items-center">
                <div>Last Trade</div>
                <div>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
              </div>
            </Link>
          ))}
        </div>
        {teams}
      </div>
    );
  }

  if (mode === "profits") {
    return (
      <div className="flex flex-col w-full gap-4 pb-[60px] text-gray-400">
        <div className="flex gap-4 justify-center p-4 text-2xl border-b border-gray-800 sticky top-0">
          <UserButton />
          <div>Users</div>
        </div>
        {menu}
        <div className="flex gap-4 flex-wrap justify-center w-full p-4">
          {users.map((user) => (
            <Link href={`/user?user=${user._id.toString()}`} key={user._id.toString()} className="border border-gray-800 px-4 py-2 flex flex-wrap justify-center gap-4 w-[260px] rounded">
              <div className="text-gray-200">
                {user.firstName} {user.lastName}
              </div>
              <div className="flex justify-between w-full items-center">
                <div>Profits</div>
                <div>${user?.profits ? user.profits : 0}</div>
              </div>
            </Link>
          ))}
        </div>
        {teams}
      </div>
    );
  }
};

export default Users;
