import { Activity, EventHandlerMap, Labels, ThemeInput } from "@/types";
import type { Day as WeekDay } from "date-fns";
import { CSSProperties, ReactElement, useState } from "react";
import { BlockElement } from "react-activity-calendar";
import { groupByWeeks } from "./utils";

export interface ActivityCalendarProps {
  data: Array<Activity>;
  blockMargin?: number;
  blockRadius?: number;
  blockSize?: number;
  colorScheme?: "light" | "dark";
  eventHandlers?: EventHandlerMap;
  fontSize?: number;
  hideColorLegend?: boolean;
  hideMonthLabels?: boolean;
  hideTotalCount?: boolean;
  labels?: Labels;
  maxLevel?: number;
  loading?: boolean;
  renderBlock?: (block: BlockElement, activity: Activity) => ReactElement;
  showWeekdayLabels?: boolean;

  style?: CSSProperties;
  theme?: ThemeInput;
  totalCount?: number;

  weekStart?: WeekDay;
}

export default function Calendar({
  data,
  fontSize = 14,
  hideMonthLabels = false,
  labels: labelsProp = undefined,
  style: styleProp = {},
  theme: themeProp = undefined,
  totalCount: totalCountProp = undefined,
  weekStart = 0, // Sunday
}: ActivityCalendarProps) {
  const weeks = groupByWeeks(data, weekStart);
  const [selectedDate, setSelectedDate] = useState<string[]>([]);
  const handleSelect = (date: string) => {
    console.log(date);
    setSelectedDate((prev) => [...prev, date]);
  };
  console.log({ selectedDate });
  function renderCalendar() {
    return weeks
      .map((week, weekIndex) =>
        week.map((activity, dayIndex) => {
          if (!activity) {
            return null;
          }
          return (
            <div
              onMouseEnter={() => handleSelect(activity.date)}
              className={`w-4 h-4 ${selectedDate.includes(activity.date) ? "bg-emerald-600" : "bg-zinc-600"} rounded-sm m-[1px]`}
              key={activity.date}
            ></div>
          );
        })
      )
      .map((week, x) => {
        return (
          <div className="m-[2px] flex flex-col" key={x}>
            {week}
          </div>
        );
      });
  }
  return (
    <div className="flex h-full justify-center items-center overflow-x-auto flex-col">
      {/* <div>
        {getMonthLabels(weeks, labels.months).map(({ label, weekIndex }) => (
          <text
            x={(blockSize + blockMargin) * weekIndex}
            dominantBaseline="hanging"
            key={weekIndex}
          >
            {label}
          </text>
        ))}
      </div> */}

      <div className="flex h-full justify-center items-center overflow-x-auto">
        <div className="flex flex-col mr-4">
          <span className="text-[12px] font-bold">Mon</span>
          <span className="text-[12px] font-bold">Tue</span>
          <span className="text-[12px] font-bold">Wed</span>
          <span className="text-[12px] font-bold">Thu</span>
          <span className="text-[12px] font-bold">Fri</span>
          <span className="text-[12px] font-bold">Sat</span>
          <span className="text-[12px] font-bold">Sun</span>
        </div>
        <div className="flex">{renderCalendar()}</div>
      </div>
    </div>
  );
}
