import AdminMainMenu from "@/components/MainMenu/AdminMainMenu";
import TopBar from "@/components/TopBar/TopBar";
import { auth } from "@clerk/nextjs/server";

export default async function AdminLayout({ children }) {
  const { sessionClaims } = auth();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex justify-center">{children}</div>
      {sessionClaims.metadata.owner && <AdminMainMenu />}
    </div>
  );
}
