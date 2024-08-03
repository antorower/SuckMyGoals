import Image from "next/image";
import Link from "next/link";
import Days from "@/components/Settings/Days";
import { currentUser } from "@clerk/nextjs/server";

const Settings = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser.publicMetadata.owner) notFound();

  return (
    <div>
      <Days />
    </div>
  );
};

export default Settings;
