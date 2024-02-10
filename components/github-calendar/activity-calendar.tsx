"use client";

import {
  Activity,
  ApiErrorResponse,
  ApiResponse,
  ThemeInput,
  Year,
} from "@/.next/types/app";
import { transformData } from "@/components/github-calendar/utils";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Calendar, {
  type Props as ActivityCalendarProps,
  Skeleton,
} from "react-activity-calendar";

export interface Props extends Omit<ActivityCalendarProps, "data" | "theme"> {
  username: string;
  errorMessage?: string;
  theme?: ThemeInput;
  throwOnError?: boolean;
  transformData?: (data: Array<Activity>) => Array<Activity>;
  transformTotalCount?: boolean;
  year?: Year;
}

async function fetchCalendarData(username: string): Promise<ApiResponse> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}`
  );
  const data: ApiResponse | ApiErrorResponse = await response.json();

  if (!response.ok) {
    throw Error(
      `Fetching GitHub contribution data for "${username}" failed: ${(data as ApiErrorResponse).error}`
    );
  }

  return data as ApiResponse;
}
const GitHubActivityCalendar: FunctionComponent<Props> = ({
  username,
  labels,
  transformData: transformFn,
  transformTotalCount = true,
  throwOnError = false,
  errorMessage = `Error: Fetching GitHub contribution data for "${username}" failed.`,
  ...props
}) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchCalendarData(username)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(fetchData, [fetchData]);

  // React error boundaries can't handle asynchronous code, so rethrow.
  if (error) {
    if (throwOnError) {
      throw error;
    } else {
      return <div>{errorMessage}</div>;
    }
  }

  if (loading || !data) {
    return <Skeleton {...props} loading />;
  }

  const theme = props.theme;

  const defaultLabels = {
    totalCount: `{{count}} contributions in the last year`,
  };

  const totalCount = data.total["lastYear"];
  console.log(
    transformData(data.contributions, transformFn),
    "transformData(data.contributions, transformFn)"
  );
  return (
    <Calendar
      data={transformData(data.contributions, transformFn)}
      theme={theme}
      labels={Object.assign({}, defaultLabels, labels)}
      totalCount={transformFn && transformTotalCount ? undefined : totalCount}
      {...props}
      maxLevel={4}
    />
  );
};

export default GitHubActivityCalendar;
