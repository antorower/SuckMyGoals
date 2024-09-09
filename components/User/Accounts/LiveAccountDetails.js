import Image from "next/image";
import Link from "next/link";
import LiveAccountActivities from "./LiveAccountActivities";
import OpenTradeButton from "./OpenTradeButton";
import { GetOpenTradeOfAccount } from "@/lib/TradeActions";
import CloseTradeForm from "./CloseTradeForm";

const LiveAccountDetails = async ({ account, admin, owner, accountCorrect }) => {
  const sortedActivities = account.activities.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)).slice(0, 10); // Limit to the first 4 activities

  const openTrade = await GetOpenTradeOfAccount(account._id.toString());
  const isTradeToday = new Date(openTrade?.trade?.openTime).toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-col gap-4 sm:flex-row p-4">
      {(admin || owner) && (
        <div className="m-auto">
          {openTrade && (
            <div className="flex flex-col items-start gap-2 text-lg w-[250px]">
              <div className="flex gap-2 w-full justify-between">
                <div>Account:</div>
                <div className="text-xl animate-pulse">{account.number}</div>
              </div>
              {!accountCorrect && (
                <Link className="submitButton text-center text-xs" href={`/account?account=${account._id.toString()}&accountcorrect=true`}>
                  I am logged in to the correct account
                </Link>
              )}
              {accountCorrect && isTradeToday && (
                <>
                  <div className="flex gap-2 w-full justify-between">
                    <div>Pair:</div>
                    <div>{openTrade?.trade?.pair}</div>
                  </div>
                  <div className="flex gap-2 w-full justify-between">
                    <div>Position:</div>
                    <div>{openTrade?.trade?.position}</div>
                  </div>
                  <div className="flex gap-2 w-full justify-between">
                    <div>Lots:</div>
                    <div>{openTrade?.trade?.lots}</div>
                  </div>
                  <div className="flex gap-2 w-full justify-between text-green-500">
                    <div>Take Profit:</div>
                    <div>+{openTrade?.trade?.takeProfit}</div>
                  </div>
                  <div className="flex gap-2 w-full justify-between text-red-500">
                    <div>Stop Loss:</div>
                    <div>-{openTrade?.trade?.stopLoss}</div>
                  </div>
                </>
              )}
              {openTrade && <CloseTradeForm tradeId={openTrade._id.toString()} />}
            </div>
          )}
          {!openTrade && <OpenTradeButton accountId={account._id.toString()} admin={admin} owner={owner} />}
        </div>
      )}
      <div className="flex flex-col m-auto sm:m-0 gap-2 max-h-[300px] max-w-[300px] overflow-y-scroll p-4">
        <div className="m-auto">Recent History</div>
        {account.eventsTimestamps?.firstTradeDate && (
          <div className="flex w-full justify-between text-xs text-gray-500">
            <div>First Trade:</div>
            <div>
              {account.eventsTimestamps?.firstTradeDate?.toLocaleString("el-GR", {
                timeZone: "Europe/Athens",
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </div>
          </div>
        )}
        {sortedActivities.map((activity) => (
          <LiveAccountActivities key={new Date(activity.dateTime).getTime()} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default LiveAccountDetails;
