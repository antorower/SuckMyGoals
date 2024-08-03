"use client";
import Image from "next/image";
import { toast } from "react-toastify";
import { RemoveInvestment } from "@/lib/SettingsActions";
import { useRouter } from "next/navigation";

const DeleteInvestment = ({ investmentId }) => {
  const router = useRouter();

  const Delete = async () => {
    const response = await RemoveInvestment(investmentId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <button onClick={Delete} className="bg-red-700 text-xs px-2 py-1 rounded hover:bg-red-600">
      Delete
    </button>
  );
};

export default DeleteInvestment;
