import Link from "next/link";
import { GetSettings } from "@/lib/SettingsActions";
import DayActivation from "./DayActivation";

const Days = async () => {
  const settings = await GetSettings();

  return (
    <div className="flex flex-wrap items-center gap-8 justify-center py-8">
      <div className="border border-gray-600 py-2 px-4 rounded text-gray-300 flex gap-4 items-center">
        <DayActivation isActive={settings.monday?.active} day="monday" />
        <Link href="/settings/update/day?day=monday">Monday</Link>
      </div>
      <div className="border border-gray-600 py-2 px-4 rounded text-gray-300 flex gap-4 items-center">
        <DayActivation isActive={settings.tuesday?.active} day="tuesday" />
        <Link href="/settings/update/day?day=tuesday">Tuesday</Link>
      </div>
      <div className="border border-gray-600 py-2 px-4 rounded text-gray-300 flex gap-4 items-center">
        <DayActivation isActive={settings.wednesday?.active} day="wednesday" />
        <Link href="/settings/update/day?day=wednesday">Wednesday</Link>
      </div>
      <div className="border border-gray-600 py-2 px-4 rounded text-gray-300 flex gap-4 items-center">
        <DayActivation isActive={settings.thursday?.active} day="thursday" />
        <Link href="/settings/update/day?day=thursday">Thursday</Link>
      </div>
      <div className="border border-gray-600 py-2 px-4 rounded text-gray-300 flex gap-4 items-center">
        <DayActivation isActive={settings.friday?.active} day="friday" />
        <Link href="/settings/update/day?day=friday">Friday</Link>
      </div>
    </div>
  );
};

export default Days;
