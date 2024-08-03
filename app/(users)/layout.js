import UsersMainMenu from "@/components/MainMenu/UsersMainMenu";

export default async function UsersLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex flex-col items-center">{children}</div>
      <UsersMainMenu />
    </div>
  );
}
