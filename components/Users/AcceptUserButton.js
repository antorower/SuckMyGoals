"use client";
import { AcceptUser } from "@/lib/UserActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AcceptUserButton = ({ userId }) => {
  const router = useRouter();

  const Accept = async () => {
    const response = await AcceptUser(userId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
  };

  return (
    <button onClick={Accept} className="submitButton">
      Accept
    </button>
  );
};

export default AcceptUserButton;
