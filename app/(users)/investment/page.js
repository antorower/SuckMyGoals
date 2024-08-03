import Link from "next/link";
import { GetInvestmentSettings } from "@/lib/SettingsActions";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import InvestmentProduct from "@/components/Investment/InvestmentProduct";
import { GetUserProfits } from "@/lib/UserActions";
import { GetActiveUserInvestments } from "@/lib/InvestmentActions";
import { GetAccountPayoutsAmount } from "@/lib/PayoutActions";

const Investment = async ({ searchParams }) => {
  const clerkUser = await currentUser();
  if (!clerkUser) notFound();

  // Τα profits του user
  const profits = await GetUserProfits(clerkUser.publicMetadata.mongoId);

  // Τα διαθέσιμα investment products
  const settings = await GetInvestmentSettings();

  // Τα investments του user
  const investments = await GetActiveUserInvestments(clerkUser.publicMetadata.mongoId);

  // Η παράμετρος id={investmentId} που δείχνει ποιό investment έχει επιλέξει ο χρήστης
  const investmentId = searchParams.id;

  // Τραβάει το επιλεγμένο, από το url, investment
  const selectedInvestment = investments.find((investment) => investment._id.toString() === investmentId);

  // Αν υπάρχουν investments και έχει επιλεχθεί κάποιο συγκεκριμένο investment τότε τραβάει τα profits του account
  let accountProfits;
  if (investments && investments.length > 0 && investmentId && selectedInvestment) {
    accountProfits = await GetAccountPayoutsAmount(selectedInvestment.account._id.toString());
  }

  return (
    <div className="flex flex-col gap-8 w-full items-center">
      <div className="w-full flex justify-center p-4 border-b border-gray-800">${profits}</div>
      {investmentId && (
        <Link href="/investment" className="hover:text-blue-500">
          Show All
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {investments &&
          investments.length > 0 &&
          investments.map((investment) => {
            if (!investmentId || investment._id.toString() === investmentId) {
              const totalMilliseconds = 1000 * 60 * 60 * 24 * 60;
              const receivables = Number(investment.amount + (investment.amount * investment.interest) / 100);
              const millisecondsPaid = Number(new Date(investment.paidUntil).getTime() - new Date(investment.createdAt).getTime());
              const euroPerMillisecond = Number(receivables / totalMilliseconds);
              const creditPerDay = Number(euroPerMillisecond * 1000 * 60 * 60 * 24);
              const amountPaid = Number(Math.abs(euroPerMillisecond * millisecondsPaid).toFixed(2));
              return (
                <Link href={`/investment?id=${investment._id.toString()}`} key={investment._id.toString()} className="flex flex-col gap-2 border border-gray-800 rounded px-3 py-2 w-[280px]">
                  <div className="flex justify-between">
                    <div>Account: </div>
                    <div>{investment.account.number}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Invested: </div>
                    <div>{new Date(investment.createdAt).toLocaleDateString("gr-GR")}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Amount: </div>
                    <div>${investment.amount}</div>
                  </div>
                  {investment._id.toString() === investmentId && (
                    <>
                      <div className="flex justify-between">
                        <div>Interest:</div>
                        <div>{investment.interest}%</div>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <div>Receivables:</div>
                        <div>${receivables}</div>
                      </div>
                      <hr className="border-none bg-gray-800 h-[1px]" />
                    </>
                  )}
                  <div className="flex justify-between">
                    <div>Paid up to:</div>
                    <div>{new Date(investment.paidUntil).toLocaleDateString("gr-GR")}</div>
                  </div>
                  {investment._id.toString() === investmentId && (
                    <>
                      <div className="flex justify-between">
                        <div>Credit Per Day:</div>
                        <div>${creditPerDay.toFixed(2)}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Amount Paid:</div>
                        <div>${amountPaid}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Account Profits:</div>
                        <div>${accountProfits}</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Total Earnings:</div>
                        <div>${amountPaid + accountProfits}</div>
                      </div>
                      <hr className="border-none bg-gray-800 h-[1px]" />
                      <div className="flex justify-between font-semibold">
                        <div>ROI:</div>
                        <div>{(((amountPaid + accountProfits - investment.amount) * 100) / investment.amount).toFixed(2)}%</div>
                      </div>
                    </>
                  )}
                </Link>
              );
            }
            return null;
          })}
        {(!investments || investments.length === 0) && <div className="flex w-full justify-center animate-pulse">You have not investments yet...</div>}
      </div>
      {settings && settings.length > 0 && (
        <>
          <div className="text-2xl font-semibold w-full text-center border-y border-gray-800 p-4">Investment Products</div>
          <div className="flex flex-wrap justify-center p-4 gap-8 items-center">
            {settings.map((investment) => (
              <InvestmentProduct key={investment._id} investment={investment} userId={clerkUser.publicMetadata.mongoId} admin={clerkUser.publicMetadata.owner} />
            ))}
          </div>
        </>
      )}
      {(!settings || settings.length === 0) && <div className="m-auto animate-pulse">There are no investment products</div>}
    </div>
  );
};

export default Investment;
