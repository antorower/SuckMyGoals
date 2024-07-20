import { UserButton } from "@clerk/nextjs";
import UsersMainMenu from "@/components/MainMenu/UsersMainMenu";

export default async function UsersLayout({ children }) {
  return (
    <div className="flex flex-col">
      <div className="flex-grow flex items-center justify-center">{children}</div>
      <UsersMainMenu />
    </div>
  );
}
