import Image from "next/image";
import Link from "next/link";
import { GetNewUsers } from "@/lib/UserActions";
import AcceptUserButton from "@/components/Users/AcceptUserButton";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const Accept = async () => {
  const newUsers = await GetNewUsers();
  const user = await currentUser();

  if (!user.publicMetadata.owner) notFound();
  return (
    <div className="flex flex-wrap gap-8 p-8">
      {newUsers &&
        newUsers.length > 0 &&
        newUsers.map((user) => (
          <div key={user._id.toString} className="flex flex-col gap-2">
            <div>
              {user.firstName} {user.lastName}
            </div>
            <AcceptUserButton userId={user._id.toString()} />
          </div>
        ))}
    </div>
  );
};

export default Accept;
