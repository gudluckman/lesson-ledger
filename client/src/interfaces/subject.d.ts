export interface SubjectData {
  _id: {
    subject: string;
    year: string;
  };
  count: number;
}

export interface ProgressBarProps {
  title: string;
  year: string;
  count: number;
  color: string;
}
