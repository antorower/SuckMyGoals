import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GetDaySettings } from "@/lib/SettingsActions";
import DayActivation from "@/components/Settings/DayActivation";
import DayNote from "@/components/Settings/DayNote";
import DaySchedule from "@/components/Settings/DaySchedule";

const Update = async ({ searchParams }) => {
  const day = searchParams.day;
  if (!day) notFound();

  const daySettings = await GetDaySettings(day);
  if (!daySettings) notFound();

  return (
    <div className="flex flex-col gap-6 justify-center items-center text-xl p-4">
      <div className="flex gap-4 items-center">
        <DayActivation isActive={daySettings?.active} day={day} />
        <div>
          <div>{day.charAt(0).toUpperCase() + day.slice(1)}</div>
        </div>
      </div>
      <DaySchedule day={day} />
      <DayNote day={day} note={daySettings.note} />
    </div>
  );
};

export default Update;
