import TopBar from "@/components/TopBar/TopBar";
import UsersMainMenu from "@/components/MainMenu/UsersMainMenu";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function Home() {
  const clerkUser = await currentUser();
  if (!clerkUser) notFound();

  redirect("/user");

  return (
    <div className="flex justify-center h-screen items-center py-[60px]">
      <TopBar />
      <div className="text-xl">Welcome back, {clerkUser.firstName}</div>
      <UsersMainMenu />
    </div>
  );
}
