import AdminMainMenu from "@/components/MainMenu/AdminMainMenu";
import TopBar from "@/components/TopBar/TopBar";

export default async function AdminLayout({ children }) {
  return (
    <div className="flex flex-col justify-between h-screen py-[60px]">
      <div>
        <TopBar />
      </div>
      <div className="flex-grow overflow-auto">{children}</div>
      <div>
        <AdminMainMenu />
      </div>
    </div>
  );
}
