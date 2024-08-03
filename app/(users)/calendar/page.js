import Image from "next/image";
import Link from "next/link";
import { GetSettings } from "@/lib/SettingsActions";

const Calendar = async () => {
  const settings = await GetSettings();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleTimeString("en-GB", {
      timeZone: "Europe/Athens",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const renderDaySchedule = (day, settings) => (
    <div className={`border border-gray-800 rounded max-w-[600px] px-4 py-2 flex flex-col gap-2 ${settings.active ? "text-white" : "text-gray-400"}`}>
      <div className="m-auto font-medium">{day}</div>
      <hr className="border-none bg-gray-800 h-[1px]" />
      {settings.active ? (
        <>
          <div className="animate-pulse text-center">{settings.note || "No note"}</div>
          <div className="flex justify-between text-sm">
            <div>Starting:</div>
            <div>{settings?.schedule?.startingHour && formatDate(settings.schedule.startingHour)}</div>
          </div>
          <div className="flex justify-between text-sm">
            <div>Ending:</div>
            <div>{settings?.schedule?.endingHour && formatDate(settings.schedule.endingHour)}</div>
          </div>
        </>
      ) : (
        <div className="m-auto">DAY OFF</div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col justify-center gap-4 pb-[60px] pt-8 px-4">
      {renderDaySchedule("Monday", settings.monday)}
      {renderDaySchedule("Tuesday", settings.tuesday)}
      {renderDaySchedule("Wednesday", settings.wednesday)}
      {renderDaySchedule("Thursday", settings.thursday)}
      {renderDaySchedule("Friday", settings.friday)}
    </div>
  );
};

export default Calendar;
