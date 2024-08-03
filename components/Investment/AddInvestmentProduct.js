"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AddInvestment } from "@/lib/SettingsActions";
import { useRouter } from "next/navigation";

const AddInvestmentProduct = ({ companies }) => {
  const router = useRouter();
  const [companyId, setCompanyId] = useState("");
  const [capital, setCapital] = useState("");
  const [interest, setInterest] = useState("");
  const [cost, setCost] = useState("");
  const [note, setNote] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const SaveInvestment = async () => {
    if (!companyId || !capital || !interest || !cost) {
      toast.warn("Please fill in all required fields");
      return;
    }

    const newInvestmentProduct = {
      company: companyId,
      capital,
      cost,
      interest,
      note,
    };

    const response = await AddInvestment(newInvestmentProduct);
    if (response.error) {
      toast.error(response.message);
    } else {
      router.refresh();
      toast.success(response.message);
      setCompanyId("");
      setCapital("");
      setInterest("");
      setNote("");
      setCost("");
      setIsExpanded(false);
    }
  };

  const SetCompany = (id) => {
    setCompanyId(id);
  };

  return (
    <div className="max-w-[280px] m-auto">
      {isExpanded && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {companies.map((company) => (
              <button onClick={() => SetCompany(company._id, company.name)} className={`border border-gray-800 ${company._id === companyId ? "bg-green-700" : "bg-gray-800"} px-2 py-1 rounded text-xs`} key={company._id}>
                {company.name}
              </button>
            ))}
          </div>
          <input type="number" value={capital} onChange={(e) => setCapital(e.target.value)} placeholder="Capital" className="input rounded w-full" />
          <input type="number" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="Interest" className="input rounded w-full" />
          <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Cost" className="input rounded w-full" />
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" className="input rounded w-full" />
          <button onClick={SaveInvestment} className="submitButton w-full">
            Add
          </button>
        </div>
      )}
      <button onClick={() => setIsExpanded(!isExpanded)} className={`submitButton w-full ${isExpanded && "mt-2"}`}>
        {isExpanded ? "Cancel" : "Add Investment Product"}
      </button>
    </div>
  );
};

export default AddInvestmentProduct;
