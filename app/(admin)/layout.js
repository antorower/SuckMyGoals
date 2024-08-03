import AdminMainMenu from "@/components/MainMenu/AdminMainMenu";
import TopBar from "@/components/TopBar/TopBar";

export default async function AdminLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex-grow flex items-center justify-center">{children}</div>
      <AdminMainMenu />
    </div>
  );
}
