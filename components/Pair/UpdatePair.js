"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { UpdatePairData } from "@/lib/PairActions";
import { useRouter } from "next/navigation";

const UpdatePair = ({ pair, slowMinimumPoints, slowMaximumPoints, fastMinimumPoints, fastMaximumPoints, pointValue }) => {
  const [newSlowMinimumPoints, setNewSlowMinimumPoints] = useState(slowMinimumPoints ? slowMinimumPoints : "");
  const [newSlowMaximumPoints, setNewSlowMaximumPoints] = useState(slowMaximumPoints ? slowMaximumPoints : "");
  const [newFastMinimumPoints, setNewFastMinimumPoints] = useState(fastMinimumPoints ? fastMinimumPoints : "");
  const [newFastMaximumPoints, setNewFastMaximumPoints] = useState(fastMaximumPoints ? fastMaximumPoints : "");
  const [newPointValue, setNewPointValue] = useState(pointValue ? pointValue : "");
  const router = useRouter();

  const SavePair = async () => {
    if (!pair || !newSlowMinimumPoints || !newSlowMaximumPoints || !newFastMinimumPoints || !newFastMaximumPoints || !newPointValue) {
      toast.warn("Please fill all fields");
      return;
    }

    const response = await UpdatePairData(pair, newSlowMinimumPoints, newSlowMaximumPoints, newFastMinimumPoints, newFastMaximumPoints, newPointValue);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.push("/pairs");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center text-2xl p-4 border-b border-gray-800">{pair}</div>
      <div className="flex flex-col gap-2 w-[280px] border border-gray-800 rounded m-auto p-4">
        <input value={newSlowMinimumPoints} onChange={(e) => setNewSlowMinimumPoints(Number(e.target.value))} type="number" placeholder="Slow Minimum Points" className="input rounded" />
        <input value={newSlowMaximumPoints} onChange={(e) => setNewSlowMaximumPoints(Number(e.target.value))} type="number" placeholder="Slow Maximum Points" className="input rounded" />
        <input value={newFastMinimumPoints} onChange={(e) => setNewFastMinimumPoints(Number(e.target.value))} type="number" placeholder="Fast Minimum Points" className="input rounded" />
        <input value={newFastMaximumPoints} onChange={(e) => setNewFastMaximumPoints(Number(e.target.value))} type="number" placeholder="Fast Maximum Points" className="input rounded" />
        <input value={newPointValue} onChange={(e) => setNewPointValue(Number(e.target.value))} type="number" placeholder="Point Value" className="input rounded" />
        <button onClick={SavePair} className="submitButton">
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdatePair;
