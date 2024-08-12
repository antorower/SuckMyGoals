import Image from "next/image";
import Link from "next/link";

const PayoutPhase = ({ status }) => {
  if ((status = "WaitingPayout")) {
    return <div>Waiting Payout</div>;
  }
  if ((status = "PayoutRequestDone")) {
    return <div>Waiting Payout</div>;
  }
  if ((status = "MoneySended")) {
    return <div>Waiting Payout</div>;
  }

  return <div className="">Please wait...</div>;
};

export default PayoutPhase;
