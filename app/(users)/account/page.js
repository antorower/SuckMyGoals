import Image from "next/image";
import Link from "next/link";
import { GetAccountById } from "@/lib/AccountActions";
import { notFound } from "next/navigation";

const Account = async ({ searchParams }) => {
  const urlAccountId = searchParams.account;
  if (!urlAccountId) notFound();

  const account = await GetAccountById(urlAccountId);

  return (
    <div className="flex justify-center w-full p-4 text-xl border-b border-gray-800">
      {account.user.firstName} {account.user.lastName}
    </div>
  );
};

export default Account;
