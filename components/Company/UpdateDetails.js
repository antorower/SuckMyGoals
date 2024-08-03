"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CreateCompany } from "@/lib/CompanyActions";
import { UpdateCompany } from "@/lib/CompanyActions";
import Link from "next/link";

const UpdateDetails = ({ _id, _name, _link, _numberOfPhases, _maxAccounts, _maxCapital, _companyPhase1Name, _companyPhase2Name, _companyPhase3Name }) => {
  const [name, setName] = useState(_name);
  const [link, setLink] = useState(_link);
  const [numberOfPhases, setNumberOfPhases] = useState(_numberOfPhases);
  const [maxAccounts, setMaxAccounts] = useState(_maxAccounts);
  const [maxCapital, setMaxCapital] = useState(_maxCapital);
  const [isButtonActive, setIsButtonActive] = useState(true);

  const router = useRouter();

  const Create = async () => {
    if (!name || !link || !numberOfPhases || !maxAccounts || !maxCapital) {
      toast.warn("Please fill all fields");
      return;
    }

    setIsButtonActive(false);

    const company = {
      name: name,
      link: link,
      numberOfPhases: numberOfPhases,
      maxAccounts: maxAccounts,
      maxCapital: maxCapital,
    };

    const response = await CreateCompany(company);
    if (response.error) {
      toast.error(response.message);
      setIsButtonActive(true);
    } else {
      toast.success(response.message);
      router.push("/companies");
    }
  };

  const Update = async () => {
    if (!name || !link || !numberOfPhases || !maxAccounts || !maxCapital) {
      toast.warn("Please fill all fields");
      return;
    }

    setIsButtonActive(false);

    const company = {
      _id: _id,
      name: name,
      link: link,
      numberOfPhases: numberOfPhases,
      maxAccounts: maxAccounts,
      maxCapital: maxCapital,
    };

    const response = await UpdateCompany(company);
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
      <div className="self-center text-center mb-2">{_id ? `Update ${_name}` : "Create New Company"}</div>
      <input type="text" placeholder="Name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Link" className="input" value={link} onChange={(e) => setLink(e.target.value)} />
      <input type="number" placeholder="Number of Phases" className="input" value={numberOfPhases} onChange={(e) => setNumberOfPhases(Number(e.target.value))} />
      <input type="number" placeholder="Maximum Accounts" className="input" value={maxAccounts} onChange={(e) => setMaxAccounts(Number(e.target.value))} />
      <input type="number" placeholder="Maximum Capital" className="input" value={maxCapital} onChange={(e) => setMaxCapital(Number(e.target.value))} />
      <button disabled={!isButtonActive} onClick={_id ? Update : Create} className="submitButton">
        {_id ? "Update" : "Create"}
      </button>
      {_id && (
        <div className="flex justify-evenly px-2 text-gray-400 text-sm mt-1">
          {_numberOfPhases === 3 && (
            <Link href={`/companies/update?company=${_id}&phase=1`} className="hover:text-gray-500">
              {_companyPhase1Name ? _companyPhase1Name : "Phase 1"}
            </Link>
          )}
          {_numberOfPhases > 1 && (
            <Link href={`/companies/update?company=${_id}&phase=2`} className="hover:text-gray-500">
              {_companyPhase2Name ? _companyPhase2Name : "Phase 2"}
            </Link>
          )}
          <Link href={`/companies/update?company=${_id}&phase=3`} className="hover:text-gray-500">
            {_companyPhase3Name ? _companyPhase3Name : "Phase 3"}
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpdateDetails;
