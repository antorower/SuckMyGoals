import Image from "next/image";
import Link from "next/link";
import DayPicker from "./DayPicker";
import PayoutRequestDoneButton from "./PayoutRequestDoneButton";
import MoneySendedButton from "./MoneySendedButton";

const PayoutPhase = ({ account, admin, owner, clerkId, mongoId }) => {
  const day = account?.payoutRequestDate?.day;
  const month = account?.payoutRequestDate?.month;

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;

  const isPayoutDay = day === todayDay && month === todayMonth;

  if (account.status === "WaitingPayout") {
    return (
      <div className={"flex flex-col gap-8"}>
        {isPayoutDay && <div className={`flex bg-blue-600 justify-center p-4 text-2xl font-bold ${isPayoutDay ? "animate-pulse" : null}`}>Payday</div>}
        <div className="flex flex-col items-center gap-2 justify-center">
          <div className="m-auto text-gray-400 font-medium">When is your payout day?</div>
          <DayPicker accountId={account._id.toString()} savedDay={account?.payoutRequestDate?.day} savedMonth={account?.payoutRequestDate?.month} />
        </div>
        <PayoutRequestDoneButton accountId={account._id.toString()} />
      </div>
    );
  }

  if (account.status === "PayoutRequestDone") {
    return <MoneySendedButton accountId={account._id.toString()} clerkId={clerkId} mongoId={mongoId} />;
  }

  if (account.status === "MoneySended") {
    return <div className="m-auto animate-pulse text-gray-400">Please wait a few hours while your account resets</div>;
  }

  return <div className="">Please wait...</div>;
};

export default PayoutPhase;
