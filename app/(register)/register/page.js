import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { RegisterUser } from "@/lib/RegisterActions";
import { RegisterOwner } from "@/lib/RegisterActions";

const Register = async () => {
  const clerkUser = await currentUser();
  return (
    <form action={clerkUser?.publicMetadata.owner ? RegisterOwner : RegisterUser} autoComplete="none" className="flex flex-col w-full max-w-[300px]">
      <input type="text" required pattern="[A-Za-z]+" title="First name should only contain letters." minLength={3} maxLength={20} name="firstName" autoComplete="none" placeholder="First Name" className={`${inputClasses} border-t border-x rounded-t`} />
      <input type="text" required pattern="[A-Za-z]+" title="Last name should only contain letters." minLength={3} maxLength={20} name="lastName" autoComplete="none" placeholder="Last Name" className={`${inputClasses} border-t border-x`} />
      <input type="tel" title="Telephone should only contain numbers and special characters like +, -, (, )." minLength={3} maxLength={20} name="telephone" autoComplete="none" placeholder="Telephone" className={`${inputClasses} border-t border-x`} />
      <input type="email" minLength={3} maxLength={50} name="bybitEmail" autoComplete="none" placeholder="Bybit Email" className={`${inputClasses} border-t border-x`} />
      <input type="text" required minLength={3} maxLength={20} name="bybitUid" autoComplete="none" placeholder="Bybit Uid" className={`${inputClasses} border`} />
      <button type="submit" required className="bg-orange-700 p-3 rounded-b hover:bg-orange-600 text-white font-semibold outline-none">
        Register
      </button>
    </form>
  );
};

export default Register;

const inputClasses = "border-gray-800 bg-gray-900 focus:bg-gray-950 py-2 px-3 outline-none text-white w-full";
