import { UserButton } from "@clerk/nextjs";
export default async function RegisterLayout({ children }) {
  return (
    <div className="flex flex-col h-screen pt-[60px]">
      <div className="flex items-center justify-evenly border-b border-gray-800 w-screen fixed top-0 h-[60px] z-40 bg-gray-950 px-8">
        <UserButton />
      </div>
      <div className="flex-grow flex items-center justify-center">{children}</div>
    </div>
  );
}
