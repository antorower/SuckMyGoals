import React from "react";
import MenuItem from "./MenuItem";

const AdminMainMenu = () => {
  return (
    <div className="flex items-center border-y border-gray-800 w-screen sticky bottom-0 z-50 bg-gray-950">
      <MenuItem link="/users" icon="users" size={35} alt="users-icon" border={true} />
      <MenuItem link="/accounts?sort=balance" icon="accounts" size={32} alt="pairs-icon" border={true} />
      <MenuItem link="/trades" icon="trades" size={38} alt="trades-icon" border={true} />
      <MenuItem link="/settings" icon="settings" size={28} alt="settings-icon" border={true} />
      <MenuItem link="/bank" icon="capital" size={30} alt="bank-icon" border={true} />
      <MenuItem link="/user" icon="profile" size={28} alt="user-icon" border={false} />
      {/*<MenuItem link="/pairs" icon="pairs" size={32} alt="pairs-icon" border={true} />*/}
      {/*<MenuItem link="/companies" icon="company" size={28} alt="company-icon" border={true} />*/}
    </div>
  );
};

export default AdminMainMenu;
