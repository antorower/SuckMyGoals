"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { UpdatePayoutRequestDate } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";

const DayPicker = ({ accountId, savedDay, savedMonth, savedYear }) => {
  const [day, setDay] = useState(savedDay || 1);
  const [month, setMonth] = useState(savedMonth || 1);
  const [year, setYear] = useState(savedYear || 1);
  const [isButtonActive, setIsButtonActive] = useState(true);
  const router = useRouter();

  const handleDayChange = (e) => {
    setDay(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const UpdateDate = async () => {
    setIsButtonActive(false);
    const response = await UpdatePayoutRequestDate(accountId, day, month, year);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
    setIsButtonActive(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          <div className="m-auto text-gray-400 text-xs">Day</div>
          <select value={day} onChange={handleDayChange} className="bg-gray-800 text-gray-400 p-2 rounded focus:outline-none focus:ring-2">
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="m-auto text-gray-400 text-xs">Month</div>
          <select value={month} onChange={handleMonthChange} className="bg-gray-800 text-gray-400 p-2 rounded focus:outline-none focus:ring-2">
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="m-auto text-gray-400 text-xs">Year</div>
          <select value={year} onChange={handleYearChange} className="bg-gray-800 text-gray-400 p-2 rounded focus:outline-none focus:ring-2">
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>
      <button disabled={!isButtonActive} onClick={UpdateDate} className="submitButton">
        Save Date
      </button>
    </div>
  );
};

export default DayPicker;
