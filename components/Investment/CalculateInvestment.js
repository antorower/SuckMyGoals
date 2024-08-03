"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { CreateInvestmentAccount } from "@/lib/AccountActions";
import { AddAccountToUser } from "@/lib/UserActions";
import { CreateInvestment } from "@/lib/InvestmentActions";

const CalculateInvestment = ({ amount, interest, capital, userId, companyId, companyName }) => {
  const [numberOfPayments, setNumberOfPayments] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [newAccountCreated, setNewAccountCreated] = useState(false);
  const [accountAddedToUser, setAccountAddedToUser] = useState(false);
  const [investmentCreated, setInvestmentCreated] = useState(false);
  const [investmentStart, setInvestmentStart] = useState(false);

  const days = 60;
  const probabilityToGetFunded = 0.34;
  const probabilityForPayment = 0.82;

  const Invest = async () => {
    if (!accountNumber || accountNumber === "") {
      toast.warn("Please provide your account number");
      return;
    }
    setInvestmentStart(true);

    const responseCreatingAccount = await CreateInvestmentAccount(userId, companyId, capital, amount, accountNumber);
    if (responseCreatingAccount.error) {
      toast.error(responseCreatingAccount.message);
    } else {
      setNewAccountCreated(true);
      const newAccountId = responseCreatingAccount.newAccountId;
      const responseAddingAccountToUser = await AddAccountToUser(userId, newAccountId);
      if (responseAddingAccountToUser.error) {
        toast.error(responseAddingAccountToUser.message);
      } else {
        setAccountAddedToUser(true);
        const responseCreatingInvestment = await CreateInvestment(userId, newAccountId, amount, interest);
        if (responseCreatingInvestment.error) {
          toast.error(responseCreatingInvestment.message);
        } else {
          setInvestmentCreated(true);
          toast.success("Your account is ready, and the investment is set!");
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between w-full">
        <div>Investment:</div>
        <div>${amount}</div>
      </div>
      <div className="flex justify-between w-full">
        <div>Interest:</div>
        <div>{interest}%</div>
      </div>
      <div className="flex justify-between w-full">
        <div>Refundable Amount:</div>
        <div>${amount + (amount * interest) / 100}</div>
      </div>
      <hr className="border-none bg-gray-800 h-[1px] w-full" />
      <div className="text-xs text-justify text-gray-400">{`The Daily Credit is the amount that will be credited to your account every day for the next ${60} days. Over this period, you will receive the entire amount plus interest. Each time you receive a payment from any company, you will keep the amount that has been credited up to that day.`}</div>
      <div className="flex justify-between w-full">
        <div>Duration:</div>
        <div>{days} days</div>
      </div>
      <div className="flex justify-between w-full">
        <div>Daily Credit:</div>
        <div>${((amount + (amount * interest) / 100) / days).toFixed(2)}</div>
      </div>
      {isExpanded && (
        <>
          {" "}
          <hr className="border-none bg-gray-800 h-[1px] w-full" />
          <div className="flex flex-col gap-4">
            <div className="text-xs text-justify text-gray-400">From this account, not only will you get your capital back with a 10% interest over a 60-day period, but depending on whether it gets funded and how many times it gets paid, you could further increase your profits. Below, you can find information about the probability of returns.</div>
            <input onChange={(e) => setNumberOfPayments(e.target.value)} type="number" placeholder="Number of payments" className="input rounded" />
            <div className="flex justify-between w-full">
              <div>Probability:</div>
              <div>{numberOfPayments === 0 || numberOfPayments === "" ? "-" : `${(probabilityToGetFunded * Math.pow(probabilityForPayment, numberOfPayments) * 100).toFixed(1)}%`} </div>
            </div>
          </div>
          <hr className="border-none bg-gray-800 h-[1px] w-full" />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between w-full">
              <div>Your Capital:</div>
              <div>${amount}</div>
            </div>
            <div className="flex justify-between w-full">
              <div>Your Interest:</div>
              <div>${(amount * interest) / 100}</div>
            </div>
            <div className="flex justify-between w-full">
              <div>Your Profit Split:</div>
              <div>${capital * 0.02 * 0.8 * 0.15 * numberOfPayments}</div>
            </div>
          </div>
          <hr className="border-none bg-gray-800 h-[1px] w-full" />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between w-full">
              <div>Total Profits:</div>
              <div>${capital * 0.02 * 0.8 * 0.15 * numberOfPayments + (amount * interest) / 100}</div>
            </div>
            <div className="flex justify-between w-full font-semibold">
              <div>Total Returns:</div>
              <div>${capital * 0.02 * 0.8 * 0.15 * numberOfPayments + (amount * interest) / 100 + amount}</div>
            </div>
          </div>
          <hr className="border-none bg-gray-800 h-[1px] w-full" />
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Statistics</div>
            <div className="flex justify-between w-full">
              <div>ROI:</div>
              <div>{(((capital * 0.02 * 0.8 * 0.15 * numberOfPayments + (amount * interest) / 100) * 100) / amount).toFixed(1)}%</div>
            </div>
            <div className="flex justify-between w-full">
              <div>Estimate Days:</div>
              <div>
                {(numberOfPayments == 0 || numberOfPayments == 1) && days}
                {numberOfPayments > 1 && days + (numberOfPayments - 1) * 14}
              </div>
            </div>
            <div className="text-xs text-justify text-gray-400">The number of days is just an estimate. It may vary depending on each company's individual payment cycle.</div>
          </div>
        </>
      )}
      <button onClick={() => setIsExpanded(!isExpanded)} className="submitButton">
        {isExpanded ? "Collapse" : "Inspect"}
      </button>
      <div className="border border-gray-800 p-4 rounded flex flex-col gap-2">
        <div className="font-semibold">Do you want to invest?</div>
        <div className="text-xs text-justify text-gray-400">
          `To invest, you need to purchase an {companyName} account of ${capital.toLocaleString("de-DE")} and provide the account number in the input below. Finally, press "Create Investment." Your account will be automatically ready for trading, and the daily credit amount will start adding to your profits. You can start earning the daily credits immediately from your next payments.`
        </div>
        {!investmentStart && (
          <>
            <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="You new account number" className="input rounded" />
            <button onClick={Invest} className="submitButton">
              Create Investment
            </button>
          </>
        )}
        {investmentStart && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>Creating New Account:</div>
              <Image src={newAccountCreated ? "/tick-green.svg" : "/spinner.svg"} width={16} height={16} alt="icon" className={!newAccountCreated && "animate-spin"} />
            </div>
            <div className="flex justify-between items-center">
              <div>Adding New Account:</div>
              <Image src={accountAddedToUser ? "/tick-green.svg" : "/spinner.svg"} width={16} height={16} alt="icon" className={!accountAddedToUser && "animate-spin"} />
            </div>
            <div className="flex justify-between items-center">
              <div>Creating Investment:</div>
              <Image src={investmentCreated ? "/tick-green.svg" : "/spinner.svg"} width={16} height={16} alt="icon" className={!investmentCreated && "animate-spin"} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculateInvestment;
