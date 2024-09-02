"use client";
import { toast } from "react-toastify";
import { ReviewFinished } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";

const AccountLostButton = ({ accountId }) => {
  const router = useRouter();

  const DeleteAccount = async () => {
    const response = await ReviewFinished(accountId);
    if (response.error) {
      toast.error("Error remove account");
    } else {
      toast.success("Account lost successfully");
      router.refresh();
    }
  };

  return (
    <button onClick={DeleteAccount} className="text-gray-600">
      Remove
    </button>
  );
};

export default AccountLostButton;
