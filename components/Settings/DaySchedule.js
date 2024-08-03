"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SaveSchedule } from "@/lib/SettingsActions";
import { useRouter } from "next/navigation";
import { GetAllPairsClient } from "@/lib/PairActions";

const DaySchedule = ({ day }) => {
  /*const allPairs = [
    { pair: "EURUSD", rank: 1 },
    { pair: "USDJPY", rank: 2 },
    { pair: "GBPUSD", rank: 3 },
    { pair: "USDCHF", rank: 4 },
    { pair: "AUDUSD", rank: 5 },
    { pair: "USDCAD", rank: 6 },
    { pair: "NZDUSD", rank: 7 },
    { pair: "EURGBP", rank: 8 },
    { pair: "EURJPY", rank: 9 },
    { pair: "GBPJPY", rank: 10 },
    { pair: "EURCHF", rank: 11 },
    { pair: "GBPCHF", rank: 12 },
    { pair: "AUDJPY", rank: 13 },
    { pair: "AUDNZD", rank: 14 },
    { pair: "CADJPY", rank: 15 },
    { pair: "CHFJPY", rank: 16 },
    { pair: "EURAUD", rank: 17 },
    { pair: "EURCAD", rank: 18 },
    { pair: "EURNZD", rank: 19 },
    { pair: "GBPAUD", rank: 20 },
    { pair: "GBPCAD", rank: 21 },
    { pair: "GBPNZD", rank: 22 },
    { pair: "NZDJPY", rank: 23 },
    { pair: "NZDCAD", rank: 24 },
    { pair: "NZDCHF", rank: 25 },
    { pair: "AUDCAD", rank: 26 },
    { pair: "AUDCHF", rank: 27 },
    { pair: "CADCHF", rank: 28 },
  ];*/
  const router = useRouter();

  const [allPairs, setAllPairs] = useState([]);
  const [filteredPairs, setFilteredPairs] = useState(allPairs);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [startingHour, setStartingHour] = useState("");
  const [endingHour, setEndingHour] = useState("");
  const [mode, setMode] = useState("fast");

  useEffect(() => {
    const GetAllPairs = async () => {
      const response = await GetAllPairsClient();
      const pairs = await JSON.parse(response);
      if (pairs.error) {
        toast.error(pairs.error);
      } else {
        setAllPairs(pairs);
        setFilteredPairs(pairs);
      }
    };

    GetAllPairs();
  }, []);

  const FilterPairs = (currency) => {
    const filteredPairs = allPairs.filter((pair) => pair.pair.includes(currency));
    setFilteredPairs(filteredPairs);
  };

  const ResetPairs = () => {
    setFilteredPairs(allPairs);
  };

  const AddPair = (pair) => {
    if (!selectedPairs.includes(pair)) {
      setSelectedPairs([...selectedPairs, pair]);
    } else {
      toast.info(`${pair} is already selected`);
    }
  };

  const RemovePair = (pair) => {
    setSelectedPairs(selectedPairs.filter((selectedPair) => selectedPair !== pair));
  };

  const AddSchedule = async () => {
    if (!startingHour || startingHour === "") {
      toast.warn("Please set starting hour");
      return;
    }
    if (!endingHour || endingHour === "") {
      toast.warn("Please set ending hour");
      return;
    }
    if (!selectedPairs || selectedPairs.length < 3) {
      toast.warn("Select at least 3 pairs");
      return;
    }

    const data = {
      mode: mode,
      schedule: {
        startingHour: startingHour,
        endingHour: endingHour,
        pairs: selectedPairs,
      },
    };

    const response = await SaveSchedule(day, data);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.push("/settings");
    }
  };

  return (
    <div className="flex flex-col gap-4  max-w-[600px]">
      <button onClick={AddSchedule} className="submitButton font-medium flex items-center gap-4 justify-center">
        <div>
          <Image src="/plus.svg" width={16} height={16} />
        </div>
        <div>Add Schedule</div>
      </button>
      <div className="w-full flex gap-4">
        <input className="input" value={startingHour} onChange={(e) => setStartingHour(Number(e.target.value))} type="number" placeholder="Starting Hour" />
        <input className="input" value={endingHour} onChange={(e) => setEndingHour(Number(e.target.value))} type="number" placeholder="Ending Hour" />
      </div>
      <button onClick={() => setMode(mode === "slow" ? "fast" : "slow")}>Mode: {mode}</button>
      {selectedPairs && selectedPairs.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm justify-center">
          {selectedPairs.map((pair) => (
            <button onClick={() => RemovePair(pair)} className="border border-gray-800  px-2 py-1">
              {pair}
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-wrap border border-gray-800 p-4 rounded justify-between w-full">
        {["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD"].map((currency) => (
          <button key={currency} className="text-sm border border-gray-800 px-2 py-1 rounded" onClick={() => FilterPairs(currency)}>
            {currency}
          </button>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap justify-center text-sm border border-gray-800 p-4">
        {filteredPairs.map((pair, index) => (
          <button onClick={() => AddPair(pair.pair)} key={index} className="flex gap-2 items-center text-gray-400 border border-gray-800 px-2 py-1 rounded">
            <div>{pair.pair}</div>
            <div className="text-blue-500 font-semibold">{pair.spread.average}</div>
          </button>
        ))}
        <button onClick={ResetPairs} className="text-gray-400 border border-gray-800 px-2 py-1 rounded">
          Reset
        </button>
      </div>
    </div>
  );
};

export default DaySchedule;
