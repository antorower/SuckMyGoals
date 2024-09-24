import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

const Settings = () => {
  const { userId, sessionClaims } = auth();
  if (!userId || !sessionClaims.metadata.owner) notFound();

  return <div>Settings</div>;
};

export default Settings;
