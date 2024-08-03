import Image from "next/image";
import Link from "next/link";
import CopyText from "../CopyText";

const Name = ({ firstName, lastName, userId }) => {
  return (
    <div className="flex justify-center items-center p-4 gap-4 text-xl border-b border-gray-800 sticky top-0 bg-gray-950 z-50">
      <CopyText text={userId} message="User copied successfully" />
      <div className="flex gap-2 text-gray-400">
        <div>{firstName}</div>
        <div>{lastName}</div>
      </div>
    </div>
  );
};

export default Name;
