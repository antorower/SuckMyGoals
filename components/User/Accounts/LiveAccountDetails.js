import Image from "next/image";
import Link from "next/link";
import LiveAccountActivities from "./LiveAccountActivities";
import OpenTradeButton from "./OpenTradeButton";

const LiveAccountDetails = ({ account }) => {
  const sortedActivities = account.activities.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)).slice(0, 10); // Limit to the first 4 activities

  return (
    <div className="flex flex-col gap-4 sm:flex-row p-4">
      <div className="flex sm:flex-grow">
        <div className="m-auto">
          <OpenTradeButton accountId={account._id.toString()} />
        </div>
      </div>
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
        {sortedActivities.map((activity) => (
          <LiveAccountActivities key={new Date(activity.dateTime).getTime()} activity={activity} />
        ))}
        {sortedActivities.map((activity) => (
          <LiveAccountActivities key={new Date(activity.dateTime).getTime()} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default LiveAccountDetails;
