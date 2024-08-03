"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { UpdateUserNote } from "@/lib/UserActions";
import { useRouter } from "next/navigation";

const UserNote = ({ userId, note }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState("");
  const router = useRouter();

  const UpdateNote = async () => {
    const response = await UpdateUserNote(userId, newNote);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setNewNote("");
      router.refresh();
      setIsExpanded(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 border-y border-gray-800  p-4">
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex justify-center w-full animate-pulse text-gray-400">
        {note} (click to update)
      </button>
      {isExpanded && (
        <div className="flex flex-col gap-2 items-center justify-center p-2">
          <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} type="text" placeholder="Note" className="input rounded max-w-[250px]" />
          <button onClick={UpdateNote} className="submitButton max-w-[250px]">
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default UserNote;
