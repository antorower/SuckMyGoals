import AdminMainMenu from "@/components/MainMenu/AdminMainMenu";
import TopBar from "@/components/TopBar/TopBar";
import { currentUser } from "@clerk/nextjs/server";

export default async function AdminLayout({ children }) {
  const clerkUser = await currentUser();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex justify-center">{children}</div>
      {clerkUser.publicMetadata.owner && <AdminMainMenu />}
    </div>
  );
}
