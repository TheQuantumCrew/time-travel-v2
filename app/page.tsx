"use client";

import Image from "next/image";
import Wrapper from "@/components/wrapper";
import { Button } from "@/components/ui/button";

import GitHubActivityCalendar, {
  Props,
} from "@/components/github-calendar/activity-calendar";

export default function Home() {
  const selectLastHalfYear: Props["transformData"] = (contributions) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const shownMonths = 6;

    return contributions.filter((activity) => {
      const date = new Date(activity.date);
      const monthOfDay = date.getMonth();

      return (
        monthOfDay > currentMonth - shownMonths && monthOfDay <= currentMonth
      );
    });
  };
  return (
    <section className="flex h-screen lg:flex-row">
      <section className="flex h-screen w-full  flex-col justify-between p-9 lg:h-auto">
        <Wrapper>
          <div className="mx-auto flex max-w-2xl flex-col justify-between">
            <span
              className={`-mt-14 inline-block text-[24px] font-bold text-black dark:text-white`}
            >
              Please select date you want to travel
            </span>
            <GitHubActivityCalendar
              username={"ncnthien"}
              transformData={selectLastHalfYear}
              hideColorLegend
              fontSize={16}
              labels={{
                totalCount: "{{count}} contributions in the last half year",
              }}
              throwOnError
            />
            <div className="">
              <Button
                size="default"
                className="w-full font-bold"
                variant="link"
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="pb-1 dark:text-zinc-800 text-zinc-100"
                >
                  Repo
                </a>{" "}
              </Button>
            </div>
          </div>
        </Wrapper>
      </section>

      {/* second half */}
    </section>
  );
}
