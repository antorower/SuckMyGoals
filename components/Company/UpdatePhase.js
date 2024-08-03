"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { UpdatePhaseProperties } from "@/lib/CompanyActions";
import { useRouter } from "next/navigation";

const UpdatePhase = ({ companyId, phase, name, target, dailyDrawdown, maxDrawdown, maxRiskPerTrade, note, minimumProfit }) => {
  const router = useRouter();

  const [isButtonActive, setIsButtonActive] = useState(true);

  const [newName, setNewName] = useState(name);
  const [newTarget, setNewTarget] = useState(target);
  const [newDailyDrawdown, setNewDailyDrawdown] = useState(dailyDrawdown);
  const [newMaxDrawdown, setNewMaxDrawdown] = useState(maxDrawdown);
  const [newMaxRiskPerTrade, setNewMaxRiskPerTrade] = useState(maxRiskPerTrade);
  const [newMinimumProfit, setNewMinimumProfit] = useState(minimumProfit);
  const [newNote, setNewNote] = useState(note);

  const UpdatePhase = async () => {
    setIsButtonActive(false);
    const phaseString = `phase${phase}`;
    const newPhase = {
      _id: companyId,
      [phaseString]: {
        name: newName,
        target: newTarget,
        dailyDrawdown: newDailyDrawdown,
        maxDrawdown: newMaxDrawdown,
        maxRiskPerTrade: newMaxRiskPerTrade,
        note: newNote,
      },
    };
    if (phase === 3) {
      newPhase[phaseString].minimumProfit = newMinimumProfit;
    }

    const response = await UpdatePhaseProperties(companyId, newPhase);
    if (response.error) {
      toast.error(response.message);
      setIsButtonActive(true);
    } else {
      toast.success(response.message);
      router.push("/companies");
    }
  };

  return (
    <div className="form form-small">
      <div className="self-center text-center mb-2">{`Update ${name ? name : `Phase ${phase}`}`}</div>
      <input type="text" placeholder="Name" className="input" value={newName} onChange={(e) => setNewName(e.target.value)} />
      <input type="number" placeholder="Target" className="input" value={newTarget} onChange={(e) => setNewTarget(Number(e.target.value))} />
      <input type="number" placeholder="Daily Drawdown" className="input" value={newDailyDrawdown} onChange={(e) => setNewDailyDrawdown(Number(e.target.value))} />
      <input type="number" placeholder="Max Drawdown" className="input" value={newMaxDrawdown} onChange={(e) => setNewMaxDrawdown(Number(e.target.value))} />
      <input type="number" placeholder="Max Risk Per Trade" className="input" value={newMaxRiskPerTrade} onChange={(e) => setNewMaxRiskPerTrade(Number(e.target.value))} />
      {phase === 3 && <input type="number" placeholder="Minimum Profit" className="input" value={newMinimumProfit} onChange={(e) => setNewMinimumProfit(Number(e.target.value))} />}
      <textarea type="note" placeholder="Note" className="input" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
      <button onClick={UpdatePhase} disabled={!isButtonActive} className="submitButton">
        {name ? "Update" : "Create"}
      </button>
    </div>
  );
};

export default UpdatePhase;

// All fields are the int of percent (for example 10% is 10)
// The Minimum Profit is:
// < 1 if it's in percentage
// > 1 if it's in dollars
