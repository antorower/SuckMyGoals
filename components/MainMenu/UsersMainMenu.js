import React from "react";
import MenuItem from "./MenuItem";
import { currentUser } from "@clerk/nextjs/server";

const UsersMainMenu = async () => {
  const clerkUser = await currentUser();
  return (
    <div className="flex items-center border-t border-gray-800 w-screen sticky bottom-0 h-[60px] z-50 bg-gray-950">
      <MenuItem link="/user" icon="profile" size={30} alt="profile-icon" border={true} />
      {(clerkUser.publicMetadata.owner || clerkUser.publicMetadata.leader) && <MenuItem link="/team" icon="team" size={35} alt="team-icon" border={true} />}
      <MenuItem link="/investment" icon="capital" size={30} alt="capital-icon" border={true} />
      <MenuItem link="/calendar" icon="calendar" size={30} alt="calendar-icon" border={clerkUser.publicMetadata.owner} />
      {clerkUser.publicMetadata.owner && <MenuItem link="/companies" icon="admin" size={30} alt="admin-icon" border={true} />}
    </div>
  );
};

export default UsersMainMenu;
