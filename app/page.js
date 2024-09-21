import TopBar from "@/components/TopBar/TopBar";
import UsersMainMenu from "@/components/MainMenu/UsersMainMenu";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId, sessionClaims } = auth();

  if (!userId) notFound();

  redirect("/user");

  return (
    <div className="flex justify-center h-screen items-center py-[60px]">
      <TopBar />
      <div className="text-xl">Welcome back, {sessionClaims.firstName}</div>
      <UsersMainMenu />
    </div>
  );
}
