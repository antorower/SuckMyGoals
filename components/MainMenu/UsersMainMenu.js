import React from "react";
import MenuItem from "./MenuItem";
import { auth } from "@clerk/nextjs/server";

const UsersMainMenu = async () => {
  const { userId, sessionClaims } = auth();

  return (
    <div className="flex items-center border-y border-gray-800 w-screen sticky bottom-0 h-[60px] z-50 bg-gray-950">
      <MenuItem link="/user" icon="profile" size={30} alt="profile-icon" border={true} />
      {(sessionClaims.metadata.owner || sessionClaims.metadata.leader) && <MenuItem link="/team" icon="team" size={35} alt="team-icon" border={true} />}
      {userId === "user_2kuThd9M40qCdvbHSbFY0sd8AlS" && <MenuItem link="/trades" icon="trades" size={38} alt="trades-icon" border={true} />}
      <MenuItem link="/calendar" icon="calendar" size={30} alt="calendar-icon" border={sessionClaims.metadata.owner} />
      <MenuItem link="/accounts?sort=default" icon="accounts" size={32} alt="pairs-icon" border={true} />
      {sessionClaims.metadata.owner && <MenuItem link="/users" icon="admin" size={30} alt="admin-icon" border={true} />}
    </div>
  );
};

export default UsersMainMenu;

//      <MenuItem link="/financials" icon="capital" size={30} alt="capital-icon" border={true} />
