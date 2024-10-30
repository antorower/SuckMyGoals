import { GetDonePayouts } from "@/lib/PayoutActions";

const Stats = async () => {
  const payouts = await GetDonePayouts();

  return <div>{payouts[0].user.lastName}</div>;
};

export default Stats;
