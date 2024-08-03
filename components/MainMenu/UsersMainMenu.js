import React from "react";
import MenuItem from "./MenuItem";
import { currentUser } from "@clerk/nextjs/server";
import { GetUserRoles } from "@/lib/UserActions";

const UsersMainMenu = async () => {
  const clerkUser = await currentUser();
  const roles = await GetUserRoles(clerkUser.publicMetadata.mongoId);

  return (
    <div className="flex items-center border-t border-gray-800 w-screen sticky bottom-0 h-[60px] z-50 bg-gray-950">
      <MenuItem link="/user" icon="profile" size={30} alt="profile-icon" border={true} />
      {(roles.owner || roles.leader) && <MenuItem link="/team" icon="team" size={35} alt="team-icon" border={true} />}
      <MenuItem link="/investment" icon="capital" size={30} alt="capital-icon" border={true} />
      <MenuItem link="/calendar" icon="calendar" size={30} alt="calendar-icon" border={roles.owner} />
      {roles.owner && <MenuItem link="/companies" icon="admin" size={30} alt="admin-icon" border={true} />}
    </div>
  );
};

export default UsersMainMenu;
