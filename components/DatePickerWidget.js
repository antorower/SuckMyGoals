"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const DatePickerWidget = ({ title }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  return (
    <div className="flex flex-col items-center p-4 bg-gray-950 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-400">{title}</h2>
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} dateFormat="dd/MM/yyyy" className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-950" />
          <div>dslkfj</div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} dateFormat="dd/MM/yyyy" className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-950" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">Selected Start Date: {format(startDate, "MM/dd/yyyy")}</p>
        <p className="text-sm text-gray-600">Selected End Date: {format(endDate, "MM/dd/yyyy")}</p>
      </div>
    </div>
  );
};

export default DatePickerWidget;
