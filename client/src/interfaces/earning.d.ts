import { BaseKey } from "@pankod/refine-core";

export interface EarningCardProps {
  id?: BaseKey | undefined;
  startDateOfWeek: string;
  endDateOfWeek: string;
  weeklyHours: number;
  weeklyIncome: number;
}

export interface EarningProps {
  _id: string;
  startDateOfWeek: string;
  endDateOfWeek: string;
  weeklyHours: number;
  weeklyIncome: number;
  tutor: string;
}
