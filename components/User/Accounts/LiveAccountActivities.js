import Account from "@/models/Account";

const LiveAccountActivities = ({ activity }) => {
  // Parse dateTime as a Date object
  const dateTime = new Date(activity.dateTime);

  const formattedDateTime = dateTime.toLocaleString("el-GR", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  return (
    <div className="w-full flex flex-col items-center gap-2 border border-gray-800 rounded px-4 py-2">
      <div className="text-xs text-gray-400">{formattedDateTime}</div>
      <div className="text-sm text-center">{activity.title}</div>
      <div className="text-sm text-gray-400 text-center">{activity.description}</div>
    </div>
  );
};

export default LiveAccountActivities;
