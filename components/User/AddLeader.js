"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { AddLeaderToUser } from "@/lib/UserActions";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RemoveLeaderFromUser } from "@/lib/UserActions";

const AddLeader = ({ userId, leaders }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [leaderId, setLeaderId] = useState("");
  const [leadersObj, setLeadersObj] = useState([]);

  useEffect(() => {
    setLeadersObj(JSON.parse(leaders));
  }, [leaders]);

  const AddLeader = async () => {
    if (!leaderId || leaderId === "") {
      toast.warn("Please set leader id");
      return;
    }
    const response = await AddLeaderToUser(userId, leaderId);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setLeaderId("");
      setIsExpanded(false);
      router.refresh();
    }
  };

  const RemoveLeader = async (leaderIdForRemove) => {
    const response = await RemoveLeaderFromUser(userId, leaderIdForRemove);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      setLeaderId("");
      setIsExpanded(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col items-end px-4 gap-2">
      <motion.button whileHover={{ scale: 1.1 }} onClick={() => setIsExpanded(!isExpanded)} className="text-xs">
        Add Leader
      </motion.button>
      {isExpanded && (
        <div className="flex flex-col gap-2">
          {leadersObj && leadersObj.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              <div>Leaders: </div>
              {leadersObj.map((leader) => (
                <button onClick={() => RemoveLeader(leader._id.toString())} key={leader._id.toString()}>
                  {leader.firstName} {leader.lastName}
                </button>
              ))}
            </div>
          )}
          <input value={leaderId} onChange={(e) => setLeaderId(e.target.value)} type="text" placeholder="Leader ID" className="input rounded" />
          <button onClick={AddLeader} className="submitButton flex gap-2 justify-center items-center">
            <Image src="/plus.svg" width={14} height={14} alt="plus-icon" />
            <div>Add</div>
          </button>
        </div>
      )}
    </div>
  );
};

export default AddLeader;
