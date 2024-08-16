import { Schedule } from "@/lib/AppData";
import { GetDayString } from "@/lib/AppData";

const Calendar = async () => {
  const dayString = GetDayString();
  const renderDaySchedule = (day, settings) => (
    <div className={`border ${dayString === day.toLowerCase() ? "animate-pulse" : null} border-gray-800 rounded w-[280px] px-4 py-2 flex flex-col gap-2 ${settings.active ? "text-white" : "text-gray-400"}`}>
      <div className="m-auto font-medium text-center">
        <div>{day}</div>
        <div className="text-xs text-gray-400">{settings?.dateString}</div>
      </div>
      <hr className="border-none bg-gray-800 h-[1px]" />
      {settings.active ? (
        <>
          <div className="text-center">{settings.note}</div>
          <div className="flex justify-between text-sm">
            <div>Starting:</div>
            <div>{settings?.schedule?.startingHour}:00</div>
          </div>
          <div className="flex justify-between text-sm">
            <div>Ending:</div>
            <div>{settings?.schedule?.endingHour}:00</div>
          </div>
        </>
      ) : (
        <div className="m-auto">DAY OFF</div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-center items-center text-2xl border-b text-gray-400 border-gray-800 py-4">Calendar</div>
      <div className="flex flex-wrap justify-center gap-4">
        {renderDaySchedule("Monday", Schedule.monday)}
        {renderDaySchedule("Tuesday", Schedule.tuesday)}
        {renderDaySchedule("Wednesday", Schedule.wednesday)}
        {renderDaySchedule("Thursday", Schedule.thursday)}
        {renderDaySchedule("Friday", Schedule.friday)}
      </div>
    </div>
  );
};

export default Calendar;
