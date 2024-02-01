import { BaseKey } from "@pankod/refine-core";

export interface StudentCardProps {
  id?: BaseKey | undefined;
  studentName: string;
  year: string;
  baseRate: string;
  subject: string;
  status: string;
}

export interface StudentProps {
  _id: string;
  studentName: string;
  year: string;
  baseRate: string;
  subject: string;
  status: string;
  tutor: string;
}

export interface StudentFormValues {
  studentName: string,
  subject: string,
  year: string,
  status: string,
  baseRate: number | undefined,
}