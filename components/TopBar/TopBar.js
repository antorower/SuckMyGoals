import { UserButton } from "@clerk/nextjs";
const TopBar = async () => {
  return (
    <div className="flex items-center justify-evenly border-b border-gray-800 fixed top-0 z-50 w-screen h-[60px] bg-gray-950 px-8">
      <UserButton />
    </div>
  );
};

export default TopBar;
