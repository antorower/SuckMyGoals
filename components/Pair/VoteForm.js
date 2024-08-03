"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { VotePair } from "@/lib/PairActions";

const VoteForm = ({ pair }) => {
  const [spread, setSpread] = useState("");
  const [isDone, setIsDone] = useState(false);

  const Vote = async () => {
    if (spread === "") {
      toast.warn("Please fill the spread input");
      return;
    }

    setIsDone(true);
    const response = await VotePair(pair, spread);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <>
      {isDone ? null : (
        <div className="max-w-[100px] flex flex-col gap-2 items-center justify-center text-gray-400">
          <div>{pair}</div>
          <input type="number" min={0} max={100} value={spread} onChange={(e) => setSpread(Number(e.target.value))} placeholder="Spread" className="input rounded" />
          <motion.button disabled={isDone} onClick={Vote} whileHover={{ scale: 0.95 }} className="submitButton text-gray-200 font-medium">
            Report
          </motion.button>
        </div>
      )}
    </>
  );
};

export default VoteForm;
