"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { UpdateDayNote } from "@/lib/SettingsActions";

const DayNote = ({ day, note }) => {
  const [newNote, setNewNote] = useState(note);

  const SaveNewNote = async () => {
    const response = await UpdateDayNote(day, newNote);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setNewNote(response.note);
    }
  };
  return (
    <div className="flex flex-col gap-4 max-w-[600px] w-full">
      <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} type="text" placeholder="Note" className="input rounded" />
      <button onClick={SaveNewNote} className="submitButton flex gap-2 justify-center items-center h-12">
        <Image src="/save.svg" width={14} height={14} />
        <div>Save Note</div>
      </button>
    </div>
  );
};

export default DayNote;
