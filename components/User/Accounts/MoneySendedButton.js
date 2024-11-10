"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MoneySended } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";
import { GetUserProfitsByClerkId } from "@/lib/UserActions";

const MoneySendedButton = ({ accountId, clerkId, mongoId }) => {
  const [accountBalance, setAccountBalance] = useState("");
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [profitShare, setProfitShare] = useState(0);
  const [userProfits, setUserProfits] = useState(0);
  const [refund, setRefund] = useState(0);
  const [finalAmount, setFinalAmount] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(true);
  const router = useRouter();

  // Fetch user profits using Clerk ID
  useEffect(() => {
    const fetchUserProfits = async () => {
      try {
        const profits = await GetUserProfitsByClerkId(clerkId);
        setUserProfits(profits);
      } catch (error) {
        toast.error("Error fetching user profits.");
      }
    };
    fetchUserProfits();
  }, []);

  useEffect(() => {
    if (payoutAmount && payoutAmount > 0) {
      setProfitShare(Math.round(payoutAmount * 0.15));
    } else {
      setProfitShare(0);
    }

    if (payoutAmount && payoutAmount > 0) {
      if (userProfits > payoutAmount * 0.5) {
        setRefund(payoutAmount * 0.5);
      } else {
        setRefund(userProfits);
      }
    }
  }, [payoutAmount]);

  useEffect(() => {
    setFinalAmount(Math.round(profitShare + refund));
  }, [profitShare, refund]);

  const SendMoney = async () => {
    setIsButtonActive(false);

    // Convert inputs to numbers before sending to MoneySended
    const accountBalanceNum = parseFloat(accountBalance);
    const payoutAmountNum = parseFloat(payoutAmount);
    const profitShareNum = parseFloat(profitShare);
    const refundNum = parseFloat(refund);
    const finalAmountNum = parseFloat(finalAmount);

    if (isNaN(accountBalanceNum) || isNaN(payoutAmountNum) || isNaN(profitShareNum) || isNaN(refundNum)) {
      toast.error("Please enter valid numbers.");
      setIsButtonActive(true);
      return;
    }

    //mongoId ειναι το id του user
    const response = await MoneySended(mongoId, accountId, accountBalanceNum, payoutAmountNum, profitShareNum, refundNum, finalAmountNum);

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }

    setIsButtonActive(true);
  };

  return (
    <div className="w-full max-w-96 m-auto flex flex-col gap-2">
      <div className="text-sm text-gray-500">What's the account balance?</div>
      <input type="number" className="input" placeholder="Account Balance" value={accountBalance} onChange={(e) => setAccountBalance(Math.round(e.target.value))} />
      <div className="text-sm text-gray-500">How much the company send you?</div>
      <input type="number" className="input" placeholder="Payout Amount" value={payoutAmount} onChange={(e) => setPayoutAmount(Math.round(e.target.value))} />
      <div className="text-sm text-gray-500">Your profits are:</div>
      <input type="number" className="input" placeholder="Your 15% profit share" value={Math.round(profitShare)} readOnly />
      <div className="text-sm text-gray-500">Your total profits are ${userProfits}. Your refund is:</div>
      <input type="number" className="input" placeholder="Refund Amount" value={Math.round(refund)} readOnly />
      <div className="text-sm text-gray-500">Final Amount:</div>
      <input type="number" className="input" placeholder="Final Amount" value={Math.round(finalAmount)} readOnly />
      {payoutAmount > 0 && (
        <button className="bg-blue-600 w-full max-w-96 mt-2 p-4 rounded hover:bg-blue-700" onClick={SendMoney} disabled={!isButtonActive}>
          I keep ${0} and I send ${parseFloat(payoutAmount)}
        </button>
      )}
    </div>
  );
};

export default MoneySendedButton;
//PROFITSCHANGE
/*

"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MoneySended } from "@/lib/AccountActions";
import { useRouter } from "next/navigation";
import { GetUserProfitsByClerkId } from "@/lib/UserActions";

const MoneySendedButton = ({ accountId, clerkId, mongoId }) => {
  const [accountBalance, setAccountBalance] = useState("");
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [profitShare, setProfitShare] = useState(0);
  const [userProfits, setUserProfits] = useState(0);
  const [refund, setRefund] = useState(0);
  const [finalAmount, setFinalAmount] = useState("");
  const [isButtonActive, setIsButtonActive] = useState(true);
  const router = useRouter();

  // Fetch user profits using Clerk ID
  useEffect(() => {
    const fetchUserProfits = async () => {
      try {
        const profits = await GetUserProfitsByClerkId(clerkId);
        setUserProfits(profits);
      } catch (error) {
        toast.error("Error fetching user profits.");
      }
    };
    fetchUserProfits();
  }, []);

  useEffect(() => {
    if (payoutAmount && payoutAmount > 0) {
      setProfitShare(Math.round(payoutAmount * 0.15));
    } else {
      setProfitShare(0);
    }

    if (payoutAmount && payoutAmount > 0) {
      if (userProfits > payoutAmount * 0.5) {
        setRefund(payoutAmount * 0.5);
      } else {
        setRefund(userProfits);
      }
    }
  }, [payoutAmount]);

  useEffect(() => {
    setFinalAmount(Math.round(profitShare + refund));
  }, [profitShare, refund]);

  const SendMoney = async () => {
    setIsButtonActive(false);

    // Convert inputs to numbers before sending to MoneySended
    const accountBalanceNum = parseFloat(accountBalance);
    const payoutAmountNum = parseFloat(payoutAmount);
    const profitShareNum = parseFloat(profitShare);
    const refundNum = parseFloat(refund);
    const finalAmountNum = parseFloat(finalAmount);

    if (isNaN(accountBalanceNum) || isNaN(payoutAmountNum) || isNaN(profitShareNum) || isNaN(refundNum)) {
      toast.error("Please enter valid numbers.");
      setIsButtonActive(true);
      return;
    }

    //mongoId ειναι το id του user
    const response = await MoneySended(mongoId, accountId, accountBalanceNum, payoutAmountNum, profitShareNum, refundNum, finalAmountNum);

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }

    setIsButtonActive(true);
  };

  return (
    <div className="w-full max-w-96 m-auto flex flex-col gap-2">
      <div className="text-sm text-gray-500">What's the account balance?</div>
      <input type="number" className="input" placeholder="Account Balance" value={accountBalance} onChange={(e) => setAccountBalance(Math.round(e.target.value))} />
      <div className="text-sm text-gray-500">How much the company send you?</div>
      <input type="number" className="input" placeholder="Payout Amount" value={payoutAmount} onChange={(e) => setPayoutAmount(Math.round(e.target.value))} />
      <div className="text-sm text-gray-500">Your profits are:</div>
      <input type="number" className="input" placeholder="Your 15% profit share" value={Math.round(profitShare)} readOnly />
      <div className="text-sm text-gray-500">Your total profits are ${userProfits}. Your refund is:</div>
      <input type="number" className="input" placeholder="Refund Amount" value={Math.round(refund)} readOnly />
      <div className="text-sm text-gray-500">Final Amount:</div>
      <input type="number" className="input" placeholder="Final Amount" value={Math.round(finalAmount)} readOnly />
      {finalAmount > 0 && payoutAmount > 0 && (
        <button className="bg-blue-600 w-full max-w-96 mt-2 p-4 rounded hover:bg-blue-700" onClick={SendMoney} disabled={!isButtonActive}>
          I keep ${finalAmount} share and I send ${(parseFloat(payoutAmount) - parseFloat(finalAmount)).toFixed(2)}
        </button>
      )}
    </div>
  );
};

export default MoneySendedButton;
*/
